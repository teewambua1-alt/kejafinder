import React from 'react';
import type { Listing } from '../../types/listing';
import {
  CardFrame,
  CardPhoto,
  CardPrice,
  CardStats,
  CardLocation,
  CardAmenities,
  SaveHeart,
  ContactActions,
} from './parts';
import { cn } from '../../lib/cn';

interface PropertyCardHorizontalProps {
  listing: Listing;
  onSelect?: (id: string) => void;
  /** Replaces the default Call/WhatsApp pair. */
  actions?: React.ReactNode;
  /** Extra rows under the metadata, e.g. a saved-on date. */
  meta?: React.ReactNode;
  /** Overlay inside the photo frame, e.g. a compare checkbox. */
  photoOverlay?: React.ReactNode;
  /** Saved page: heart removes instead of toggling. */
  onUnsave?: (id: string) => void;
  onCall?: () => void;
  onWhatsApp?: () => void;
  className?: string;
}

/**
 * Photo-beside-content card for full-width rows. Used by the search results
 * list and the Saved page. The photo column is a fixed width so a column of
 * these lines up regardless of photo aspect ratio; the content column absorbs
 * the remaining space.
 */
export default function PropertyCardHorizontal({
  listing,
  onSelect,
  actions,
  meta,
  photoOverlay,
  onUnsave,
  onCall,
  onWhatsApp,
  className,
}: PropertyCardHorizontalProps) {
  return (
    <CardFrame onClick={() => onSelect?.(listing.id)} className={cn('flex flex-row', className)}>
      <div className="relative w-[124px] xs:w-[150px] shrink-0 self-stretch">
        <CardPhoto listing={listing} ratio="fill">
          {photoOverlay}
        </CardPhoto>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex flex-col gap-1.5">
            <CardPrice listing={listing} />
            <h3 className="text-xs font-bold text-neutral-800 dark:text-stone-100 line-clamp-1">
              {listing.title}
            </h3>
          </div>
          <SaveHeart listing={listing} onUnsave={onUnsave} className="shrink-0 -mr-1 -mt-1" />
        </div>

        <CardLocation listing={listing} />
        <CardStats listing={listing} />
        <div className="hidden xs:block">
          <CardAmenities listing={listing} max={2} />
        </div>
        {meta}

        {/* Capped so the pair stays button-shaped in a wide results column
            rather than stretching across the whole row. */}
        <div className="mt-auto pt-1 sm:max-w-[300px]">
          {actions ?? (
            <ContactActions listing={listing} onCall={onCall} onWhatsApp={onWhatsApp} />
          )}
        </div>
      </div>
    </CardFrame>
  );
}
