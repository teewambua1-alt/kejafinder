import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  BadgeCheck, 
  RefreshCw, 
  Phone,
  Info,
  AlertTriangle,
  AlertCircle,
  XCircle,
  HelpCircle,
  Flag,
  CalendarCheck
} from 'lucide-react';
import { KejaListing } from '../types/listings';

interface ListingTrustSafetyProps {
  listing: KejaListing;
  onAvailabilityCheck?: () => void;
  onOpenReport?: () => void;
}

export default function ListingTrustSafety({ listing, onAvailabilityCheck, onOpenReport }: ListingTrustSafetyProps) {
  const [hasAskedAvailability, setHasAskedAvailability] = useState(false);

  const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  const badgeConfig: Record<string, { icon: React.ElementType, description: string, color: string }> = {
    "Phone Verified": { icon: Phone, description: "The contact number has been confirmed.", color: "text-emerald-600 dark:text-emerald-400" },
    "Location Checked": { icon: MapPin, description: "The area and landmark details were reviewed.", color: "text-emerald-600 dark:text-emerald-400" },
    "Scout Verified": { icon: UserCheck, description: "An area scout physically checked this listing.", color: "text-emerald-600 dark:text-emerald-400" },
    "Trusted Landlord": { icon: BadgeCheck, description: "This poster has a good listing history.", color: "text-emerald-600 dark:text-emerald-400" },
    "Recently Updated": { icon: RefreshCw, description: "The listing was confirmed recently.", color: "text-orange-500 dark:text-orange-400" },
  };

  const handleAskAvailability = () => {
    setHasAskedAvailability(true);
    if (onAvailabilityCheck) {
      onAvailabilityCheck();
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div variants={rowVariants} className="px-1 flex items-center space-x-2">
        <div>
          <h3 className="text-lg font-black text-neutral-850 dark:text-stone-50 flex items-center gap-2">
            Trust & safety
          </h3>
          <p className="text-xs font-semibold text-neutral-500 dark:text-stone-400 mt-0.5">
            Check listing signals before visiting or paying.
          </p>
        </div>
      </motion.div>

      {/* Trust Badges Card */}
      {listing.trustBadges && listing.trustBadges.length > 0 && (
        <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h4 className="text-[11px] font-black tracking-wider uppercase text-neutral-805 dark:text-stone-200">
              Listing Signals
            </h4>
          </div>

          <div className="space-y-3">
            {listing.trustBadges.map((badge, idx) => {
              const config = badgeConfig[badge];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <div key={idx} className="flex items-start space-x-3 bg-neutral-50 dark:bg-stone-850 p-3 rounded-2xl border border-neutral-100 dark:border-stone-800">
                  <div className={`mt-0.5 ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800 dark:text-stone-200">{badge}</h5>
                    <p className="text-[10px] font-medium text-neutral-500 dark:text-stone-400 mt-0.5">{config.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification explanation note */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/30 rounded-2xl p-3.5 flex items-start space-x-3 mt-4">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[10.5px] font-semibold text-emerald-800 dark:text-emerald-300 leading-snug">
              Verification badges are reviewed by KejaFinder. Always confirm details with the caretaker before visiting.
            </p>
          </div>
        </motion.div>
      )}

      {/* Safety warning card */}
      <motion.div variants={rowVariants} className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-500" />
          <h4 className="text-xs font-black tracking-wider uppercase text-orange-800 dark:text-orange-400">
            Safety Warning
          </h4>
        </div>
        <p className="text-sm font-bold text-orange-900 dark:text-orange-300 leading-snug">
          Never send deposit before physically viewing the house and confirming the caretaker or landlord.
        </p>
        <p className="text-[11px] font-semibold text-orange-800/80 dark:text-orange-400/80 leading-snug">
          KejaFinder does not collect deposits. Use Call or WhatsApp to confirm availability, directions, and the contact person before visiting.
        </p>
      </motion.div>

      {/* Scam warning checklist */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-red-100/60 dark:border-red-900/20 rounded-3xl p-5 shadow-sm space-y-4">
        <h4 className="text-[11px] font-black tracking-wider uppercase text-neutral-805 dark:text-stone-200">
          Watch out for
        </h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs font-bold text-neutral-700 dark:text-stone-300 leading-tight">Requests to pay deposit before viewing</span>
          </div>
          <div className="flex items-start space-x-3">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs font-bold text-neutral-700 dark:text-stone-300 leading-tight">Pressure to send fare or booking fee</span>
          </div>
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <span className="text-xs font-bold text-neutral-700 dark:text-stone-300 leading-tight">Price different from the listing</span>
          </div>
          <div className="flex items-start space-x-3">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs font-bold text-neutral-700 dark:text-stone-300 leading-tight">Refusal to show the house physically</span>
          </div>
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <span className="text-xs font-bold text-neutral-700 dark:text-stone-300 leading-tight">Contact person not matching the listing</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Availability check card */}
        <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="text-[11px] font-black tracking-wider uppercase text-neutral-805 dark:text-stone-200">
              Is this still available?
            </h4>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 leading-snug">
            Help keep KejaFinder fresh by checking if this home is still vacant.
          </p>
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={handleAskAvailability}
            disabled={hasAskedAvailability}
            className={`w-full py-3 rounded-xl border text-[11px] uppercase tracking-wider font-bold transition-all ${
              hasAskedAvailability 
                ? 'bg-neutral-100 dark:bg-stone-800 text-neutral-400 dark:text-stone-500 border-transparent cursor-not-allowed'
                : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
            }`}
            aria-label="Ask if this listing is still available"
          >
            {hasAskedAvailability ? "Asked locally" : "Ask if available"}
          </motion.button>
          <p className="text-[9px] text-center font-medium text-neutral-400 dark:text-stone-500">
            Many unavailable reports may flag a listing later.
          </p>
        </motion.div>

        {/* Report listing card */}
        <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <Flag className="w-5 h-5 text-neutral-500" />
            <h4 className="text-[11px] font-black tracking-wider uppercase text-neutral-805 dark:text-stone-200">
              Report this listing
            </h4>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 leading-snug">
            Flag wrong price, fake listing, already taken house, or unsafe request.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenReport?.()}
            className="w-full mt-2 py-3 rounded-xl border border-neutral-200 dark:border-stone-700 text-[11px] uppercase tracking-wider font-bold text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            aria-label="Report this listing"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report listing
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
