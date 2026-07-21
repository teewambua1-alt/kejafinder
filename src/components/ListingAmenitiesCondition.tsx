import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Droplets, 
  Zap, 
  DoorClosed, 
  Bath, 
  Square, 
  ShieldCheck, 
  Route, 
  Bus, 
  Wifi, 
  Car, 
  Info,
  Home
} from 'lucide-react';
import { KejaListing } from '../types/listings';

interface ListingAmenitiesConditionProps {
  listing: KejaListing;
  onAskAmenities?: () => void;
}

export default function ListingAmenitiesCondition({ listing, onAskAmenities }: ListingAmenitiesConditionProps) {
  const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  // Ensure fallback values if amenities array is empty
  const defaultAmenities = [
    { label: listing.waterStatus || 'Water 24/7', icon: Droplets, highlight: true },
    { label: listing.electricityType || 'Token electricity', icon: Zap, highlight: true },
    { label: listing.toiletType || 'Private toilet', icon: DoorClosed },
    { label: listing.bathroomType || 'Private bathroom', icon: Bath },
    { label: listing.floorType || 'Tiled floor', icon: Square },
    { label: listing.securityText || 'Secure gate', icon: ShieldCheck },
    { label: 'Near main road', icon: Route },
    { label: 'Near bus stage', icon: Bus },
    { label: 'Wi-Fi nearby', icon: Wifi },
    { label: 'Parking nearby', icon: Car }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      {/* 1. Section Header */}
      <motion.div variants={rowVariants} className="px-1 flex items-center space-x-2">
        <div>
          <h3 className="text-lg font-black text-neutral-850 dark:text-stone-50 flex items-center gap-2">
            Amenities & condition
          </h3>
          <p className="text-xs font-semibold text-neutral-500 dark:text-stone-400 mt-0.5">
            Check water, electricity, toilet, security, and room condition.
          </p>
        </div>
      </motion.div>

      {/* 2. Amenities Grid */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          {defaultAmenities.map((amenity, idx) => {
            const Icon = amenity.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center space-x-2.5 p-2.5 rounded-2xl border border-neutral-150 dark:border-stone-800 bg-neutral-50/50 dark:bg-stone-850/50"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${amenity.highlight ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-stone-800 text-neutral-600 dark:text-stone-300 shadow-sm border border-neutral-100 dark:border-stone-700'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-neutral-700 dark:text-stone-300 leading-tight">
                  {amenity.label}
                </span>
              </div>
            );
          })}
        </div>

        {onAskAmenities && (
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={onAskAmenities}
            className="w-full mt-4 py-3 rounded-xl border border-neutral-200 dark:border-stone-800 text-[11px] uppercase tracking-wider font-bold text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors"
            aria-label="Ask about listing amenities"
          >
            Ask about amenities
          </motion.button>
        )}
      </motion.div>

      {/* 3. Key Details Card */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-[11px] font-black text-neutral-805 dark:text-stone-200 uppercase tracking-wider mb-2">
          Key Details
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-stone-800 pb-3">
            <div className="flex items-center space-x-3">
              <Droplets className="w-4.5 h-4.5 text-neutral-400" />
              <span className="text-sm font-bold text-neutral-600 dark:text-stone-400">Water</span>
            </div>
            <span className="text-sm font-black text-neutral-850 dark:text-stone-100">{listing.waterStatus || 'Water 24/7'}</span>
          </div>
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-stone-800 pb-3">
            <div className="flex items-center space-x-3">
              <Zap className="w-4.5 h-4.5 text-neutral-400" />
              <span className="text-sm font-bold text-neutral-600 dark:text-stone-400">Electricity</span>
            </div>
            <span className="text-sm font-black text-neutral-850 dark:text-stone-100">{listing.electricityType || 'Token meter'}</span>
          </div>
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-stone-800 pb-3">
            <div className="flex items-center space-x-3">
              <DoorClosed className="w-4.5 h-4.5 text-neutral-400" />
              <span className="text-sm font-bold text-neutral-600 dark:text-stone-400">Toilet</span>
            </div>
            <span className="text-sm font-black text-neutral-850 dark:text-stone-100">{listing.toiletType || 'Private toilet'}</span>
          </div>
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-stone-800 pb-3">
            <div className="flex items-center space-x-3">
              <Bath className="w-4.5 h-4.5 text-neutral-400" />
              <span className="text-sm font-bold text-neutral-600 dark:text-stone-400">Bathroom</span>
            </div>
            <span className="text-sm font-black text-neutral-850 dark:text-stone-100">{listing.bathroomType || 'Private bathroom'}</span>
          </div>
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-stone-800 pb-3">
            <div className="flex items-center space-x-3">
              <Square className="w-4.5 h-4.5 text-neutral-400" />
              <span className="text-sm font-bold text-neutral-600 dark:text-stone-400">Floor</span>
            </div>
            <span className="text-sm font-black text-neutral-850 dark:text-stone-100">{listing.floorType || 'Tiled floor'}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-4.5 h-4.5 text-neutral-400" />
              <span className="text-sm font-bold text-neutral-600 dark:text-stone-400">Security</span>
            </div>
            <span className="text-sm font-black text-neutral-850 dark:text-stone-100">{listing.securityText || 'Secure gate'}</span>
          </div>
        </div>
      </motion.div>

      {/* 4. House Condition Card */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-[11px] font-black text-neutral-805 dark:text-stone-200 uppercase tracking-wider mb-2">
          House Condition
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Room condition</p>
            <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Clean and ready
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Floor level</p>
            <p className="text-xs font-black text-neutral-800 dark:text-stone-200">{listing.floorLevel || 'Ground floor'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Ventilation</p>
            <p className="text-xs font-black text-neutral-800 dark:text-stone-200">{listing.ventilationText || 'Good airflow'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Lighting</p>
            <p className="text-xs font-black text-neutral-800 dark:text-stone-200">{listing.lightingText || 'Natural light'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Noise level</p>
            <p className="text-xs font-black text-neutral-800 dark:text-stone-200">{listing.noiseLevel || 'Moderate'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Compound</p>
            <p className="text-xs font-black text-neutral-800 dark:text-stone-200 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-neutral-400" />
              {listing.compoundText || 'Shared compound'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 5. Practical Description Card */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="text-[11px] font-black text-neutral-805 dark:text-stone-200 uppercase tracking-wider mb-1">
          Description
        </h3>
        <p className="text-sm font-medium text-neutral-600 dark:text-stone-350 leading-relaxed">
          {listing.description || 'Affordable bedsitter available in Syokimau near Gateway Mall. The room has a private toilet, token electricity, water access, tiled floor, and is close to the main road.'}
        </p>
      </motion.div>

      {/* 6. Missing Detail Note */}
      <motion.div variants={rowVariants} className="bg-orange-50/80 dark:bg-orange-950/20 border border-orange-100/80 dark:border-orange-900/30 rounded-2xl p-4 shadow-sm flex items-start space-x-3">
        <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <p className="text-[11.5px] font-semibold text-orange-800 dark:text-orange-300 leading-snug">
          Some details may not be provided. Confirm water, toilet, and electricity with the caretaker before visiting.
        </p>
      </motion.div>
    </motion.div>
  );
}
