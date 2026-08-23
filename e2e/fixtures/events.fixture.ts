import { test as authTest, expect } from './auth.fixture';
import type { FiestaEvent } from '../../src/data/events';

export const MOCK_CUSTOM_EVENT: FiestaEvent = {
  id: 99,
  badge: 'ESPECIAL · 20:00H',
  name: 'Festival de Luces y Drones',
  date: 'Lunes, 25 de Agosto',
  addressStreet: 'Plaza Mayor de La Rubia, 1',
  location: {
    lat: 41.6255,
    lng: -4.7405,
    altitudeTarget: 0.08,
  },
  sponsor: {
    name: 'Sponsor Test Local',
    promoText: '2x1 con ticket digital de prueba',
    mapsUrl: 'https://maps.google.com/?q=41.6255,-4.7405',
  },
  description: 'Evento de prueba inyectado para validar renderizado dinámico de tarjetas y CTAs.',
  pastPhotos: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  ],
  googleMapsUrl: 'https://maps.google.com/?q=41.6255,-4.7405',
  whatsappText: encodeURIComponent('🎉 ¡Prueba de evento!'),
};

export const MOCK_EVENT_WITHOUT_SPONSOR_LINK: FiestaEvent = {
  id: 100,
  badge: 'CONVIVENCIA · 12:00H',
  name: 'Taller de Juegos Tradicionales',
  date: 'Martes, 26 de Agosto',
  addressStreet: 'Calle Parque, 5',
  location: {
    lat: 41.626,
    lng: -4.741,
    altitudeTarget: 0.08,
  },
  sponsor: {
    name: 'Comercio Amigo Sin Web',
    promoText: 'Descuentos para socios',
    // mapsUrl omitted to test fallback non-link rendering
  },
  description: 'Taller infantil de chapas, peonza y comba.',
  pastPhotos: [],
  googleMapsUrl: 'https://maps.google.com/?q=41.626,-4.741',
  whatsappText: encodeURIComponent('🎮 ¡Juegos tradicionales!'),
};

type EventsFixtures = {
  mockMapboxNetwork: () => Promise<void>;
  simulateOffline: () => Promise<void>;
  simulateMapboxTileFailure: () => Promise<void>;
  injectCustomEvents: (events: FiestaEvent[]) => Promise<void>;
};

export const test = authTest.extend<EventsFixtures>({
  /**
   * Mocks Mapbox GL API network requests to make tests fast, deterministic,
   * and independent of third-party network tile availability.
   */
  mockMapboxNetwork: async ({ page }, use) => {
    const setupFn = async () => {
      // Enable lightweight test mode for map container in tests
      await page.addInitScript(() => {
        (window as any).__E2E_MOCK_MAPBOX__ = true;
      });

      // Intercept mapbox styles and tile requests with lightweight mock responses
      await page.route('**/api.mapbox.com/styles/v1/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            version: 8,
            name: 'Mock Satellite Style',
            sources: {},
            layers: [
              {
                id: 'background',
                type: 'background',
                paint: { 'background-color': '#050B14' },
              },
            ],
          }),
        });
      });

      // Intercept Mapbox telemetry to avoid tracking in tests
      await page.route('**/events.mapbox.com/**', async (route) => {
        await route.fulfill({ status: 204, body: '' });
      });

      // Intercept any other mapbox api requests (glyphs, sprites, tiles)
      await page.route('**/api.mapbox.com/**', async (route) => {
        const url = route.request().url();
        if (url.includes('/styles/v1/')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              version: 8,
              name: 'Mock Style',
              sources: {},
              layers: [
                {
                  id: 'background',
                  type: 'background',
                  paint: { 'background-color': '#050B14' },
                },
              ],
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({}),
          });
        }
      });

      // Intercept external freesound audio assets with silent buffer responses
      await page.route('**/cdn.freesound.org/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'audio/mpeg',
          body: Buffer.from([]),
        });
      });
    };

    await use(setupFn);
  },

  /**
   * Simulates network tile failure (500 server error)
   */
  simulateMapboxTileFailure: async ({ page }, use) => {
    const failureFn = async () => {
      await page.route('**/api.mapbox.com/**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      });
    };
    await use(failureFn);
  },

  /**
   * Simulates offline mode
   */
  simulateOffline: async ({ context }, use) => {
    const offlineFn = async () => {
      await context.setOffline(true);
    };
    await use(offlineFn);
  },

  /**
   * Injects custom seed event data dynamically into the window context
   */
  injectCustomEvents: async ({ page }, use) => {
    const injectFn = async (events: FiestaEvent[]) => {
      await page.addInitScript((customEvents) => {
        (window as any).__MOCK_FIESTA_EVENTS__ = customEvents;
      }, events);
    };
    await use(injectFn);
  },
});

export { expect };

