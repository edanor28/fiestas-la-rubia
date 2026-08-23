import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { FIESTA_EVENTS } from '../data/events';
import { EventCard } from './EventCard';
import { HeroOverlay } from './HeroOverlay';
import { EventTimeline } from './EventTimeline';
import { ParticleFX } from './ParticleFX';
import { getDistance, lerp } from '../utils/math';

gsap.registerPlugin(ScrollTrigger);

export const GlobeScene: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeWrapperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  
  const lastPhase = useRef(0);
  const lastIdx = useRef(0);

  // Obtener el token de variables de entorno o simulación en pruebas
  const mapToken = (typeof window !== 'undefined' && window.__MOCK_NO_TOKEN__)
    ? undefined
    : import.meta.env.VITE_MAPBOX_TOKEN;

  const events = (typeof window !== 'undefined' && window.__MOCK_FIESTA_EVENTS__)
    ? window.__MOCK_FIESTA_EVENTS__
    : FIESTA_EVENTS;

  useEffect(() => {
    if (!mapContainerRef.current || !mapToken) return;

    if (typeof window !== 'undefined' && window.__E2E_MOCK_MAPBOX__) {
      const mockCanvas = document.createElement('canvas');
      mockCanvas.className = 'mapboxgl-canvas';
      mockCanvas.setAttribute('data-testid', 'mock-mapbox-canvas');
      mapContainerRef.current.appendChild(mockCanvas);
      return () => {
        mockCanvas.remove();
      };
    }

    let map: mapboxgl.Map | null = null;
    try {
      mapboxgl.accessToken = mapToken;

      // Inicializar mapa de Mapbox
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Estilo Satélite con calles
        center: [events[0].location.lng, events[0].location.lat],
        zoom: 1.5, // Altitud espacial
        pitch: 0,
        bearing: 0,
        projection: 'globe' // Renderiza la Tierra como un globo 3D
      });

      mapRef.current = map;

      const applyFog = (isNight: boolean) => {
        if (!map) return;
        try {
          if (isNight) {
            map.setFog({
              'color': 'rgb(186, 210, 235)', // Atmósfera inferior
              'high-color': 'rgb(36, 92, 223)', // Atmósfera superior
              'horizon-blend': 0.02, // Grosor atmósfera
              'space-color': 'rgb(5, 11, 20)', // Espacio oscuro
              'star-intensity': 0.8 // Brillo estelar
            });
          } else {
            map.setFog({
              'color': 'rgb(255, 255, 255)', // Cielo diurno claro
              'high-color': 'rgb(200, 230, 255)',
              'horizon-blend': 0.08,
              'space-color': 'rgb(135, 206, 235)', // Azul cielo
              'star-intensity': 0.0
            });
          }
        } catch {}
      };

      map.on('style.load', () => {
        // Atmósfera nocturna por defecto
        applyFog(true);

        // Añadir marcadores visuales (puntos brillantes) en la ubicación de cada evento
        map?.addSource('events-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: events.map(ev => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [ev.location.lng, ev.location.lat]
              },
              properties: {
                id: ev.id,
                name: ev.name
              }
            }))
          }
        });

        // Capa de halo (resplandor animado)
        map?.addLayer({
          id: 'events-halo',
          type: 'circle',
          source: 'events-points',
          paint: {
            'circle-radius': 15,
            'circle-color': '#F43F5E',
            'circle-opacity': 0.3,
            'circle-blur': 1,
            'circle-pitch-alignment': 'map'
          }
        });

        // Capa central (punto fijo)
        map?.addLayer({
          id: 'events-core',
          type: 'circle',
          source: 'events-points',
          paint: {
            'circle-radius': 6,
            'circle-color': '#F43F5E',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF',
            'circle-pitch-alignment': 'map'
          }
        });
        
        // Deshabilitar controles manuales para que el GSAP tenga el control total
        map?.scrollZoom.disable();
        map?.boxZoom.disable();
        map?.dragRotate.disable();
        map?.dragPan.disable();
        map?.keyboard.disable();
        map?.doubleClickZoom.disable();
        map?.touchZoomRotate.disable();
      });

      // Escuchar cambios de tema Día/Noche
      const handleThemeChange = (e: CustomEvent<{ isNight: boolean }>) => {
        applyFog(e.detail?.isNight ?? true);
      };
      window.addEventListener('mapThemeChange', handleThemeChange);

      map.on('error', (e) => {
        console.warn("Mapbox non-critical map event:", e);
      });
    } catch (err) {
      console.warn("Mapbox initialization error (handled):", err);
    }

    return () => {
      try {
        map?.remove();
      } catch {}
    };
  }, [mapToken]);

  useEffect(() => {
    if (!containerRef.current || !globeWrapperRef.current) return;

    const map = mapRef.current;
    const totalEvents = events.length;

    // Constantes matemáticas para el vuelo
    const spaceZoom = 2; // Vista desde el espacio (globo entero)
    const streetZoom = 17; // Vista a nivel de calle (se ven edificios 3D volumétricos)
    const spacePitch = 0;
    const streetPitch = 65; // Inclinación cinematográfica

    // Calcular el estado máximo (Peak) de la transición entre dos eventos
    const getPeakState = (fromIdx: number, toIdx: number) => {
      const ev1 = events[fromIdx];
      const ev2 = events[toIdx];
      const dist = getDistance(ev1.location.lat, ev1.location.lng, ev2.location.lat, ev2.location.lng);
      
      const lng = (ev1.location.lng + ev2.location.lng) / 2;
      const lat = (ev1.location.lat + ev2.location.lat) / 2;
      
      if (dist < 2) {
        // Salto de barrio (< 2km): Vuelo de dron bajo
        return { lng, lat, zoom: 15.5, pitch: 50, bearing: 45 };
      } else if (dist < 20) {
        // Salto de ciudad (< 20km): Vuelo de avión medio
        return { lng, lat, zoom: 13, pitch: 30, bearing: 0 };
      } else {
        // Salto global: Vuelo orbital espacial
        return { lng, lat, zoom: 4, pitch: 0, bearing: 0 };
      }
    };

    const getStreetState = (idx: number) => {
      const ev = events[idx];
      return { lng: ev.location.lng, lat: ev.location.lat, zoom: streetZoom, pitch: streetPitch, bearing: 45 };
    };

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: globeWrapperRef.current,
      scrub: 1.5,
      onUpdate: (self) => {
        // Optimización: Animamos la opacidad del hero a través de ref (direct DOM) sin provocar renders
        if (heroRef.current) {
          heroRef.current.style.opacity = Math.max(0, 1 - self.progress * 20).toString();
          heroRef.current.style.pointerEvents = self.progress > 0.05 ? 'none' : 'auto';
        }

        const rawIndex = self.progress * totalEvents;
        const idx = Math.min(Math.floor(rawIndex), totalEvents - 1);
        const phase = rawIndex - idx; // Fase local (0.0 -> 1.0)

        // Despachar el evento para el SoundController
        window.dispatchEvent(new CustomEvent('scrollPhase', { detail: { phase } }));

        // Disparar confeti al aterrizar (cuando pasamos de phase < 0.2 a >= 0.2 en el mismo evento)
        if (phase >= 0.2 && lastPhase.current < 0.2 && idx === lastIdx.current) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#F43F5E', '#38BDF8', '#FFFFFF'],
            zIndex: 100
          });
        }

        lastPhase.current = phase;
        lastIdx.current = idx;

        setActiveEventIndex(idx);

        const streetState = getStreetState(idx);
        let targetState;
        let cardVisible = false;

        if (phase < 0.2) {
          // Fase 0.0 -> 0.2: Descenso hacia el evento actual
          const p = phase / 0.2; // 0 to 1
          
          // El estado de inicio es el espacio exterior (si es el primer evento)
          // o el "Peak" del salto desde el evento anterior.
          const startState = idx === 0 
            ? { lng: streetState.lng, lat: streetState.lat, zoom: spaceZoom, pitch: spacePitch, bearing: 0 }
            : getPeakState(idx - 1, idx);

          targetState = {
            lng: lerp(startState.lng, streetState.lng, p),
            lat: lerp(startState.lat, streetState.lat, p),
            zoom: lerp(startState.zoom, streetState.zoom, p),
            pitch: lerp(startState.pitch, streetState.pitch, p),
            bearing: lerp(startState.bearing, streetState.bearing, p)
          };
          cardVisible = false;
        } 
        else if (phase <= 0.8) {
          // Fase 0.2 -> 0.8: Hold en la calle, mostrando el componente UI
          targetState = streetState;
          cardVisible = true;
        } 
        else {
          // Fase 0.8 -> 1.0: Despegue (Ascenso) hacia el siguiente evento
          const p = (phase - 0.8) / 0.2; // 0 to 1
          
          if (idx === totalEvents - 1) {
            // Si es el último evento, no despegamos. Mantenemos la vista.
            targetState = streetState;
            cardVisible = true; // Mantener la tarjeta visible al final
          } else {
            // El estado final es el "Peak" hacia el siguiente evento.
            const endState = getPeakState(idx, idx + 1);
            targetState = {
              lng: lerp(streetState.lng, endState.lng, p),
              lat: lerp(streetState.lat, endState.lat, p),
              zoom: lerp(streetState.zoom, endState.zoom, p),
              pitch: lerp(streetState.pitch, endState.pitch, p),
              bearing: lerp(streetState.bearing, endState.bearing, p)
            };
            cardVisible = false;
          }
        }

        setShowCard(cardVisible);

        // Usamos jumpTo para evitar conflictos con las animaciones nativas de Mapbox,
        // ya que el ScrollTrigger dicta los valores precisos en cada frame (scrubbing)
        try {
          mapRef.current?.jumpTo({
            center: [targetState.lng, targetState.lat],
            zoom: targetState.zoom,
            pitch: targetState.pitch,
            bearing: targetState.bearing
          });
        } catch {}
      }
    });

    return () => {
      trigger.kill();
    };
  }, [mapToken]); // Recalcular si el mapa/token se inicializa

  if (!mapToken) {
    return (
      <div data-testid="mapbox-token-error" className="w-full h-screen bg-[#050B14] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-lg">
          <h2 className="text-xl font-bold text-red-400 mb-2">Token de Mapbox no encontrado</h2>
          <p className="text-slate-300 text-sm mb-4">
            Para renderizar el globo en 3D con Mapbox GL JS (Standard Style), necesitas añadir un token público en las variables de entorno.
          </p>
          <code className="block bg-black/50 p-4 rounded-lg text-left text-xs text-sky-300 overflow-x-auto">
            VITE_MAPBOX_TOKEN="pk.eyJ1...tu_token_aqui"
          </code>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} data-testid="globe-scene-container" style={{ height: `${events.length * 150}vh` }} className="relative w-full bg-[#050B14]">
      <div ref={globeWrapperRef} className="absolute top-0 left-0 w-full h-screen overflow-hidden bg-[#050B14]">
        
        <HeroOverlay ref={heroRef} />

        {/* Selector Rápido / Timeline de Eventos 3D */}
        <EventTimeline events={events} activeEventIndex={activeEventIndex} />

        {/* Efectos de Partículas Temáticas (Espuma, Discomóvil, Rock) */}
        <ParticleFX activeEventIndex={activeEventIndex} />

        {/* Contenedor del mapa de Mapbox: 100% de la pantalla en todos los dispositivos */}
        <div className="absolute top-0 left-0 w-full h-screen">
          <div ref={mapContainerRef} data-testid="map-container" className="w-full h-full" />
          
          {/* Capa decorativa para integrar el mapa con nuestro fondo oscuro de manera más suave en los bordes */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(5,11,20,0.8)] lg:shadow-[inset_0_0_200px_rgba(5,11,20,1)]" />
        </div>

        {/* 
          Tarjeta UI (Single Unified Floating Glass Card):
          - Mobile / Tablet: Centrada abajo con márgenes.
          - Desktop (lg): Flotante cuadrante inferior izquierdo.
        */}
        <div
          data-testid="event-card-container"
          className={`absolute z-20 flex w-full md:w-auto left-0 right-0 md:right-auto bottom-3 sm:bottom-6 md:bottom-8 lg:bottom-10 md:left-8 lg:left-10 px-3 sm:px-5 md:px-0 transition-all duration-700 ease-out transform ${
            showCard
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-8 sm:translate-y-12 opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Card Wrapper sin duplicar fondos ni bordes */}
          <div 
            data-testid="bottomsheet-card-wrapper" 
            className="w-full max-w-md md:max-w-[400px] lg:max-w-[430px] mx-auto md:mx-0 relative"
          >
            {/* Indicador táctil superior en móvil */}
            <div data-testid="mobile-drag-handle" className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-2 md:hidden shrink-0" />
            
            <EventCard 
              event={events[activeEventIndex]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

