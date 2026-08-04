import React, { useState } from 'react';
import { Star, Heart, MapPin, Wifi, Car, Droplet, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useSavedListings } from '../hooks/useSavedListings';
import { Listing } from '../types/listing';

interface FeaturedListingProps {
  onSelectListing?: (id: string) => void;
}

export default function FeaturedListing({ onSelectListing }: FeaturedListingProps) {
  const { isSaved: fbIsSaved, toggleSavedListing, source } = useSavedListings();
  const [localSaved, setLocalSaved] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  // High-quality cozy studio interior representing a spacious bedsitter in Kenya
  const imageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600";
  
  const mockListing: Listing = {
    id: 'featured-1',
    title: 'Spacious Bedsitter Syokimau',
    type: 'bedsitter',
    typeLabel: 'Bedsitter',
    rent: 8000,
    deposit: 8000,
    location: 'Syokimau, Gateway Mall Area',
    town: 'Syokimau',
    estate: 'Gateway',
    image: imageUrl,
    imagesCount: 8,
    amenities: ['Wi-Fi', 'Parking', 'Water 24/7'],
    badges: ['Scout Verified', 'Featured'],
    isFeatured: true,
    isAvailable: true,
    views: 0,
    contactPhone: '254700000000',
    whatsappPhone: '254700000000'
  };

  const isSaved = source === 'firestore' ? fbIsSaved(mockListing.id) : localSaved;

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source === 'firestore') {
      await toggleSavedListing(mockListing);
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      onClick={() => onSelectListing?.('listing-1')}
      className="w-full flex flex-col space-y-3 cursor-pointer"
    >
      {/* 1. Main Featured Media Card */}
      <div className="w-full h-56 rounded-[28px] overflow-hidden relative shadow-md border border-neutral-100 bg-neutral-900 group">
        
        {/* Background Room Image - loaded with proper no-referrer policy */}
        <img 
          src={imageUrl} 
          alt="Spacious Bedsitter in Syokimau" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Dynamic Left-to-Right and Bottom gradient overlay to guarantee text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/40 via-transparent to-transparent pointer-events-none" />

        {/* 2. Overlaid Badge Elements */}
        {/* Top-Left: Featured tag with Star icon */}
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 px-3 py-1.5 rounded-full bg-orange-500 text-white font-sans text-[10px] font-bold tracking-wider uppercase shadow-md shadow-orange-500/20">
          <Star className="w-3 h-3 fill-white text-white stroke-[2.5]" />
          <span>Featured</span>
        </div>

        {/* Top-Right: Glass rounded Save/Heart button */}
        <motion.button 
          id="btn-save-featured"
          whileTap={{ scale: 0.9 }}
          onClick={handleSaveToggle}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-stone-800/95 flex items-center justify-center text-neutral-800 dark:text-neutral-100 shadow-md hover:bg-neutral-50 dark:hover:bg-stone-700/90 active:scale-90 transition-all duration-200 cursor-pointer outline-none border-none"
          aria-label={isSaved ? "Remove from saved" : "Save listing"}
        >
          <Heart 
            className={`w-5 h-5 transition-transform duration-200 ${
              isSaved 
                ? 'fill-emerald-600 text-emerald-600 dark:fill-emerald-500 dark:text-emerald-500 scale-105 stroke-[2]' 
                : 'text-neutral-700 dark:text-neutral-300 stroke-[2.2]'
            }`} 
          />
        </motion.button>

        {showLoginHint && (
          <div className="absolute top-14 right-4 z-20 px-2.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-stone-950 text-white text-[10px] font-bold whitespace-nowrap shadow-lg">
            Log in to save homes
          </div>
        )}

        {/* 3. Dynamic Text details overlaid at the bottom parameters */}
        <div className="absolute bottom-4 left-5 right-5 z-10 flex flex-col justify-end text-white">
          <h3 className="font-display text-lg font-bold tracking-tight text-white drop-shadow-sm line-clamp-1">
            Spacious Bedsitter Syokimau
          </h3>
          
          <p className="text-[11px] font-medium text-neutral-200/90 tracking-wide mt-0.5 max-w-[85%] drop-shadow-xs line-clamp-1">
            Syokimau, Gateway Mall Area
          </p>
        </div>

        {/* Bottom-Right: Image Counter Pill */}
        <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-black/60 text-white font-mono text-[9px] font-bold tracking-wider backdrop-blur-xs select-none">
          1/8
        </div>
      </div>

      {/* 4. Text and Details Below Image */}
      <div className="px-1 flex flex-col space-y-3">
        {/* Price and Deposit Row */}
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
          {/* Rent text */}
          <div className="flex items-baseline space-x-1">
            <span className="font-sans text-xl font-extrabold text-emerald-600 dark:text-emerald-500 tracking-tight">KSh 8,000</span>
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">/month</span>
          </div>

          {/* Deposit highlighted with warm orange badge text label */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-orange-500 font-bold tracking-wide text-[11px] uppercase">Deposit:</span>
            <span className="text-neutral-800 dark:text-neutral-100 font-extrabold tracking-tight">KSh 8,000</span>
          </div>
        </div>

        {/* Detailed geographical location area with icon */}
        <div className="flex items-center space-x-1.5 text-xs text-neutral-600 dark:text-neutral-300 font-medium">
          <MapPin className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.2]" />
          <span className="truncate">Syokimau, Gateway Mall Area</span>
        </div>

        {/* Amenities Icons Row */}
        <div className="flex flex-wrap gap-2 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
          <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-stone-800/80 border border-neutral-200/45 dark:border-neutral-700/60 transition-colors">
            <Wifi className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2.2]" />
            <span>Wi-Fi</span>
          </div>
          <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-stone-800/80 border border-neutral-200/45 dark:border-neutral-700/60 transition-colors">
            <Car className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2.2]" />
            <span>Parking</span>
          </div>
          <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-stone-800/80 border border-neutral-200/45 dark:border-neutral-700/60 transition-colors">
            <Droplet className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2.2]" />
            <span>Water 24/7</span>
          </div>
        </div>

        {/* Trust badge: Scout Verified in emerald green */}
        <div className="pt-0.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.25 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/40 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500 stroke-[2.2]" />
            <span>Scout Verified</span>
          </div>
        </div>
      </div>

      {/* 5. Carousel indicators below featured card */}
      <div className="flex items-center justify-center space-x-1.5 py-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 transition-colors" />
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-stone-700 transition-colors" />
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-stone-700 transition-colors" />
      </div>
    </motion.div>
  );
}
