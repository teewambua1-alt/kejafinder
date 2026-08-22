import React from 'react';
import type { Listing } from '../../types/listing';
import {
  CardFrame,
  CardPhoto,
  CardPrice,
  CardStats,
  CardLocation,
  CardAmenities,
  RecentlyUpdatedTag,
  SaveHeart,
  ContactActions,
} from './parts';
import { cn } from '../../lib/cn';

interface PropertyCardVerticalProps {
  listing: Listing;
  onSelect?: (id: string) => void;
  /** First card in a viewport-visible row: loads its photo eagerly. */
  priority?: boolean;
  /** Replaces the default Call/WhatsApp pair (e.g. a "View" CTA). */
  actions?: React.ReactNode;
  /** Extra rows under the metadata, e.g. a saved-on date. */
  meta?: React.ReactNode;
  onCall?: () => void;
  onWhatsApp?: () => void;
  className?: string;
}

/**
 * Photo-above-content card. Used by the home carousels, the search grid, and
 * the similar-homes rail. Width is set by the caller so the same card can be a
 * fixed-width carousel item or a fluid grid cell -- it does not need to know
 * which.
 */
export default function PropertyCardVertical({
  listing,
  onSelect,
  priority,
  actions,
  meta,
  onCall,
  onWhatsApp,
  className,
}: PropertyCardVerticalProps) {
  return (
    <CardFrame onClick={() => onSelect?.(listing.id)} className={cn('flex flex-col', className)}>
      <CardPhoto listing={listing} ratio="photo" priority={priority}>
        <SaveHeart listing={listing} className="absolute top-2.5 right-2.5 z-10" />
      </CardPhoto>

      <div className="flex flex-col gap-2 p-3 flex-1">
        <CardPrice listing={listing} />
        <h3 className="text-xs font-bold text-neutral-800 dark:text-stone-100 line-clamp-1">
          {listing.title}
        </h3>
        <CardLocation listing={listing} />
        <CardStats listing={listing} />
        <CardAmenities listing={listing} max={2} />
        <RecentlyUpdatedTag listing={listing} />
        {meta}

        <div className="mt-auto pt-2">
          {actions ?? (
            <ContactActions listing={listing} onCall={onCall} onWhatsApp={onWhatsApp} />
          )}
        </div>
      </div>
    </CardFrame>
  );
}
