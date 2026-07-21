import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Phone, 
  MoreVertical, 
  Wifi, 
  Car, 
  Droplet, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw,
  Tag,
  Zap,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types/listing';

interface SavedListingCardProps {
  listing: Listing;
  onUnsave?: (id: string) => void;
  isCompareMode?: boolean;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (id: string) => void;
  onSelectListing?: (id: string) => void;
}

export default function SavedListingCard({ 
  listing, 
  onUnsave,
  isCompareMode = false,
  isSelectedForCompare = false,
  onToggleCompare,
  onSelectListing
}: SavedListingCardProps) {
  // Use a local state for optimistic visual toggling, before calling parent's onUnsave if desired
  const [isSaved, setIsSaved] = useState(true);

  // Helper formatting for Kenyan Shilling currency (KSh)
  const formatCurrency = (val: number) => `KSh ${val.toLocaleString()}`;

  // Helper formatting for savedAt string (e.g., "2025-05-12" -> "Saved on 12 May 2025")
  const formatSavedDate = (dateStr?: string) => {
    if (!dateStr) return "Saved recently";
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `Saved on ${day} ${months[monthIndex]} ${year}`;
      }
    }
    return `Saved on ${dateStr}`;
  };

  // Helper formatting for internal listing types
  const formatHouseType = (type: string) => {
    switch (type) {
      case 'single_room': return 'Single Room';
      case 'bedsitter': return 'Bedsitter';
      case 'studio': return 'Studio';
      case 'one_bedroom': return '1 Bedroom';
      case 'two_bedroom': return '2 Bedroom';
      case 'mabati': return 'Mabati House';
      default: return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
    }
  };

  // Map amenity text dynamically to Lucide icons
  const getAmenityIcon = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('wifi') || norm.includes('wi-fi')) {
      return <Wifi className="w-3 h-3 text-emerald-500 mr-1 stroke-[2.2]" />;
    }
    if (norm.includes('park')) {
      return <Car className="w-3 h-3 text-cyan-500 mr-1 stroke-[2.2]" />;
    }
    if (norm.includes('water')) {
      return <Droplet className="w-3 h-3 text-blue-500 mr-1 stroke-[2.2]" />;
    }
    if (norm.includes('power') || norm.includes('token') || norm.includes('elect')) {
      return <Zap className="w-3 h-3 text-amber-500 mr-0.5 stroke-[2.2]" />;
    }
    return <Tag className="w-3 h-3 text-neutral-400 mr-1 stroke-[2]" />;
  };

  // Map trust/activity badges to beautiful icons and styling
  const renderBadge = (badgeName: string) => {
    const norm = badgeName.toLowerCase();
    if (norm.includes('phone')) {
      return (
        <div key={badgeName} className="flex items-center space-x-1 text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md border border-emerald-500/10">
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 stroke-[2.5]" />
          <span>Phone Verified</span>
        </div>
      );
    }
    if (norm.includes('scout')) {
      return (
        <div key={badgeName} className="flex items-center space-x-1 text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md border border-emerald-500/10">
          <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0 stroke-[2.5]" />
          <span>Scout Verified</span>
        </div>
      );
    }
    if (norm.includes('location')) {
      return (
        <div key={badgeName} className="flex items-center space-x-1 text-[9px] font-extrabold text-teal-700 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-950/20 px-1.5 py-0.5 rounded-md border border-teal-500/10">
          <MapPin className="w-3 h-3 text-teal-500 shrink-0 stroke-[2.5]" />
          <span>Location Checked</span>
        </div>
      );
    }
    if (norm.includes('updated')) {
      return (
        <div key={badgeName} className="flex items-center space-x-1 text-[9px] font-extrabold text-orange-700 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-950/20 px-1.5 py-0.5 rounded-md border border-orange-500/10">
          <RefreshCw className="w-3 h-3 text-orange-500 shrink-0 stroke-[2.5]" />
          <span>Recently Updated</span>
        </div>
      );
    }
    return (
      <div key={badgeName} className="text-[9px] font-extrabold text-neutral-500 dark:text-stone-400 bg-neutral-100 dark:bg-stone-850 px-1.5 py-0.5 rounded-md">
        <span>{badgeName}</span>
      </div>
    );
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering comparison select click if compare mode is running
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    // Directly invoke onUnsave once toggled false
    if (!nextSaved && onUnsave) {
      setTimeout(() => {
        onUnsave(listing.id);
      }, 200); // 200ms delay to allow visual transition feel
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isCompareMode && onToggleCompare) {
      onToggleCompare(listing.id);
    } else if (onSelectListing) {
      onSelectListing(listing.id);
    }
  };

  return (
    <motion.div
      layoutId={`card-container-${listing.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      onClick={handleCardClick}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`w-full backdrop-blur-md rounded-2.5xl p-3.5 shadow-3xs transition-all flex flex-col space-y-3.5 border cursor-pointer select-none ${
        isSelectedForCompare 
          ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-500/80 shadow-xs' 
          : 'bg-white/95 dark:bg-stone-900/90 border-neutral-100 dark:border-neutral-800/80 hover:border-emerald-500/10'
      }`}
    >
      
      {/* Horizontal Layout Container */}
      <div className="flex flex-row space-x-3.5 w-full items-start">
        
        {/* Left Side: Thumbnail Image Area */}
        <div className="relative w-28 xs:w-32 sm:w-36 h-28 xs:h-32 sm:h-36 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-stone-950 shrink-0 shadow-3xs">
          <img 
            src={listing.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'} 
            alt={listing.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Image count translucent indicator */}
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-neutral-900/70 backdrop-blur-xs text-[9px] font-extrabold text-white rounded-md tracking-wider">
            1/{listing.imagesCount || 5}
          </div>

          {/* Compare Selector Checkbox overlay */}
          {isCompareMode && (
            <div className="absolute top-2 right-2 z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                isSelectedForCompare
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white/90 border-neutral-300 text-transparent dark:bg-stone-850/90 dark:border-stone-600'
              }`}>
                {isSelectedForCompare && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          )}

          {/* Active Heart Overlay (Only interactive if not in compare mode, or keep it running) */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleHeartClick}
            className="absolute top-2 left-2 w-7.5 h-7.5 rounded-full bg-white/95 dark:bg-stone-850/95 flex items-center justify-center shadow-2xs hover:shadow-xs transition-shadow cursor-pointer select-none border-none outline-none z-10"
            aria-label={isSaved ? "Remove from saved homes" : "Save home"}
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-transform duration-250 ${
                isSaved 
                  ? 'fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400 font-bold scale-110 stroke-[2.5]' 
                  : 'text-neutral-500 dark:text-stone-400 stroke-[2.2]'
              }`}
            />
          </motion.button>
        </div>

        {/* Right Side: Primary Rental vacancy content information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-auto min-h-[112px] xs:min-h-[128px]">
          
          {/* Header Row: Title & Action Dot togglers */}
          <div className="space-y-1">
            <div className="flex items-start justify-between space-x-1">
              <h4 className="text-[13.5px] font-black text-neutral-800 dark:text-stone-100 leading-tight font-sans tracking-tight truncate">
                {listing.title}
              </h4>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="p-1 -mr-1.5 -mt-1 text-neutral-400 dark:text-stone-500 hover:text-neutral-600 dark:hover:text-stone-300 cursor-pointer select-none"
                aria-label="More saved listing actions"
              >
                <MoreVertical className="w-4 h-4 stroke-[2]" />
              </motion.button>
            </div>

            {/* Geographical Location Row */}
            <div className="flex items-center space-x-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2]" />
              <span className="truncate">{listing.location}</span>
            </div>

            {/* Distance from road helper indicator (if present) */}
            {listing.distanceFromRoad && (
              <span className="inline-block text-[9.5px] font-bold text-neutral-400 dark:text-stone-500 mt-0.5 bg-neutral-50 dark:bg-stone-850 px-1 py-0.5 rounded">
                🚶 {listing.distanceFromRoad}
              </span>
            )}
          </div>

          {/* Pricing Row details */}
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 mt-1.5">
            <div className="flex items-baseline space-x-0.5">
              <span className="text-[14.5px] font-black text-emerald-600 dark:text-emerald-400 font-sans">
                {formatCurrency(listing.rent)}
              </span>
              <span className="text-[9.5px] text-neutral-400 dark:text-stone-500 font-extrabold font-mono">/month</span>
            </div>

            <div className="text-[10px] font-bold flex items-center space-x-0.5">
              <span className="text-orange-500 uppercase tracking-wider text-[8.5px] font-black">Deposit:</span>
              <span className="text-neutral-700 dark:text-stone-300">{formatCurrency(listing.deposit)}</span>
            </div>
          </div>

          {/* House Type pill & Amenities mini tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 bg-neutral-100 dark:bg-stone-850 rounded-md text-slate-500 dark:text-stone-400 uppercase tracking-wider">
              {formatHouseType(listing.type)}
            </span>

            {/* Dynamic Amenities Mapping */}
            {listing.amenities && listing.amenities.map((amenity, idx) => (
              <div 
                key={`${amenity}-${idx}`} 
                className="flex items-center bg-neutral-50/80 dark:bg-stone-900/50 p-1 px-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800/40 text-neutral-500 dark:text-stone-400 text-[9px] font-extrabold"
                title={amenity}
              >
                {getAmenityIcon(amenity)}
                <span className="hidden xs:inline">{amenity}</span>
              </div>
            ))}
          </div>

          {/* Trust Validation indicators */}
          {listing.badges && listing.badges.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-2.5 pt-2 border-t border-neutral-100/60 dark:border-stone-800/60">
              {listing.badges.map((badge) => renderBadge(badge))}
            </div>
          )}

        </div>

      </div>

      {/* Interactive Action CTA buttons and date stamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:space-x-3 sm:space-y-0 space-y-2.5 pt-2 border-t border-neutral-100 dark:border-stone-800/50">
        
        {/* Saved Date Indicators */}
        <div className="flex items-center space-x-1 text-[9.5px] font-bold text-neutral-450 dark:text-stone-500 select-none pl-1">
          <Calendar className="w-3.5 h-3.5 text-neutral-400/80 stroke-[2]" />
          <span>{formatSavedDate(listing.savedAt)}</span>
        </div>

        {/* Dual CTA calling & messaging grids */}
        <div className="grid grid-cols-2 gap-2 min-w-[190px] sm:min-w-[210px]" onClick={(e) => e.stopPropagation()}>
          
          {/* Transparent Call Link */}
          <motion.a 
            whileTap={{ scale: 0.97 }}
            href={`tel:${listing.contactPhone || "+254700000000"}`}
            className="flex items-center justify-center space-x-1 h-9 rounded-xl border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 bg-white/70 dark:bg-stone-850 hover:bg-emerald-500/5 text-[11px] font-extrabold transition-colors shadow-3xs"
          >
            <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Call</span>
          </motion.a>

          {/* Primary WhatsApp Chat Link */}
          <motion.a 
            whileTap={{ scale: 0.97 }}
            href={`https://wa.me/${listing.whatsappPhone || "254700000000"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold transition-colors shadow-2xs"
          >
            <svg 
              className="w-3.5 h-3.5 fill-white stroke-[0.3]" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.865-9.847 0-2.63-1.03-5.101-2.903-6.974-1.872-1.873-4.348-2.903-6.977-2.904-5.439 0-9.862 4.412-9.865 9.846-.001 1.662.436 3.284 1.272 4.721L1.251 22.361l4.577-1.2C7.3 22.1 8.8 22.5 10.3 22.5c.1 0 .1 0 0 0z" />
            </svg>
            <span>WhatsApp</span>
          </motion.a>

        </div>

      </div>

    </motion.div>
  );
}
