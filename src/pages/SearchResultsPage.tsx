import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/Header';
import SearchTopBar from '../components/SearchTopBar';
import SearchMapPreview from '../components/SearchMapPreview';
import SearchFilterChips from '../components/SearchFilterChips';
import ResultsSummary from '../components/ResultsSummary';
import SearchResultsList from '../components/SearchResultsList';
import SearchFilterSheet, { SearchFilters, defaultSearchFilters } from '../components/SearchFilterSheet';
import { SortOption } from '../components/SortDropdown';
import { useListings } from '../hooks/useListings';
import SearchFullMap from '../components/SearchFullMap';
import { Map, List } from 'lucide-react';

interface SearchResultsPageProps {
  onBackToHome?: () => void;
  onTabChange?: (tab: string) => void;
  onSelectListing?: (id: string) => void;
}

export default function SearchResultsPage({ onBackToHome, onTabChange, onSelectListing }: SearchResultsPageProps) {
  const { listings: baseListings, isLoading } = useListings();
  const [searchQuery, setSearchQuery] = useState('Syokimau');
  const [selectedSort, setSelectedSort] = useState<SortOption>('Most relevant');
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

  // 1. Filtering pipeline combining searchQuery and advanced filters
  const filteredListings = baseListings.filter((listing) => {
    // A. House type filter (if any are selected, match one of the selection)
    if (filters.houseTypes.length > 0) {
      if (!filters.houseTypes.includes(listing.type)) {
        return false;
      }
    }

    // B. Rent range limits
    if (filters.minRent !== "") {
      if (listing.rent < filters.minRent) return false;
    }
    if (filters.maxRent !== "") {
      if (listing.rent > filters.maxRent) return false;
    }

    // C. Deposit range limits
    if (filters.minDeposit !== "") {
      if (listing.deposit < filters.minDeposit) return false;
    }
    if (filters.maxDeposit !== "") {
      if (listing.deposit > filters.maxDeposit) return false;
    }

    // D. Available now quick check
    if (filters.availableNow && !listing.isAvailable) {
      return false;
    }

    // E. Verified only quick check
    if (filters.verifiedOnly) {
      const isVerified = listing.badges.some((badge) =>
        badge === 'Scout Verified' ||
        badge === 'Location Checked' ||
        badge === 'Phone Verified' ||
        badge === 'Trusted Landlord'
      );
      if (!isVerified) return false;
    }

    // F. Amenities matching (ensure ALL selected amenities are matched against listing amenities)
    if (filters.amenities.length > 0) {
      const matchAllAmenities = filters.amenities.every((selected) => {
        return listing.amenities.some((listingAmenity) =>
          listingAmenity.toLowerCase().includes(selected.toLowerCase())
        );
      });
      if (!matchAllAmenities) return false;
    }

    // G. Local details matching
    if (filters.localDetails.length > 0) {
      const matchAllDetails = filters.localDetails.every((detail) => {
        const dLower = detail.toLowerCase();
        
        if (detail === 'No Agent Fee') {
          return (
            listing.amenities.some((a) => a.toLowerCase().includes('agent fee') || a.toLowerCase().includes('no agent')) ||
            listing.badges.some((b) => b.toLowerCase().includes('agent fee') || b.toLowerCase().includes('no agent'))
          );
        }
        if (detail === 'Recently Updated') {
          return listing.badges.includes('Recently Updated');
        }
        if (detail === 'Near main road') {
          return (
            (listing.landmark || '').toLowerCase().includes('main road') ||
            (listing.landmark || '').toLowerCase().includes('highway') ||
            listing.location.toLowerCase().includes('main road')
          );
        }
        if (detail === 'Near stage') {
          return (
            (listing.landmark || '').toLowerCase().includes('stage') ||
            (listing.landmark || '').toLowerCase().includes('railway') ||
            (listing.landmark || '').toLowerCase().includes('station') ||
            listing.location.toLowerCase().includes('stage') ||
            listing.location.toLowerCase().includes('station')
          );
        }
        if (dLower === 'school') {
          return (
            (listing.landmark || '').toLowerCase().includes('school') ||
            (listing.landmark || '').toLowerCase().includes('academy') ||
            listing.location.toLowerCase().includes('school')
          );
        }
        if (detail === 'Secure gate') {
          return (
            (listing.landmark || '').toLowerCase().includes('gate') ||
            listing.estate.toLowerCase().includes('gate') ||
            listing.location.toLowerCase().includes('gate')
          );
        }

        // Generic catch-all string check
        return (
          listing.location.toLowerCase().includes(dLower) ||
          listing.estate.toLowerCase().includes(dLower) ||
          (listing.landmark || '').toLowerCase().includes(dLower) ||
          listing.amenities.some((a) => a.toLowerCase().includes(dLower)) ||
          listing.badges.some((b) => b.toLowerCase().includes(dLower))
        );
      });
      if (!matchAllDetails) return false;
    }

    // H. Query Keyword text search (case-insensitive & trimmed)
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return true;
    }

    const matchesTitle = listing.title.toLowerCase().includes(q);
    const matchesLocation = listing.location.toLowerCase().includes(q);
    const matchesTown = listing.town.toLowerCase().includes(q);
    const matchesEstate = listing.estate.toLowerCase().includes(q);
    const matchesLandmark = (listing.landmark || '').toLowerCase().includes(q);

    // Type label custom matching logic
    const normType = listing.type.toLowerCase();
    const label = (listing.typeLabel || '').toLowerCase();
    let matchesType = normType.includes(q) || label.includes(q);

    if (normType === 'single_room' && (q.includes('single room') || 'single room'.includes(q))) matchesType = true;
    if (normType === 'one_bedroom' && (q.includes('1 bedroom') || q.includes('one bedroom') || '1 bedroom'.includes(q) || 'one bedroom'.includes(q))) matchesType = true;
    if (normType === 'two_bedroom' && (q.includes('2 bedroom') || q.includes('two bedroom') || '2 bedroom'.includes(q) || 'two bedroom'.includes(q))) matchesType = true;
    if (normType === 'mabati' && (q.includes('mabati') || 'mabati'.includes(q))) matchesType = true;
    if (normType === 'bedsitter' && (q.includes('bedsitter') || 'bedsitter'.includes(q))) matchesType = true;
    if (normType === 'studio' && (q.includes('studio') || 'studio'.includes(q))) matchesType = true;

    const matchesAmenities = listing.amenities.some((a) => a.toLowerCase().includes(q));
    const matchesBadges = listing.badges.some((b) => b.toLowerCase().includes(q));

    return (
      matchesTitle ||
      matchesLocation ||
      matchesTown ||
      matchesEstate ||
      matchesLandmark ||
      matchesType ||
      matchesAmenities ||
      matchesBadges
    );
  });

  // 2. Sorting pipeline
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (selectedSort) {
      case 'Most relevant': {
        // Featured listings prioritized
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      }
      case 'Newest': {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      }
      case 'Cheapest': {
        return a.rent - b.rent;
      }
      case 'Verified first': {
        const aVerified = a.badges.some(badge => 
          badge === 'Scout Verified' || 
          badge === 'Location Checked' || 
          badge === 'Phone Verified'
        );
        const bVerified = b.badges.some(badge => 
          badge === 'Scout Verified' || 
          badge === 'Location Checked' || 
          badge === 'Phone Verified'
        );
        if (aVerified && !bVerified) return -1;
        if (!aVerified && bVerified) return 1;
        return 0;
      }
      case 'Recently updated': {
        const aRecent = a.badges.includes('Recently Updated');
        const bRecent = b.badges.includes('Recently Updated');
        if (aRecent && !bRecent) return -1;
        if (!aRecent && bRecent) return 1;

        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      }
      case 'Most viewed': {
        const viewsA = a.views !== undefined ? a.views : 0;
        const viewsB = b.views !== undefined ? b.views : 0;
        return viewsB - viewsA;
      }
      default:
        return 0;
    }
  });

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedSort('Most relevant');
    setFilters(defaultSearchFilters);
    // TODO: Clear any future advanced filter states when added in version 0.3.9
  };

  // Container animation configuration for Staggered appearances
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col pt-1 space-y-5"
    >
      {/* Real Shared Header Component */}
      <Header onNotificationsClick={() => onTabChange?.('notifications')} />

      {viewMode === 'map' ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 relative"
          >
            <SearchFullMap listings={sortedListings} onSelectListing={onSelectListing} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          {/* Real Controlled Search top bar */}
          <motion.div variants={itemVariants} className="w-full">
            <SearchTopBar 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery} 
              onOpenFilters={() => setIsFilterSheetOpen(true)}
            />
          </motion.div>

          {/* 2. Filter Chips Row */}
          <motion.div variants={itemVariants} className="w-full">
            <SearchFilterChips 
              searchQuery={searchQuery}
              filters={filters}
              onOpenFilters={() => setIsFilterSheetOpen(true)}
            />
          </motion.div>

          {/* 3. Map Preview */}
          <motion.div variants={itemVariants} className="w-full">
            <SearchMapPreview />
          </motion.div>

          {/* 4. Results Summary Row */}
          <motion.div variants={itemVariants} className="w-full">
            <ResultsSummary 
              count={sortedListings.length} 
              searchQuery={searchQuery}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode as any}
            />
          </motion.div>

          {/* 5. Listing Results Card Area */}
          <motion.div variants={itemVariants} className="w-full">
            <SearchResultsList 
              listings={sortedListings} 
              onClearSearch={handleClearSearch}
              onSelectListing={onSelectListing}
              viewMode={viewMode}
            />
          </motion.div>
        </>
      )}

      {/* Floating Action Button for Map/List Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        className="absolute bottom-6 right-6 z-50 bg-neutral-900 dark:bg-emerald-600 text-white rounded-full px-5 py-3.5 flex items-center space-x-2 shadow-lg border border-neutral-800 dark:border-emerald-500"
      >
        {viewMode === 'map' ? (
          <>
            <List className="w-5 h-5" />
            <span className="font-bold tracking-wide text-sm">List View</span>
          </>
        ) : (
          <>
            <Map className="w-5 h-5" />
            <span className="font-bold tracking-wide text-sm">Map View</span>
          </>
        )}
      </motion.button>

      {/* 6. Advanced Filters Drawer Bottom Sheet Modal (Version 0.3.8) */}
      <SearchFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onApply={setFilters}
        onClear={() => setFilters(defaultSearchFilters)}
      />

    </motion.div>
  );
}
