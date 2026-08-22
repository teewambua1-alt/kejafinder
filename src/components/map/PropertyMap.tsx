import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type L from 'leaflet';
import { useTheme } from '../ThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import {
  DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, NAIROBI_CENTER, TILES,
  formatPriceLabel, toMapPoint, type MapPoint,
} from '../../lib/leaflet';
import '../../lib/leaflet'; // side effect: default-icon setup
import PriceMarker from './PriceMarker';
import MapViewController from './MapViewController';
import MapAutoResize from './MapAutoResize';
import LocateControl from './LocateControl';
import MapCoverageNotice from './MapCoverageNotice';

/**
 * The narrowest shape a map needs. Declared structurally rather than as
 * `Listing[]` so the detail page can pass its own KejaListing without a cast
 * and without either type having to know about the map.
 */
export interface MappableListing {
  id: string;
  title: string;
  rent: number;
  lat?: number | null;
  lng?: number | null;
}

export interface PropertyMapProps {
  listings: MappableListing[];
  /** Explicit variants rather than a pile of booleans. */
  variant?: 'interactive' | 'preview';
  selectedId?: string | null;
  hoveredId?: string | null;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  /** Height of anything docked over the bottom of the map, in px. */
  bottomInset?: number;
  onNotice?: (message: string) => void;
  className?: string;
}

/**
 * The app's only map. Replaces SearchFullMap (85 lines, default blue pins,
 * price hidden inside a Popup) and SavedMapView (382 lines that were not
 * Leaflet at all -- rotated divs, eight hardcoded estate labels, and a
 * getMockCoordinates that returned CSS percentages).
 *
 * This component owns **zero height**: it is always `h-full` and the caller
 * sizes the parent. SearchFullMap used to hardcode `top: 64px; bottom: 64px`
 * inline, which double-counted because its offset parent already sat below the
 * header and inside AppShell's padding. Layout now lives once per page,
 * expressed with the --kf-*-h variables in index.css.
 *
 * Clustering: no. 60 DOM markers is nothing, and the real threshold is not
 * marker count but pagination -- revisit when `.limit(60)` becomes a viewport
 * query and >150 pins can land at once, and then use `supercluster` with this
 * same divIcon rather than leaflet.markercluster.
 */
export default function PropertyMap({
  listings,
  variant = 'interactive',
  selectedId = null,
  hoveredId = null,
  onSelect,
  onHover,
  bottomInset = 0,
  onNotice,
  className = '',
}: PropertyMapProps) {
  const { isDark } = useTheme();
  const [map, setMap] = useState<L.Map | null>(null);
  const interactive = variant === 'interactive';

  // Touch devices are also the metered-data devices. updateWhenIdle stops
  // Leaflet requesting tiles for every intermediate frame of a pan.
  const isTouch = useMediaQuery('(hover: none)');

  const points: MapPoint[] = useMemo(
    () => listings.map(toMapPoint).filter((p): p is MapPoint => p !== null),
    [listings]
  );

  // Only the plottable ones, keyed for label lookup without a second scan.
  const plotted = useMemo(() => {
    const byId = new Map(listings.map((l) => [l.id, l]));
    return points.map((point) => {
      const listing = byId.get(point.id);
      return {
        point,
        priceLabel: formatPriceLabel(listing?.rent ?? 0),
        title: listing?.title ?? 'Listing',
      };
    });
  }, [points, listings]);

  const handleSelect = React.useCallback((id: string) => { onSelect?.(id); }, [onSelect]);
  const tiles = isDark ? TILES.dark : TILES.light;

  return (
    // The theme background belongs on the wrapper, never on MapContainer:
    // react-leaflet freezes className at mount, so a dark: class there would
    // stick at whatever the theme was on first render. It also gives the brief
    // blank during a tile swap something themed to sit on.
    <div className={`relative h-full w-full overflow-hidden bg-neutral-100 dark:bg-stone-900 ${className}`}>
      <MapContainer
        ref={setMap}
        center={NAIROBI_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        keyboard={interactive}
        className="h-full w-full"
      >
        {/* Swapping `url` makes react-leaflet call setUrl, which keeps the
          * layer, its pane and every marker. `key={theme}` would tear the
          * layer down for the same result. Caveat worth naming: setUrl ->
          * redraw() -> _removeAllTiles(), so there is a brief blank -- the
          * themed wrapper above makes that read as a theme change. */}
        <TileLayer
          url={tiles.url}
          attribution={tiles.attribution}
          // Retina tiles double the bytes for a difference nobody reports.
          detectRetina={false}
          updateWhenIdle={isTouch}
        />
        <MapAutoResize />
        <MapViewController points={points} selectedId={selectedId} bottomInset={bottomInset} />
        {plotted.map(({ point, priceLabel, title }) => (
          <PriceMarker
            key={point.id}
            id={point.id}
            lat={point.lat}
            lng={point.lng}
            priceLabel={priceLabel}
            title={title}
            // Booleans, not selectedId -- see PriceMarker's memo note.
            isSelected={point.id === selectedId}
            isHovered={point.id === hoveredId}
            onSelect={handleSelect}
            onHover={onHover}
            focusable={interactive}
          />
        ))}
      </MapContainer>

      {/* Chrome sits outside MapContainer so it is outside the container's
        * stacking context and only needs to beat --z-map (0). */}
      {interactive && (
        <div className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[var(--z-map-chrome)] flex flex-col items-end gap-2">
          <LocateControl map={map} onNotice={onNotice} />
        </div>
      )}

      <div
        className="absolute left-3 z-[var(--z-map-chrome)] max-w-[calc(100%-1.5rem)]"
        style={{ bottom: `calc(1.25rem + ${bottomInset}px)` }}
      >
        <MapCoverageNotice plotted={points.length} total={listings.length} />
      </div>
    </div>
  );
}
