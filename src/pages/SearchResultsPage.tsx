import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, List, LocateFixed } from 'lucide-react';
import Header from '../components/Header';
import SearchTopBar from '../components/SearchTopBar';
import ResultsSummary from '../components/ResultsSummary';
import SearchResultsList from '../components/SearchResultsList';
import SearchFilterSheet from '../components/SearchFilterSheet';
import SaveSearchButton from '../components/SaveSearchButton';
import { SortOption } from '../components/SortDropdown';
import { PropertyCardHorizontal, PropertyCardVerticalSkeleton } from '../components/property';
import { PropertyMap } from '../components/map';
import EmptyState from '../components/ui/EmptyState';
import { useListings } from '../hooks/useListings';
import { useNearbyListings } from '../hooks/useNearbyListings';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useListingSelection } from '../hooks/useListingSelection';
import { useServerSearch, unionById } from '../hooks/useServerSearch';
import { useMotion } from '../lib/motion';
import {
  type SearchFilters,
  defaultSearchFilters,
  applyFilters,
  sortListings,
  amountBounds,
  activeFilterCount,
} from '../lib/searchFilters';

interface SearchResultsPageProps {
  onTabChange?: (tab: string) => void;
  onSelectListing?: (id: string) => void;
  initialQuery?: string;
  initialFilters?: SearchFilters;
  initialSort?: SortOption;
  onRefreshReady?: (refresh: () => Promise<void>) => void;
}

/**
 * Search. Two visible controls above the results -- the search field and one
 * Filters button -- where there used to be nineteen across three rows.
 *
 * Layout follows the device, not one compromise:
 *   below 1280px  list first, map one tap away behind the FAB. A map is heavy
 *                 on a low-end phone and on metered data, and it opens empty
 *                 for any listing whose coordinates were never captured.
 *   1280px and up persistent Airbnb-style split, results left and a live map
 *                 right, kept in sync: tap a pin to ring and scroll its card,
 *                 hover a card to raise its pin.
 */
