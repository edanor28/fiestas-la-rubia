import { test, expect } from './fixtures/events.fixture';
import { MOCK_AUTH_USER, MOCK_EXPIRED_USER } from './fixtures/auth.fixture';

test.describe('Journey 5: Responsive Layout, Auth Fixture & Failure Resiliency', () => {
  test.beforeEach(async ({ mockMapboxNetwork }) => {
    await mockMapboxNetwork();
  });

  test('Responsive Layout: Mobile viewport displays bottom-sheet drag handle and full width container', async ({ page }) => {
    // Set mobile viewport (iPhone 13 / Pixel)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.getByTestId('globe-scene-container')).toBeVisible({ timeout: 15000 });

    // Scroll to reveal card
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 0.75);
      window.dispatchEvent(new Event('scroll'));
    });

    const cardContainer = page.getByTestId('event-card-container');
    await expect(cardContainer).toBeVisible({ timeout: 15000 });

    // In mobile view, the drag handle is visible
    const dragHandle = page.getByTestId('mobile-drag-handle');
    await expect(dragHandle).toBeVisible();

    // Event card is rendered inside bottomsheet wrapper
    const bottomSheet = page.getByTestId('bottomsheet-card-wrapper');
    await expect(bottomSheet).toBeVisible();
  });

  test('Auth Fixture: Pre-authenticated state sets session storage and cookie correctly', async ({ authenticatedPage, authSession }) => {
    await authenticatedPage.goto('/');

    // Validate that localStorage contains user session from fixture
    const storedUser = await authenticatedPage.evaluate(() => {
      const raw = window.localStorage.getItem('fiestas_user');
      return raw ? JSON.parse(raw) : null;
    });

    expect(storedUser).not.toBeNull();
    expect(storedUser.email).toBe(MOCK_AUTH_USER.email);
    expect(storedUser.token).toBe(MOCK_AUTH_USER.token);

    // Validate cookie
    const cookies = await authenticatedPage.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === 'fiestas_session');
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).toBe(authSession.token);
  });

  test('Auth Fixture: Expired session is detected and cleared cleanly', async ({ page, setExpiredSession, clearSession }) => {
    await setExpiredSession();
    await page.goto('/');

    // Validate expired user presence
    const user = await page.evaluate(() => {
      const raw = window.localStorage.getItem('fiestas_user');
      return raw ? JSON.parse(raw) : null;
    });
    expect(user.expiresAt).toBe(MOCK_EXPIRED_USER.expiresAt);
    expect(user.expiresAt).toBeLessThan(Date.now());

    // Clean up session
    await clearSession();
    const clearedUser = await page.evaluate(() => window.localStorage.getItem('fiestas_user'));
    expect(clearedUser).toBeNull();
  });

  test('Network Error Resilience: App remains fully functional when Mapbox tiles return 500 error', async ({ page, simulateMapboxTileFailure }) => {
    await simulateMapboxTileFailure();
    await page.goto('/');

    // Even if tile network errors occur, the DOM UI (hero, navbar, sound button) does not crash
    const navbar = page.getByTestId('navbar');
    await expect(navbar).toBeVisible({ timeout: 15000 });

    const soundBtn = page.getByTestId('sound-toggle-btn');
    await expect(soundBtn).toBeVisible();

    const heroOverlay = page.getByTestId('hero-overlay');
    await expect(heroOverlay).toBeVisible({ timeout: 15000 });
  });
});

