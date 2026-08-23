import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { FIESTA_EVENTS } from '../data/events';
import { EventCard } from './EventCard';
import { HeroOverlay } from './HeroOverlay';
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

  // Obtener el token exclusivamente de variables de entorno por seguridad
  const mapToken = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapContainerRef.current || !mapToken) return;

    mapboxgl.accessToken = mapToken;
    const isMobile = window.innerWidth < 768;

    // Inicializar mapa de Mapbox
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Estilo Satélite con calles
      center: [FIESTA_EVENTS[0].location.lng, FIESTA_EVENTS[0].location.lat],
      zoom: 1.5, // Altitud espacial
      pitch: 0,
      bearing: 0,
      projection: 'globe' // Renderiza la Tierra como un globo 3D
    });

    mapRef.current = map;

    map.on('style.load', () => {
      // Configuramos la atmósfera del globo (cielo base integrado, mucho más ligero que la capa 'sky')
      map.setFog({
        'color': 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness
        'space-color': 'rgb(5, 11, 20)', // Background color
        'star-intensity': 0.6 // Background star brightness
      });

      // Añadir marcadores visuales (puntos brillantes) en la ubicación de cada evento
      map.addSource('events-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: FIESTA_EVENTS.map(ev => ({
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
      map.addLayer({
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
      map.addLayer({
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
      map.scrollZoom.disable();
      map.boxZoom.disable();
      map.dragRotate.disable();
      map.dragPan.disable();
      map.keyboard.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();
    });

    return () => map.remove();
  }, [mapToken]);

  useEffect(() => {
    if (!containerRef.current || !globeWrapperRef.current || !mapRef.current) return;

    const map = mapRef.current;
    const totalEvents = FIESTA_EVENTS.length;

    // Constantes matemáticas para el vuelo
    const spaceZoom = 2; // Vista desde el espacio (globo entero)
    const streetZoom = 17; // Vista a nivel de calle (se ven edificios 3D volumétricos)
    const spacePitch = 0;
    const streetPitch = 65; // Inclinación cinematográfica

    // Calcular el estado máximo (Peak) de la transición entre dos eventos
    const getPeakState = (fromIdx: number, toIdx: number) => {
      const ev1 = FIESTA_EVENTS[fromIdx];
      const ev2 = FIESTA_EVENTS[toIdx];
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
      const ev = FIESTA_EVENTS[idx];
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
        map.jumpTo({
          center: [targetState.lng, targetState.lat],
          zoom: targetState.zoom,
          pitch: targetState.pitch,
          bearing: targetState.bearing
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, [mapToken]); // Recalcular si el mapa/token se inicializa

  if (!mapToken) {
    return (
      <div className="w-full h-screen bg-[#050B14] flex flex-col items-center justify-center p-6 text-center">
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
    <div ref={containerRef} style={{ height: `${FIESTA_EVENTS.length * 150}vh` }} className="relative w-full bg-[#050B14]">
      <div ref={globeWrapperRef} className="absolute top-0 left-0 w-full h-screen overflow-hidden bg-[#050B14]">
        
        <HeroOverlay ref={heroRef} />

        {/* Contenedor del mapa de Mapbox */}
        <div className="absolute top-0 left-0 w-full h-[50vh] lg:h-screen">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Capa decorativa para integrar el mapa con nuestro fondo oscuro de manera más suave en los bordes */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(5,11,20,0.8)] lg:shadow-[inset_0_0_200px_rgba(5,11,20,1)]" />
        </div>

        {/* 
          Tarjeta UI:
          - Desktop (lg): Flotante cuadrante inferior izquierdo.
          - Mobile: BottomSheet ocupando el 50vh inferior con scroll interno.
        */}
        <div
          className={`absolute z-20 flex w-full lg:w-auto left-0 bottom-0 lg:bottom-10 lg:left-10 transition-all duration-700 ease-out transform ${
            showCard
              ? 'translate-y-0 opacity-100 lg:scale-100'
              : 'translate-y-full lg:translate-y-12 opacity-0 lg:scale-95 pointer-events-none'
          }`}
        >
          {/* Mobile BottomSheet container / Desktop Floating Card */}
          <div className="w-full h-[50vh] lg:h-auto bg-[#0F172A] lg:bg-transparent rounded-t-[2.5rem] lg:rounded-none overflow-y-auto lg:overflow-visible shadow-[0_-15px_40px_rgba(0,0,0,0.6)] lg:shadow-none border-t border-white/10 lg:border-none p-5 pb-12 lg:p-0 relative">
            
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 lg:hidden shrink-0" />
            
            <EventCard 
              event={FIESTA_EVENTS[activeEventIndex]} 
              className="w-full max-w-none lg:max-w-[420px] mx-auto !bg-transparent lg:!bg-[#0F172A]/85 !border-none lg:!border lg:!border-white/15 !drop-shadow-none lg:!drop-shadow-2xl !p-0 lg:!p-6 !shadow-none lg:!shadow-2xl" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

