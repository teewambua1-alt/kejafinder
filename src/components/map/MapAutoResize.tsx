import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * Leaflet only listens for *window* resize, so it misses every change driven by
 * the container: the desktop split reflowing its columns, a bottom sheet
 * opening, a breakpoint crossing, the results list changing height. The symptom
 * is grey gutters where tiles were never requested.
 *
 * ResizeObserver also fires one initial observation on `observe()`, which
 * covers the zero-size-at-mount case that otherwise needs a setTimeout guess.
 *
 * Coalesced through rAF because a column drag fires the observer far faster
 * than Leaflet can usefully re-tile, and `invalidateSize` is not cheap.
 */
export default function MapAutoResize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let frame = 0;

    const observer = new ResizeObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // `pan: false` -- a resize should reveal more map, not slide the
        // centre out from under the user's finger.
        map.invalidateSize({ animate: false, pan: false });
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [map]);

  return null;
}
