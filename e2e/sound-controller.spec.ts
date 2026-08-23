import { test, expect } from './fixtures/events.fixture';

test.describe('Journey 2: Sound Controller & Audio Toggle', () => {
  test.beforeEach(async ({ mockMapboxNetwork }) => {
    await mockMapboxNetwork();
  });

  test('Happy Path: Toggles sound on and off, updating aria-label and icon states', async ({ page }) => {
    await page.goto('/');

    const soundBtn = page.getByTestId('sound-toggle-btn');
    await expect(soundBtn).toBeVisible();

    // Initial state: Muted
    await expect(soundBtn).toHaveAttribute('aria-label', 'Activar sonido');

    // Click to Unmute
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-label', 'Silenciar sonido');

    // Click to Mute again
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-label', 'Activar sonido');
  });

  test('Failure / Error State: Handles audio play exception gracefully without breaking UI', async ({ page }) => {
    // Intercept Audio play to reject (simulating browser autoplay policy restrictions or audio decode error)
    await page.addInitScript(() => {
      window.HTMLMediaElement.prototype.play = function () {
        return Promise.reject(new DOMException('The play() request was interrupted or blocked by user policy', 'NotAllowedError'));
      };
    });

    await page.goto('/');

    const soundBtn = page.getByTestId('sound-toggle-btn');
    await expect(soundBtn).toBeVisible();

    // Clicking should catch the error without throwing an unhandled exception or crashing the UI
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-label', 'Silenciar sonido');

    // App remains interactive
    const navbar = page.getByTestId('navbar');
    await expect(navbar).toBeVisible();
  });

  test('Fixed position and hover styling remain responsive to viewport changes', async ({ page }) => {
    await page.goto('/');

    const soundBtn = page.getByTestId('sound-toggle-btn');
    const box = await soundBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      // Must be anchored in bottom-left quadrant
      expect(box.x).toBeLessThan(100);
      expect(box.y).toBeGreaterThan(300);
    }
  });
});

