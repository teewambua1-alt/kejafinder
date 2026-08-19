import React, { useState, useEffect } from 'react';
import { Locate, LocateFixed, LoaderCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER: [number, number] = [-1.2921, 36.8219]; // Nairobi

type CaptureState = 'idle' | 'requesting' | 'captured' | 'denied' | 'unsupported';

interface PostMapPreviewProps {
  lat: number | null;
  lng: number | null;
  onLocationCaptured: (lat: number, lng: number) => void;
}

// Recenters the map view whenever `position` changes externally (e.g. the
// "Locate me" button), without fighting the user's own pan/zoom otherwise.
function RecenterOnChange({ position, zoom }: { position: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position[0], position[1]]);
  return null;
}

function ClickToPlace({ onPlace }: { onPlace: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPlace(e.latlng);
    },
  });
  return null;
}

/**
 * Real interactive Leaflet map for setting a listing's exact coordinates --
 * drag the pin, tap anywhere on the map, or tap "Locate me" for a real
 * navigator.geolocation fix. This is the only place in the app a listing
 * ever gets real lat/lng; every other map (ListingLocationDetails,
 * SearchFullMap) falls back to an approximation when it's null.
 */
export default function PostMapPreview({ lat, lng, onLocationCaptured }: PostMapPreviewProps) {
  const [position, setPosition] = useState<[number, number]>(
    lat !== null && lng !== null ? [lat, lng] : DEFAULT_CENTER
  );
  const [captureState, setCaptureState] = useState<CaptureState>(lat !== null && lng !== null ? 'captured' : 'idle');

  useEffect(() => {
    if (lat !== null && lng !== null) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const handleCapture = (latlng: { lat: number; lng: number }) => {
    setPosition([latlng.lat, latlng.lng]);
    setCaptureState('captured');
    onLocationCaptured(latlng.lat, latlng.lng);
  };

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setCaptureState('unsupported');
      return;
    }

    setCaptureState('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleCapture({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setCaptureState('denied');
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };

  const badgeText =
    captureState === 'captured'
      ? `Location captured (${position[0].toFixed(4)}, ${position[1].toFixed(4)})`
      : captureState === 'requesting'
      ? 'Locating...'
      : captureState === 'denied'
      ? 'Location access needed'
      : captureState === 'unsupported'
      ? 'Not supported on this device'
      : 'Drag the pin, tap the map, or use your location';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="relative w-full h-56 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-800/80 shadow-xs"
    >
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker
          position={position}
          draggable
          eventHandlers={{
            dragend: (e) => handleCapture(e.target.getLatLng()),
          }}
        />
        <ClickToPlace onPlace={(latlng) => handleCapture(latlng)} />
        <RecenterOnChange position={position} zoom={16} />
      </MapContainer>

      {captureState === 'captured' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-12 h-12 bg-emerald-500/20 rounded-full animate-ping opacity-60" />
        </div>
      )}

      {/* Floating real-status badge */}
      <div className="absolute top-3 left-3 right-14 px-2.5 py-1.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-neutral-150/45 dark:border-neutral-800/60 shadow-xs flex items-center space-x-1.5 z-[1000] pointer-events-none">
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
        className="absolute bottom-3 right-3 w-8.5 h-8.5 bg-white dark:bg-stone-900 border border-neutral-100 dark:border-neutral-800 rounded-xl flex items-center justify-center text-neutral-700 dark:text-stone-300 shadow-xs hover:bg-neutral-50 dark:hover:bg-stone-850 active:scale-95 transition-all cursor-pointer disabled:opacity-60 z-[1000]"
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
