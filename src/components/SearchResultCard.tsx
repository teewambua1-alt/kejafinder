import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Heart, 
  Phone, 
  MessageCircle, 
  Wifi, 
  Car, 
  Droplet, 
  Check,
  Zap,
  Power
} from 'lucide-react';
import { Listing, getListingTypeLabel } from '../types/listing';
import { useSavedListings } from '../hooks/useSavedListings';

export interface SearchResultCardProps {
  listing: Listing;
  key?: string | number;
  onSelectListing?: (id: string) => void;
  viewMode?: 'list' | 'grid';
}

export default function SearchResultCard({ listing, onSelectListing, viewMode = 'list' }: SearchResultCardProps) {
  const { isSaved: fbIsSaved, toggleSavedListing, source } = useSavedListings();
  const [localSaved, setLocalSaved] = useState(listing.isSaved || false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  const isSaved = source === 'firestore' ? fbIsSaved(listing.id) : localSaved;

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source === 'firestore') {
      await toggleSavedListing(listing);
    } else if (source === 'signed_out') {
      // Firebase is configured but no one is logged in — flipping localSaved
      // here would look like a real save that then silently vanishes, since
      // it never reaches Firestore and never shows up on the Saved page.
      setShowLoginHint(true);
      setTimeout(() => setShowLoginHint(false), 2000);
    } else {
      setLocalSaved(!isSaved);
    }
  };

  const {
    title,
    location,
    rent,
    deposit,
    type,
    image,
    imagesCount = 8,
    amenities = [],
    badges = [],
    isFeatured = false,
    contactPhone,
    whatsappPhone,
  } = listing;

  // Amenity icon mapper helpers
  const renderAmenityIcon = (name: string) => {
    const iconClass = "w-3 h-3 text-neutral-500 mr-1";
    const lower = name.toLowerCase();
    if (lower.includes('wi-fi') || lower.includes('wifi')) {
      return <Wifi className={iconClass} />;
    }
    if (lower.includes('parking')) {
      return <Car className={iconClass} />;
    }
    if (lower.includes('water')) {
      return <Droplet className={iconClass} />;
    }
    if (lower.includes('electricity') || lower.includes('token')) {
      return <Zap className={iconClass} />;
    }
    return null;
  };

  // Human readable trust badges matching design requirements
  const isScoutVerified = badges.includes('Scout Verified');
  const isPhoneVerified = badges.includes('Phone Verified');
  const isLocationChecked = badges.includes('Location Checked');
  const isRecentlyUpdated = badges.includes('Recently Updated');

  // Format numbers nicely
  const formattedRent = `KSh ${rent.toLocaleString()}`;
  const formattedDeposit = `KSh ${deposit.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      onClick={() => onSelectListing?.(listing.id)}
      className={`w-full bg-white dark:bg-stone-900 rounded-3xl border border-neutral-100/90 dark:border-neutral-800/80 shadow-xs p-3.5 flex ${viewMode === 'grid' ? 'flex-col gap-3' : 'flex-row gap-3.5'} relative overflow-hidden cursor-pointer`}
    >
      {/* 1. Left Column: Image wrapper */}
      <div className={`relative ${viewMode === 'grid' ? 'w-full aspect-square' : 'w-[130px] xs:w-[145px] h-[145px] xs:h-[160px] shrink-0'} rounded-2xl overflow-hidden select-none shadow-3xs`}>
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* FEATURED badge */}
        {isFeatured && (
          <div className="absolute top-2.5 left-2.5 bg-[#f97316] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 z-10">
            <Zap className="w-2.5 h-2.5 fill-white stroke-none" />
            <span>Featured</span>
          </div>
        )}

        {/* Circular Save Heart Button */}
        <button
          type="button"
          onClick={handleSaveToggle}
          aria-label={isSaved ? "Remove from saved list" : "Save this listing"}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white dark:bg-stone-850 shadow-sm flex items-center justify-center outline-none border-none cursor-pointer transition-colors active:scale-95 group z-10"
        >
          <motion.div
            animate={isSaved ? { scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                isSaved
                  ? 'fill-rose-500 stroke-rose-500'
                  : 'text-neutral-500 group-hover:text-rose-550'
              }`}
            />
          </motion.div>
        </button>

        {showLoginHint && (
          <div className="absolute top-12 right-2.5 z-20 px-2.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-stone-950 text-white text-[10px] font-bold whitespace-nowrap shadow-lg">
            Log in to save homes
          </div>
        )}

        {/* Image index counter indicator */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-3xs text-[9px] text-white font-mono font-bold tracking-wider z-10">
          1/{imagesCount}
        </div>
      </div>

      {/* 2. Main Content Details Area & Action Column wrapper */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        
        {/* Top Info Header block */}
        <div className="space-y-1">
          {/* Listing Title */}
          <h3 className="text-sm xs:text-[15px] font-extrabold text-[#111] dark:text-neutral-50 tracking-tight leading-tight truncate">
            {title}
          </h3>

          {/* Location row */}
          <div className="flex items-center text-[11px] font-semibold text-neutral-500 dark:text-stone-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0 mr-1" />
            <span className="truncate">{location}</span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-sm xs:text-[15px] font-bold text-emerald-600 dark:text-emerald-400">
              {formattedRent}
            </span>
            <span className="text-[10.5px] text-neutral-500 dark:text-stone-400 font-semibold lowercase">
              /month
            </span>
          </div>

          {/* Deposit Info label styled with warm orange label text as requested */}
          <div className="text-[10px] font-semibold flex items-center">
            <span className="text-orange-600 dark:text-orange-400 mr-1">Deposit:</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-bold truncate">{formattedDeposit}</span>
          </div>
        </div>

        {/* Middle Meta / Badges Row */}
        <div className={`flex items-center gap-1.5 flex-wrap my-1.5 select-none ${viewMode === 'grid' ? 'hidden xs:flex' : ''}`}>
          {/* House Type pill */}
          <span className="px-2 py-0.5 rounded-md border border-neutral-150 dark:border-neutral-800 bg-neutral-50/50 dark:bg-stone-850/50 text-[10px] font-bold text-neutral-600 dark:text-neutral-350">
            {getListingTypeLabel(type)}
          </span>

          {/* Amenities sub-chips */}
          {amenities.slice(0, viewMode === 'grid' ? 1 : undefined).map((amenity, idx) => (
            <div 
              key={idx} 
              className="px-2 py-0.5 rounded-md bg-neutral-50 dark:bg-stone-850/30 text-[9.5px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center"
            >
              {renderAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {viewMode === 'grid' && amenities.length > 1 && (
             <div className="px-1.5 py-0.5 rounded-md bg-neutral-50 dark:bg-stone-850/30 text-[9px] font-medium text-neutral-500">
               +{amenities.length - 1}
             </div>
          )}
        </div>

        {/* Footer Area: Trust Badge on Bottom Left and Stacked Call/WA Action Buttons on Bottom Right */}
        <div className={`flex ${viewMode === 'grid' ? 'flex-col gap-2' : 'items-end justify-between gap-1'} mt-auto pt-1`}>
          
          {/* Trust Badge Indicators */}
          <div className={`space-y-0.5 shrink-0 ${viewMode === 'grid' ? 'hidden' : 'pb-1'}`}>
            {isScoutVerified && (
              <div className="flex items-center text-[9.5px] font-bold text-emerald-600 dark:text-emerald-450 bg-emerald-50/40 dark:bg-emerald-950/25 px-1.5 py-0.5 rounded-md border border-emerald-100/30">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-450 stroke-[3] mr-1" />
                <span>Scout Verified</span>
              </div>
            )}
            
            {isPhoneVerified && !isScoutVerified && (
              <div className="flex items-center text-[9.5px] font-bold text-emerald-650 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md">
                <Check className="w-3 h-3 text-emerald-600 stroke-[3] mr-1" />
                <span>Phone Verified</span>
              </div>
            )}

            {isLocationChecked && !isScoutVerified && (
              <div className="flex items-center text-[9.5px] font-bold text-neutral-500 dark:text-stone-400 bg-neutral-50/30 dark:bg-stone-900/40 px-1.5 py-0.5 rounded-md">
                <Check className="w-3 h-3 text-emerald-600 stroke-[3] mr-1" />
                <span>Location Checked</span>
              </div>
            )}

            {isRecentlyUpdated && (
              <div className="flex items-center text-[9px] font-bold text-orange-603 dark:text-orange-450 bg-orange-50/40 dark:bg-orange-950/20 px-1.5 py-0.5 rounded-md">
                <span className="block w-1.5 h-1.5 rounded-full bg-orange-500 mr-1 animate-pulse" />
                <span>Recently Updated</span>
              </div>
            )}
          </div>

          {/* Interactive Calling Stack Buttons */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`flex ${viewMode === 'grid' ? 'flex-row w-full' : 'flex-col w-[90px] xs:w-[100px] shrink-0'} gap-1.5`}
          >
            {/* Call button */}
            <motion.a
              href={`tel:${contactPhone}`}
              whileTap={{ scale: 0.96 }}
              className={`h-[34px] rounded-lg border border-emerald-600 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 text-emerald-650 dark:text-emerald-400 text-[11px] font-extrabold flex items-center justify-center space-x-1 shadow-3xs cursor-pointer select-none no-underline decoration-none outline-none ${viewMode === 'grid' ? 'flex-1' : ''}`}
            >
              <Phone className="w-3.5 h-3.5 stroke-[2.2] text-emerald-600 dark:text-emerald-400" />
              {(viewMode === 'list' || true) && <span>Call</span>}
            </motion.a>

            {/* WhatsApp button */}
            <motion.a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.96 }}
              className={`h-[34px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold flex items-center justify-center space-x-1 shadow-xs cursor-pointer select-none no-underline decoration-none outline-none ${viewMode === 'grid' ? 'flex-1' : ''}`}
            >
              <MessageCircle className="w-3.5 h-3.5 stroke-[2.2] text-white" />
              {(viewMode === 'list' || true) && <span>Chat</span>}
            </motion.a>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
