import React from 'react';

interface SkeletonProps {
  className?: string;
}
import Skeleton from '../ui/Skeleton';
import { cn } from '../../lib/cn';

/**
 * Loading placeholder mirroring PropertyCardVertical's real layout. The old
 * ListingCardSkeleton had drifted out of step with the card it stood in for --
 * it still rendered a circular-icon amenity row and a two-line trust-badge
 * stack the card no longer had -- so content visibly jumped on load.
 */
export function PropertyCardVerticalSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-stone-900 border border-neutral-100 dark:border-stone-800/70 rounded-2xl shadow-2xs overflow-hidden flex flex-col',
        className
      )}
    >
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-3/4 h-3.5" />
        <Skeleton className="w-2/3 h-3" />
        <Skeleton className="w-1/2 h-3" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Loading placeholder mirroring PropertyCardHorizontal's real layout. */
export function PropertyCardHorizontalSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-stone-900 border border-neutral-100 dark:border-stone-800/70 rounded-2xl shadow-2xs overflow-hidden flex flex-row',
        className
      )}
    >
      <Skeleton className="w-[124px] xs:w-[150px] shrink-0 aspect-square rounded-none" />
      <div className="flex-1 flex flex-col gap-2 p-3">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-3/4 h-3.5" />
        <Skeleton className="w-2/3 h-3" />
        <Skeleton className="w-1/2 h-3" />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
