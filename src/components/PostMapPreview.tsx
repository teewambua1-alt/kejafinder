import React, { useState } from 'react';
import { MapPin, Locate, LocateFixed, LoaderCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

type CaptureState = 'idle' | 'requesting' | 'captured' | 'denied' | 'unsupported';

interface PostMapPreviewProps {
  lat: number | null;
  lng: number | null;
  onLocationCaptured: (lat: number, lng: number) => void;
}

/**
 * Real geolocation capture -- the map itself stays a decorative CSS/SVG
 * backdrop (a real draggable-pin map is a bigger scope than the actual goal
 * here, which is just a real coordinate), but the "locate me" button now
 * genuinely calls navigator.geolocation and the badge reflects real state.
 * This is the only place in the app a listing can ever get real lat/lng --
 * Nearby/Nearest search (Phase 3/6) have shown honest empty states purely
 * because no listing has had one before.
 */
export default function PostMapPreview({ lat, lng, onLocationCaptured }: PostMapPreviewProps) {
  const [captureState, setCaptureState] = useState<CaptureState>(lat !== null && lng !== null ? 'captured' : 'idle');

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setCaptureState('unsupported');
      return;
    }

    setCaptureState('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCaptureState('captured');
        onLocationCaptured(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setCaptureState('denied');
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };

  const badgeText =
    captureState === 'captured'
      ? `Location captured (${lat?.toFixed(4)}, ${lng?.toFixed(4)})`
      : captureState === 'requesting'
      ? 'Locating...'
      : captureState === 'denied'
      ? 'Location access needed'
      : captureState === 'unsupported'
      ? 'Not supported on this device'
      : 'Tap to share your exact location';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="relative w-full h-42 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-800/80 shadow-xs group"
    >
      {/* Mock Map Grid & Roads (pure CSS and SVG) */}
      <div className="absolute inset-0 bg-[#f9f9fb] dark:bg-[#161513] transition-colors duration-300">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

        {/* Stylized streets map design natively constructed with inline SVGs */}
        <svg className="absolute inset-0 w-full h-full stroke-neutral-200/60 dark:stroke-neutral-850/40 fill-none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Roads */}
          <path d="M-10,50 L450,110 M-10,120 L450,60" strokeWidth="8" strokeLinecap="round" />
          <path d="M120,-10 L180,200" strokeWidth="6" strokeLinecap="round" />
          <path d="M300,-10 L260,200" strokeWidth="6" strokeLinecap="round" />

          {/* Secondary smaller alleys */}
          <path d="M50,80 L80,-10 M70,82 L150,150 M200,90 C250,90 290,120 350,120" strokeWidth="3" strokeDasharray="3,3" strokeLinecap="round" />

          {/* Visual greenery/parks with CSS borders */}
          <rect x="20" y="10" width="70" height="35" rx="8" className="fill-emerald-500/4 dark:fill-emerald-850/5 stroke-none" />
          <rect x="330" y="25" width="80" height="70" rx="12" className="fill-emerald-500/4 dark:fill-emerald-850/5 stroke-none" />
        </svg>

        {/* Floating stylized text tags */}
        <div className="absolute top-6 left-10 text-[9px] font-bold text-neutral-400 dark:text-stone-600 select-none uppercase tracking-wide">
          Estate Road
        </div>
        <div className="absolute bottom-5 right-20 text-[9px] font-bold text-neutral-400 dark:text-stone-600 select-none uppercase tracking-wide">
          Main Highway
        </div>
      </div>

      {/* Center Pin Overlay & Radar Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {captureState === 'captured' && (
          <>
            <div className="absolute w-12 h-12 bg-emerald-500/20 rounded-full animate-ping opacity-60" />
            <div className="absolute w-6 h-6 bg-emerald-500/30 rounded-full animate-pulse" />
          </>
        )}

        <div className="relative flex flex-col items-center">
          <motion.div
            animate={captureState === 'captured' ? { y: [0, -4, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center border-2 border-white dark:border-stone-900 text-white ${
              captureState === 'captured' ? 'bg-emerald-600' : 'bg-neutral-400 dark:bg-stone-700'
            }`}
          >
            <MapPin className="w-4.5 h-4.5 fill-white/10" />
          </motion.div>
          <div className="w-2.5 h-1 bg-neutral-900/30 rounded-full blur-[1px] mt-0.5" />
        </div>
      </div>

      {/* Floating real-status badge */}
      <div className="absolute top-3 left-3 right-14 px-2.5 py-1.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-neutral-150/45 dark:border-neutral-800/60 shadow-xs flex items-center space-x-1.5">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          captureState === 'captured' ? 'bg-emerald-500 animate-pulse' : captureState === 'denied' || captureState === 'unsupported' ? 'bg-orange-500' : 'bg-neutral-400'
        }`} />
        <span className="text-[9.5px] font-extrabold text-neutral-750 dark:text-stone-200 tracking-tight truncate">
          {badgeText}
        </span>
      </div>

      {/* Real locate me button (bottom-right) */}
      <button
        type="button"
        onClick={requestLocation}
        disabled={captureState === 'requesting'}
        aria-label="Use current location"
        className="absolute bottom-3 right-3 w-8.5 h-8.5 bg-white dark:bg-stone-900 border border-neutral-100 dark:border-neutral-800 rounded-xl flex items-center justify-center text-neutral-700 dark:text-stone-300 shadow-xs hover:bg-neutral-50 dark:hover:bg-stone-850 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
      >
        {captureState === 'requesting' ? (
          <LoaderCircle className="w-4.5 h-4.5 stroke-[2] animate-spin" />
        ) : captureState === 'captured' ? (
          <LocateFixed className="w-4.5 h-4.5 stroke-[2] text-emerald-600" />
        ) : captureState === 'denied' || captureState === 'unsupported' ? (
          <ShieldAlert className="w-4.5 h-4.5 stroke-[2] text-orange-500" />
        ) : (
          <Locate className="w-4.5 h-4.5 stroke-[2]" />
        )}
      </button>
    </motion.div>
  );
}
