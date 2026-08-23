import { test, expect } from './fixtures/events.fixture';
import { FIESTA_EVENTS } from '../src/data/events';

test.describe('Journey 3 & 4: Scroll Experience, Event Cards & External Actions', () => {
  test.beforeEach(async ({ mockMapboxNetwork }) => {
    await mockMapboxNetwork();
  });

  test('Happy Path: Event card contains complete details for active event', async ({ page }) => {
    await page.goto('/');

    // Wait for the main globe scene to mount
    await expect(page.getByTestId('globe-scene-container')).toBeVisible({ timeout: 15000 });

    const firstEvent = FIESTA_EVENTS[0];

    // Scroll to active phase of event 1 (around 0.5 * 150vh)
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 0.75);
      window.dispatchEvent(new Event('scroll'));
    });

    const eventCard = page.getByTestId('event-card');
    await expect(eventCard).toBeVisible({ timeout: 15000 });

    // Validate Event Header & Badge
    const badge = page.getByTestId('event-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText(firstEvent.badge);

    const eventDate = page.getByTestId('event-date');
    await expect(eventDate).toContainText(firstEvent.date);

    // Validate Title & Street Address
    const title = page.getByTestId('event-title');
    await expect(title).toHaveText(firstEvent.name);

    const address = page.getByTestId('event-address');
    await expect(address).toHaveText(firstEvent.addressStreet);

    // Validate Description
    const description = page.getByTestId('event-description');
    await expect(description).toHaveText(firstEvent.description);

    // Validate Sponsor Information
    const sponsor = page.getByTestId('event-sponsor');
    await expect(sponsor).toBeVisible();
    await expect(sponsor).toContainText(firstEvent.sponsor.name);
    await expect(sponsor).toContainText(firstEvent.sponsor.promoText);

    // Validate Past Photo Memories Gallery
    const photosSection = page.getByTestId('event-past-photos');
    await expect(photosSection).toBeVisible();
    const photoImages = photosSection.locator('img');
    await expect(photoImages).toHaveCount(firstEvent.pastPhotos.length);
  });

  test('Journey 4: Action CTAs - Google Maps (GPS) and WhatsApp links are valid and secure', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('globe-scene-container')).toBeVisible({ timeout: 15000 });

    const firstEvent = FIESTA_EVENTS[0];

    // Scroll to reveal card
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 0.75);
      window.dispatchEvent(new Event('scroll'));
    });

    const eventCard = page.getByTestId('event-card');
    await expect(eventCard).toBeVisible({ timeout: 15000 });

    // 1. Validate Google Maps button
    const btnMaps = page.getByTestId('btn-maps');
    await expect(btnMaps).toBeVisible();
    await expect(btnMaps).toHaveAttribute('href', firstEvent.googleMapsUrl);
    await expect(btnMaps).toHaveAttribute('target', '_blank');
    await expect(btnMaps).toHaveAttribute('rel', 'noopener noreferrer');

    // 2. Validate WhatsApp share button
    const btnWhatsapp = page.getByTestId('btn-share-whatsapp');
    await expect(btnWhatsapp).toBeVisible();
    const whatsappHref = await btnWhatsapp.getAttribute('href');
    expect(whatsappHref).not.toBeNull();
    expect(whatsappHref).toContain('https://api.whatsapp.com/send?text=');
    expect(whatsappHref).toContain(firstEvent.whatsappText);
    await expect(btnWhatsapp).toHaveAttribute('target', '_blank');
    await expect(btnWhatsapp).toHaveAttribute('rel', 'noopener noreferrer');

    // 3. Validate Sponsor link (if present)
    if (firstEvent.sponsor.mapsUrl) {
      const sponsorLink = page.getByTestId('event-sponsor');
      await expect(sponsorLink).toHaveAttribute('href', firstEvent.sponsor.mapsUrl);
      await expect(sponsorLink).toHaveAttribute('target', '_blank');
      await expect(sponsorLink).toHaveAttribute('rel', 'noopener noreferrer');
    }

    // 4. Validate Google Calendar CTA
    const btnGoogleCal = page.getByTestId('btn-google-calendar');
    await expect(btnGoogleCal).toBeVisible();
    const gcalHref = await btnGoogleCal.getAttribute('href');
    expect(gcalHref).toContain('calendar.google.com/calendar/render');

    // 5. Validate Apple Calendar / iCal button
    const btnAppleCal = page.getByTestId('btn-apple-calendar');
    await expect(btnAppleCal).toBeVisible();
  });

  test('Interactive Timeline: Clicking an event pill navigates and updates the active event', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('globe-scene-container')).toBeVisible({ timeout: 15000 });

    // Click the 4th pill (Dom 24 · Espuma)
    const fourthPill = page.getByTestId('timeline-pill-4');
    await expect(fourthPill).toBeVisible();
    await fourthPill.click();

    // Scroll to the active position
    await page.evaluate(() => {
      window.scrollTo(0, (3 + 0.5) * window.innerHeight * 1.5);
      window.dispatchEvent(new Event('scroll'));
    });

    const fourthEvent = FIESTA_EVENTS[3];
    const title = page.getByTestId('event-title');
    await expect(title).toHaveText(fourthEvent.name, { timeout: 15000 });

    // Verify foam particles are rendered
    const foamBubbles = page.getByTestId('foam-bubbles');
    await expect(foamBubbles).toBeVisible();
  });

  test('Scroll Navigation: Scrolling through subsequent event sections updates active event data', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('globe-scene-container')).toBeVisible({ timeout: 15000 });

    // Scroll into the second event section (around 220vh)
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 2.2);
      window.dispatchEvent(new Event('scroll'));
    });

    const secondEvent = FIESTA_EVENTS[1];
    const eventCard = page.getByTestId('event-card');
    await expect(eventCard).toBeVisible({ timeout: 15000 });

    // Event 2 (Paella Popular) check
    const title = page.getByTestId('event-title');
    await expect(title).toHaveText(secondEvent.name, { timeout: 15000 });

    const btnMaps = page.getByTestId('btn-maps');
    await expect(btnMaps).toHaveAttribute('href', secondEvent.googleMapsUrl);
  });
});

