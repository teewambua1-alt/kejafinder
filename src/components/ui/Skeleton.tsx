import React from 'react';
import { cn } from '../../lib/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'block' | 'circle' | 'text';
}

/**
 * Generic pulsing placeholder block, extracted from the shimmer pattern
 * already used in ListingCardSkeleton (bg-neutral-200/dark:bg-stone-800 +
 * animate-pulse). Compose with width/height utility classes via className,
 * e.g. <Skeleton className="w-32 h-5" /> or <Skeleton variant="circle"
 * className="w-8 h-8" />.
 */
export default function Skeleton({ className, variant = 'block' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-neutral-200 dark:bg-stone-800 animate-pulse',
        variant === 'circle' && 'rounded-full',
        variant === 'block' && 'rounded-md',
        variant === 'text' && 'rounded-md h-3',
        className
      )}
    />
  );
}
