import { AnimatePresence, motion } from 'motion/react';
import { Listing } from '../types/listing';
import { PropertyMap } from './map';
import { PropertyCardHorizontal } from './property';
import { useListingSelection } from '../hooks/useListingSelection';
import { useMotion } from '../lib/motion';

interface SavedMapViewProps {
  listings: Listing[];
  onUnsave?: (id: string) => void;
  onSelectListing?: (id: string) => void;
}

/**
 * Saved homes on a map.
 *
 * What was here before was 382 lines that were not Leaflet at all: rotated
 * divs standing in for roads, eight hardcoded estate labels, and a
 * `getMockCoordinates` that returned CSS percentages derived from the estate
 * name. It looked convincing and told the user nothing true about where a
 * house was.
 *
 * The parts of it worth keeping were the price-flag markers and the
 * tap-a-pin-to-see-the-card model. Both moved onto the real map: the flags are
 * now `.kf-price-marker` divIcons at real coordinates, and the card below is
 * the same PropertyCard the list uses.
 */
export default function SavedMapView({ listings, onUnsave, onSelectListing }: SavedMapViewProps) {
  const m = useMotion();
  const { selectedId, selectFromMap, selectedListing } = useListingSelection(listings);

  return (
    <div className="space-y-3">
      {/* PropertyMap owns no height -- the page decides how much room a map
        * deserves. svh, not dvh: dvh resizes continuously while the mobile URL
        * bar animates, which turns one scroll into a resize storm. */}
      <div className="relative h-[min(70svh,560px)] w-full overflow-hidden rounded-2xl border border-neutral-100 dark:border-stone-800">
        <PropertyMap
          listings={listings}
          selectedId={selectedId}
          onSelect={selectFromMap}
          bottomInset={0}
        />
      </div>

      <AnimatePresence mode="wait">
        {selectedListing && (
          <motion.div
            key={selectedListing.id}
            initial={m.reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={m.reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={m.spring.settle}
          >
            <PropertyCardHorizontal
              listing={selectedListing}
              onSelect={onSelectListing}
              onUnsave={onUnsave}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
