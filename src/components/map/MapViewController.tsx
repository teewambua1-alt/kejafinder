import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { FIT_PADDING, MAX_FIT_ZOOM, type MapPoint } from '../../lib/leaflet';

interface MapViewControllerProps {
  points: MapPoint[];
  selectedId?: string | null;
  /** Extra bottom padding so a docked card doesn't cover the selected pin. */
  bottomInset?: number;
}

/**
 * `MapContainer` freezes `center`, `zoom`, `className`, `style` and every
 * MapOptions field at first render -- verified in react-leaflet's
 * MapContainer.js, which stashes them in `useState` and builds the map inside
 * `useCallback(..., [])`. They are mount-time defaults, not controlled props.
 * So view changes have to come from a child with `useMap()`, which is what this
 * is.
 */
export default function MapViewController({ points, selectedId, bottomInset = 0 }: MapViewControllerProps) {
  const map = useMap();

  // Refit only when the *set of coordinates* changes -- never on selection,
  // which would zoom the map every time the user taps a pin.
  const signature = points
    .map((p) => `${p.id}:${p.lat.toFixed(5)}:${p.lng.toFixed(5)}`)
    .sort()
    .join('|');

  // A refit mid-gesture yanks the map out from under the user. Once they have
  // moved it themselves, respect that until the result set actually changes.
  const userMoved = useRef(false);
  useEffect(() => {
    const mark = () => { userMoved.current = true; };
    map.on('dragstart', mark);
    map.on('zoomstart', mark);
    return () => {
      map.off('dragstart', mark);
      map.off('zoomstart', mark);
    };
  }, [map]);

  useEffect(() => {
    userMoved.current = false;
    if (points.length === 0) return;

    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, {
      padding: FIT_PADDING,
      // Without this a single-pin result slams to zoom 18 -- a rooftop view
      // with no context, which is worse than useless for orienting yourself.
      maxZoom: MAX_FIT_ZOOM,
      animate: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, signature]);

  useEffect(() => {
    if (!selectedId) return;
    const point = points.find((p) => p.id === selectedId);
    if (!point) return;

    // panInside no-ops when the point is already inside the padded bounds --
    // exactly the "don't yank the map when I tap a pin I can already see"
    // behaviour, without hand-rolling the bounds maths.
    // Clamp the inset: a docked card can be a third of a phone screen tall, and
    // an unclamped padding larger than the remaining viewport makes panInside
    // fling the map instead of nudging it.
    const usable = map.getSize().y;
    const bottomPad = 64 + Math.min(bottomInset, usable * 0.4);

    map.panInside(L.latLng(point.lat, point.lng), {
      padding: [64, 64],
      paddingBottomRight: [64, bottomPad],
      animate: true,
      duration: 0.3,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedId, bottomInset]);

  return null;
}
