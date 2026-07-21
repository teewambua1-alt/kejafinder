import React, { useState } from 'react';
import { Heart, MapPin, Wifi, Droplet, Zap, ShieldCheck, Phone, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types/listing';
import { useSavedListings } from '../hooks/useSavedListings';

interface ListingCardProps {
  listing: Listing;
  onSelectListing?: (id: string) => void;
}

export default function ListingCard({ listing, onSelectListing }: ListingCardProps) {
  const { isSaved: fbIsSaved, toggleSavedListing, source } = useSavedListings();
  const [localSaved, setLocalSaved] = useState(false);

  const saved = source === 'firestore' ? fbIsSaved(listing.id) : localSaved;

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source === 'firestore') {
      await toggleSavedListing(listing);
    } else {
      setLocalSaved(!saved);
    }
  };

  return (
    <div 
      onClick={() => onSelectListing?.(listing.id)}
      className="w-[250px] shrink-0 bg-white dark:bg-stone-850 border border-neutral-100/80 dark:border-neutral-800/65 rounded-2xl shadow-2xs p-3 flex flex-col justify-between hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-colors cursor-pointer"
    >
      <div>
        {/* 1. Card Image Container */}
        <div className="w-full h-32 rounded-xl overflow-hidden relative mb-2.5 bg-neutral-100 dark:bg-stone-900">
          <img 
            src={listing.image} 
            alt={listing.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* 360 Badge Overlay */}
          {listing.panoramaUrl && (
            <div className="absolute top-2.5 left-2.5 z-10 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-md border border-white/20 shadow-sm flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>360° VIEW</span>
            </div>
          )}

          {/* Save Heart Button overlay */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSaveToggle}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-stone-800/95 flex items-center justify-center shadow-xs text-neutral-800 dark:text-neutral-150 outline-none cursor-pointer border-none"
            aria-label="Save Spot"
          >
            <Heart 
              className={`w-4 h-4 transition-transform duration-200 ${
                saved 
                  ? 'fill-emerald-600 text-emerald-600 dark:fill-emerald-500 dark:text-emerald-500 scale-105 stroke-[2.2]' 
                  : 'text-neutral-600 dark:text-stone-300 stroke-[2.2]'
              }`} 
            />
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

        {/* 3. Geographic location & Area details */}
        <div className="flex items-center space-x-1 mt-2 text-[11px] text-neutral-600 dark:text-neutral-300 font-medium font-sans">
          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2]" />
          <span className="truncate">{listing.location}</span>
        </div>

        {/* 4. House Type Pill Badge */}
        <div className="mt-2.5">
          <span className="inline-block text-[10px] font-bold tracking-wide px-2.5 py-0.75 bg-slate-100 dark:bg-stone-900 rounded-md text-neutral-600 dark:text-neutral-300">
            {listing.typeLabel}
          </span>
        </div>

        {/* 5. Compact Amenities Icon Row */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {listing.amenities.some(a => a.toLowerCase().includes('wifi') || a.toLowerCase().includes('wi-fi')) && (
            <div className="w-7 h-7 bg-neutral-50 dark:bg-stone-900 rounded-full border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-center transition-colors" title="Wi-Fi Available">
              <Wifi className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2]" />
            </div>
          )}
          {listing.amenities.some(a => a.toLowerCase().includes('water')) && (
            <div className="w-7 h-7 bg-neutral-50 dark:bg-stone-900 rounded-full border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-center transition-colors" title="Borehole/Water Available">
              <Droplet className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2]" />
            </div>
          )}
          {listing.amenities.some(a => a.toLowerCase().includes('token') || a.toLowerCase().includes('electricity')) && (
            <div className="w-7 h-7 bg-neutral-50 dark:bg-stone-900 rounded-full border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-center transition-colors" title="Prepaid Token Meter">
              <Zap className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2]" />
            </div>
          )}
        </div>

        {/* 6. Mobile Trust Badges Row */}
        <div className="flex flex-col space-y-1.5 mt-3 pt-2.5 border-t border-neutral-100/60 dark:border-neutral-800 text-[9px] font-bold transition-colors">
          {listing.badges.includes('Phone Verified') && (
            <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0 stroke-[2.2]" />
              <span>Phone Verified</span>
            </div>
          )}
          {listing.badges.includes('Location Checked') && (
            <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0 stroke-[2.2]" />
              <span>Location Checked</span>
            </div>
          )}
          {listing.badges.includes('Recently Updated') && (
            <div className="flex items-center space-x-1.5 text-orange-600">
              <RefreshCw className="w-3.5 h-3.5 text-orange-500 shrink-0 stroke-[2.2] animate-spin-slow" />
              <span>Recently Updated</span>
            </div>
          )}
        </div>
      </div>

      {/* 7. Action Contact Row */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="grid grid-cols-2 gap-2 mt-4 pt-1"
      >
        {/* Call Button */}
        <a 
          href={`tel:${listing.contactPhone}`}
          className="flex items-center justify-center space-x-1 h-9 rounded-lg border border-emerald-500 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-transparent hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-[11px] font-bold transition-all shadow-2xs active:scale-95 outline-none"
        >
          <Phone className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Call</span>
        </a>

        {/* WhatsApp Button */}
        <a 
          href={`https://wa.me/${listing.whatsappPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-1 h-9 rounded-lg bg-emerald-600 dark:bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500 text-[11px] font-bold transition-all shadow-2xs active:scale-95 outline-none border-none"
        >
          {/* Custom vector representation of WhatsApp icon */}
          <svg className="w-3.5 h-3.5 fill-white stroke-[0.5]" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847 0-2.63-1.03-5.101-2.903-6.974-1.872-1.873-4.348-2.903-6.977-2.904-5.439 0-9.862 4.412-9.865 9.846-.001 1.662.436 3.284 1.272 4.721L1.251 22.361l4.577-1.2C7.3 22.1 8.8 22.5 10.3 22.5c.1 0 .1 0 0 0z" />
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
