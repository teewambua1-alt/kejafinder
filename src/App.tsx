import React, { useState, useMemo, Suspense, lazy, useEffect } from 'react';
import { motion } from 'motion/react';
import AppShell from './components/AppShell';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import FilterChips from './components/FilterChips';
import CategoryScroller from './components/CategoryScroller';
import FeaturedListing from './components/FeaturedListing';
import FreshVacancies from './components/FreshVacancies';
import RecommendedForYou from './components/RecommendedForYou';
import SafetyBanner from './components/SafetyBanner';
import { useListings } from './hooks/useListings';

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
const LandlordDashboardPage = lazy(() => import('./pages/LandlordDashboardPage'));
const TestModePage = lazy(() => import('./pages/TestModePage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));

export default function App() {
  const { listings: allListings, isLoading } = useListings();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilterChip, setActiveFilterChip] = useState<string | null>(null);
  
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [previousTab, setPreviousTab] = useState<string>('home');

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

  const openLandlordDashboard = () => {
    setPreviousTab(activeTab);
    setActiveTab('landlord-dashboard');
  };

  const closeLandlordDashboard = () => {
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

  return (
    <AppShell 
      activeTab={activeTab === 'listing-details' || activeTab === 'about' ? previousTab : activeTab} 
      onTabChange={(tab) => {
        setSelectedListingId(null);
        setActiveTab(tab);
      }}
    >
      <Suspense fallback={null}>
      {activeTab === 'home' ? (
        /* Container holding the progression of elements */
        <div className="flex-1 flex flex-col py-2 space-y-5 animate-fadeIn">
          
          {/* Header Section (v0.1.1) */}
          <Header onNotificationsClick={() => setActiveTab('notifications')} />

          {/* Hero & Search Section (v0.1.2) - Controlled */}
          <HeroSearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />

          {/* Quick Filter Chips (v0.1.3) - Controlled */}
          <FilterChips 
            activeChip={activeFilterChip} 
            onChipClick={setActiveFilterChip} 
          />

          {/* House Type Category Scroller (v0.1.4) - Controlled */}
          <CategoryScroller 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />

          {/* Large Featured Listing Card (v0.1.5) */}
          <FeaturedListing onSelectListing={openListingDetails} />

          {/* Fresh Vacancies Section (v0.1.6) - Controlled */}
          <FreshVacancies 
            listings={filteredListings} 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClearFilters={handleClearFilters} 
            onSelectListing={openListingDetails}
            isLoading={isLoading}
          />

          <RecommendedForYou
            allListings={allListings}
            searchQuery={searchQuery}
            onSelectListing={openListingDetails}
            isLoading={isLoading}
          />

          {/* Safety & Trust Banner (v0.1.7) */}
          <SafetyBanner />

        </div>
      ) : activeTab === 'search' ? (
        <SearchResultsPage 
          onBackToHome={() => setActiveTab('home')} 
          onTabChange={setActiveTab} 
          onSelectListing={openListingDetails}
        />
      ) : activeTab === 'post' ? (
        <PostVacancyPage onTabChange={setActiveTab} />
      ) : activeTab === 'saved' ? (
        <SavedPage 
          onExploreHomes={() => setActiveTab('home')} 
          onTabChange={setActiveTab} 
          onSelectListing={openListingDetails}
        />
      ) : activeTab === 'profile' ? (
        <ProfilePage 
          onTabChange={setActiveTab} 
          onOpenAuth={openAuthPage} 
          onOpenSafety={openSafetyPage} 
          onOpenAbout={openAboutPage} 
          onOpenSupport={openSupportPage}
          onOpenLandlordDashboard={openLandlordDashboard}
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
        <LandlordDashboardPage 
          onBack={closeLandlordDashboard} 
          onGoPost={() => setActiveTab('post')}
          onGoSearch={() => setActiveTab('search')}
          onGoSafety={() => setActiveTab('safety')}
        />
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
      </Suspense>
    </AppShell>
  );
}
