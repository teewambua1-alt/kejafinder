import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, ChevronLeft, MapPin, ShieldCheck, Sparkles, AlertTriangle, UserCircle } from 'lucide-react';
import PostHeader from '../components/PostHeader';
import PostStepProgress from '../components/PostStepProgress';
import PostHouseTypeSelector from '../components/PostHouseTypeSelector';
import PostPricingFields from '../components/PostPricingFields';
import PostAvailabilityField from '../components/PostAvailabilityField';
import PostDescriptionField from '../components/PostDescriptionField';
import PostContactOptions from '../components/PostContactOptions';
import PostLocationSearch from '../components/PostLocationSearch';
import PostMapPreview from '../components/PostMapPreview';
import PostLocationForm from '../components/PostLocationForm';
import PostAmenitiesGrid from '../components/PostAmenitiesGrid';
import PostTrustToggles from '../components/PostTrustToggles';
import PostPhotoUploader, { PostPhotoPreview } from '../components/PostPhotoUploader';
import PostReviewSummary from '../components/PostReviewSummary';
import { PostListingDraft, PostStep } from '../types/postListing';
import { usePostListingDraft } from '../hooks/usePostListingDraft';
import { mapPostVacancyFormToSupabaseListing } from '../lib/listingMappers';
import { useAuth } from '../context/AuthContext';

interface PostVacancyPageProps {
  onTabChange?: (tab: string) => void;
}

