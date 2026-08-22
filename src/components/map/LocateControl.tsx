import { useCallback, useState } from 'react';
import type L from 'leaflet';
import { LocateFixed, Loader2 } from 'lucide-react';

interface LocateControlProps {
  map: L.Map | null;
  /** Bubbled up so the page can toast; the live region below covers AT. */
  onNotice?: (message: string) => void;
}

type Status = 'idle' | 'locating' | 'error';

/**
 * "Where am I" button. Rendered as a *sibling* of MapContainer, not a child, so
 * it sits outside `.leaflet-container`'s stacking context and only has to beat
 * z-index 0 -- which is why it is z-10 and not the z-[1000] every other map
 * overlay in this app was carrying.
 *
 * Worth knowing when testing: geolocation requires a secure context.
 * http://localhost counts, but reaching the dev server over a LAN IP from a
 * real phone does not, and the browser rejects it silently. That is exactly how
 * one would test this feature, so the failure is named explicitly below rather
 * than left as a button that does nothing.
 */
export default function LocateControl({ map, onNotice }: LocateControlProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const fail = useCallback((text: string) => {
    setStatus('error');
    setMessage(text);
    onNotice?.(text);
  }, [onNotice]);

  const locate = useCallback(() => {
    if (!map) return;

    if (!('geolocation' in navigator)) {
      fail('This browser cannot share your location.');
      return;
    }
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      fail('Location needs a secure (https) connection.');
      return;
    }

    setStatus('locating');
    setMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus('idle');
        map.flyTo([position.coords.latitude, position.coords.longitude], 15, { duration: 0.8 });
        setMessage('Centred on your location.');
      },
      (error) => {
        fail(
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was declined.'
            : 'Could not get your location. Try again.'
        );
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  }, [map, fail]);

  const busy = status === 'locating';

  return (
    <>
      <button
        type="button"
        onClick={locate}
        disabled={!map || busy}
        aria-label="Centre the map on my location"
        className="grid h-11 w-11 place-items-center rounded-2xl border border-neutral-200 dark:border-stone-800 bg-surface dark:bg-stone-900 text-neutral-700 dark:text-stone-200 shadow-md transition-colors hover:bg-neutral-100 dark:hover:bg-stone-800 disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin stroke-[2.2]" aria-hidden="true" />
        ) : (
          <LocateFixed className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
        )}
      </button>
      {/* Every outcome here is asynchronous and otherwise invisible to AT. */}
      <p aria-live="polite" className="sr-only">{message}</p>
    </>
  );
}
