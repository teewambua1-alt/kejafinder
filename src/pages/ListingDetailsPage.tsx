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
import { useFirestoreListing } from '../hooks/useFirestoreListing';
import { useFirestoreListings } from '../hooks/useFirestoreListings';
import { useSavedListings } from '../hooks/useSavedListings';
import { sampleKejaListing } from '../data/listingsData';
import { KejaListing } from '../types/listings';
import ReportListingPanel from '../components/ReportListingPanel';

interface ListingDetailsPageProps {
  listingId: string | null;
  onBack: () => void;
}

export default function ListingDetailsPage({ listingId, onBack }: ListingDetailsPageProps) {
  const [internalListingId, setInternalListingId] = useState<string | null>(listingId);
  const [listingFeedback, setListingFeedback] = useState<string | null>(null);
  const [isReportPanelOpen, setIsReportPanelOpen] = useState(false);

  const { listing: fbListing, isLoading } = useFirestoreListing(internalListingId || undefined);
  const { listings: allListings } = useFirestoreListings();
  const { isSaved, toggleSavedListing, source } = useSavedListings();

  // Sync internal ID when prop changes
  React.useEffect(() => {
    setInternalListingId(listingId);
  }, [listingId]);

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

  const handleReportSubmit = (reason: string, message: string) => {
    setIsReportPanelOpen(false);
    showFeedback("Report submitted locally. KejaFinder review tools will be added later.");
  };

  const [localSaved, setLocalSaved] = useState(currentListing.isSaved || false);
  const currentlySaved = source === 'firestore' ? isSaved(currentListing.id) : localSaved;

  const handleSaveToggleClick = async () => {
    if (source === 'firestore') {
      await toggleSavedListing(currentListing);
      showFeedback(isSaved(currentListing.id) ? "Removed from saved homes." : "Saved to your account.");
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

  return (
    <div className="flex-1 flex flex-col pb-32 animate-fadeIn relative">
      {/* 1. Header component */}
      <ListingDetailsHeader 
        onBack={onBack} 
        isInitialSaved={currentlySaved} 
        onShare={handleShare}
        onSaveToggle={handleSaveToggleClick}
        onReport={() => setIsReportPanelOpen(true)}
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
