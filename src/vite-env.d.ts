/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ScrollPhaseEventDetail {
  phase: number;
}

interface MapThemeChangeEventDetail {
  isNight: boolean;
}

declare global {
  interface Window {
    __MOCK_NO_TOKEN__?: boolean;
    __MOCK_FIESTA_EVENTS__?: any[];
    __E2E_MOCK_MAPBOX__?: boolean;
    __PLAYWRIGHT_TEST__?: boolean;
  }

  interface WindowEventMap {
    'scrollPhase': CustomEvent<ScrollPhaseEventDetail>;
    'mapThemeChange': CustomEvent<MapThemeChangeEventDetail>;
  }
}

export {};
