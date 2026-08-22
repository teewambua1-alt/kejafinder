import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { Listing } from '../types/listing';

/**
 * One selection model for the results list and the map.
 *
 * The old map buried a clickable div inside a Leaflet `<Popup>` -- a second,
 * hidden interaction path that no keyboard or screen-reader user would ever
 * find. There is now one piece of state with two renderings: tapping a marker
 * selects a listing, and the list shows that as a docked card on mobile or a
 * highlighted-and-scrolled card on desktop. Hovering a card highlights its
 * marker, which is the reverse direction and deliberately kept separate --
 * hover is not selection.
 */
export function useListingSelection(listings: Listing[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const cardNodes = useRef(new Map<string, HTMLElement>());
  // Set by marker taps only. A card-driven selection must not scroll the card
  // the user just clicked.
  const scrollPending = useRef<string | null>(null);

  const registerCard = useCallback((id: string, node: HTMLElement | null) => {
    if (node) cardNodes.current.set(id, node);
    else cardNodes.current.delete(id);
  }, []);

  const ids = useMemo(() => new Set(listings.map((l) => l.id)), [listings]);

  // A selection that survives a filter change would highlight a card that is
  // no longer on screen and pan the map to a pin that no longer exists.
  useEffect(() => {
    if (selectedId && !ids.has(selectedId)) setSelectedId(null);
    if (hoveredId && !ids.has(hoveredId)) setHoveredId(null);
  }, [ids, selectedId, hoveredId]);

  const selectFromMap = useCallback((id: string) => {
    setSelectedId((prev) => {
      const next = prev === id ? null : id;
      scrollPending.current = next;
      return next;
    });
  }, []);

  const selectFromList = useCallback((id: string) => {
    scrollPending.current = null;
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const clearSelection = useCallback(() => {
    scrollPending.current = null;
    setSelectedId(null);
  }, []);

  useEffect(() => {
    const target = scrollPending.current;
    if (!target || target !== selectedId) return;
    scrollPending.current = null;
    const node = cardNodes.current.get(target);
    if (!node) return;
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }, [selectedId, reduce]);

  return {
    selectedId,
    hoveredId,
    selectFromMap,
    selectFromList,
    clearSelection,
    setHovered: setHoveredId,
    registerCard,
    selectedListing: useMemo(
      () => listings.find((l) => l.id === selectedId) ?? null,
      [listings, selectedId]
    ),
  };
}

export default useListingSelection;
