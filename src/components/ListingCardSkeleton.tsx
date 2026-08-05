import React from 'react';
import Skeleton from './ui/Skeleton';

export default function ListingCardSkeleton() {
  return (
    <div className="w-[268px] shrink-0 bg-white dark:bg-stone-850 border border-neutral-100/80 dark:border-neutral-800/65 rounded-2xl shadow-2xs p-3 flex flex-col justify-between cursor-default">
      <div>
        {/* 1. Card Image Container Skeleton */}
        <div className="relative mb-2.5">
          <Skeleton className="w-full h-44 rounded-xl" />
          <div className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/50 dark:bg-stone-700/50" />
        </div>

        {/* 2. Listing Price Row Skeleton */}
        <div className="flex flex-col space-y-1.5 mt-2">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-24 h-3" />
        </div>

        {/* 3. Geographic location Skeleton */}
        <div className="flex items-center space-x-2 mt-3">
          <Skeleton variant="circle" className="w-3.5 h-3.5 shrink-0" />
          <Skeleton className="w-3/4 h-3" />
        </div>

        {/* 4. House Type Pill Badge Skeleton */}
        <div className="mt-3">
          <Skeleton className="w-16 h-4" />
        </div>

        {/* 5. Compact Amenities Icon Row Skeleton */}
        <div className="flex items-center gap-1.5 mt-3">
          <Skeleton variant="circle" className="w-7 h-7" />
          <Skeleton variant="circle" className="w-7 h-7" />
          <Skeleton variant="circle" className="w-7 h-7" />
        </div>

        {/* 6. Mobile Trust Badges Row Skeleton */}
        <div className="flex flex-col space-y-2 mt-4 pt-3 border-t border-neutral-100/60 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <Skeleton variant="circle" className="w-3.5 h-3.5 shrink-0" />
            <Skeleton className="w-20 h-3" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton variant="circle" className="w-3.5 h-3.5 shrink-0" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
      </div>

      {/* 7. Action Contact Row Skeleton */}
      <div className="grid grid-cols-2 gap-2 mt-5 pt-1">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
    </div>
  );
}
