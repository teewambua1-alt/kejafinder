import React, { useEffect, useMemo, useRef } from 'react';
import { Marker } from 'react-leaflet';
import type L from 'leaflet';
import { priceMarkerIcon } from './priceMarkerIcon';

interface PriceMarkerProps {
  id: string;
  lat: number;
  lng: number;
  priceLabel: string;
  title: string;
  /** Booleans, never `selectedId`. See the memo note below. */
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
  /**
   * Tab-reachable. False on the small non-interactive preview map, where 60
   * focusable pins would be 60 tab stops in front of a control the user cannot
   * act on -- a variant of the nested-interactive trap this replaces.
   */
  focusable?: boolean;
}

/**
 * One pin. Deliberately dumb, and deliberately given booleans rather than the
 * current `selectedId`: with `selectedId` every one of 60 markers re-renders on
 * every selection change, and since react-leaflet's `useEventHandlers` does a
 * full off/on when the handler object's identity changes, that meant 60
 * unbind/rebind cycles per tap. With booleans plus React.memo, selecting a pin
 * re-renders exactly the two that changed.
 */
function PriceMarkerBase({
  id, lat, lng, priceLabel, title, isSelected, isHovered, onSelect, onHover,
  focusable = true,
}: PriceMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);

  const icon = useMemo(
    () => priceMarkerIcon(priceLabel, title, isSelected ? 'selected' : isHovered ? 'hovered' : 'default'),
    [priceLabel, title, isSelected, isHovered]
  );

  // Stable identity, or react-leaflet rebinds every listener on every render.
  const eventHandlers = useMemo(
    () => ({
      click: () => onSelect(id),
      keypress: (e: L.LeafletKeyboardEvent) => {
        // Leaflet makes the marker focusable but only maps Enter to click.
        if (e.originalEvent.key === ' ') {
          e.originalEvent.preventDefault();
          onSelect(id);
        }
      },
      mouseover: () => onHover?.(id),
      mouseout: () => onHover?.(null),
    }),
    [id, onSelect, onHover]
  );

  // Leaflet gives the div a tabindex but no role, so AT announces a focusable
  // blob of text. The accessible name comes from the .__sr span in the icon
  // HTML; this supplies the role and the pressed-ness.
  useEffect(() => {
    const el = markerRef.current?.getElement();
    if (!el) return;
    if (!focusable) {
      el.setAttribute('aria-hidden', 'true');
      return;
    }
    el.setAttribute('role', 'button');
    el.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  }, [isSelected, icon, focusable]);

  return (
    <Marker
      ref={markerRef}
      position={[lat, lng]}
      icon={icon}
      keyboard={focusable}
      riseOnHover
      // Selected pin must not be overlapped by its neighbours.
      zIndexOffset={isSelected ? 1000 : isHovered ? 500 : 0}
      eventHandlers={eventHandlers}
    />
  );
}

export const PriceMarker = React.memo(PriceMarkerBase);
export default PriceMarker;
