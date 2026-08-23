import { test, expect } from './fixtures/events.fixture';

test.describe('Journey 1: Initial Page Load & Hero Experience', () => {
  test.beforeEach(async ({ mockMapboxNetwork }) => {
    await mockMapboxNetwork();
  });

  test('Happy Path: Loads navbar, hero overlay, sound controller, and indicators correctly', async ({ page }) => {
    await page.goto('/');

    // 1. Navbar validation
    const navbar = page.getByTestId('navbar');
    await expect(navbar).toBeVisible({ timeout: 15000 });

    const navTitle = page.getByTestId('navbar-title');
    await expect(navTitle).toHaveText('Asociación Vecinal');
    await expect(page.getByText('La Rubia, Valladolid')).toBeVisible();

    const contactBtn = page.getByTestId('navbar-contact-btn');
    await expect(contactBtn).toBeVisible();

    // 2. Sound Controller validation
    const soundBtn = page.getByTestId('sound-toggle-btn');
    await expect(soundBtn).toBeVisible();
    await expect(soundBtn).toHaveAttribute('aria-label', 'Activar sonido');

    // 3. Hero Overlay validation
    const heroOverlay = page.getByTestId('hero-overlay');
    await expect(heroOverlay).toBeVisible({ timeout: 15000 });

    const heroBadge = page.getByTestId('hero-badge');
    await expect(heroBadge).toContainText('Experiencia 3D Interactiva');

    const heroTitle = page.getByTestId('hero-title');
    await expect(heroTitle).toContainText('Fiestas de');
    await expect(heroTitle).toContainText('La Rubia');
    await expect(heroTitle).toContainText('2026');

    const scrollIndicator = page.getByTestId('hero-scroll-indicator');
    await expect(scrollIndicator).toBeVisible();
    await expect(scrollIndicator).toContainText('Haz scroll para descubrir');
  });

  test('Fallback / Error State: Displays descriptive warning when Mapbox Token is missing or empty', async ({ page }) => {
    // Intercept client environment with mock token absent
    await page.addInitScript(() => {
      (window as any).__MOCK_NO_TOKEN__ = true;
    });

    await page.goto('/');

    const errorBox = page.getByTestId('mapbox-token-error');
    await expect(errorBox).toBeVisible({ timeout: 15000 });
    await expect(errorBox).toContainText('Token de Mapbox no encontrado');
    await expect(errorBox).toContainText('VITE_MAPBOX_TOKEN');
  });

  test('Accessibility & Semantic Headings: Validates main landmark and heading levels', async ({ page }) => {
    await page.goto('/');

    const mainLandmark = page.getByRole('main');
    await expect(mainLandmark).toBeAttached();

    const heroOverlay = page.getByTestId('hero-overlay');
    await expect(heroOverlay).toBeVisible({ timeout: 15000 });

    const h1Heading = page.getByRole('heading', { level: 1 });
    await expect(h1Heading).toHaveText('Asociación Vecinal');

    const h2Heading = page.getByRole('heading', { level: 2 });
    await expect(h2Heading).toContainText('Fiestas de');
  });
});

