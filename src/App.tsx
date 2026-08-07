import React, { useState, useMemo, useCallback, Suspense, lazy, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AppShell from './components/AppShell';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import FilterChips from './components/FilterChips';
import CategoryScroller from './components/CategoryScroller';
import NearbyListings from './components/NearbyListings';
import FeaturedListings from './components/FeaturedListings';
import FreshVacancies from './components/FreshVacancies';
import PopularLocations from './components/PopularLocations';
import SafetyBanner from './components/SafetyBanner';
import PullToRefreshIndicator from './components/PullToRefreshIndicator';
import { useListings } from './hooks/useListings';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import type { SearchFilters } from './components/SearchFilterSheet';
import type { SortOption } from './components/SortDropdown';
import type { SavedSearch } from './hooks/useSavedSearches';

const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const PostVacancyPage = lazy(() => import('./pages/PostVacancyPage'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ListingDetailsPage = lazy(() => import('./pages/ListingDetailsPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const SafetyPage = lazy(() => import('./pages/SafetyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactSupportPage = lazy(() => import('./pages/ContactSupportPage'));
const OwnerDashboardPage = lazy(() => import('./pages/OwnerDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const TestModePage = lazy(() => import('./pages/TestModePage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));

export default function App() {
  const { listings: allListings, isLoading, refreshListings } = useListings();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilterChip, setActiveFilterChip] = useState<string | null>(null);

  // Search and Saved each fetch their own listings independently (separate
  // hook instances), so pulling to refresh on those tabs needs to call
  // *their* refetch, not Home's -- each page hands its refetch fn up here
  // once it's ready via onRefreshReady.
  const [searchRefreshFn, setSearchRefreshFn] = useState<(() => Promise<void>) | null>(null);
  const [savedRefreshFn, setSavedRefreshFn] = useState<(() => Promise<void>) | null>(null);
  const handleSearchRefreshReady = useCallback((fn: () => Promise<void>) => {
    setSearchRefreshFn(() => fn);
  }, []);
  const handleSavedRefreshReady = useCallback((fn: () => Promise<void>) => {
    setSavedRefreshFn(() => fn);
  }, []);

  const activeRefreshFn = activeTab === 'home'
    ? refreshListings
    : activeTab === 'search'
    ? searchRefreshFn
    : activeTab === 'saved'
    ? savedRefreshFn
    : null;

  const { pullDistance, isRefreshing, containerProps: pullToRefreshHandlers } = usePullToRefresh(
    async () => { await activeRefreshFn?.(); },
    { enabled: activeRefreshFn !== null }
  );

  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [previousTab, setPreviousTab] = useState<string>('home');
  const [pendingSearchQuery, setPendingSearchQuery] = useState<string | undefined>(undefined);
  const [pendingSearchFilters, setPendingSearchFilters] = useState<SearchFilters | undefined>(undefined);
  const [pendingSearchSort, setPendingSearchSort] = useState<SortOption | undefined>(undefined);

  const handleSearchSubmit = (query: string) => {
    setPendingSearchQuery(query);
    setPendingSearchFilters(undefined);
    setPendingSearchSort(undefined);
    setActiveTab('search');
  };

  const handleApplySavedSearch = (search: SavedSearch) => {
    setPendingSearchQuery(search.query);
    setPendingSearchFilters(search.filters);
    setPendingSearchSort(search.sort);
    setActiveTab('search');
  };

  const openListingDetails = (listingId: string) => {
    setPreviousTab(activeTab);
    setSelectedListingId(listingId);
    setActiveTab('listing-details');
  };

  const closeListingDetails = () => {
    setActiveTab(previousTab || 'home');
  };

  const openAuthPage = () => {
    setPreviousTab(activeTab);
    setActiveTab('auth');
  };

  const closeAuthPage = () => {
    setActiveTab(previousTab || 'profile');
  };

  const openSafetyPage = () => {
    setPreviousTab(activeTab);
    setActiveTab('safety');
  };

  const closeSafetyPage = () => {
    setActiveTab(previousTab || 'profile');
  };

  const openAboutPage = () => {
    setPreviousTab(activeTab);
    setActiveTab('about');
  };

  const closeAboutPage = () => {
    setActiveTab(previousTab || 'profile');
  };

  const openSupportPage = () => {
    setPreviousTab(activeTab);
    setActiveTab('support');
  };

  const closeSupportPage = () => {
    setActiveTab(previousTab || 'profile');
  };

  const openOwnerDashboard = () => {
    setPreviousTab(activeTab);
    setActiveTab('landlord-dashboard');
  };

  const closeOwnerDashboard = () => {
    setActiveTab(previousTab || 'profile');
  };

  const openAdminDashboard = () => {
    setPreviousTab(activeTab);
    setActiveTab('admin-dashboard');
  };

  const closeAdminDashboard = () => {
    setActiveTab(previousTab || 'profile');
  };

  const openTestMode = () => {
    setPreviousTab(activeTab);
    setActiveTab('test-mode');
  };

  const closeTestMode = () => {
    setActiveTab(previousTab || 'profile');
  };

  const openDesignSystem = () => {
    setPreviousTab(activeTab);
    setActiveTab('design-system');
  };

  const closeDesignSystem = () => {
    setActiveTab(previousTab || 'profile');
  };

  // Multi-criteria filter logic
  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && listing.type !== selectedCategory) {
        return false;
      }

      // 2. Available Filter
      if (activeFilterChip === 'available' && listing.isAvailable === false) {
        return false;
      }

      // 3. Search Query Filter - matches against title, type, location, town, estate, landmark, amenities, and badges
      if (!searchQuery.trim()) {
        return true;
      }

      const q = searchQuery.toLowerCase().trim();

      const titleMatch = listing.title.toLowerCase().includes(q);
      const typeMatch = listing.type.toLowerCase().includes(q) || (listing.typeLabel ? listing.typeLabel.toLowerCase().includes(q) : false);
      const locationMatch = listing.location.toLowerCase().includes(q);
      const townMatch = listing.town.toLowerCase().includes(q);
      const estateMatch = listing.estate.toLowerCase().includes(q);
      const landmarkMatch = listing.landmark ? listing.landmark.toLowerCase().includes(q) : false;

      const amenitiesMatch = listing.amenities.some((amenity) => amenity.toLowerCase().includes(q));

      const badgesMatch = listing.badges.some((badge) => badge.toLowerCase().includes(q));

      return (
        titleMatch ||
        typeMatch ||
        locationMatch ||
        townMatch ||
        estateMatch ||
        landmarkMatch ||
        amenitiesMatch ||
        badgesMatch
      );
    });
  }, [allListings, searchQuery, selectedCategory, activeFilterChip]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveFilterChip(null);
  };

  // Real aggregation of already-loaded approved listings by estate -- never
  // a curated/fake list. PopularLocations itself renders nothing when this
  // is empty.
  const popularLocations = useMemo(() => {
    const counts = new Map<string, number>();
    allListings.forEach((listing) => {
      const name = listing.estate?.trim();
      if (!name) return;
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allListings]);

  return (
    <AppShell
      activeTab={activeTab === 'listing-details' || activeTab === 'about' ? previousTab : activeTab}
      onTabChange={(tab) => {
        setSelectedListingId(null);
        setActiveTab(tab);
      }}
      onNotificationsClick={() => setActiveTab('notifications')}
      onOpenAuth={openAuthPage}
      onOpenTestMode={openTestMode}
      onOpenDesignSystem={openDesignSystem}
      onSearchSubmit={handleSearchSubmit}
      pullToRefreshHandlers={pullToRefreshHandlers}
      pullToRefreshIndicator={<PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />}
    >
      <Suspense fallback={null}>
      <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        className="flex-1 flex flex-col w-full min-h-0"
      >
      {activeTab === 'home' ? (
        /* Container holding the progression of elements */
        <div className="flex-1 flex flex-col py-2 space-y-8 animate-fadeIn">

          {/* Header -- hidden at md+, DesktopNavbar covers that role there */}
          <div className="md:hidden">
            <Header onNotificationsClick={() => setActiveTab('notifications')} onProfileClick={() => setActiveTab('profile')} />
          </div>

          {/* 1. Hero Search */}
          <HeroSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />

          {/* 2. Nearby Listings */}
          <NearbyListings onSelectListing={openListingDetails} />

          {/* 3. Featured Listings */}
          <FeaturedListings onSelectListing={openListingDetails} />

          {/* 4. Recently Added */}
          <FreshVacancies
            listings={filteredListings}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClearFilters={handleClearFilters}
            onSelectListing={openListingDetails}
            isLoading={isLoading}
          />

          {/* 5. Popular Locations */}
          <PopularLocations locations={popularLocations} onSelectLocation={handleSearchSubmit} />

          {/* 6. Quick Filters */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="font-display text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight px-0.5">
              Quick filters
            </h2>
            <FilterChips
              activeChip={activeFilterChip}
              onChipClick={setActiveFilterChip}
            />
            <CategoryScroller
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* 7. Safety Tips */}
          <SafetyBanner />

        </div>
      ) : activeTab === 'search' ? (
        <SearchResultsPage
          onBackToHome={() => setActiveTab('home')}
          onTabChange={setActiveTab}
          onSelectListing={openListingDetails}
          initialQuery={pendingSearchQuery}
          initialFilters={pendingSearchFilters}
          initialSort={pendingSearchSort}
          onRefreshReady={handleSearchRefreshReady}
        />
      ) : activeTab === 'post' ? (
        <PostVacancyPage onTabChange={setActiveTab} />
      ) : activeTab === 'saved' ? (
        <SavedPage
          onExploreHomes={() => setActiveTab('home')}
          onTabChange={setActiveTab}
          onSelectListing={openListingDetails}
          onApplySavedSearch={handleApplySavedSearch}
          onRefreshReady={handleSavedRefreshReady}
        />
      ) : activeTab === 'profile' ? (
        <ProfilePage
          onTabChange={setActiveTab}
          onOpenAuth={openAuthPage}
          onOpenSafety={openSafetyPage}
          onOpenAbout={openAboutPage}
          onOpenSupport={openSupportPage}
          onOpenOwnerDashboard={openOwnerDashboard}
          onOpenAdminDashboard={openAdminDashboard}
          onOpenTestMode={openTestMode}
          onOpenDesignSystem={openDesignSystem}
        />
      ) : activeTab === 'auth' ? (
        <AuthPage onBack={closeAuthPage} onTabChange={setActiveTab} />
      ) : activeTab === 'safety' ? (
        <SafetyPage 
          onBack={closeSafetyPage} 
          onGoSearch={() => setActiveTab('search')}
          onGoPost={() => setActiveTab('post')}
          onOpenListingDetails={openListingDetails}
          onOpenSupport={openSupportPage}
        />
      ) : activeTab === 'about' ? (
        <AboutPage 
          onBack={closeAboutPage} 
          onGoSearch={() => setActiveTab('search')}
          onGoPost={() => setActiveTab('post')}
          onGoSafety={() => setActiveTab('safety')}
        />
      ) : activeTab === 'support' ? (
        <ContactSupportPage 
          onBack={closeSupportPage} 
          onGoSearch={() => setActiveTab('search')}
          onGoSafety={() => setActiveTab('safety')}
        />
      ) : activeTab === 'landlord-dashboard' ? (
        <OwnerDashboardPage
          onBack={closeOwnerDashboard}
          onGoPost={() => setActiveTab('post')}
          onGoSearch={() => setActiveTab('search')}
          onGoSafety={() => setActiveTab('safety')}
          onSelectListing={openListingDetails}
        />
      ) : activeTab === 'admin-dashboard' ? (
        <AdminDashboardPage onBack={closeAdminDashboard} />
      ) : activeTab === 'test-mode' ? (
        <TestModePage 
          onBack={closeTestMode}
          onGoHome={() => setActiveTab('home')}
          onGoSearch={() => setActiveTab('search')}
          onGoPost={() => setActiveTab('post')}
          onGoSaved={() => setActiveTab('saved')}
          onGoProfile={() => setActiveTab('profile')}
          onGoAuth={() => setActiveTab('auth')}
          onGoSafety={() => setActiveTab('safety')}
          onGoAbout={() => setActiveTab('about')}
          onGoSupport={() => setActiveTab('support')}
          onGoLandlordDashboard={() => setActiveTab('landlord-dashboard')}
        />
      ) : activeTab === 'design-system' ? (
        <DesignSystemPage onBack={closeDesignSystem} />
      ) : activeTab === 'notifications' ? (
        <NotificationsPage onBackToHome={() => setActiveTab('home')} onOpenSafety={openSafetyPage} />
      ) : activeTab === 'listing-details' ? (
        <ListingDetailsPage 
          listingId={selectedListingId} 
          onBack={closeListingDetails} 
        />
      ) : (
        /* Placeholder for other tabs like profile */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 min-h-[400px]">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-neutral-100 dark:border-stone-850">
            <span className="font-mono text-xs font-black uppercase">{activeTab[0]}</span>
          </div>
          <div className="space-y-1">
            <div className="text-emerald-600 dark:text-emerald-400 font-display font-black text-sm tracking-tight capitalize">
              {activeTab} Screen
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-[10px] leading-relaxed max-w-[240px] font-medium mx-auto">
              This area is styled visually for preview purposes. Use the primary <strong>Home</strong>, <strong>Search</strong>, and <strong>Post</strong> tabs to explore KejaFinder.
            </p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('home')}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 border-none outline-none font-bold text-xs text-white cursor-pointer hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            Go back Home
          </motion.button>
        </div>
      )}
      </motion.div>
      </AnimatePresence>
      </Suspense>
    </AppShell>
  );
}
