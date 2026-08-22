import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { Listing } from '../types/listing';
import { PropertyCardVertical, PropertyCardHorizontal } from './property';
import EmptyState from './ui/EmptyState';
import { useMotion } from '../lib/motion';
import { cn } from '../lib/cn';

interface SearchResultsListProps {
  listings: Listing[];
  onClearSearch?: () => void;
  onSelectListing?: (id: string) => void;
  viewMode?: 'list' | 'grid';
  /** Map selection -- ringed and scrolled into view. */
  selectedId?: string | null;
  /** Hovering a card highlights its marker. Desktop split only. */
  onHoverListing?: (id: string | null) => void;
  /** Lets the selection hook scroll the matching card into view. */
  registerCard?: (id: string, node: HTMLElement | null) => void;
  /** Distinguishes "the database is empty" from "your search matched nothing". */
  hasQueryOrFilters?: boolean;
}

export default function SearchResultsList({
  listings,
  onClearSearch,
  onSelectListing,
  viewMode = 'list',
  selectedId = null,
  onHoverListing,
  registerCard,
  hasQueryOrFilters = false,
}: SearchResultsListProps) {
  const m = useMotion();

  if (listings.length === 0) {
    // Two genuinely different situations that used to share one message.
    return hasQueryOrFilters ? (
      <EmptyState
        icon={Search}
        title="No vacancies match"
        description="Try another estate, area or house type, or widen your rent range."
        primaryAction={onClearSearch ? { label: 'Clear search', onClick: onClearSearch } : undefined}
      />
    ) : (
      <EmptyState
        icon={Search}
        title="No vacancies posted yet"
        description="Nothing has been listed in this area so far. Check back soon."
      />
    );
  }

  return (
    <motion.div
      variants={m.stagger(0.05)}
      initial="hidden"
      animate="show"
      className={cn(
        // Bottom padding clears the mobile BottomNav; there is none at md+.
        'w-full pb-28 md:pb-4',
        viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'flex flex-col gap-4'
      )}
    >
      {listings.map((listing, i) => {
        const isSelected = listing.id === selectedId;
        // The ring lives on a wrapper rather than on the card, so it reads as
        // "the map picked this one" and does not fight the card's own hover
        // border. Also the anchor the scroll-into-view targets.
        const ring = isSelected
          ? 'rounded-2xl ring-2 ring-emerald-500 ring-offset-2 ring-offset-surface-muted dark:ring-offset-stone-950'
          : '';

        return (
          <motion.div
            key={listing.id}
            variants={m.fadeUp}
            ref={registerCard ? (node) => registerCard(listing.id, node) : undefined}
            onMouseEnter={onHoverListing ? () => onHoverListing(listing.id) : undefined}
            onMouseLeave={onHoverListing ? () => onHoverListing(null) : undefined}
            className={cn('min-w-0', ring)}
          >
            {viewMode === 'grid' ? (
              <PropertyCardVertical listing={listing} onSelect={onSelectListing} priority={i < 4} />
            ) : (
              <PropertyCardHorizontal listing={listing} onSelect={onSelectListing} />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