export default function SearchResultsPage({
  onTabChange, onSelectListing, initialQuery, initialFilters, initialSort, onRefreshReady,
}: SearchResultsPageProps) {
  const { listings: baseListings, isLoading, refreshListings } = useListings();
  const m = useMotion();

  useEffect(() => {
    onRefreshReady?.(refreshListings);
  }, [refreshListings, onRefreshReady]);

  // `?? ''`, not `|| 'Syokimau'`. The old default silently pre-filtered every
  // result, painted a filter chip active, made the summary read "N homes found
  // in Syokimau", prefilled the save-search label, and persisted
  // `query: 'Syokimau'` into saved_searches. Because it used `||`, submitting
  // an empty search from Home could not produce an unfiltered page at all.
  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSort || 'Most relevant');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || defaultSearchFilters);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isMapTakeover, setIsMapTakeover] = useState(false);

  // A real media query, not CSS visibility: a Leaflet map must only mount into
  // a container that already has size, and a mounted map in a hidden container
  // still fetches tiles.
  const isDesktopSplit = useMediaQuery('(min-width: 1280px)');

  // "Nearest" reuses the geolocation-driven RPC Home's Nearby Listings uses,
  // rather than building a second location flow.
  const {
    permissionState: nearbyPermissionState,
    listings: nearbyListings,
    isLoading: isNearbyLoading,
    requestLocation: requestNearbyLocation,
  } = useNearbyListings();
  const isNearestSort = selectedSort === 'Nearest';

  useEffect(() => {
    if (isNearestSort && nearbyPermissionState === 'idle') requestNearbyLocation();
  }, [isNearestSort, nearbyPermissionState, requestNearbyLocation]);

  // The RPC returns real server-side distance ordering; only switch source
  // once we actually have it, otherwise keep browsing the full set.
  const browseListings =
    isNearestSort && nearbyPermissionState === 'granted' ? nearbyListings : baseListings;

  // Widens the set with rows past the 60-row browse window that match the
  // query's tsvector. Additive, so the filter sheet's live count and the
  // rendered results are still computed from one array by one predicate.
  const { listings: serverMatches } = useServerSearch(searchQuery);
  const sourceListings = useMemo(
    () => (isNearestSort ? browseListings : unionById(browseListings, serverMatches)),
    [browseListings, serverMatches, isNearestSort]
  );

  // Bounds from the real loaded data. Nothing aggregated deposits before, so
  // the deposit filter had no range to offer.
  const rentBounds = useMemo(() => amountBounds(baseListings, 'rent', 30000), [baseListings]);
  const depositBounds = useMemo(() => amountBounds(baseListings, 'deposit', 60000), [baseListings]);

  // Memoized: this pipeline used to re-run in full on every keystroke, for
  // every listing, with the sort re-allocating the array each time.
  const filteredListings = useMemo(
    () => applyFilters(sourceListings, filters, searchQuery),
    [sourceListings, filters, searchQuery]
  );

  const sortedListings = useMemo(
    () => (isNearestSort ? filteredListings : sortListings(filteredListings, selectedSort)),
    [filteredListings, selectedSort, isNearestSort]
  );

  const {
    selectedId, hoveredId, selectFromMap, clearSelection, setHovered, registerCard, selectedListing,
  } = useListingSelection(sortedListings);

  const activeCount = activeFilterCount(filters);
  const hasQueryOrFilters = searchQuery.trim().length > 0 || activeCount > 0;

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedSort('Most relevant');
    setFilters(defaultSearchFilters);
  }, []);

  const openFilters = useCallback(() => setIsFilterSheetOpen(true), []);

  /**
   * "Nearest" has its own honest status states -- requesting / denied /
   * unsupported -- reusing the copy and EmptyState pattern established by
   * Home's NearbyListings.
   */
  const renderResults = () => {
    if (!isNearestSort && isLoading) {
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PropertyCardVerticalSkeleton key={i} />
          ))}
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => <PropertyCardVerticalSkeleton key={i} />)}
          </div>
        );
      }
    }

    return (
      <SearchResultsList
        listings={sortedListings}
        onClearSearch={handleClearSearch}
        onSelectListing={onSelectListing}
        selectedId={selectedId}
        onHoverListing={isDesktopSplit ? setHovered : undefined}
        registerCard={registerCard}
        hasQueryOrFilters={hasQueryOrFilters}
      />
    );
  };

  const controls = (
    <>
      <motion.div variants={m.fadeUp} className="w-full">
        <SearchTopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenFilters={openFilters}
          activeFilterCount={activeCount}
        />
      </motion.div>
      <motion.div variants={m.fadeUp} className="w-full">
        <ResultsSummary
          count={sortedListings.length}
          searchQuery={searchQuery}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          rightSlot={
            <SaveSearchButton
              query={searchQuery}
              filters={filters}
              sort={selectedSort}
              onRequireAuth={() => onTabChange?.('profile')}
            />
          }
        />
      </motion.div>
    </>
  );

  return (
    <motion.div
      variants={m.stagger(0.06)}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col pt-1 space-y-5"
    >
      {/* DesktopNavbar covers this role at md+. */}
      <div className="md:hidden">
        <Header
          onNotificationsClick={() => onTabChange?.('notifications')}
          onProfileClick={() => onTabChange?.('profile')}
        />
      </div>

      {isDesktopSplit ? (
        <div className="flex-1 flex gap-6 min-h-0 items-start">
          <div className="flex-1 min-w-0 flex flex-col space-y-5">
            {controls}
            <motion.div variants={m.fadeUp} className="w-full">
              {renderResults()}
            </motion.div>
          </div>
          {/* The caller owns the height; PropertyMap is always h-full. */}
          <div className="w-[420px] shrink-0 sticky top-6 h-[calc(100svh-var(--kf-navbar-h)-var(--kf-page-pad-y)-2rem)] rounded-2xl overflow-hidden border border-neutral-100 dark:border-stone-800">
            <PropertyMap
              listings={sortedListings}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={selectFromMap}
              onHover={setHovered}
            />
          </div>
        </div>
      ) : (
        <>
          {controls}
          <motion.div variants={m.fadeUp} className="w-full">
            {renderResults()}
          </motion.div>
        </>
      )}

      {/* Mobile/tablet map takeover.
        *
        * `inset-0`, not top/bottom arithmetic. AppShell's main container carries
        * `backdrop-blur-md`, and backdrop-filter makes an element the containing
        * block for every `position: fixed` descendant -- so `top: navbar-h;
        * bottom: bottomnav-h` resolved against AppShell's box rather than the
        * viewport and left a 20px seam at the bottom through which the results
        * list showed. `inset-0` cannot be wrong about a box it fills entirely.
        * (This is the same class of bug as the old inline `top:64px;
        * bottom:64px`, which double-counted for a different reason.)
        *
        * Full-bleed means it covers BottomNav, so the exit control lives inside
        * the takeover rather than outside it -- one way out, where the thumb is.
        *
        * The old version instead rendered a second live Leaflet map inline as a
        * preview wrapped in a <button>: pointer-events-none blocked its clicks
        * but not tab focus, so the zoom anchors, the attribution link and one
        * marker per listing all became tab stops inside a button. It also
        * mounted a whole second map on a page whose users are on metered data. */}
      <AnimatePresence>
        {!isDesktopSplit && isMapTakeover && (
          <motion.div
            key="map-takeover"
            initial={m.reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={m.reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: m.duration.fast }}
            className="fixed inset-0 z-[var(--z-overlay)]"
          >
            <PropertyMap
              listings={sortedListings}
              selectedId={selectedId}
              onSelect={selectFromMap}
              /* Clearance above the docked card (267px) plus the List button
               * below it, so both the coverage notice and the selected pin stay
               * visible. MapViewController clamps this for the pan itself. */
              bottomInset={selectedListing ? 360 : 88}
            />

            <motion.button
              type="button"
              whileTap={m.tap}
              onClick={() => { setIsMapTakeover(false); clearSelection(); }}
              className="absolute left-4 z-[var(--z-map-chrome)] flex items-center gap-2 rounded-full border border-transparent bg-emerald-700 px-5 py-3.5 text-white shadow-lg transition-colors hover:bg-emerald-800 outline-none cursor-pointer bottom-[max(1rem,env(safe-area-inset-bottom))]"
            >
              <List className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
              <span className="text-sm font-bold tracking-wide">List</span>
            </motion.button>

            {/* One selection model, two renderings: this is the mobile half.
              * The old map put a clickable div inside a Leaflet Popup -- a
              * second interaction path no keyboard user would find. */}
            <AnimatePresence>
              {selectedListing && (
                <motion.div
                  initial={m.reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={m.reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
                  transition={m.spring.settle}
                  className="absolute inset-x-3 z-[var(--z-map-chrome)] bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.75rem)]"
                >
                  <PropertyCardHorizontal
                    listing={selectedListing}
                    onSelect={onSelectListing}
                    className="shadow-lg"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-LEFT: AIChatbot's launcher already owns the bottom-right corner
        * (bottom-28 right-6), and at 390px the two overlapped by 60px -- the
        * chat bubble sat on top of this button's label. */}
      {!isDesktopSplit && !isMapTakeover && (
        <motion.button
          type="button"
          whileTap={m.tap}
          onClick={() => setIsMapTakeover(true)}
          className="fixed bottom-[76px] md:bottom-6 left-3.5 z-[var(--z-overlay)] flex items-center gap-2 rounded-full border border-transparent bg-emerald-700 px-4 py-3 text-white shadow-lg transition-colors hover:bg-emerald-800 outline-none cursor-pointer"
        >
          <MapIcon className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
          <span className="text-sm font-bold tracking-wide">Map</span>
        </motion.button>
      )}

      <SearchFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onApply={setFilters}
        rentBounds={rentBounds}
        depositBounds={depositBounds}
        listings={sourceListings}
        query={searchQuery}
      />
    </motion.div>
  );
}
