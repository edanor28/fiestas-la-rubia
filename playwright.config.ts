import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Fiestas La Rubia (Vite + React)
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI if needed for resource-constrained runners */
  workers: process.env.CI ? 1 : 2,
  timeout: 45000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
    ? [['github'], ['html', { open: 'never' }]] 
    : [['list'], ['html', { open: 'on-failure' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',

    /* Take screenshots on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Launch options to ensure WebGL/Canvas works reliably in CI */
    launchOptions: {
      args: ['--enable-webgl', '--use-gl=swiftshader', '--ignore-gpu-blocklist'],
    },
  },

  /* Configure projects for major browsers and mobile viewports */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Run local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      VITE_MAPBOX_TOKEN: process.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibGFydWJpYSIsImEiOiJjbHRlc3R0b2tlbjEyMzQ1Njc4OTAifQ.mock_token_for_e2e_testing',
    },
  },
});

