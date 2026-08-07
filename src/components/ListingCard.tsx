import React, { useState } from 'react';
import { Heart, MapPin, Wifi, Droplet, Zap, Car, ShieldCheck, Star, Phone, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types/listing';
import { useSavedListings } from '../hooks/useSavedListings';
import { useToast } from '../context/ToastContext';

interface ListingCardProps {
  listing: Listing;
  onSelectListing?: (id: string) => void;
}

const AMENITY_ICONS: { match: (a: string) => boolean; label: string; icon: typeof Wifi }[] = [
  { match: (a) => a.includes('wifi') || a.includes('wi-fi'), label: 'Wi-Fi', icon: Wifi },
  { match: (a) => a.includes('water'), label: 'Water', icon: Droplet },
  { match: (a) => a.includes('token') || a.includes('electricity'), label: 'Electricity', icon: Zap },
  { match: (a) => a.includes('parking'), label: 'Parking', icon: Car },
];

export default function ListingCard({ listing, onSelectListing }: ListingCardProps) {
  const { isSaved: fbIsSaved, toggleSavedListing, source } = useSavedListings();
  const { showToast } = useToast();
  const [localSaved, setLocalSaved] = useState(false);

  const saved = source === 'supabase' ? fbIsSaved(listing.id) : localSaved;
  const isVerified = listing.badges.some((b) => b.toLowerCase().includes('verified') || b.toLowerCase().includes('checked'));
  const isRecentlyUpdated = listing.badges.includes('Recently Updated');
  const matchedAmenities = AMENITY_ICONS.filter((a) => listing.amenities.some((la) => a.match(la.toLowerCase())));

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source === 'supabase') {
      await toggleSavedListing(listing);
    } else if (source === 'signed_out') {
      // Supabase is configured but no one is logged in — flipping localSaved
      // here would look like a real save that then silently vanishes, since
      // it never reaches the database and never shows up on the Saved page.
      showToast('Log in to save homes.');
    } else {
      setLocalSaved(!saved);
    }
  };

  return (
    <motion.div
      onClick={() => onSelectListing?.(listing.id)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group w-[268px] shrink-0 bg-white dark:bg-stone-850 border border-neutral-100/80 dark:border-neutral-800/65 rounded-2xl shadow-2xs hover:shadow-lg p-3 flex flex-col justify-between hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-[border-color,box-shadow] cursor-pointer"
    >
      <div>
        {/* 1. Card Image Container -- large photo, subtle zoom on hover */}
        <div className="w-full h-44 rounded-xl overflow-hidden relative mb-2.5 bg-neutral-100 dark:bg-stone-900">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />

          {/* Top-left stacked overlay badges: Featured, then Verified */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start space-y-1.5">
            {listing.isFeatured && (
              <div className="bg-orange-500 text-white text-2xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center space-x-1">
                <Star className="w-3 h-3 fill-white stroke-[2.5]" />
                <span>Featured</span>
              </div>
            )}
            {isVerified && (
              <div className="bg-emerald-600 text-white text-2xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                <span>Verified</span>
              </div>
            )}
            {listing.panoramaUrl && (
              <div className="bg-black/60 backdrop-blur-md text-white text-2xs font-bold px-2 py-1 rounded-md border border-white/20 shadow-sm flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>360° VIEW</span>
              </div>
            )}
          </div>

          {/* Save Heart Button overlay */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSaveToggle}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-stone-800/95 flex items-center justify-center shadow-xs text-neutral-800 dark:text-neutral-150 outline-none cursor-pointer border-none"
            aria-label="Save Spot"
          >
            <motion.div
              animate={saved ? { scale: [1, 1.25, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-4 h-4 ${
                  saved
                    ? 'fill-emerald-600 text-emerald-600 dark:fill-emerald-500 dark:text-emerald-500 stroke-[2.2]'
                    : 'text-neutral-600 dark:text-stone-300 stroke-[2.2]'
                }`}
              />
            </motion.div>
          </motion.button>

        </div>

        {/* 2. Listing Price Row */}
        <div className="flex flex-col space-y-0.5">
          <div className="flex items-baseline space-x-1">
            <span className="font-sans text-[15px] font-bold text-emerald-600 dark:text-emerald-500 tracking-tight">
              KSh {listing.rent.toLocaleString()}
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold">/month</span>
          </div>

          {/* Deposit with Warm Orange Label */}
          <div className="text-[10px] flex items-center space-x-1 font-medium">
            <span className="text-orange-500 font-bold uppercase tracking-wider text-[9px]">Deposit:</span>
            <span className="text-neutral-700 dark:text-neutral-200 font-bold">KSh {listing.deposit.toLocaleString()}</span>
          </div>
        </div>

        {/* 3. House Type Pill Badge */}
        <div className="mt-2.5">
          <span className="inline-block text-[10px] font-bold tracking-wide px-2.5 py-0.75 bg-slate-100 dark:bg-stone-900 rounded-md text-neutral-600 dark:text-neutral-300">
            {listing.typeLabel}
          </span>
        </div>

        {/* 4. Geographic location & Area details */}
        <div className="flex items-center space-x-1 mt-2 text-[11px] text-neutral-600 dark:text-neutral-300 font-medium font-sans">
          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2]" />
          <span className="truncate">{listing.location}</span>
        </div>

        {/* 5. Amenities row with visible labels */}
        {matchedAmenities.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {matchedAmenities.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center space-x-1 pl-1.5 pr-2 py-1 bg-neutral-50 dark:bg-stone-900 rounded-full border border-neutral-100 dark:border-neutral-800/80"
              >
                <Icon className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0" />
                <span className="text-2xs font-bold text-neutral-600 dark:text-neutral-300">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* 6. Recently Updated tag */}
        {isRecentlyUpdated && (
          <div className="flex items-center space-x-1.5 mt-2.5 text-2xs font-bold text-orange-600 dark:text-orange-400">
            <RefreshCw className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
            <span>Recently updated</span>
          </div>
        )}
      </div>

      {/* 7. Action Contact Row */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="grid grid-cols-2 gap-2 mt-4 pt-1"
      >
        {/* Call Button */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          href={`tel:${listing.contactPhone}`}
          className="flex items-center justify-center space-x-1 h-9 rounded-lg border border-emerald-500 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-transparent hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-[11px] font-bold transition-colors shadow-2xs outline-none"
        >
          <Phone className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Call</span>
        </motion.a>

        {/* WhatsApp Button */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          href={`https://wa.me/${listing.whatsappPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-1 h-9 rounded-lg bg-emerald-600 dark:bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500 text-[11px] font-bold transition-colors shadow-2xs outline-none border-none"
        >
          {/* Custom vector representation of WhatsApp icon */}
          <svg className="w-3.5 h-3.5 fill-white stroke-[0.5]" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847 0-2.63-1.03-5.101-2.903-6.974-1.872-1.873-4.348-2.903-6.977-2.904-5.439 0-9.862 4.412-9.865 9.846-.001 1.662.436 3.284 1.272 4.721L1.251 22.361l4.577-1.2C7.3 22.1 8.8 22.5 10.3 22.5c.1 0 .1 0 0 0z" />
          </svg>
          <span>WhatsApp</span>
        </motion.a>
      </div>
    </motion.div>
  );
}
