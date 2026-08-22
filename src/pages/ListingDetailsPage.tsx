import React, { useState } from 'react';
import { motion } from 'motion/react';
import ListingDetailsHeader from '../components/ListingDetailsHeader';
import ListingImageGallery from '../components/ListingImageGallery';
import {
  ListingOverview, ListingCost, ListingHouse, ListingLocation, ListingContact,
} from '../components/listing';
import SimilarHomesSection from '../components/SimilarHomesSection';
import { useListing } from '../hooks/useListing';
import { useListings } from '../hooks/useListings';
import { useSavedListings } from '../hooks/useSavedListings';
import { useAuth } from '../context/AuthContext';
import { KejaListing } from '../types/listings';
import ReportListingPanel from '../components/ReportListingPanel';
import ListingStickyContactBar from '../components/ListingStickyContactBar';
import { incrementListingView, incrementContactClick, submitListingReport } from '../services/listingService';
import { useToast } from '../context/ToastContext';

interface ListingDetailsPageProps {
  listingId: string | null;
  onBack: () => void;
}

export default function ListingDetailsPage({ listingId, onBack }: ListingDetailsPageProps) {
  const [internalListingId, setInternalListingId] = useState<string | null>(listingId);
  const [isReportPanelOpen, setIsReportPanelOpen] = useState(false);

  const { listing: fbListing, isLoading } = useListing(internalListingId || undefined);
  const { listings: allListings } = useListings();
  const { isSaved, toggleSavedListing, source } = useSavedListings();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Sync internal ID when prop changes
  React.useEffect(() => {
    setInternalListingId(listingId);
  }, [listingId]);

  // Real view count (increment_listing_view RPC), once per distinct listing
  // actually loaded -- not on every re-render.
  const trackedViewIdRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (fbListing && trackedViewIdRef.current !== fbListing.id) {
      trackedViewIdRef.current = fbListing.id;
      incrementListingView(fbListing.id);
    }
  }, [fbListing]);

  // Built from the real row only. This used to spread the fetched listing
  // over `sampleKejaListing`, which meant every KejaListing field the mapper
  // doesn't emit kept the sample's value on real listings -- including
  // isPhoneVerified: true (a false trust signal), a demo panorama URL, and a
  // whole fabricated "house condition" block. Fields with no real column are
  // now absent, and each section hides itself rather than inventing content.
  const currentListing = React.useMemo(() => {
    if (!fbListing) return null;
    return {
      ...fbListing,
      houseType: fbListing.type,
      // `trustBadges` is gone: nothing read it once the overview switched to
      // the real verification_level ladder, and it was the last `as any` on
      // this page -- a string[] force-cast into a union of five literals.
      imageUrl: fbListing.image,
      caretakerName: fbListing.contactName,
      caretakerPhone: fbListing.contactPhone,
    } as KejaListing;
  }, [fbListing]);

  // Real rows straight from useListings(); no reshaping needed now that
  // SimilarHomesSection consumes Listing directly. Listings missing a real
  // rent/deposit are skipped rather than shown with a fabricated price.
  const similarCandidates = React.useMemo(
    () => allListings.filter((l) => l.rent && l.deposit),
    [allListings]
  );

  const handleOpenSimilarListing = (id: string) => {
    setInternalListingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showFeedback = (message: string) => {
    showToast(message);
  };

  const handleShare = async () => {
    if (!currentListing) return;
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('listing', currentListing.id);

    const shareData = {
      title: `Check out this ${currentListing.typeLabel || currentListing.houseType} on KejaFinder`,
      text: `${currentListing.title || 'Great rental home'} for KSh ${currentListing.rent?.toLocaleString()}/month in ${currentListing.estate || currentListing.location}.`,
      url: shareUrl.toString(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error("Error sharing:", err);
          showFeedback("Could not share listing.");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        showFeedback("Link copied to clipboard!");
      } catch (err) {
        showFeedback("Sharing not supported on this browser.");
      }
    }
  };

  const handleReportSubmit = async (reason: string, message: string) => {
    setIsReportPanelOpen(false);
    if (!currentListing) return;
    if (!user) {
      showFeedback("Log in to report a listing.");
      return;
    }
    const success = await submitListingReport({
      listingId: currentListing.id,
      reporterId: user.id,
      reason,
      message,
    });
    showFeedback(success ? "Report submitted. Our team will review it." : "Could not submit report. Please try again.");
  };

  const handleCallClick = () => {
    if (fbListing) incrementContactClick(fbListing.id, 'call');
  };

  const handleWhatsAppClick = () => {
    if (fbListing) incrementContactClick(fbListing.id, 'whatsapp');
  };

  const [localSaved, setLocalSaved] = useState(false);
  const currentlySaved = currentListing
    ? (source === 'supabase' ? isSaved(currentListing.id) : localSaved)
    : false;

  const handleSaveToggleClick = async () => {
    if (!currentListing) return;
    if (source === 'supabase') {
      await toggleSavedListing(currentListing);
      showFeedback(isSaved(currentListing.id) ? "Removed from saved homes." : "Saved to your account.");
    } else if (source === 'signed_out') {
      // Flipping localSaved here would look like a real save that then
      // silently vanishes, since it never reaches the database and never
      // shows up on the Saved page.
      showFeedback("Log in to save homes.");
    } else {
      setLocalSaved(!currentlySaved);
      showFeedback(!currentlySaved ? "Saved locally for this prototype." : "Removed from temporary saved list.");
    }
  };

  // Container motion stagger configuration
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 110, 
        damping: 15 
      } 
    }
  };

  // Real listings only reach this page with an ID that should resolve. While
  // that fetch is in flight, or if it comes back empty (bad/stale/removed
  // ID, or no ID at all), show that honestly instead of rendering fake
  // sample data as if it were the listing the user actually clicked on.
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col pb-44 animate-fadeIn relative">
        <ListingDetailsHeader onBack={onBack} isInitialSaved={false} onShare={() => {}} onSaveToggle={() => {}} onReport={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-24">
          <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-xs font-bold text-neutral-550 dark:text-stone-400 uppercase tracking-wider">Loading listing…</p>
        </div>
      </div>
    );
  }

  if (!currentListing) {
    return (
      <div className="flex-1 flex flex-col pb-44 animate-fadeIn relative">
        <ListingDetailsHeader onBack={onBack} isInitialSaved={false} onShare={() => {}} onSaveToggle={() => {}} onReport={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-24 px-6 text-center">
          <h2 className="text-sm font-black text-neutral-800 dark:text-neutral-100 uppercase tracking-tight">Listing not found</h2>
          <p className="text-xs font-medium text-neutral-500 dark:text-stone-400 max-w-[240px]">
            This listing may have been removed, taken, or is no longer available.
          </p>
          <button
            onClick={onBack}
            className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-44 animate-fadeIn relative">
      {/* 1. Header component */}
      <ListingDetailsHeader
        onBack={onBack}
        isInitialSaved={currentlySaved}
        onShare={handleShare}
        onSaveToggle={handleSaveToggleClick}
        onReport={() => setIsReportPanelOpen(true)}
      />

      {/* Persistent quick-action bar -- always reachable while scrolling */}
      <ListingStickyContactBar
        rent={currentListing.rent}
        phone={currentListing.caretakerPhone || ''}
        whatsapp={currentListing.whatsappPhone || ''}
        onCallClick={handleCallClick}
        onWhatsAppClick={handleWhatsAppClick}
      />

      {/* Main Content Area */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* A. Image gallery (v1.4.1) */}
        <motion.div variants={cardVariants}>
          <ListingImageGallery 
            listing={currentListing}
            onShare={handleShare}
            onSaveToggle={handleSaveToggleClick}
            isSaved={currentlySaved}
          />
        </motion.div>

        {/* Five sections, one card each. This was six components rendering
          * roughly twenty cards, in which availability appeared three times,
          * the landmark three times, water and electricity three times, and
          * the deposit warning three times. Each section now answers exactly
          * one question and no fact is stated twice. */}
        <motion.div variants={cardVariants}>
          <ListingOverview listing={currentListing} />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ListingCost listing={currentListing} />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ListingHouse listing={currentListing} />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ListingLocation listing={currentListing} onWhatsAppClick={handleWhatsAppClick} />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ListingContact
            listing={currentListing}
            onCallClick={handleCallClick}
            onWhatsAppClick={handleWhatsAppClick}
            onReport={() => setIsReportPanelOpen(true)}
          />
        </motion.div>

        {/* H. Similar homes (v1.4.7) */}
        <motion.div variants={cardVariants}>
          <SimilarHomesSection
            currentListing={fbListing}
            allListings={similarCandidates}
            onOpenListingDetails={handleOpenSimilarListing}
            setListingFeedback={showToast}
          />
        </motion.div>
      </motion.div>

      {/* Report Panel */}
      <ReportListingPanel 
        isOpen={isReportPanelOpen}
        onClose={() => setIsReportPanelOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
