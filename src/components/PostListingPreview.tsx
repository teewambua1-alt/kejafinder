import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Image as ImageIcon, 
  ImagePlus,
  Compass,
  Calendar,
  Grid,
  Check,
  Dot
} from 'lucide-react';
import { motion } from 'motion/react';
import { PostListingDraft, PostHouseType } from '../types/postListing';

interface PostListingPreviewProps {
  draft: PostListingDraft;
  coverPhotoUrl?: string;
}

// Maps house type keys to friendly labels
export const formatHouseType = (type: PostHouseType): string => {
  const mapping: Record<PostHouseType, string> = {
    single_room: 'Single Room',
    bedsitter: 'Bedsitter',
    studio: 'Studio',
    one_bedroom: '1 Bedroom',
    two_bedroom: '2 Bedroom',
    mabati_other: 'Mabati / Other',
  };
  return mapping[type] || 'Vacant House';
};

// Static helper representing amenities map for quick preview lookup
const AMENITY_TEXTS: Record<string, string> = {
  water_available: 'Water available',
  token_electricity: 'Token electricity',
  private_toilet: 'Private toilet',
  shared_toilet: 'Shared toilet',
  private_bathroom: 'Private bathroom',
  shared_bathroom: 'Shared bathroom',
  tiled_floor: 'Tiled floor',
  secure_gate: 'Secure gate',
  near_main_road: 'Near main road',
  near_bus_stage: 'Near bus stage',
  no_agent_fee: 'No agent fee',
  parking: 'Parking',
};

export default function PostListingPreview({
  draft,
  coverPhotoUrl,
}: PostListingPreviewProps) {
  
  // Format location summary nicely
  const locationParts = [draft.estate, draft.town].filter(Boolean);
  const locationSummary = locationParts.join(', ') || 'Location not added yet';
  
  // Format pricing values
  const formattedRent = draft.rent ? `KSh ${Number(draft.rent).toLocaleString()}` : '--';
  const formattedDeposit = draft.deposit ? `KSh ${Number(draft.deposit).toLocaleString()}` : '--';

  // Is any verification channel active?
  const hasVerificationOption = draft.allowPhoneVerification || draft.requestLocationCheck || draft.requestScoutVerification;

  return (
    <div className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-4">
      
      {/* 1. Preview Header Section */}
      <div className="flex flex-col space-y-0.5">
        <h4 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight flex items-center space-x-1.5">
          <span>Listing Preview</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </h4>
        <p className="text-[10px] font-semibold text-neutral-400 dark:text-stone-500">
          This is how your listing may appear to tenants.
        </p>
      </div>

      {/* 2. Visual card itself mimicking mobile search card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-neutral-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm transition-all"
      >
        {/* Cover Photo Area */}
        <div className="relative aspect-video w-full bg-neutral-50 dark:bg-stone-850 flex items-center justify-center overflow-hidden">
          {coverPhotoUrl ? (
            <img 
              src={coverPhotoUrl} 
              alt="Listing preview cover"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 select-none">
              <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-stone-800 flex items-center justify-center text-neutral-400 dark:text-stone-500">
                <ImagePlus className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <p className="text-[11px] font-bold text-neutral-500 dark:text-stone-400">
                Cover photo preview
              </p>
              <p className="text-[9px] font-semibold text-neutral-400 dark:text-stone-500 max-w-[190px]">
                Add at least one photo above to populate this card.
              </p>
            </div>
          )}

          {/* Glowing Status availability tag on the top left */}
          <div className="absolute top-3 left-3 flex items-center bg-black/50 backdrop-blur-md border border-white/5 text-white px-2.5 py-1 rounded-full text-[9px] font-bold tracking-tight shadow-sm space-x-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>
              {draft.availabilityDate ? `Available from ${draft.availabilityDate}` : 'Available Soon'}
            </span>
          </div>

          {/* Floating Rent marker on bottom right */}
          <div className="absolute bottom-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-md tracking-tight">
            {formattedRent} <span className="text-[9px] font-medium text-emerald-100">/mo</span>
          </div>
        </div>

        {/* Informational Details grid */}
        <div className="p-4 space-y-3.5">
          {/* House Type & Verification badges line */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-0.5">
              <span className="text-xs font-black text-neutral-800 dark:text-stone-200 tracking-tight truncate max-w-[190px]">
                {draft.title || `${formatHouseType(draft.houseType)} in ${draft.estate || 'Estate'}`}
              </span>
              <div className="flex items-center text-[10.5px] font-bold text-neutral-400 dark:text-stone-500">
                <MapPin className="w-3 h-3 text-neutral-400 mr-1 shrink-0" />
                <span className="truncate max-w-[180px]">{locationSummary}</span>
              </div>
            </div>

            {/* Availability / Verification request pill */}
            {hasVerificationOption && (
              <div className="flex items-center space-x-1 bg-emerald-500/10 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold tracking-tight shrink-0 shadow-3xs uppercase">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Verified requested</span>
              </div>
            )}
          </div>

          {/* Pricing parameters & Deposit indicators */}
          <div className="flex items-center justify-between text-[10px] font-extrabold text-neutral-500 dark:text-stone-400 bg-neutral-50/50 dark:bg-stone-900/10 px-3 py-2 rounded-xl border border-neutral-100/40 dark:border-stone-850/40">
            <span>Deposit: <span className="text-neutral-800 dark:text-neutral-200">{formattedDeposit}</span></span>
            {draft.distanceFromRoad && (
              <span className="flex items-center">
                <Dot className="w-4 h-4 text-neutral-550" />
                <span>{draft.distanceFromRoad} from road</span>
              </span>
            )}
          </div>

          {/* Selected Amenities tags container */}
          {draft.amenities.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {draft.amenities.map((amenityId) => (
                <div 
                  key={amenityId} 
                  className="flex items-center space-x-1 bg-stone-100/50 dark:bg-stone-850 border border-neutral-250/20 dark:border-neutral-850 text-neutral-600 dark:text-stone-300 px-2 py-0.5 rounded-md text-[9px] font-bold"
                >
                  <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[90px]">
                    {AMENITY_TEXTS[amenityId] || amenityId.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[9px] font-bold text-neutral-400 dark:text-stone-500 bg-neutral-500/5 p-2 rounded-xl border border-neutral-200/50 dark:border-stone-850/50 flex items-center space-x-1">
              <span>No amenities selected in Step 2.</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-neutral-100 dark:border-stone-800/80 my-1.5" />

          {/* Contact and Trust Options indicators */}
          <div className="flex items-center justify-between">
            {/* Roles labels */}
            <div className="flex items-center space-x-1 text-[10.5px] font-bold text-neutral-500 dark:text-stone-400">
              <span className="capitalize">{draft.contactRole || 'Caretaker'}</span>
              <span>•</span>
              <span className="truncate max-w-[100px] text-neutral-600 dark:text-stone-300">{draft.contactName || 'Contact Person'}</span>
            </div>

            {/* Quick action buttons badges mock */}
            <div className="flex items-center space-x-1.5">
              {draft.allowCalls && (
                <div className="w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer shadow-sm shadow-emerald-500/10">
                  <Phone className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              )}
              {draft.allowWhatsApp && (
                <div className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
