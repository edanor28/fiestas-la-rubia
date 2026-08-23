export interface SponsorInfo {
  name: string;
  promoText: string;
  logoUrl?: string;
  mapsUrl?: string;
}

export interface FiestaEvent {
  id: number;
  badge: string;
  name: string;
  date: string;
  addressStreet: string;
  location: {
    lat: number;
    lng: number;
    altitudeTarget: number;
  };
  sponsor: SponsorInfo;
  description: string;
  pastPhotos: string[];
  googleMapsUrl: string;
  whatsappText: string;
}

export const FIESTA_EVENTS: FiestaEvent[] = [
  {
    id: 1,
    badge: 'HOY · 23:00H',
    name: 'Gran Discomóvil de Apertura & Luces LED',
    date: 'Viernes, 22 de Agosto',
    addressStreet: 'R Castrillo, C. Maestranza, 4, 47008 Valladolid',
    location: {
      lat: 41.62592,
      lng: -4.74084,
      altitudeTarget: 0.08,
    },
    sponsor: {
      name: 'Cervecería La Rubia',
      promoText: 'Muestra esta web en la barra: 10% dto. en cañas y raciones',
      logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80',
      mapsUrl: 'https://maps.app.goo.gl/CCLPa4KrDJ7pWeQH7?g_st=ic',
    },
    description: 'Comienzo oficial de las fiestas con el mejor espectáculo audiovisual, DJ residente, confeti y temazos de ayer y de hoy en el corazón del barrio.',
    pastPhotos: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    ],
    googleMapsUrl: 'https://maps.app.goo.gl/NcerrHLeGV1Nhm579?g_st=ic',
    whatsappText: encodeURIComponent('🎉 ¡Nos vemos esta noche en las Fiestas de La Rubia! Gran Discomóvil a las 23:00h en R Castrillo. Ubicación: https://maps.app.goo.gl/NcerrHLeGV1Nhm579?g_st=ic'),
  },
  {
    id: 2,
    badge: 'SÁBADO · 14:30H',
    name: 'Gran Paellada Popular y Charanga Vecinal',
    date: 'Sábado, 23 de Agosto',
    addressStreet: 'Parque de La Rubia (Paseo de Zorrilla)',
    location: {
      lat: 41.62482,
      lng: -4.73982,
      altitudeTarget: 0.08,
    },
    sponsor: {
      name: 'Asador & Bar El Encuentro',
      promoText: 'Enseña la web: Con tu ración, postre casero o café gratis',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80',
    },
    description: 'Comida de convivencia para más de 800 vecinos con raciones de paella gigante mixta, sangría casera y el ritmo inconfundible de la Charanga local.',
    pastPhotos: [
      'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    ],
    googleMapsUrl: 'https://maps.google.com/?q=41.6292,-4.7495',
    whatsappText: encodeURIComponent('🥘 ¡Planazo para el sábado en La Rubia! Paellada Popular a las 14:30h en el Parque. ¡No te quedes sin tu plato! Coordenadas: https://maps.google.com/?q=41.6292,-4.7495'),
  },
  {
    id: 3,
    badge: 'SÁBADO · 22:30H',
    name: 'Noche de Rock: Tributo & Bandas del Barrio',
    date: 'Sábado, 23 de Agosto',
    addressStreet: 'Carretera de Rueda, 32 (Explanada)',
    location: {
      lat: 41.62495,
      lng: -4.74179,
      altitudeTarget: 0.08,
    },
    sponsor: {
      name: 'Pub Roots & Rock',
      promoText: 'Muestra la app: 2x1 en jarras de cerveza durante el concierto',
      logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=120&q=80',
    },
    description: 'Tres horas de puro rock en directo con los grandes himnos de Platero y Tú, Extremoduro, Fito y temas originales de los grupos jóvenes de la zona.',
    pastPhotos: [
      'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80',
    ],
    googleMapsUrl: 'https://maps.google.com/?q=41.6268,-4.7441',
    whatsappText: encodeURIComponent('🎸 ¡Esta noche hay concierto de Rock en las fiestas de La Rubia! A las 22:30h en Ctra. de Rueda. ¡Nos vemos allí! 📍 https://maps.google.com/?q=41.6268,-4.7441'),
  },
  {
    id: 4,
    badge: 'DOMINGO · 17:00H',
    name: 'Gran Fiesta de la Espuma & Juegos Infantiles',
    date: 'Domingo, 24 de Agosto',
    addressStreet: 'C/ Doctor Moreno con C/ Héroes del Alcázar',
    location: {
      lat: 41.62525,
      lng: -4.74077,
      altitudeTarget: 0.08,
    },
    sponsor: {
      name: 'Heladería & Cafetería Rubia Dulce',
      promoText: 'Muestra esta web: Mini tarrina de helado gratis para los peques',
      logoUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=120&q=80',
    },
    description: 'Cañón gigante de espuma biodegradable con música animada, talleres de pintacaras, hinchables y juegos tradicionales para toda la familia.',
    pastPhotos: [
      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
    ],
    googleMapsUrl: 'https://maps.google.com/?q=41.6338,-4.7429',
    whatsappText: encodeURIComponent('💦 ¡Fiesta de la espuma el domingo a las 17:00h en La Rubia! Ideal para peques y familias. Traed bañador y chanclas. 📍 https://maps.google.com/?q=41.6338,-4.7429'),
  },
];
