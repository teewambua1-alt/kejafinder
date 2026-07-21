import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing } from '../types/listing';
import { 
  X, 
  MapPin, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface SavedCompareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedListings: Listing[];
  onClearSelection: () => void;
}

export default function SavedCompareSheet({ 
  isOpen, 
  onClose, 
  selectedListings, 
  onClearSelection 
}: SavedCompareSheetProps) {
  
  if (!isOpen) return null;

  // Formatting utilities matching the system styles
  const formatCurrency = (val: number) => `KSh ${val.toLocaleString()}`;

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

  const getBadgesList = (badges?: string[]) => {
    if (!badges || badges.length === 0) return ['Standard Listing'];
    return badges;
  };

  // Safe escape key binding to close the comparison modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-955/60 dark:bg-black/75 backdrop-blur-sm"
        />

        {/* Slidable sheet wrapper container */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: 'spring', damping: 24, stiffness: 210 }}
          className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-t-[32px] border-t border-neutral-150 dark:border-stone-850 p-5 xs:p-6 pb-8 shadow-xl z-50 flex flex-col max-h-[88vh] outline-none"
        >
          {/* Aesthetic Drag Handle Pill */}
          <div className="mx-auto w-10 h-1 bg-neutral-200 dark:bg-stone-800 rounded-full mb-4 shrink-0" />

          {/* Header section panel */}
          <div className="flex items-start justify-between mb-4.5 shrink-0">
            <div>
              <h2 className="text-base font-black text-neutral-800 dark:text-neutral-50 tracking-tight flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                <span>Compare Saved Homes</span>
              </h2>
              <p className="text-[11.5px] font-semibold text-neutral-500 dark:text-stone-400">
                Check key details side-by-side before committing or visiting.
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="Close comparison"
              className="w-7.5 h-7.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-stone-800 dark:hover:bg-stone-750 flex items-center justify-center text-neutral-550 dark:text-stone-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </motion.button>
          </div>

          {/* Grid Columns Block */}
          <div className="flex-1 overflow-y-auto pr-1 -mr-2 space-y-5 py-1">
            {selectedListings.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs font-bold text-neutral-550 dark:text-stone-400">
                  Select some properties to populate the comparison sheet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3.5 items-stretch">
                
                {selectedListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    layoutId={`compare-sheet-card-${listing.id}`}
                    className="bg-neutral-50/50 dark:bg-stone-900/50 border border-neutral-100 dark:border-stone-850 rounded-2.5xl p-3.5 flex flex-col justify-between space-y-4"
                  >
                    
                    {/* Visual Media with Title and Location */}
                    <div className="space-y-2.5">
                      <div className="relative h-24 rounded-xl overflow-hidden bg-neutral-200 dark:bg-stone-950">
                        <img 
                          src={listing.image} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-emerald-600 border border-emerald-500/20 text-[8.5px] font-mono font-black uppercase text-white rounded-md tracking-wider">
                          {formatHouseType(listing.type)}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-[12.5px] font-black text-neutral-800 dark:text-stone-100 tracking-tight leading-tight line-clamp-1">
                          {listing.title}
                        </h4>
                        <div className="flex items-center space-x-1 text-[10px] font-semibold text-neutral-500 dark:text-stone-400">
                          <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Side parameters list container */}
                    <div className="space-y-3 pt-2.5 border-t border-neutral-100 dark:border-stone-850/80">
                      
                      {/* Price fields */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="block text-[8px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest leading-none">
                            Rent
                          </span>
                          <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(listing.rent)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest leading-none">
                            Deposit
                          </span>
                          <span className="text-[11px] font-bold text-neutral-700 dark:text-stone-200">
                            {formatCurrency(listing.deposit)}
                          </span>
                        </div>
                      </div>

                      {/* Amenities Details */}
                      <div>
                        <span className="block text-[8px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1 leading-none">
                          In-House Amenities
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {listing.amenities && listing.amenities.map((amenity) => (
                            <span 
                              key={amenity} 
                              className="text-[9px] font-bold text-neutral-600 dark:text-stone-300 bg-white dark:bg-stone-850/70 py-0.5 px-1.5 rounded-md border border-neutral-150/40 dark:border-stone-800"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Badges details check */}
                      <div>
                        <span className="block text-[8px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1 leading-none">
                          Trust status
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {getBadgesList(listing.badges).map((badge) => (
                            <span 
                              key={badge} 
                              className="text-[8px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 py-0.5 px-1.5 rounded-md border border-emerald-500/10 flex items-center space-x-0.5"
                            >
                              <ShieldCheck className="w-2.5 h-2.5 shrink-0 text-emerald-500" />
                              <span>{badge}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Distance summary */}
                      {listing.distanceFromRoad && (
                        <div>
                          <span className="block text-[8px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest leading-none">
                            Accessibility
                          </span>
                          <span className="text-[10px] font-semibold text-neutral-600 dark:text-stone-300">
                            🚶 {listing.distanceFromRoad}
                          </span>
                        </div>
                      )}

                      {/* Saved Dates */}
                      <div className="flex items-center space-x-1 pt-1 text-[9px] font-bold text-neutral-400 dark:text-stone-500">
                        <Calendar className="w-3 h-3 stroke-[2]" />
                        <span>Saved: {listing.savedAt || "June 2026"}</span>
                      </div>

                    </div>

                    {/* Small Actions CTA block */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-stone-850/50">
                      <motion.a
                        whileTap={{ scale: 0.96 }}
                        href={`https://wa.me/${listing.whatsappPhone || "254700000000"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-8 flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10.5px] rounded-xl transition-colors shadow-3xs"
                      >
                        <span>Contact caretaker</span>
                      </motion.a>
                    </div>

                  </motion.div>
                ))}

              </div>
            )}
          </div>

          {/* Bottom actions summary area */}
          <div className="pt-4 border-t border-neutral-100 dark:border-stone-800 shrink-0 flex items-center justify-between space-x-3 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClearSelection}
              className="text-[11px] font-extrabold text-red-600 dark:text-red-400 bg-red-500/5 dark:bg-red-950/20 hover:bg-red-500/10 px-4 h-9.5 rounded-xl transition-colors cursor-pointer"
            >
              Reset Selection
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-6 h-9.5 rounded-xl bg-neutral-800 dark:bg-stone-200 text-white dark:text-stone-900 font-extrabold text-[11px] hover:bg-neutral-750 cursor-pointer shadow-3xs transition-all"
            >
              Done, Go Back
            </motion.button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
