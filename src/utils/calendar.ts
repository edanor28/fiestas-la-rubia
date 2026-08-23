import type { FiestaEvent } from '../data/events';

interface EventDates {
  start: Date;
  end: Date;
}

/**
 * Returns estimated start and end Date objects for each fiesta event in August 2026 (Europe/Madrid)
 */
export const getEventDateRange = (event: FiestaEvent): EventDates => {
  const year = 2026;
  const month = 7; // August (0-indexed)

  switch (event.id) {
    case 1: // Viernes 22 Agosto 23:00h
      return {
        start: new Date(year, month, 22, 23, 0, 0),
        end: new Date(year, month, 23, 4, 0, 0),
      };
    case 2: // Sábado 23 Agosto 14:30h
      return {
        start: new Date(year, month, 23, 14, 30, 0),
        end: new Date(year, month, 23, 18, 0, 0),
      };
    case 3: // Sábado 23 Agosto 22:30h
      return {
        start: new Date(year, month, 23, 22, 30, 0),
        end: new Date(year, month, 24, 2, 0, 0),
      };
    case 4: // Domingo 24 Agosto 17:00h
      return {
        start: new Date(year, month, 24, 17, 0, 0),
        end: new Date(year, month, 24, 20, 30, 0),
      };
    default:
      return {
        start: new Date(year, month, 22, 20, 0, 0),
        end: new Date(year, month, 22, 23, 0, 0),
      };
  }
};

/**
 * Format Date to Google Calendar UTC string: YYYYMMDDTHHMMSSZ
 */
const formatUtcDate = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
};

/**
 * Generates direct Google Calendar link
 */
export const generateGoogleCalendarUrl = (event: FiestaEvent): string => {
  const { start, end } = getEventDateRange(event);
  const dates = `${formatUtcDate(start)}/${formatUtcDate(end)}`;
  const title = encodeURIComponent(`Fiestas La Rubia 2026: ${event.name}`);
  const details = encodeURIComponent(`${event.description}\n\n📍 Ubicación: ${event.addressStreet}\n✨ Patrocinador: ${event.sponsor.name} (${event.sponsor.promoText})`);
  const location = encodeURIComponent(`${event.addressStreet}, Valladolid, España`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
};

/**
 * Generates and downloads a universal .ics file for Apple Calendar (iPhone/Mac), Outlook, etc.
 */
export const downloadIcsFile = (event: FiestaEvent) => {
  const { start, end } = getEventDateRange(event);
  const startStr = formatUtcDate(start);
  const endStr = formatUtcDate(end);
  const nowStr = formatUtcDate(new Date());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Asociacion Vecinal La Rubia//Fiestas 2026//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:fiestas-la-rubia-2026-ev${event.id}@larubia.valladolid.es`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:Fiestas La Rubia 2026: ${event.name}`,
    `DESCRIPTION:${event.description.replace(/\n/g, ' ')} - Patrocinado por ${event.sponsor.name}`,
    `LOCATION:${event.addressStreet}, Valladolid, España`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio: ${event.name} en 1 hora`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `evento-${event.id}-fiestas-la-rubia.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

