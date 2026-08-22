import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/cn';

type Ratio = 'photo' | 'wide' | 'square' | 'tall' | 'fill';

const RATIO_CLASS: Record<Ratio, string> = {
  photo: 'aspect-[4/3]',
  wide: 'aspect-[16/10]',
  square: 'aspect-square',
  tall: 'aspect-[3/4]',
  // 'fill' stretches to the parent instead of imposing a ratio. Needed by the
  // horizontal card, where the photo occupies a fixed-width column whose
  // height is set by the content beside it -- combining a ratio with h-full
  // there made the photo's width track the row height and overflow the column.
  fill: 'h-full w-full',
};

// Intrinsic width/height hints matching each ratio. The browser needs numbers
// on the element to reserve space before CSS loads; the aspect-ratio class then
// governs the rendered size.
const RATIO_DIMS: Record<Ratio, { w: number; h: number }> = {
  photo: { w: 800, h: 600 },
  wide: { w: 800, h: 500 },
  square: { w: 800, h: 800 },
  tall: { w: 600, h: 800 },
  fill: { w: 600, h: 600 },
};

interface PropertyImageProps {
  src?: string | null;
  /** Describe the property, not the photo: "Bedsitter in Kilimani", not "image". */
  alt: string;
  ratio?: Ratio;
  /** Set for the first above-the-fold image; skips lazy loading. */
  priority?: boolean;
  className?: string;
  /** Overlays (badges, save button) render above the image, inside the frame. */
  children?: React.ReactNode;
}

/**
 * Property photo in a ratio-locked frame.
 *
 * Cards previously used fixed pixel heights (h-44, h-36, h-[145px]) with a
 * bare <img> carrying no dimensions, so photos of differing shapes stretched
 * inconsistently and each one shifted layout as it arrived. This reserves the
 * space up front, fades the photo in when decoded, and degrades to a labelled
 * placeholder if the URL is missing or fails -- rather than a broken-image
 * icon or a stretched stand-in photo of a different house.
 */
export default function PropertyImage({
  src,
  alt,
  ratio = 'photo',
  priority = false,
  className,
  children,
}: PropertyImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>(src ? 'loading' : 'failed');
  const dims = RATIO_DIMS[ratio];

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-neutral-100 dark:bg-stone-850',
        RATIO_CLASS[ratio],
        className
      )}
    >
      {src && state !== 'failed' && (
        <img
          src={src}
          alt={alt}
          width={dims.w}
          height={dims.h}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setState('loaded')}
          onError={() => setState('failed')}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Shimmer while decoding. Held to the frame so it can't shift layout. */}
      {state === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-neutral-150 dark:bg-stone-800" aria-hidden="true" />
      )}

      {state === 'failed' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-neutral-550 dark:text-stone-400">
          <ImageOff className="w-6 h-6 stroke-[1.8]" aria-hidden="true" />
          <span className="text-2xs font-bold uppercase tracking-widest">No photo</span>
        </div>
      )}

      {children}
    </div>
  );
}
