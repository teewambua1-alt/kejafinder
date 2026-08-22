import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, Phone, ShieldCheck, Star, RefreshCw, Footprints } from 'lucide-react';
import type { Listing } from '../../types/listing';
import { resolveAmenities } from '../../lib/amenities';
import { useSavedListings } from '../../hooks/useSavedListings';
import { useToast } from '../../context/ToastContext';
import { useMotion } from '../../lib/motion';
import { cn } from '../../lib/cn';
import PropertyImage from '../ui/PropertyImage';

/**
 * Shared building blocks for property cards. The layout variants
 * (PropertyCardVertical / PropertyCardHorizontal) compose these; nothing here
 * knows which variant it sits in, so there are no layout booleans threaded
 * through.
 *
 * Consolidated from ListingCard, SearchResultCard, SavedListingCard and
 * SimilarHomeCard, which were four separate implementations of the same card
 * -- including three different amenity icon mappers and two private copies of
 * the house-type label function.
 */

/* ---------------------------------------------------------------- frame ---- */

export function CardFrame({
  onClick,
  className,
  children,
  interactive = true,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
}) {
  const m = useMotion();
  return (
    <motion.div
      onClick={onClick}
      whileHover={interactive && !m.reduce ? { y: -4 } : undefined}
      whileTap={interactive ? m.tap : undefined}
      transition={m.spring.snap}
      className={cn(
        'group bg-white dark:bg-stone-900 border border-neutral-100 dark:border-stone-800/70',
        'rounded-2xl shadow-2xs overflow-hidden',
        'transition-[border-color,box-shadow] duration-200',
        interactive &&
          'cursor-pointer hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-900/50',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------- verification ---- */

const VERIFICATION_LABEL: Record<string, string> = {
  phone: 'Phone verified',
  location: 'Location checked',
  scout: 'Scout verified',
  trusted: 'Trusted landlord',
};

/** Renders only for a real verification_level above 'none'. */
export function VerificationBadge({ listing }: { listing: Listing }) {
  const level = listing.verificationLevel;
  if (!level || level === 'none') return null;
  const label = VERIFICATION_LABEL[level];
  if (!label) return null;
  return (
    <span className="flex items-center gap-1 bg-emerald-700 text-white text-2xs font-bold px-2 py-1 rounded-md shadow-sm">
      <ShieldCheck className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------- photo ---- */

export function CardPhoto({
  listing,
  ratio = 'photo',
  priority,
  className,
  children,
}: {
  listing: Listing;
  ratio?: 'photo' | 'wide' | 'square' | 'tall' | 'fill';
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const count = listing.imagesCount ?? 0;
  return (
    <PropertyImage
      src={listing.image}
      alt={`${listing.typeLabel || 'Home'} in ${listing.location}`}
      ratio={ratio}
      priority={priority}
      className={className}
    >
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5">
        {listing.isFeatured && (
          <span className="flex items-center gap-1 bg-orange-700 text-white text-2xs font-bold px-2 py-1 rounded-md shadow-sm">
            <Star className="w-3 h-3 fill-white stroke-[2.5]" aria-hidden="true" />
            Featured
          </span>
        )}
        <VerificationBadge listing={listing} />
      </div>

      {/* Real photo count only -- never a fabricated "1/8". */}
      {count > 1 && (
        <span className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] text-white font-mono font-bold tracking-wider">
          1/{count}
        </span>
      )}

      {children}
    </PropertyImage>
  );
}

/* ---------------------------------------------------------------- price ---- */

export function CardPrice({ listing, size = 'base' }: { listing: Listing; size?: 'base' | 'lg' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'font-bold text-emerald-700 dark:text-emerald-400 tracking-tight tabular-nums',
            size === 'lg' ? 'text-lg' : 'text-[15px]'
          )}
        >
          KSh {listing.rent.toLocaleString()}
        </span>
        <span className="text-2xs text-neutral-550 dark:text-stone-400 font-semibold">/month</span>
      </div>
      <div className="flex items-center gap-1 text-2xs font-medium">
        <span className="text-orange-700 dark:text-orange-400 font-bold uppercase tracking-wider">Deposit</span>
        <span className="text-neutral-700 dark:text-stone-200 font-bold tabular-nums">
          KSh {listing.deposit.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- stats ---- */

/**
 * Honest stat row. The reference designs show "2 beds / 2 baths / 1,000 sqft",
 * but this schema has no bedroom, bathroom or area columns -- size is encoded
 * in house_type. So this shows what actually exists, and is arguably more
 * decision-relevant in this market: the type, the bathroom arrangement, and
 * how far the walk from the road is.
 */
export function CardStats({ listing }: { listing: Listing }) {
  const parts = [listing.typeLabel, listing.bathroomType, listing.distanceFromRoad].filter(
    (p): p is string => !!p
  );
  if (parts.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap text-2xs font-semibold text-neutral-600 dark:text-stone-300">
      {parts.map((part, i) => (
        <React.Fragment key={`${part}-${i}`}>
          {i > 0 && (
            <span className="text-neutral-550 dark:text-stone-400" aria-hidden="true">
              &middot;
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            {part === listing.distanceFromRoad && (
              <Footprints className="w-3 h-3 stroke-[2.2] shrink-0" aria-hidden="true" />
            )}
            {part}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- location ---- */

export function CardLocation({ listing }: { listing: Listing }) {
  return (
    <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-stone-300 font-medium min-w-0">
      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 stroke-[2]" aria-hidden="true" />
      <span className="truncate">{listing.location}</span>
    </div>
  );
}

/* ------------------------------------------------------------ amenities ---- */

export function CardAmenities({ listing, max = 3 }: { listing: Listing; max?: number }) {
  const all = resolveAmenities(listing.amenities);
  if (all.length === 0) return null;
  const shown = all.slice(0, max);
  const rest = all.length - shown.length;

  return (
    <ul className="flex items-center gap-1.5 flex-wrap list-none p-0 m-0">
      {shown.map(({ id, label, icon: Icon }) => (
        <li
          key={id}
          className="flex items-center gap-1 pl-1.5 pr-2 py-1 bg-neutral-50 dark:bg-stone-850 rounded-full border border-neutral-100 dark:border-stone-800"
        >
          <Icon
            className="w-3 h-3 text-emerald-700 dark:text-emerald-400 stroke-[2.2] shrink-0"
            aria-hidden="true"
          />
          <span className="text-2xs font-bold text-neutral-600 dark:text-stone-300">{label}</span>
        </li>
      ))}
      {rest > 0 && (
        <li className="text-2xs font-bold text-neutral-550 dark:text-stone-400 px-1">+{rest} more</li>
      )}
    </ul>
  );
}

/* --------------------------------------------------------------- recent ---- */

export function RecentlyUpdatedTag({ listing }: { listing: Listing }) {
  if (!listing.badges?.includes('Recently Updated')) return null;
  return (
    <div className="flex items-center gap-1.5 text-2xs font-bold text-orange-700 dark:text-orange-400">
      <RefreshCw className="w-3.5 h-3.5 stroke-[2.2] shrink-0" aria-hidden="true" />
      Recently updated
    </div>
  );
}

/* ----------------------------------------------------------- save heart ---- */

/**
 * Save toggle. Keeps the three-way behaviour the cards already had: a real
 * Supabase write when signed in, an honest "log in" prompt when signed out
 * (rather than a local flip that silently vanishes and never reaches the
 * Saved page), and a local-only toggle when Supabase isn't the source.
 */
export function SaveHeart({
  listing,
  onUnsave,
  className,
}: {
  listing: Listing;
  /** Saved page passes this so removing a card can animate out. */
  onUnsave?: (id: string) => void;
  className?: string;
}) {
  const { isSaved: remoteIsSaved, toggleSavedListing, source } = useSavedListings();
  const { showToast } = useToast();
  const [localSaved, setLocalSaved] = useState(false);
  const m = useMotion();

  const saved = source === 'supabase' ? remoteIsSaved(listing.id) : localSaved;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source === 'supabase') {
      if (saved && onUnsave) {
        onUnsave(listing.id);
        return;
      }
      await toggleSavedListing(listing);
    } else if (source === 'signed_out') {
      showToast('Log in to save homes.');
    } else {
      setLocalSaved(!saved);
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={m.reduce ? undefined : { scale: 1.08 }}
      whileTap={m.reduce ? undefined : { scale: 0.9 }}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${listing.title} from saved homes` : `Save ${listing.title}`}
      className={cn(
        'w-10 h-10 rounded-full bg-white/95 dark:bg-stone-800/95 flex items-center justify-center',
        'shadow-xs outline-none cursor-pointer border-none',
        className
      )}
    >
      <Heart
        className={cn(
          'w-4 h-4 stroke-[2.2]',
          saved
            ? 'fill-emerald-600 text-emerald-700 dark:fill-emerald-500 dark:text-emerald-500'
            : 'text-neutral-600 dark:text-stone-300'
        )}
      />
    </motion.button>
  );
}

/* ------------------------------------------------------ contact actions ---- */

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847 0-2.63-1.03-5.101-2.903-6.974-1.872-1.873-4.348-2.903-6.977-2.904-5.439 0-9.862 4.412-9.865 9.846-.001 1.662.436 3.284 1.272 4.721L1.251 22.361l4.577-1.2C7.3 22.1 8.8 22.5 10.3 22.5c.1 0 .1 0 0 0z" />
    </svg>
  );
}

export function ContactActions({
  listing,
  layout = 'row',
  onCall,
  onWhatsApp,
}: {
  listing: Listing;
  layout?: 'row' | 'column';
  onCall?: () => void;
  onWhatsApp?: () => void;
}) {
  const hasPhone = listing.contactPhone.length > 0;
  const hasWhatsapp = listing.whatsappPhone.length > 0;
  const m = useMotion();

  const base =
    'flex items-center justify-center gap-1 h-10 rounded-lg text-[11px] font-bold outline-none transition-colors';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn('gap-2', layout === 'row' ? 'grid grid-cols-2' : 'flex flex-col')}
    >
      {hasPhone ? (
        <motion.a
          whileTap={m.tap}
          href={`tel:${listing.contactPhone.replace(/\s+/g, '')}`}
          onClick={onCall}
          className={cn(
            base,
            'border border-emerald-700 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-transparent hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20'
          )}
        >
          <Phone className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
          Call
        </motion.a>
      ) : (
        <button
          disabled
          className={cn(
            base,
            'border border-neutral-200 dark:border-stone-700 text-neutral-550 dark:text-stone-400 cursor-not-allowed'
          )}
        >
          <Phone className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
          No phone
        </button>
      )}

      {hasWhatsapp ? (
        <motion.a
          whileTap={m.tap}
          href={`https://wa.me/${listing.whatsappPhone}?text=${encodeURIComponent(
            `Hi, I saw ${listing.title} on KejaFinder. Is it still available?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsApp}
          className={cn(
            base,
            'bg-emerald-700 text-white hover:bg-emerald-800 dark:hover:bg-emerald-800 border-none'
          )}
        >
          <WhatsAppGlyph className="w-3.5 h-3.5 fill-white" />
          WhatsApp
        </motion.a>
      ) : (
        <button
          disabled
          className={cn(
            base,
            'bg-neutral-100 dark:bg-stone-850 text-neutral-550 dark:text-stone-400 cursor-not-allowed border-none'
          )}
        >
          No WhatsApp
        </button>
      )}
    </div>
  );
}