export default function PostVacancyPage({ onTabChange }: PostVacancyPageProps = {}) {
  const { user: currentUser, profile: userProfile } = useAuth();
  const {
    saveDraft,
    submitForReview,
    isSaving,
    isSubmitting,
    error: submitError,
    feedback: submitFeedback,
    canSubmitListing
  } = usePostListingDraft();

  const [currentStep, setCurrentStep] = useState<PostStep>(1);
  const [locationSearch, setLocationSearch] = useState('');
  const [photoPreviews, setPhotoPreviews] = useState<PostPhotoPreview[]>([]);
  const [draft, setDraft] = useState<PostListingDraft>({
    houseType: 'single_room',
    rent: '',
    deposit: '',
    availabilityDate: '',
    description: '',
    county: '',
    town: '',
    estate: '',
    landmark: '',
    distanceFromRoad: '',
    contactName: '',
    contactRole: 'caretaker',
    contactPhone: '',
    whatsappPhone: '',
    allowCalls: true,
    allowWhatsApp: true,
    amenities: [],
    photos: [],
    allowPhoneVerification: true,
    requestLocationCheck: false,
    requestScoutVerification: false,
    remindToUpdate: true,
  });

  const [errors, setErrors] = useState<{
    rent?: string;
    deposit?: string;
    availabilityDate?: string;
    contactName?: string;
    contactPhone?: string;
    whatsappPhone?: string;
    contactPhoneFormat?: string;
    whatsappPhoneFormat?: string;
    contactMethod?: string;
    county?: string;
    town?: string;
    estate?: string;
    landmark?: string;
    photos?: string;
  }>({});

  // Page container animation variants
  const containerVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1], // Custom premium cubic-bezier ease out
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: 'easeOut',
      },
    },
  };

  const handleContinue = () => {
    const newErrors: typeof errors = {};

    if (!draft.rent.trim()) {
      newErrors.rent = 'Rent is required.';
    } else if (Number(draft.rent) <= 0) {
      newErrors.rent = 'Enter a rent amount greater than 0.';
    }
    if (!draft.deposit.trim()) {
      newErrors.deposit = 'Deposit is required.';
    }
    if (!draft.availabilityDate.trim()) {
      newErrors.availabilityDate = 'Availability date is required.';
    }
    if (!draft.contactName.trim()) {
      newErrors.contactName = 'Contact person is required.';
    }

    // Clean phone values to enable format checks
    const cleanPhone = draft.contactPhone.replace(/\s+/g, '');
    const cleanWhatsApp = draft.whatsappPhone.replace(/\s+/g, '');
    const phoneRegex = /^(?:\+254|254|0)?(?:7|1)\d{8}$/;

    if (draft.allowCalls) {
      if (!draft.contactPhone.trim()) {
        newErrors.contactPhone = 'Phone number is required.';
      } else if (!phoneRegex.test(cleanPhone)) {
        newErrors.contactPhoneFormat = 'Enter a valid phone number.';
      }
    }

    if (draft.allowWhatsApp) {
      if (!draft.whatsappPhone.trim()) {
        newErrors.whatsappPhone = 'WhatsApp number is required.';
      } else if (!phoneRegex.test(cleanWhatsApp)) {
        newErrors.whatsappPhoneFormat = 'Enter a valid phone number.';
      }
    }

    if (!draft.allowCalls && !draft.allowWhatsApp) {
      newErrors.contactMethod = 'Choose at least one contact method.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Smooth scroll to the first active error element
      const firstErrorKey = Object.keys(newErrors)[0];
      let elementId = '';
      if (firstErrorKey === 'availabilityDate') {
        elementId = 'avail-date-input';
      } else if (firstErrorKey === 'contactName') {
        elementId = 'contact-name-input';
      } else if (firstErrorKey === 'contactPhone' || firstErrorKey === 'contactPhoneFormat') {
        elementId = 'contact-phone-input';
      } else if (firstErrorKey === 'whatsappPhone' || firstErrorKey === 'whatsappPhoneFormat') {
        elementId = 'whatsapp-phone-input';
      } else if (firstErrorKey === 'contactMethod') {
        elementId = 'post-contact-container-card';
      } else {
        elementId = `${firstErrorKey}-input`;
      }

      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    setCurrentStep(2);
  };

  const getHeaderInfo = () => {
    if (currentStep === 1) {
      return {
        title: 'Post a vacant house',
        subtitle: 'Reach renters faster with clear, trusted details.',
      };
    } else if (currentStep === 2) {
      return {
        title: 'Where is the house located?',
        subtitle: 'Help renters find the exact place easily.',
      };
    } else if (currentStep === 3) {
      return {
        title: 'Photos of the house',
        subtitle: 'Add clear photos to help renters see the house.',
      };
    } else {
      return {
        title: 'Review your listing',
        subtitle: 'Confirm all details before publishing.',
      };
    }
  };

  const handleSaveAndContinueStep2 = () => {
    const newErrors: typeof errors = {};

    if (!draft.county) {
      newErrors.county = 'County is required.';
    }
    if (!draft.town.trim()) {
      newErrors.town = 'Town or area is required.';
    }
    if (!draft.estate.trim()) {
      newErrors.estate = 'Estate is required.';
    }
    if (!draft.landmark.trim()) {
      newErrors.landmark = 'Nearby landmark is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Smooth scroll to the first active error element
      const firstErrorKey = Object.keys(newErrors)[0];
      let elementId = '';
      if (firstErrorKey === 'county') {
        elementId = 'county-select';
      } else if (firstErrorKey === 'town') {
        elementId = 'town-input';
      } else if (firstErrorKey === 'estate') {
        elementId = 'estate-input';
      } else if (firstErrorKey === 'landmark') {
        elementId = 'landmark-input';
      } else {
        elementId = `${firstErrorKey}-input`;
      }

      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    setCurrentStep(3);
  };

  const handleSaveAndContinueStep3 = () => {
    if (photoPreviews.length === 0) {
      setErrors({ photos: 'Add at least one photo before continuing.' });
      return;
    }

    setErrors({});
    setCurrentStep(4);
  };

  const handleReset = () => {
    setDraft({
      houseType: 'single_room',
      rent: '',
      deposit: '',
      availabilityDate: '',
      description: '',
      county: '',
      town: '',
      estate: '',
      landmark: '',
      distanceFromRoad: '',
      contactName: '',
      contactRole: 'caretaker',
      contactPhone: '',
      whatsappPhone: '',
      allowCalls: true,
      allowWhatsApp: true,
      amenities: [],
      photos: [],
      allowPhoneVerification: true,
      requestLocationCheck: false,
      requestScoutVerification: false,
      remindToUpdate: true,
    });
    setPhotoPreviews([]);
    setErrors({});
    setLocationSearch('');
    setCurrentStep(1);
  };

  const headerInfo = getHeaderInfo();

  // Why this can't be null when canSubmitListing is false: PostReviewSummary
  // only shows its "Listing submitted for review" screen when onSubmitReview
  // resolves truthy, so every path that returns false below must pair with a
  // reason here â€” otherwise the button would look like it silently did nothing.
  const notSubmittableReason = !currentUser
    ? 'You are not logged in, so nothing was actually submitted. Log in to submit this listing for review.'
    : userProfile?.role === 'tenant'
    ? 'Tenant accounts cannot submit vacancies, so nothing was actually submitted.'
    : 'Could not submit this listing right now. Please try again in a moment.';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-grow flex flex-col space-y-6 pt-2 pb-10"
    >
      {/* 1. Real Header Component */}
      <motion.div variants={itemVariants}>
        <PostHeader 
          title={headerInfo.title} 
          subtitle={headerInfo.subtitle} 
          onNotificationsClick={() => onTabChange?.('notifications')}
        />
      </motion.div>

      {/* 2. Real Step Progress Component */}
      <motion.div variants={itemVariants}>
        <PostStepProgress currentStep={currentStep} />
      </motion.div>

      {/* Interactive step flow container */}
      <AnimatePresence mode="wait">
        {currentStep === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col space-y-5"
          >
            {/* 3. House Type selector section */}
            <PostHouseTypeSelector 
              value={draft.houseType} 
              onChange={(houseType) => setDraft((prev) => ({ ...prev, houseType }))} 
            />

            {/* 4. Pricing Fields */}
            <PostPricingFields
              rent={draft.rent}
              deposit={draft.deposit}
              rentError={errors.rent}
              depositError={errors.deposit}
              onRentChange={(val) => setDraft((prev) => ({ ...prev, rent: val }))}
              onDepositChange={(val) => setDraft((prev) => ({ ...prev, deposit: val }))}
            />

            {/* 5. Availability Date */}
            <PostAvailabilityField
              value={draft.availabilityDate}
              error={errors.availabilityDate}
              onChange={(val) => setDraft((prev) => ({ ...prev, availabilityDate: val }))}
            />

            {/* 6. Description Field */}
            <PostDescriptionField
              value={draft.description}
              onChange={(val) => setDraft((prev) => ({ ...prev, description: val }))}
            />

            {/* 7. Contact Options */}
            <PostContactOptions
              contactName={draft.contactName}
              contactRole={draft.contactRole}
              contactPhone={draft.contactPhone}
              whatsappPhone={draft.whatsappPhone}
              allowCalls={draft.allowCalls}
              allowWhatsApp={draft.allowWhatsApp}
              errors={errors}
              onChange={(fields) => setDraft((prev) => ({ ...prev, ...fields }))}
            />

            {/* 8. Clear Rent / Deposit Verification Hint */}
            <div className="flex items-center space-x-2.5 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-sans">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-450 shrink-0" />
              <span className="text-[11px] font-bold tracking-tight leading-relaxed">
                Clear rent and deposit details help renters trust your listing.
              </span>
            </div>

            {/* 9. Safety Warning Note */}
            <div className="flex items-start space-x-2.5 p-4 bg-orange-500/5 dark:bg-orange-950/10 rounded-2xl border border-orange-500/10 text-orange-850 dark:text-orange-400 font-sans">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 stroke-[2.2]" />
              <span className="text-[11px] font-bold tracking-tight leading-relaxed">
                Never post misleading information. Keep prices and availability accurate.
              </span>
            </div>

            {/* 10. Continue button Action wrapper */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="w-full pt-2"
            >
              <button
                type="button"
                id="btn-post-continue"
                onClick={handleContinue}
                className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-wide shadow-sm shadow-emerald-500/15 flex items-center justify-center space-x-2 cursor-pointer transition-colors font-sans"
              >
                <span>Continue</span>
                <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </motion.div>
          </motion.div>
        ) : currentStep === 2 ? (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col space-y-5"
          >
            {/* 1. Location Search Input */}
            <PostLocationSearch
              value={locationSearch}
              onChange={(val) => setLocationSearch(val)}
            />

            {/* 2. Mock Map Preview */}
            <PostMapPreview />

            {/* 3. Location Details Form */}
            <PostLocationForm
              county={draft.county}
              town={draft.town}
              estate={draft.estate}
              landmark={draft.landmark}
              distanceFromRoad={draft.distanceFromRoad}
              errors={errors}
              onChange={(fields) => setDraft((prev) => ({ ...prev, ...fields }))}
            />

            {/* 3.1. Amenities Grid */}
            <PostAmenitiesGrid
              selectedAmenities={draft.amenities}
              onChange={(amenities) => setDraft((prev) => ({ ...prev, amenities }))}
              warning={draft.amenities.length === 0 ? "Adding amenities helps tenants decide faster." : undefined}
            />

            {/* 3.2. Trust & Verification Toggles */}
            <PostTrustToggles
              allowPhoneVerification={draft.allowPhoneVerification}
              requestLocationCheck={draft.requestLocationCheck}
              requestScoutVerification={draft.requestScoutVerification}
              remindToUpdate={draft.remindToUpdate}
              onChange={(fields) => setDraft((prev) => ({ ...prev, ...fields }))}
            />

            {/* 4. Privacy and safety note banner selection */}
            <div className="flex items-center space-x-2.5 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-sans">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-450 shrink-0" />
              <span className="text-[11px] font-bold tracking-tight leading-relaxed">
                For privacy and safety, tenants will see an approximate location first. Confirm exact directions after they contact you.
              </span>
            </div>

            {/* 5. Back and Save & Continue Buttons */}
            <div className="flex items-center space-x-3 w-full pt-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setErrors({});
                  setCurrentStep(1);
                }}
                className="flex-1 h-13 rounded-2xl bg-white/50 dark:bg-stone-850/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-extrabold text-sm flex items-center justify-center space-x-2 cursor-pointer hover:bg-emerald-500/5 transition-colors font-sans"
              >
                <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>Back</span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveAndContinueStep2}
                className="flex-[2] h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-wide shadow-sm shadow-emerald-500/15 flex items-center justify-center space-x-2 cursor-pointer transition-colors font-sans"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
              </motion.button>
            </div>
          </motion.div>
        ) : currentStep === 3 ? (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col space-y-5"
          >
            {/* Real photo uploader that handles drag-and-drop & empty slots & checklists & warnings */}
            <PostPhotoUploader
              photos={photoPreviews}
              onPhotosChange={(photos) => {
                setPhotoPreviews(photos);
                setDraft((prev) => ({
                  ...prev,
                  photos: photos.map((p) => p.previewUrl),
                }));
                // Real-time error clearance
                if (photos.length > 0 && errors.photos) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.photos;
                    return next;
                  });
                }
              }}
              error={errors.photos}
              draft={draft}
            />

            <div className="flex items-start space-x-2.5 p-4 bg-blue-500/5 dark:bg-blue-950/10 rounded-2xl border border-blue-500/10 text-blue-850 dark:text-blue-400 font-sans shadow-3xs">
              <Sparkles className="w-5 h-5 text-blue-500 shrink-0 stroke-[2] mt-0.5" />
              <span className="text-[10.5px] font-bold tracking-tight leading-relaxed select-none">
                Photos upload when you save or submit this listing â€” they aren't public until an admin approves it.
              </span>
            </div>

            {/* Step 3 back and continue controllers */}
            <div className="flex items-center space-x-3 w-full pt-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setErrors({});
                  setCurrentStep(2);
                }}
                className="flex-1 h-13 rounded-2xl bg-white/50 dark:bg-stone-850/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-extrabold text-sm flex items-center justify-center space-x-2 cursor-pointer hover:bg-emerald-500/5 transition-colors font-sans"
              >
                <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>Back</span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveAndContinueStep3}
                className="flex-[2] h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-wide shadow-sm shadow-emerald-500/15 flex items-center justify-center space-x-2 cursor-pointer transition-colors font-sans"
              >
                <span>Continue</span>
                <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step4-review"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            {!currentUser && (
              <div className="mb-4 flex flex-col items-center justify-center p-6 space-y-4 text-center bg-white dark:bg-stone-850 rounded-2xl border border-neutral-100 dark:border-stone-800 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-neutral-800 dark:text-neutral-50 tracking-tight">Log in to submit a vacancy</h3>
                  <p className="text-[11px] font-medium text-neutral-550 dark:text-neutral-400 max-w-[240px] mx-auto">Create an account as a landlord, caretaker, agent, or scout to submit listings for review.</p>
                </div>
                <div className="flex flex-col space-y-2 w-full max-w-[220px]">
                  <button 
                    onClick={() => onTabChange?.('profile')}
                    className="w-full h-10 bg-emerald-600 dark:bg-emerald-500 rounded-xl text-white text-[11px] font-bold tracking-wider"
                  >
                    Log in or create account
                  </button>
                  <button className="w-full h-10 bg-neutral-100 dark:bg-stone-800/50 rounded-xl text-neutral-700 dark:text-neutral-300 text-[11px] font-bold tracking-wider">
                    Continue editing locally
                  </button>
                </div>
              </div>
            )}
            
            {currentUser && userProfile?.role === 'tenant' && (
              <div className="mb-4 flex items-start space-x-2.5 p-4 bg-orange-500/5 dark:bg-orange-950/10 rounded-2xl border border-orange-500/10 text-orange-850 dark:text-orange-400 font-sans">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 stroke-[2.2]" />
                <span className="text-[11px] font-bold tracking-tight leading-relaxed">
                  Tenant accounts can browse and save homes. To post vacancies, switch to landlord, caretaker, agent, or scout role later.
                </span>
              </div>
            )}

            <PostReviewSummary
              draft={draft}
              photoPreviews={photoPreviews}
              onEditStep={(step) => {
                setErrors({});
                setCurrentStep(step);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => {
                setErrors({});
                setCurrentStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReset={handleReset}
              onSaveDraft={async () => {
                if (canSubmitListing) {
                  return await saveDraft(mapPostVacancyFormToSupabaseListing(draft), photoPreviews);
                }
                return false;
              }}
              onSubmitReview={async () => {
                if (canSubmitListing) {
                  return await submitForReview(mapPostVacancyFormToSupabaseListing(draft), photoPreviews);
                }
                return false;
              }}
              isSaving={isSaving}
              isSubmitting={isSubmitting}
              error={submitError || (!canSubmitListing ? notSubmittableReason : null)}
              feedback={submitFeedback}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
