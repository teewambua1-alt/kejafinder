import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Grid, 
  Image as ImageIcon, 
  User, 
  ShieldCheck, 
  Lock, 
  Check, 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  Phone,
  MessageSquare,
  Compass,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PostListingDraft } from '../types/postListing';
import { PostPhotoPreview } from './PostPhotoUploader';
import PostListingPreview, { formatHouseType } from './PostListingPreview';

interface PostReviewSummaryProps {
  draft: PostListingDraft;
  photoPreviews: PostPhotoPreview[];
  onEditStep: (step: 1 | 2 | 3) => void;
  onBack: () => void;
  onReset: () => void;
  onSaveDraft: () => Promise<boolean>;
  onSubmitReview: () => Promise<boolean>;
  isSaving: boolean;
  isSubmitting: boolean;
  error: string | null;
  feedback: string | null;
}

const AMENITY_LABELS: Record<string, string> = {
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
  parking: 'Parking prk',
};

export default function PostReviewSummary({
  draft,
  photoPreviews,
  onEditStep,
  onBack,
  onReset,
  onSaveDraft,
  onSubmitReview,
  isSaving,
  isSubmitting,
  error,
  feedback,
}: PostReviewSummaryProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Trigger prototype local save action
  const handleSaveDraft = async () => {
    await onSaveDraft();
  };

  // Trigger submit for review after checking validation
  const handleSubmitReview = async () => {
    if (!isConfirmed) {
      setShowError(true);
      return;
    }
    setShowError(false);
    const success = await onSubmitReview();
    if (success) {
      setIsSubmitted(true);
    }
  };

  const coverUrl = photoPreviews[0]?.previewUrl;

  // Stagger wrapper variants
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };

  const cardFadeUp: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-8 shadow-md flex flex-col items-center justify-center text-center py-12 space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-450 shadow-xs animate-bounce">
          <CheckCircle className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2.5 max-w-[340px]">
          <div className="flex items-center justify-center space-x-1.5 justify-self-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-450">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Listing Submitted</span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-neutral-800 dark:text-stone-100 font-sans">
            Listing submitted for review
          </h2>
          <p className="text-xs font-semibold text-neutral-500 dark:text-stone-400 leading-relaxed font-sans">
            KejaFinder will review the listing details before it goes live to protect our community against scams and outdated vacancies. Note approvals typically process within 2 hours.
          </p>
        </div>

        {/* Success control buttons */}
        <div className="flex flex-col space-y-2 w-full max-w-[280px] pt-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-tight shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <PlusIcon className="w-4 h-4 stroke-[2.5]" />
            <span>Post another vacancy</span>
          </motion.button>
          
          <button
            type="button"
            disabled
            className="w-full h-11 rounded-xl bg-neutral-100 dark:bg-stone-850 text-neutral-400 dark:text-stone-600 border border-neutral-200/50 dark:border-stone-800 text-xs font-extrabold cursor-not-allowed select-none"
          >
            View dashboard (Coming soon)
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Back to Step 3 Quick Action Bar */}
      <div className="flex items-center space-x-3">
        <h3 className="text-md font-black tracking-tight text-neutral-800 dark:text-neutral-100">
          Review your listing
        </h3>
        <span className="text-[10px] bg-neutral-100 dark:bg-stone-800 text-neutral-500 px-2 py-0.5 rounded-md font-extrabold">
          Step 4 of 4
        </span>
      </div>

      {/* 2. Compact floating Save Draft feedback warning banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-650/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-450 text-[11px] font-extrabold flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-600/10 dark:bg-red-900/20 border border-red-500/20 rounded-xl text-red-800 dark:text-red-400 text-[11px] font-extrabold flex items-center space-x-2 mt-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Read Only Live Listing Preview Mounted at the top */}
      <div className="space-y-1">
        <PostListingPreview 
          draft={draft} 
          coverPhotoUrl={coverUrl} 
        />
        <p className="text-[10px] font-extrabold text-neutral-400 dark:text-stone-500 pl-4">
          This is how your listing may appear to tenants after approval.
        </p>
      </div>

      {/* 4. Editable Summary Cards List wrapper */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col space-y-4"
      >
        {/* A. House Details Card */}
        <motion.div 
          variants={cardFadeUp}
          className="bg-white/85 dark:bg-stone-900/50 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-850 p-4 shadow-3xs flex items-start justify-between"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-stone-800 flex items-center justify-center text-neutral-600 dark:text-stone-300 shrink-0">
              <Home className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col space-y-1">
              <h5 className="text-[11px] font-black uppercase text-neutral-400 dark:text-stone-500 tracking-wider leading-none">
                House details
              </h5>
              <div className="space-y-0.5 mt-0.5">
                <p className="text-[12px] font-extrabold text-neutral-800 dark:text-stone-200">
                  {formatHouseType(draft.houseType)}
                </p>
                <p className="text-[10.5px] font-bold text-neutral-500 dark:text-stone-400">
                  Rent: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{draft.rent ? `KSh ${Number(draft.rent).toLocaleString()} /month` : 'Not added'}</span>
                </p>
                <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400">
                  Deposit: {draft.deposit ? `KSh ${Number(draft.deposit).toLocaleString()}` : 'Not added'}
                </p>
                <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400">
                  Available: {draft.availabilityDate || 'Not added'}
                </p>
                <p className="text-[10.5px] font-semibold text-neutral-400 dark:text-stone-500 italic truncate max-w-[210px]">
                  &ldquo;{draft.description || 'No description added'}&rdquo;
                </p>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onEditStep(1)}
            aria-label="Edit house details"
            className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 rounded-md border border-emerald-500/20 cursor-pointer transition-colors"
          >
            Edit
          </button>
        </motion.div>

        {/* B. Location Card */}
        <motion.div 
          variants={cardFadeUp}
          className="bg-white/85 dark:bg-stone-900/50 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-850 p-4 shadow-3xs flex items-start justify-between"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-stone-800 flex items-center justify-center text-neutral-600 dark:text-stone-300 shrink-0">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col space-y-1">
              <h5 className="text-[11px] font-black uppercase text-neutral-400 dark:text-stone-500 tracking-wider leading-none">
                Location & directions
              </h5>
              <div className="space-y-0.5 mt-0.5 text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400">
                <p className="font-extrabold text-neutral-800 dark:text-stone-200">
                  {draft.estate ? `${draft.estate}, ${draft.town || 'Town'}` : 'Not added'}
                </p>
                <p>County: {draft.county || 'Not added'}</p>
                <p>Benchmark landmark: {draft.landmark || 'Not added'}</p>
                {draft.distanceFromRoad && (
                  <p className="flex items-center text-[10px] font-bold text-neutral-400">
                    <Compass className="w-3 h-3 mr-0.5" />
                    <span>{draft.distanceFromRoad} from tarmac</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onEditStep(2)}
            aria-label="Edit location"
            className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 rounded-md border border-emerald-500/20 cursor-pointer transition-colors"
          >
            Edit
          </button>
        </motion.div>

        {/* C. Amenities Card */}
        <motion.div 
          variants={cardFadeUp}
          className="bg-white/85 dark:bg-stone-900/50 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-850 p-4 shadow-3xs flex items-start justify-between"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-stone-800 flex items-center justify-center text-neutral-600 dark:text-stone-300 shrink-0">
              <Grid className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col space-y-1">
              <h5 className="text-[11px] font-black uppercase text-neutral-400 dark:text-stone-500 tracking-wider leading-none">
                Selected amenities
              </h5>
              <div className="mt-1 flex flex-wrap gap-1 max-w-[210px]">
                {draft.amenities.length > 0 ? (
                  draft.amenities.map((amenityId) => (
                    <span 
                      key={amenityId} 
                      className="bg-neutral-100 dark:bg-stone-800 text-neutral-600 dark:text-stone-300 px-2 py-0.5 rounded text-[9.5px] font-bold border border-neutral-200/40 dark:border-stone-750"
                    >
                      {AMENITY_LABELS[amenityId] || amenityId}
                    </span>
                  ))
                ) : (
                  <span className="text-[10.5px] font-semibold text-neutral-400 dark:text-stone-500 italic">
                    Not added
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onEditStep(2)}
            aria-label="Edit amenities"
            className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 rounded-md border border-emerald-500/20 cursor-pointer transition-colors"
          >
            Edit
          </button>
        </motion.div>

        {/* D. Photos Card */}
        <motion.div 
          variants={cardFadeUp}
          className="bg-white/85 dark:bg-stone-900/50 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-850 p-4 shadow-3xs flex items-start justify-between"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-stone-800 flex items-center justify-center text-neutral-600 dark:text-stone-300 shrink-0">
              <ImageIcon className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col space-y-1">
              <h5 className="text-[11px] font-black uppercase text-neutral-400 dark:text-stone-500 tracking-wider leading-none">
                House photographs
              </h5>
              <p className="text-[10.5px] font-extrabold text-neutral-700 dark:text-stone-300 mt-0.5">
                {photoPreviews.length} {photoPreviews.length === 1 ? 'photo' : 'photos'} added
              </p>

              {/* Photos miniature thumbnail strip representing up to 4 elements */}
              {photoPreviews.length > 0 ? (
                <div className="flex items-center space-x-1.5 mt-2">
                  {photoPreviews.slice(0, 4).map((photo, index) => (
                    <div 
                      key={photo.id}
                      className="relative w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-850 border border-neutral-200 overflow-hidden shrink-0"
                    >
                      <img 
                        src={photo.previewUrl} 
                        alt="Summary thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" title="Cover photo" />
                      )}
                    </div>
                  ))}
                  {photoPreviews.length > 4 && (
                    <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-stone-800 text-[10px] font-black flex items-center justify-center text-neutral-500">
                      +{photoPreviews.length - 4}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[10.5px] font-semibold text-neutral-400 dark:text-stone-500 italic mt-0.5">
                  No photos added
                </p>
              )}
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onEditStep(3)}
            aria-label="Edit photos"
            className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 rounded-md border border-emerald-500/20 cursor-pointer transition-colors"
          >
            Edit
          </button>
        </motion.div>

        {/* E. Contact Info Card */}
        <motion.div 
          variants={cardFadeUp}
          className="bg-white/85 dark:bg-stone-900/50 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-850 p-4 shadow-3xs flex items-start justify-between"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-stone-800 flex items-center justify-center text-neutral-600 dark:text-stone-300 shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col space-y-1">
              <h5 className="text-[11px] font-black uppercase text-neutral-400 dark:text-stone-500 tracking-wider leading-none">
                Contact information
              </h5>
              <div className="space-y-0.5 mt-0.5 text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400">
                <p className="font-extrabold text-neutral-800 dark:text-stone-200">
                  {draft.contactName || 'Not added'} <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded uppercase tracking-wide ml-1.5">{draft.contactRole}</span>
                </p>
                {draft.allowCalls && draft.contactPhone && (
                  <p className="flex items-center">
                    <Phone className="w-3 h-3 text-neutral-400 mr-1" />
                    <span>Call: {draft.contactPhone}</span>
                  </p>
                )}
                {draft.allowWhatsApp && draft.whatsappPhone && (
                  <p className="flex items-center">
                    <MessageSquare className="w-3 h-3 text-teal-500 mr-1" />
                    <span>WhatsApp: {draft.whatsappPhone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onEditStep(1)}
            aria-label="Edit contact info"
            className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 rounded-md border border-emerald-500/20 cursor-pointer transition-colors"
          >
            Edit
          </button>
        </motion.div>

        {/* F. Verification Requests Card */}
        <motion.div 
          variants={cardFadeUp}
          className="bg-white/85 dark:bg-stone-900/50 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-850 p-4 shadow-3xs flex items-start justify-between"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-stone-800 flex items-center justify-center text-neutral-600 dark:text-stone-300 shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col space-y-1">
              <h5 className="text-[11px] font-black uppercase text-neutral-400 dark:text-stone-500 tracking-wider leading-none">
                Trust & Verification requests
              </h5>
              <div className="space-y-1 mt-1 flex flex-col">
                <span className={`text-[10px] font-extrabold ${draft.allowPhoneVerification ? 'text-emerald-600 dark:text-emerald-450' : 'text-neutral-400'}`}>
                  {draft.allowPhoneVerification ? '✓ SMS Phone Validation active' : '✗ Password/OTP verification ignored'}
                </span>
                <span className={`text-[10px] font-extrabold ${draft.requestLocationCheck ? 'text-emerald-600 dark:text-emerald-450' : 'text-neutral-400 dark:text-stone-600'}`}>
                  {draft.requestLocationCheck ? '✓ Physical Landmark/Location pin check requested' : '✗ Location check disabled'}
                </span>
                <span className={`text-[10px] font-extrabold ${draft.requestScoutVerification ? 'text-emerald-600 dark:text-emerald-450' : 'text-neutral-400 dark:text-stone-600'}`}>
                  {draft.requestScoutVerification ? '✓ On-site KejaFinder Scout audit requested' : '✗ Scout audit disabled'}
                </span>
                <span className={`text-[10px] font-extrabold ${draft.remindToUpdate ? 'text-emerald-650' : 'text-neutral-400'}`}>
                  {draft.remindToUpdate ? '✓ Remind me to update availability status' : '✗ reminders disabled'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onEditStep(2)}
            aria-label="Edit verification requests"
            className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 rounded-md border border-emerald-500/20 cursor-pointer transition-colors"
          >
            Edit
          </button>
        </motion.div>
      </motion.div>

      {/* 5. Accuracy Safety checkbox confirmation */}
      <div className="bg-neutral-50 dark:bg-stone-900/30 rounded-2xl border border-neutral-150 dark:border-neutral-800/80 p-5 space-y-3 shadow-2xs">
        <label className="flex items-start space-x-3 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={isConfirmed}
            onChange={(e) => {
              setIsConfirmed(e.target.checked);
              if (e.target.checked) setShowError(false);
            }}
            className="mt-0.5 w-4.5 h-4.5 rounded text-emerald-600 border-neutral-300 dark:border-stone-850 accent-emerald-650 focus:ring-emerald-500 cursor-pointer shrink-0" 
          />
          <div className="flex flex-col space-y-0.5">
            <h4 className="text-[11.5px] font-white font-black text-neutral-800 dark:text-stone-200">
              Confirm listing accuracy
            </h4>
            <p className="text-[10.5px] font-bold text-neutral-500 dark:text-stone-400 leading-normal">
              I confirm the rent, deposit, photos, location, and contact details are accurate.
            </p>
          </div>
        </label>

        {/* Accuracy validation warning banner */}
        {showError && (
          <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex items-start space-x-2 text-red-650 dark:text-red-400 animate-pulse">
            <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.2] mt-0.5" />
            <span className="text-[10.5px] font-extrabold leading-tight">Please confirm your listing details are accurate.</span>
          </div>
        )}
      </div>

      {/* 6. Legal / Verification Trust note below the checkbox */}
      <div className="flex items-start space-x-2.5 p-4 bg-emerald-500/5 dark:bg-emerald-950/10 rounded-2xl border border-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-sans shadow-3xs">
        <Lock className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2] mt-0.5" />
        <span className="text-[10.5px] font-bold tracking-tight leading-relaxed select-none">
          Listings are reviewed before going live to reduce scams and outdated vacancies. Submitting does not publish the listing live immediately.
        </span>
      </div>

      {/* 7. Footer controls section layout */}
      <div className="flex flex-col space-y-2 border-t border-neutral-100 dark:border-stone-800/80 pt-4">
        
        {/* Save draft action block */}
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSaving || isSubmitting}
          className="h-10 text-xs font-extrabold text-neutral-500 dark:text-stone-400 hover:text-stone-700 bg-neutral-100/40 dark:bg-stone-850/20 border border-neutral-200/50 dark:border-stone-800 rounded-xl flex items-center justify-center space-x-1 cursor-pointer hover:bg-neutral-100 dark:hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
        </button>

        {/* Back and Submit primary split */}
        <div className="flex items-center space-x-3 w-full">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            disabled={isSaving || isSubmitting}
            className="flex-1 h-13 rounded-2xl bg-white/50 dark:bg-stone-850/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-extrabold text-sm flex items-center justify-center space-x-2 cursor-pointer hover:bg-emerald-500/5 transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>Back</span>
          </motion.button>
          
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmitReview}
            disabled={!isConfirmed || isSaving || isSubmitting}
            className={`flex-[2] h-13 rounded-2xl font-extrabold text-sm tracking-wide shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-all font-sans ${
              isConfirmed && !isSaving && !isSubmitting
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/15'
                : 'bg-emerald-600/35 text-white/50 cursor-not-allowed border border-emerald-600/10'
            }`}
          >
            <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
            <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
          </motion.button>
        </div>

      </div>

    </div>
  );
}

// Plus helper icon since Lucide uses custom Plus, inside component to reduce dependencies imports error
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
