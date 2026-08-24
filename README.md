# 🎆 Fiestas de La Rubia 2026 · Experiencia 3D Interactiva

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwindcss&logoColor=white)
![Mapbox GL](https://img.shields.io/badge/Mapbox_GL-3.29-000000?logo=mapbox&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E_Tested-2EAD33?logo=playwright&logoColor=white)

**Una experiencia web inmersiva en 3D que conecta el espacio exterior con las calles del barrio de La Rubia en Valladolid (España) para descubrir el programa oficial de fiestas.**

[Explorar Eventos](#-programa-de-fiestas-y-eventos) • [Características](#-características-principales) • [Tecnologías](#-stack-tecnológico) • [Instalación](#-instalación-y-uso) • [Testing E2E](#-testing-end-to-end-playwright)

</div>

---

## 📖 Acerca del Proyecto

**Fiestas La Rubia 2026** es una aplicación web interactiva desarrollada para la **Asociación Vecinal de La Rubia (Valladolid)**. Combina visualización geoespacial en 3D mediante **Mapbox GL JS** con animaciones cinemáticas guiadas por scroll (**GSAP ScrollTrigger**).

A medida que el usuario se desplaza por la página, la cámara realiza un vuelo cinematográfico que desciende desde una perspectiva orbital de la Tierra hasta la calle y explanada exacta donde se celebra cada fiesta, desplegando su tarjeta con detalles, promociones locales y accesos directos de navegación.

---

## ✨ Características Principales

- 🌍 **Globo Terráqueo 3D & Vuelo Orbital:** Renderizado espacial de la Tierra con atmósfera y zoom dinámico que desciende a vista de calle (pitch de 65° con edificios 3D).
- 📜 **Recorrido por Scroll (GSAP ScrollTrigger):** Control milimétrico de la cámara, confeti festivo y transiciones suaves de tarjetas UI sincronizadas con el scroll.
- 🎵 **Controlador de Audio Dinámico:** Sonido espacial y ambiental con crossfade matemático dependiente de la posición del usuario en el recorrido.
- 📱 **Diseño 100% Adaptable (Desktop & Mobile):**
  - **Desktop:** Tarjeta de evento flotante con efecto de inclinación 3D (*tilt* interactivo).
  - **Mobile:** *BottomSheet* táctil inferior con deslizamiento y gestos adaptados para smartphones.
- 📍 **Llamadas a la Acción (CTAs):**
  - Botón directo de navegación GPS con **Google Maps**.
  - Botón para **compartir el plan por WhatsApp** con texto, horario y coordenadas formateadas.
  - Bloque de **patrocinadores locales oficiales** con promociones y ubicación.
- 🧪 **Suite E2E Playwright:** 26 pruebas de integración que validan los flujos críticos de usuario, estados de fallo de red y compatibilidad móvil.
- 🚀 **Integración Continua (CI):** Pipeline en **GitHub Actions** que ejecuta automáticamente las pruebas en cada Pull Request.

---

## 📅 Programa de Fiestas y Eventos

| Evento | Fecha y Hora | Lugar | Patrocinador |
| :--- | :--- | :--- | :--- |
| **Gran Discomóvil & Luces LED** | Viernes, 22 de Agosto · 23:00h | R Castrillo (C. Maestranza) | Cervecería La Rubia |
| **Gran Paellada Popular & Charanga** | Sábado, 23 de Agosto · 14:30h | Parque de La Rubia (Paseo Zorrilla) | Asador & Bar El Encuentro |
| **Noche de Rock: Tributo & Bandas** | Sábado, 23 de Agosto · 22:30h | Carretera de Rueda, 32 | Pub Roots & Rock |
| **Fiesta de la Espuma & Juegos** | Domingo, 24 de Agosto · 17:00h | C/ Doctor Moreno c/ Héroes del Alcázar | Heladería Rubia Dulce |

---

## 🛠️ Stack Tecnológico

- **Frontend Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Visualización 3D & Mapas:** [Mapbox GL JS v3](https://docs.mapbox.com/mapbox-gl-js/) (Standard Satellite Style & Fog Atmosphere)
- **Animaciones:** [GSAP (GreenSock)](https://gsap.com/) con el plugin `ScrollTrigger`, [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Testing:** [Playwright Test](https://playwright.dev/) (Desktop Chromium + Mobile Viewports)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)

---

## 🚀 Instalación y Uso

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** o **bun**

### 1. Clonar el repositorio
```bash
git clone https://github.com/edanor28/fiestas-la-rubia.git
cd fiestas-la-rubia
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea o edita el archivo `.env` en la raíz del proyecto:
```env
# Token público de Mapbox GL JS (obtenlo gratis en https://account.mapbox.com/)
VITE_MAPBOX_TOKEN="pk.tu_token_de_mapbox"
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing End-to-End (Playwright)

El proyecto cuenta con una suite E2E completa que prueba los 5 flujos críticos del usuario:

```bash
# Ejecutar todas las pruebas en consola
npm run test:e2e

# Abrir el modo interactivo con time-travel debugger (UI Mode)
npm run test:e2e:ui

# Ejecutar el modo de CI con reporte HTML
npm run test:e2e:ci

# Visualizar el reporte HTML de la última ejecución
npx playwright show-report
```

---

## 📂 Estructura del Proyecto

```text
fiestas-la-rubia/
├── .github/
│   └── workflows/
│       └── playwright.yml         # Workflow de GitHub Actions CI
├── e2e/
│   ├── fixtures/
│   │   ├── auth.fixture.ts        # Fixture de sesión autenticada y tokens
│   │   └── events.fixture.ts      # Fixture de mock de red, datos y Mapbox
│   ├── event-journey-and-scroll.spec.ts
│   ├── hero-and-navigation.spec.ts
│   ├── responsive-and-failures.spec.ts
│   └── sound-controller.spec.ts
├── src/
│   ├── components/
│   │   ├── EventCard.tsx          # Tarjeta de evento con efecto tilt y CTAs
│   │   ├── GlobeScene.tsx         # Globo 3D con Mapbox GL y GSAP ScrollTrigger
│   │   ├── HeroOverlay.tsx        # Portada inicial con badges e indicador de scroll
│   │   ├── NavBar.tsx             # Barra de navegación fija
│   │   └── SoundController.tsx    # Reproductor y alternador de audio
│   ├── data/
│   │   └── events.ts              # Catálogo oficial de eventos de las fiestas
│   ├── utils/
│   │   └── math.ts                # Funciones matemáticas de interpolación (lerp/distancia)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── playwright.config.ts           # Configuración de Playwright
├── vite.config.ts                 # Configuración de Vite y Tailwind
└── package.json
```

---

## 📄 Autoría y Derechos

Desarrollado y diseñado con ❤️ por **[Kaldro](https://kaldro.es)** / **Edward**.  
Todos los derechos de desarrollo y propiedad intelectual corresponden a **[kaldro.es](https://kaldro.es)**.

Para colaboraciones o consultas técnicas: [info@kaldro.es](mailto:info@kaldro.es) • [kaldro.es](https://kaldro.es)
