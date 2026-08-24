import { lazy, Suspense } from 'react';
import { NavBar } from './components/NavBar';
import { SoundController } from './components/SoundController';
import { KaldroBadge } from './components/KaldroBadge';
import { Globe } from 'lucide-react';

// Lazy loading del componente pesado que contiene Mapbox GL JS
const GlobeScene = lazy(() => 
  import('./components/GlobeScene').then(module => ({ default: module.GlobeScene }))
);

// Fallback visual mientras se descargan los assets 3D
const LoadingFallback = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center bg-[#050B14]">
    <Globe className="w-16 h-16 text-[#F43F5E] animate-pulse mb-6 opacity-80" />
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2.5 h-2.5 bg-[#38BDF8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2.5 h-2.5 bg-[#38BDF8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2.5 h-2.5 bg-[#38BDF8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
    <p className="text-slate-400 text-xs font-semibold tracking-[0.2em] uppercase">
      Iniciando experiencia espacial...
    </p>
  </div>
);

export default function App() {
  return (
    <div className="font-sans antialiased text-slate-50 bg-[#050B14] min-h-screen selection:bg-[#F43F5E]/30 selection:text-white">
      <NavBar />
      <SoundController />
      <KaldroBadge />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <GlobeScene />
        </Suspense>
      </main>
    </div>
  );
}
