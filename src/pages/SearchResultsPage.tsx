import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, List, LocateFixed } from 'lucide-react';
import Header from '../components/Header';
import SearchTopBar from '../components/SearchTopBar';
import SearchFilterChips from '../components/SearchFilterChips';
import SearchHouseTypeChips from '../components/SearchHouseTypeChips';
import ResultsSummary from '../components/ResultsSummary';
import SearchResultsList from '../components/SearchResultsList';
import SearchFilterSheet, { SearchFilters, defaultSearchFilters } from '../components/SearchFilterSheet';
import SaveSearchButton from '../components/SaveSearchButton';
import { SortOption } from '../components/SortDropdown';
import ListingCardSkeleton from '../components/ListingCardSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { useListings } from '../hooks/useListings';
import { useNearbyListings } from '../hooks/useNearbyListings';
import { useMediaQuery } from '../hooks/useMediaQuery';
import SearchFullMap from '../components/SearchFullMap';
import { Listing, ListingType } from '../types/listing';

interface SearchResultsPageProps {
  onBackToHome?: () => void;
  onTabChange?: (tab: string) => void;
  onSelectListing?: (id: string) => void;
  initialQuery?: string;
  initialFilters?: SearchFilters;
  initialSort?: SortOption;
  onRefreshReady?: (refresh: () => Promise<void>) => void;
}

