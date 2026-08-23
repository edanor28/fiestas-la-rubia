import { test as base, type Page } from '@playwright/test';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vecino' | 'organizador';
  token: string;
  expiresAt: number;
}

export const MOCK_AUTH_USER: UserSession = {
  id: 'usr_larubia_2026',
  name: 'Eduardo Vecino',
  email: 'vecino@larubia.valladolid.es',
  role: 'vecino',
  token: 'mock-jwt-token-larubia-secret-xyz123',
  expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours in future
};

export const MOCK_EXPIRED_USER: UserSession = {
  id: 'usr_expired_000',
  name: 'Usuario Expirado',
  email: 'expirado@larubia.local',
  role: 'vecino',
  token: 'expired-jwt-token-invalid',
  expiresAt: Date.now() - 1000, // already expired
};

type AuthFixtures = {
  authenticatedPage: Page;
  authSession: UserSession;
  setExpiredSession: () => Promise<void>;
  clearSession: () => Promise<void>;
};

/**
 * Custom Playwright test fixture with pre-authenticated session state.
 * Prevents repeating login flows on every test run.
 */
export const test = base.extend<AuthFixtures>({
  authSession: async ({}, use) => {
    await use(MOCK_AUTH_USER);
  },

  authenticatedPage: async ({ page, authSession }, use) => {
    // Seed authenticated state in localStorage before navigation
    await page.addInitScript((session) => {
      window.localStorage.setItem('fiestas_auth_token', session.token);
      window.localStorage.setItem('fiestas_user', JSON.stringify(session));
    }, authSession);

    // Set auth cookie
    await page.context().addCookies([
      {
        name: 'fiestas_session',
        value: authSession.token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await use(page);
  },

  setExpiredSession: async ({ page }, use) => {
    const expiredFn = async () => {
      await page.addInitScript((session) => {
        window.localStorage.setItem('fiestas_auth_token', session.token);
        window.localStorage.setItem('fiestas_user', JSON.stringify(session));
      }, MOCK_EXPIRED_USER);
    };
    await use(expiredFn);
  },

  clearSession: async ({ page }, use) => {
    const clearFn = async () => {
      await page.evaluate(() => {
        window.localStorage.removeItem('fiestas_auth_token');
        window.localStorage.removeItem('fiestas_user');
      });
      await page.context().clearCookies();
    };
    await use(clearFn);
  },
});

export { expect } from '@playwright/test';

