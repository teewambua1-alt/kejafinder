import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

/**
 * One-time Leaflet setup. Import this module for its side effect anywhere a
 * map is rendered:
 *
 *   import '../lib/leaflet';
 *
 * Replaces a patch block that was duplicated verbatim in three components and
 * pointed at cdnjs for Leaflet **1.7.1** while 1.9.4 is what's installed. Two
 * problems with that: the marker sprites didn't match the bundled library, and
 * an installable offline-first PWA was reaching across the network for three
 * images it already ships. These imports are resolved and fingerprinted by
 * Vite, so they're part of the precache manifest like any other asset.
 *
 * The _getIconUrl delete is still required: Leaflet derives icon paths at
 * class level, and the stale getter wins over mergeOptions if left in place.
 */
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

/** Nairobi CBD -- shared default centre for maps with nothing to fit yet. */
export const NAIROBI_CENTER: [number, number] = [-1.2921, 36.8219];

/**
 * CARTO basemaps. The app has a full dark theme but every map was hardcoded
 * to the light tileset, so opening a map in dark mode flash-banged the user.
 */
const OSM_CARTO_ATTRIBUTION =
  // Both credits must be links, not plain text: OSM's attribution guidelines
  // require the credit to point at openstreetmap.org/copyright, and CARTO's
  // terms ask the same for the basemap. An earlier version of this constant
  // shipped the text without anchors, which reads as attribution but does not
  // satisfy either licence.
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';

export const TILES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: OSM_CARTO_ATTRIBUTION,
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: OSM_CARTO_ATTRIBUTION,
  },
} as const;

/** Mount-time map defaults. react-leaflet freezes these after first render. */
export const DEFAULT_ZOOM = 12;
export const MIN_ZOOM = 6;
export const MAX_ZOOM = 18;
/** Cap for fitBounds: a single-pin result would otherwise slam to zoom 18. */
export const MAX_FIT_ZOOM = 15;
export const FIT_PADDING: [number, number] = [48, 48];

/**
 * Generous Kenya bounding box. Anything outside it is treated as bad data
 * rather than plotted, which is what catches swapped lat/lng: a row storing
 * `lat: 36.8, lng: -1.29` would otherwise fly the map into Somalia and wreck
 * fitBounds for every other pin. There is no DB constraint on these columns
 * and PostMapPreview is their only writer, so the guard lives here.
 */
export const PLOTTABLE_BOUNDS = {
  minLat: -5.5,
  maxLat: 5.5,
  minLng: 33.0,
  maxLng: 42.5,
} as const;

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
}

/**
 * The single gate between a listing and the map. Returns null for anything
 * that should not be plotted, so callers can count and disclose the excluded
 * rows instead of inventing a position for them -- which is what the old
 * `approximateCoordinates` id-hash did.
 */
export function toMapPoint(listing: {
  id: string;
  lat?: number | null;
  lng?: number | null;
}): MapPoint | null {
  const { id, lat, lng } = listing;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  // (0,0) is the classic "unset coordinate" sentinel, in the Gulf of Guinea.
  if (lat === 0 && lng === 0) return null;

  const inBounds =
    lat >= PLOTTABLE_BOUNDS.minLat &&
    lat <= PLOTTABLE_BOUNDS.maxLat &&
    lng >= PLOTTABLE_BOUNDS.minLng &&
    lng <= PLOTTABLE_BOUNDS.maxLng;

  if (!inBounds) {
    if (import.meta.env.DEV) {
      // Surface bad data instead of letting it vanish silently.
      console.warn(`[map] listing ${id} has out-of-bounds coordinates (${lat}, ${lng}) -- not plotted`);
    }
    return null;
  }

  return { id, lat, lng };
}

/**
 * Compact price for a map pill. Keeps one decimal below 10K because the
 * previous `(rent / 1000).toFixed(0)` rendered 8,500 as "9K" -- a small lie on
 * the one number a renter cares most about.
 */
export function formatPriceLabel(rent: number): string {
  if (!Number.isFinite(rent) || rent <= 0) return 'KSh -';
  if (rent < 1000) return `KSh ${Math.round(rent)}`;
  if (rent < 10000) {
    const k = (rent / 1000).toFixed(1).replace(/\.0$/, '');
    return `KSh ${k}K`;
  }
  return `KSh ${Math.round(rent / 1000)}K`;
}