export default function SearchResultsPage({ onBackToHome, onTabChange, onSelectListing, initialQuery, initialFilters, initialSort, onRefreshReady }: SearchResultsPageProps) {
  const { listings: baseListings, isLoading, refreshListings } = useListings();

  useEffect(() => {
    onRefreshReady?.(refreshListings);
  }, [refreshListings, onRefreshReady]);
  const [searchQuery, setSearchQuery] = useState(initialQuery || 'Syokimau');
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSort || 'Most relevant');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || defaultSearchFilters);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');
  // At xl+ (1280px) there's room for Airbnb-style side-by-side list+map, so
  // the map is always visible there instead of behind the FAB toggle. Below
  // xl (mobile+tablet), behavior is unchanged. Gated by a real media query
  // (not just CSS visibility) so the Leaflet map only ever mounts into a
  // container that already has real size -- mounting into a display:none
  // box and revealing it later is a known source of broken/blank tiles.
  const isDesktopSplit = useMediaQuery('(min-width: 1280px)');
  const effectiveViewMode = isDesktopSplit && viewMode === 'map' ? 'list' : viewMode;

  // "Nearest" reuses the same geolocation-driven RPC pattern Home's Nearby
  // Listings already uses, rather than building a second location flow.
  const { permissionState: nearbyPermissionState, listings: nearbyListings, isLoading: isNearbyLoading, requestLocation: requestNearbyLocation } = useNearbyListings();
  const isNearestSort = selectedSort === 'Nearest';

  useEffect(() => {
    if (isNearestSort && nearbyPermissionState === 'idle') {
      requestNearbyLocation();
    }
  }, [isNearestSort, nearbyPermissionState, requestNearbyLocation]);

  // The nearby_listings RPC already returns real, server-side distance
  // ordering -- only switch the source dataset once we actually have that
  // real ordering to show; otherwise keep browsing the full listing set.
  const sourceListings = isNearestSort && nearbyPermissionState === 'granted' ? nearbyListings : baseListings;

  // Real aggregation of already-loaded listings for the Rent slider's bounds
  // and the estate dropdown -- never guessed constants or a curated list.
  const rentBounds = useMemo(() => {
    const rents = baseListings.map((l) => l.rent).filter((r) => typeof r === 'number' && r > 0);
    if (rents.length === 0) return { min: 0, max: 30000 };
    const min = Math.min(...rents);
    const max = Math.max(...rents);
    return min === max ? { min: Math.max(0, min - 1000), max: max + 1000 } : { min, max };
  }, [baseListings]);

  const estates = useMemo(() => {
    const counts = new Map<string, number>();
    baseListings.forEach((listing) => {
      const name = listing.estate?.trim();
      if (!name) return;
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [baseListings]);

  const selectedHouseTypeChip = filters.houseTypes.length === 1 ? filters.houseTypes[0] : null;

  const handleSelectHouseTypeChip = (type: ListingType | null) => {
    setFilters((prev) => ({ ...prev, houseTypes: type ? [type] : [] }));
  };

  const handleSelectEstate = (name: string | null) => {
    setSearchQuery(name || '');
  };

  // 1. Filtering pipeline combining searchQuery and advanced filters
  const filteredListings = sourceListings.filter((listing) => {
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

    // F. Recently updated quick check
    if (filters.recentlyUpdatedOnly && !listing.badges.includes('Recently Updated')) {
      return false;
    }

    // G. Amenities matching -- exact id match against the real ids stored on
    // the listing (see PostAmenitiesGrid.tsx), not a substring guess.
    if (filters.amenities.length > 0) {
      const matchAllAmenities = filters.amenities.every((id) => listing.amenities.includes(id));
      if (!matchAllAmenities) return false;
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

  // 2. Sorting pipeline -- skipped for "Nearest": the RPC already returned
  // filteredListings in real distance order, re-sorting here would undo that.
  const sortedListings: Listing[] = isNearestSort ? filteredListings : [...filteredListings].sort((a, b) => {
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

  // "Nearest" sort needs its own honest status states (requesting/denied/
  // unsupported/empty) instead of the normal results list, reusing the exact
  // same copy and EmptyState pattern Home's NearbyListings.tsx established.
  const renderResults = (vm: 'list' | 'grid') => {
    if (!isNearestSort && isLoading) {
      return (
        <div className={vm === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-4'}>
          {Array.from({ length: vm === 'grid' ? 4 : 3 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      );
    }

    if (isNearestSort) {
      if (nearbyPermissionState === 'denied') {
        return (
          <EmptyState
            icon={LocateFixed}
            title="Location access needed"
            description="Enable location access in your browser settings to sort homes by distance."
          />
        );
      }
      if (nearbyPermissionState === 'unsupported') {
        return (
          <EmptyState
            icon={LocateFixed}
            title="Location not supported"
            description="Your browser doesn't support location sharing on this device."
          />
        );
      }
      if (nearbyPermissionState === 'requesting' || (nearbyPermissionState === 'granted' && isNearbyLoading)) {
        return (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        );
      }
    }

    return (
      <SearchResultsList
        listings={sortedListings}
        onClearSearch={handleClearSearch}
        onSelectListing={onSelectListing}
        viewMode={vm}
      />
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col pt-1 space-y-5"
    >
      {/* Real Shared Header Component -- hidden at md+, DesktopNavbar covers that role there */}
      <div className="md:hidden">
        <Header onNotificationsClick={() => onTabChange?.('notifications')} />
      </div>

      {isDesktopSplit ? (
        /* Desktop (xl+): Airbnb-style side-by-side list + sticky map, no FAB needed */
        <div className="flex-1 flex gap-6 min-h-0 items-start">
          <div className="flex-1 min-w-0 flex flex-col space-y-5">
            <motion.div variants={itemVariants} className="w-full">
              <SearchTopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenFilters={() => setIsFilterSheetOpen(true)}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full">
              <SearchFilterChips
                searchQuery={searchQuery}
                filters={filters}
                onOpenFilters={() => setIsFilterSheetOpen(true)}
                estates={estates}
                onSelectEstate={handleSelectEstate}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full">
              <SearchHouseTypeChips selectedType={selectedHouseTypeChip} onSelectType={handleSelectHouseTypeChip} />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full">
              <ResultsSummary
                count={sortedListings.length}
                searchQuery={searchQuery}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                viewMode={effectiveViewMode}
                onViewModeChange={setViewMode as any}
                rightSlot={<SaveSearchButton query={searchQuery} filters={filters} sort={selectedSort} onRequireAuth={() => onTabChange?.('profile')} />}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full">
              {renderResults(effectiveViewMode === 'map' ? 'list' : effectiveViewMode)}
            </motion.div>
          </div>
          <div className="w-[420px] shrink-0 sticky top-6 h-[calc(100vh-7rem)]">
            <SearchFullMap listings={sortedListings} onSelectListing={onSelectListing} variant="panel" />
          </div>
        </div>
      ) : viewMode === 'map' ? (
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
              estates={estates}
              onSelectEstate={handleSelectEstate}
            />
          </motion.div>

          {/* 3. House Type Chips Row */}
          <motion.div variants={itemVariants} className="w-full">
            <SearchHouseTypeChips selectedType={selectedHouseTypeChip} onSelectType={handleSelectHouseTypeChip} />
          </motion.div>

          {/* 4. Map Preview -- real listings on a real map, tap to expand */}
          <motion.div variants={itemVariants} className="w-full">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              aria-label="Open full map view"
              className="relative w-full h-40 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800/80 shadow-xs cursor-pointer text-left"
            >
              <div className="absolute inset-0 pointer-events-none">
                <SearchFullMap listings={sortedListings} variant="panel" scrollWheelZoom={false} />
              </div>
              <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs border border-neutral-150/50 dark:border-neutral-800/60 flex items-center space-x-1.5">
                <MapIcon className="w-3.5 h-3.5 text-neutral-700 dark:text-stone-300" />
                <span className="text-[10px] font-black text-neutral-700 dark:text-stone-300 uppercase tracking-wider">Expand map</span>
              </div>
            </button>
          </motion.div>

          {/* 5. Results Summary Row */}
          <motion.div variants={itemVariants} className="w-full">
            <ResultsSummary
              count={sortedListings.length}
              searchQuery={searchQuery}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode as any}
              rightSlot={<SaveSearchButton query={searchQuery} filters={filters} sort={selectedSort} onRequireAuth={() => onTabChange?.('profile')} />}
            />
          </motion.div>

          {/* 6. Listing Results Card Area */}
          <motion.div variants={itemVariants} className="w-full">
            {renderResults(viewMode)}
          </motion.div>
        </>
      )}

      {/* Floating Action Button for Map/List Toggle -- mobile/tablet only, desktop split shows both already */}
      {!isDesktopSplit && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="absolute bottom-24 md:bottom-6 right-6 z-50 bg-neutral-900 dark:bg-emerald-600 text-white rounded-full px-5 py-3.5 flex items-center space-x-2 shadow-lg border border-neutral-800 dark:border-emerald-500"
        >
          {viewMode === 'map' ? (
            <>
              <List className="w-5 h-5" />
              <span className="font-bold tracking-wide text-sm">List View</span>
            </>
          ) : (
            <>
              <MapIcon className="w-5 h-5" />
              <span className="font-bold tracking-wide text-sm">Map View</span>
            </>
          )}
        </motion.button>
      )}

      {/* 7. Advanced Filters Drawer Bottom Sheet Modal */}
      <SearchFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onApply={setFilters}
        onClear={() => setFilters(defaultSearchFilters)}
        rentBounds={rentBounds}
      />

    </motion.div>
  );
}
