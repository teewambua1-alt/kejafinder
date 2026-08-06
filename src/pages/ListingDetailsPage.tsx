import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ListingDetailsHeader from '../components/ListingDetailsHeader';
import ListingImageGallery from '../components/ListingImageGallery';
import ListingTitleSection from '../components/ListingTitleSection';
import ListingPricingSummary from '../components/ListingPricingSummary';
import ListingLocationDetails from '../components/ListingLocationDetails';
import ListingAmenitiesCondition from '../components/ListingAmenitiesCondition';
import ListingContactCard from '../components/ListingContactCard';
import ListingTrustSafety from '../components/ListingTrustSafety';
import SimilarHomesSection from '../components/SimilarHomesSection';
import { useListing } from '../hooks/useListing';
import { useListings } from '../hooks/useListings';
import { useSavedListings } from '../hooks/useSavedListings';
import { useAuth } from '../context/AuthContext';
import { sampleKejaListing } from '../data/listingsData';
import { KejaListing } from '../types/listings';
import ReportListingPanel from '../components/ReportListingPanel';
import ListingStickyContactBar from '../components/ListingStickyContactBar';
import { incrementListingView, incrementContactClick, submitListingReport } from '../services/listingService';

interface ListingDetailsPageProps {
  listingId: string | null;
  onBack: () => void;
}

export default function ListingDetailsPage({ listingId, onBack }: ListingDetailsPageProps) {
  const [internalListingId, setInternalListingId] = useState<string | null>(listingId);
  const [listingFeedback, setListingFeedback] = useState<string | null>(null);
  const [isReportPanelOpen, setIsReportPanelOpen] = useState(false);

  const { listing: fbListing, isLoading } = useListing(internalListingId || undefined);
  const { listings: allListings } = useListings();
  const { isSaved, toggleSavedListing, source } = useSavedListings();
  const { user } = useAuth();

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

  // Gracefully resolve listing details from data sources
  const currentListing = React.useMemo(() => {
    if (!internalListingId) return sampleKejaListing;
    if (fbListing) {
      return {
        ...sampleKejaListing, // use as base to fill missing detail fields
        ...fbListing,
        houseType: fbListing.type || 'House',
        trustBadges: (fbListing.badges || []) as any,
        imageUrl: fbListing.image,
        caretakerPhone: fbListing.contactPhone,
      } as KejaListing;
    }
    return sampleKejaListing;
  }, [internalListingId, fbListing]);

  const allAvailableListings = React.useMemo(() => {
    const mapped = allListings.map((listing: any) => ({
      ...listing,
      id: listing.id,
      title: listing.title,
      houseType: listing.type || listing.typeLabel || 'House',
      rent: listing.rent || 10000,
      deposit: listing.deposit || 10000,
      location: listing.location,
      estate: listing.estate || listing.town || listing.location,
      imageUrl: listing.image || 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&w=600&q=80',
      amenities: listing.amenities || [],
      trustBadges: (listing.badges || []) as any,
    })) as KejaListing[];

    const uniqueMap = new Map();
    mapped.forEach(l => uniqueMap.set(l.id, l));
    return Array.from(uniqueMap.values());
  }, [allListings]);

  const handleOpenSimilarListing = (id: string) => {
    setInternalListingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showFeedback = (message: string) => {
    setListingFeedback(message);
    setTimeout(() => setListingFeedback(null), 3000);
  };

  const handleShare = async () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('listing', currentListing.id);
    
    const shareData = {
      title: `Check out this ${currentListing.houseType} on KejaFinder`,
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

  const handleAskDirections = () => {
    showFeedback("Directions request coming soon.");
  };

  const handleOpenMap = () => {
    showFeedback("Map view coming soon.");
  };

  const handleAskAmenities = () => {
    showFeedback("Amenity question feature coming soon.");
  };

  const handleAskAvailability = () => {
    showFeedback("Availability check noted locally.");
  };

  const handleReportSubmit = async (reason: string, message: string) => {
    setIsReportPanelOpen(false);
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

  const [localSaved, setLocalSaved] = useState(currentListing.isSaved || false);
  const currentlySaved = source === 'supabase' ? isSaved(currentListing.id) : localSaved;

  const handleSaveToggleClick = async () => {
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
  // ID), show that honestly instead of silently rendering fake sample data
  // as if it were the listing the user actually clicked on.
  if (internalListingId && isLoading) {
    return (
      <div className="flex-1 flex flex-col pb-44 animate-fadeIn relative">
        <ListingDetailsHeader onBack={onBack} isInitialSaved={false} onShare={() => {}} onSaveToggle={() => {}} onReport={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-24">
          <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-xs font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Loading listing…</p>
        </div>
      </div>
    );
  }

  if (internalListingId && !isLoading && !fbListing) {
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
            className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider"
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

      {/* Local Feedback Toast */}
      <AnimatePresence>
        {listingFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 bg-neutral-900/90 dark:bg-stone-100/90 text-white dark:text-stone-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-md whitespace-nowrap"
          >
            {listingFeedback}
          </motion.div>
        )}
      </AnimatePresence>

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
            listing={currentListing as any} 
            onShare={handleShare}
            onSaveToggle={handleSaveToggleClick}
            isSaved={currentlySaved}
          />
        </motion.div>

        {/* B. Listing title (v1.4.1) */}
        <motion.div variants={cardVariants}>
          <ListingTitleSection listing={currentListing as any} />
        </motion.div>

        {/* C. Pricing summary (v1.4.2) */}
        <motion.div variants={cardVariants}>
          <ListingPricingSummary 
            listing={currentListing as any} 
            onFeedback={showFeedback}
          />
        </motion.div>

        {/* D. Location details (v1.4.3) */}
        <motion.div variants={cardVariants}>
          <ListingLocationDetails 
            listing={currentListing as any} 
            onAskDirections={handleAskDirections}
            onOpenMap={handleOpenMap}
          />
        </motion.div>

        {/* E. Amenities and condition (v1.4.4) */}
        <motion.div variants={cardVariants}>
          <ListingAmenitiesCondition 
            listing={currentListing as any} 
            onAskAmenities={handleAskAmenities}
          />
        </motion.div>

        {/* F. Contact caretaker (v1.4.5) */}
        <motion.div variants={cardVariants}>
          <ListingContactCard
            listing={currentListing as any}
            onFeedback={showFeedback}
            onCallClick={handleCallClick}
            onWhatsAppClick={handleWhatsAppClick}
          />
        </motion.div>

        {/* G. Trust and safety (v1.4.6) */}
        <motion.div variants={cardVariants}>
          <ListingTrustSafety 
            listing={currentListing as any}
            onAvailabilityCheck={handleAskAvailability}
            onReportSubmit={handleReportSubmit}
            listingFeedback={listingFeedback}
          />
        </motion.div>

        {/* H. Similar homes (v1.4.7) */}
        <motion.div variants={cardVariants}>
          <SimilarHomesSection 
            currentListing={currentListing as any}
            allListings={allAvailableListings}
            onOpenListingDetails={handleOpenSimilarListing}
            setListingFeedback={setListingFeedback}
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
