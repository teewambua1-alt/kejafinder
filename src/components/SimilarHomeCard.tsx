import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, CheckCircle2, RefreshCw, MessageCircle, ArrowRight } from 'lucide-react';
import { KejaListing } from '../types/listings';
import { useSavedListings } from '../hooks/useSavedListings';
import { useToast } from '../context/ToastContext';

interface SimilarHomeCardProps {
  listing: KejaListing;
  onView: () => void;
}

export default function SimilarHomeCard({ listing, onView }: SimilarHomeCardProps) {
  const { isSaved: fbIsSaved, toggleSavedListing, source } = useSavedListings();
  const { showToast } = useToast();
  const [localSaved, setLocalSaved] = useState(listing.isSaved || false);

  const isSaved = source === 'supabase' ? fbIsSaved(listing.id) : localSaved;

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source === 'supabase') {
      await toggleSavedListing(listing);
    } else if (source === 'signed_out') {
      // Supabase is configured but no one is logged in — flipping localSaved
      // here would look like a real save that then silently vanishes, since
      // it never reaches the database and never shows up on the Saved page.
      showToast('Log in to save homes.');
      return;
    } else {
      setLocalSaved(!localSaved);
    }
  };

  const whatsappNumber = listing.whatsappPhone || listing.contactPhone || '';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!whatsappNumber) {
      showToast('No WhatsApp number on file for this listing.');
      return;
    }
    const text = `Hi, I saw ${listing.title} on KejaFinder. Is it still available?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      onClick={onView}
      className="w-[260px] flex-shrink-0 bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl overflow-hidden shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Image Container */}
      <div className="relative h-36 bg-neutral-100 dark:bg-stone-800">
        <img
          src={listing.imageUrl || listing.images?.[0] || 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&w=600&q=80'}
          alt={`${listing.title} photo`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        
        {/* Save button */}
        <button
          onClick={handleSaveClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-transform active:scale-95"
          aria-label={`Save ${listing.title}`}
        >
          <motion.div
            animate={isSaved ? { scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} />
          </motion.div>
        </button>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {listing.trustBadges?.includes('Phone Verified') && (
            <div className="flex items-center gap-1 bg-emerald-500/90 backdrop-blur-md text-white px-2 py-1 rounded-full border border-emerald-400/30">
              <CheckCircle2 className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Verified</span>
            </div>
          )}
          {listing.availabilityText && (
            <div className="flex items-center gap-1 bg-orange-500/90 backdrop-blur-md text-white px-2 py-1 rounded-full border border-orange-400/30">
              <span className="text-[9px] font-bold uppercase tracking-wider">{listing.availabilityText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-black text-neutral-850 dark:text-stone-100 line-clamp-1 flex-1 pr-2">
            {listing.title}
          </h4>
        </div>
        
        <div className="flex items-center text-xs font-semibold text-neutral-500 dark:text-stone-400 mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          <span className="truncate">{listing.estate || listing.location}</span>
        </div>

        {/* Financials & Type */}
        <div className="flex items-end justify-between mb-3 border-b border-neutral-100 dark:border-stone-800 pb-3">
          <div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {listing.currency || 'KSh'} {listing.rent?.toLocaleString()}
              <span className="text-[9px] text-neutral-400 dark:text-stone-500 font-semibold uppercase tracking-wider ml-1">/mo</span>
            </div>
            <div className="text-[10px] font-semibold text-neutral-400 dark:text-stone-500 mt-0.5">
              Dep: {listing.deposit?.toLocaleString()}
            </div>
          </div>
          <div className="bg-neutral-100 dark:bg-stone-850 px-2 py-1 rounded-lg text-[10px] font-bold text-neutral-600 dark:text-stone-300 uppercase tracking-wider">
            {listing.houseType}
          </div>
        </div>

        {/* Amenities (Top 2) */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.amenities?.slice(0, 2).map((amenity, idx) => (
            <span key={idx} className="bg-neutral-50 dark:bg-stone-850 border border-neutral-200/60 dark:border-stone-700/50 px-2 py-0.5 rounded-md text-[10px] font-semibold text-neutral-500 dark:text-stone-400">
              {amenity}
            </span>
          ))}
          {(listing.amenities?.length || 0) > 2 && (
            <span className="text-[10px] font-semibold text-neutral-400 dark:text-stone-500 px-1 py-0.5">
              +{(listing.amenities?.length || 0) - 2} more
            </span>
          )}
        </div>

        <div className="mt-auto">
          {/* Updated text */}
          {listing.updatedAtText && (
            <div className="flex items-center text-[10px] font-semibold text-neutral-400 dark:text-stone-500 mb-3">
              <RefreshCw className="w-3 h-3 mr-1" />
              {listing.updatedAtText}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="flex-1 bg-neutral-900 dark:bg-stone-100 text-white dark:text-stone-900 py-2.5 rounded-xl text-[11px] uppercase font-black tracking-wider flex items-center justify-center gap-1 shadow-sm"
              aria-label={`View details for ${listing.title}`}
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleWhatsAppClick}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                whatsappNumber
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                  : 'bg-neutral-100 dark:bg-stone-850 text-neutral-400 dark:text-stone-600 border-neutral-200 dark:border-stone-700'
              }`}
              aria-label={whatsappNumber ? `WhatsApp caretaker for ${listing.title}` : 'No WhatsApp number on file'}
            >
              <MessageCircle className="w-4.5 h-4.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
