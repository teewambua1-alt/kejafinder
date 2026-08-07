import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BellRing,
  Heart,
  Compass,
  Search,
  Scale,
  AlertCircle,
  Bell,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import Header from '../components/Header';
import SavedSearchBar from '../components/SavedSearchBar';
import SavedFilterChips from '../components/SavedFilterChips';
import SavedSortControl from '../components/SavedSortControl';
import SavedHomesList from '../components/SavedHomesList';
import SavedEmptyState from '../components/SavedEmptyState';
import SavedSuggestions from '../components/SavedSuggestions';
import SavedHelperBanner from '../components/SavedHelperBanner';
import SavedCollections from '../components/SavedCollections';
import SavedCompareBar from '../components/SavedCompareBar';
import SavedCompareSheet from '../components/SavedCompareSheet';
import SavedViewToggle from '../components/SavedViewToggle';
import SavedMapView from '../components/SavedMapView';
import SavedUpdates from '../components/SavedUpdates';
import SavedSearchesSection from '../components/SavedSearchesSection';
import ListingCardSkeleton from '../components/ListingCardSkeleton';
import { initialSavedUpdates } from '../data/savedUpdates';
import { Listing } from '../types/listing';
import { useSavedListings } from '../hooks/useSavedListings';
import { useSavedSearches, SavedSearch } from '../hooks/useSavedSearches';
import { useToast } from '../context/ToastContext';

interface SavedPageProps {
  onExploreHomes?: () => void;
  onTabChange?: (tab: string) => void;
  onSelectListing?: (id: string) => void;
  onApplySavedSearch?: (search: SavedSearch) => void;
  onRefreshReady?: (refresh: () => Promise<void>) => void;
}

export default function SavedPage({ onExploreHomes, onTabChange, onSelectListing, onApplySavedSearch, onRefreshReady }: SavedPageProps) {
  const { savedListings, source, isLoading, unsaveListing, saveListing, refreshSavedListings } = useSavedListings();
  const { savedSearches, removeSearch } = useSavedSearches();
  const { showToast } = useToast();

  useEffect(() => {
    onRefreshReady?.(refreshSavedListings);
  }, [refreshSavedListings, onRefreshReady]);

  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [activeSavedFilter, setActiveSavedFilter] = useState('all');
  const [savedSort, setSavedSort] = useState('Recently saved');
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  
  // View toggle selection: 'list' or 'map'
  const [savedView, setSavedView] = useState<'list' | 'map'>('list');
  
  // Saved updates states
  const [showSavedUpdates, setShowSavedUpdates] = useState(false);
  const [updates, setUpdates] = useState(initialSavedUpdates);
  
  // Compare Mode state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isCompareSheetOpen, setIsCompareSheetOpen] = useState(false);

  // Stagger entry animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  // Local heart unsave trigger
  const handleUnsave = async (id: string) => {
    await unsaveListing(id);
    setSelectedCompareIds((prev) => prev.filter((cid) => cid !== id));
  };

  // Compare toggler callback with threshold checks
  const handleToggleCompare = (id: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cid) => cid !== id);
      }
      if (prev.length >= 3) {
        showToast("You can compare up to 3 homes.", { icon: AlertCircle });
        return prev;
      }
      return [...prev, id];
    });
  };

  // Callback to add dynamic suggestion listing properties
  const handleSaveSuggestion = async (item: Listing) => {
    await saveListing(item);
  };

  // 1. Filter by Search Query
  let filtered = savedListings.filter((item) => {
    if (!savedSearchQuery.trim()) return true;
    const query = savedSearchQuery.toLowerCase();
    
    const fieldsToSearch = [
      item.title,
      item.location,
      item.town,
      item.estate,
      item.county || '',
      item.type,
      ...(item.amenities || []),
      ...(item.badges || [])
    ];
    
    return fieldsToSearch.some((field) => field.toLowerCase().includes(query));
  });

  // 2. Filter by Category Filter Chips
  if (activeSavedFilter !== 'all') {
    if (activeSavedFilter === 'bedsitter') {
      filtered = filtered.filter((item) => item.type === 'bedsitter');
    } else if (activeSavedFilter === 'one_bedroom') {
      filtered = filtered.filter((item) => item.type === 'one_bedroom');
    } else if (activeSavedFilter === 'verified') {
      filtered = filtered.filter((item) => 
        item.badges.some((tag) => tag.toLowerCase().includes('verified') || tag.toLowerCase().includes('checked'))
      );
    } else if (activeSavedFilter === 'recently_saved') {
      // Just keep them all, sorting handles order
    }
  }

  // 3. Filter by Active Saved Collections
  if (activeCollection) {
    if (activeCollection === 'budget_picks') {
      filtered = filtered.filter((item) => item.rent <= 10000);
    } else if (activeCollection === 'near_transport') {
      filtered = filtered.filter((item) => {
        const loc = (item.location || '').toLowerCase();
        const dist = (item.distanceFromRoad || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        return loc.includes('road') || loc.includes('stage') || loc.includes('station') || loc.includes('expressway') ||
               dist.includes('road') || dist.includes('stage') || dist.includes('walk') || dist.includes('station') ||
               title.includes('stage') || title.includes('station');
      });
    } else if (activeCollection === 'verified_homes') {
      filtered = filtered.filter((item) => 
        (item.badges || []).some((badge) => {
          const b = badge.toLowerCase();
          return b.includes('verified') || b.includes('checked');
        })
      );
    } else if (activeCollection === 'move_this_month') {
      filtered = filtered.filter((item) => 
        (item.badges || []).some((badge) => badge.toLowerCase().includes('updated'))
      );
    }
  }

  // 4. Sort logic
  const sorted = [...filtered].sort((a, b) => {
    switch (savedSort) {
      case 'Cheapest':
        return a.rent - b.rent;
      case 'Highest rent':
        return b.rent - a.rent;
      case 'Verified first': {
        const aVerified = a.badges.some((tag) => tag.toLowerCase().includes('verified')) ? 1 : 0;
        const bVerified = b.badges.some((tag) => tag.toLowerCase().includes('verified')) ? 1 : 0;
        return bVerified - aVerified;
      }
      case 'Recently updated': {
        const aUpdated = a.badges.some((tag) => tag.toLowerCase().includes('updated')) ? 1 : 0;
        const bUpdated = b.badges.some((tag) => tag.toLowerCase().includes('updated')) ? 1 : 0;
        return bUpdated - aUpdated;
      }
      case 'Recently saved':
      default: {
        const dateA = a.updatedAt || '';
        const dateB = b.updatedAt || '';
        return dateB.localeCompare(dateA); // Newest first
      }
    }
  });

  const handleClearFilters = () => {
    setSavedSearchQuery('');
    setActiveSavedFilter('all');
    setSavedSort('Recently saved');
    setActiveCollection(null);
  };

  const handleMarkRead = (id: string) => {
    setUpdates((prev) => prev.map((u) => u.id === id ? { ...u, isRead: true } : u));
  };

  const handleMarkAllRead = () => {
    setUpdates((prev) => prev.map((u) => ({ ...u, isRead: true })));
  };

  const handleClearRead = () => {
    setUpdates((prev) => prev.filter((u) => !u.isRead));
  };

  const unreadCount = updates.filter((u) => !u.isRead).length;

  if (source === 'signed_out') {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-5 w-full pb-6 animate-fadeIn"
      >
        <motion.div variants={itemVariants} className="md:hidden">
          <Header onNotificationsClick={() => onTabChange?.('notifications')} />
        </motion.div>
        
        <div className="flex flex-col items-center justify-center pt-24 space-y-6 text-center px-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-neutral-800 dark:text-neutral-50 tracking-tight">
              Log in to see your saved homes
            </h1>
            <p className="text-[13px] font-medium text-neutral-550 dark:text-neutral-400 max-w-[280px] mx-auto">
              Save rooms and houses across devices when you log in.
            </p>
          </div>
          <div className="flex flex-col space-y-3 w-full max-w-[240px]">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onTabChange?.('profile')}
              className="w-full h-12 bg-emerald-600 dark:bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-[13px] font-bold uppercase tracking-wider shadow-md hover:bg-emerald-700 transition-colors"
            >
              Log in or create account
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onExploreHomes}
              className="w-full h-12 bg-neutral-100 dark:bg-stone-800/50 rounded-2xl flex items-center justify-center text-neutral-700 dark:text-neutral-300 text-[13px] font-bold tracking-wider hover:bg-neutral-200 dark:hover:bg-stone-800 transition-colors"
            >
              Browse homes
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col space-y-5 w-full pb-6 animate-fadeIn"
    >
      {/* Brand Header Row (Reused from global component) */}
      <motion.div variants={itemVariants} className="md:hidden">
        <Header onNotificationsClick={() => onTabChange?.('notifications')} />
      </motion.div>

      {/* Page Title & Subtitle Section */}
      <motion.div variants={itemVariants} className="flex flex-col space-y-1.5 pt-1.5 px-1">
        <h1 className="text-3xl font-extrabold text-neutral-800 dark:text-neutral-50 tracking-tight font-sans">
          Saved homes
        </h1>
        <p className="text-[13px] font-medium text-neutral-550 dark:text-neutral-400 tracking-wide">
          Your shortlisted houses in one place.
        </p>
        
        {source === 'supabase' && (
          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Synced to your account
          </p>
        )}
      </motion.div>

      {/* Saved Searches section -- hidden entirely when there are none */}
      {!showSavedUpdates && (
        <motion.div variants={itemVariants} className="w-full">
          <SavedSearchesSection
            savedSearches={savedSearches}
            onApply={(search) => onApplySavedSearch?.(search)}
            onDelete={removeSearch}
          />
        </motion.div>
      )}

      {/* Saved Search Bar Area - Only show if we actually have items saved or if query is not empty */}
      {(savedListings.length > 0 || savedSearchQuery) && (
        <motion.div variants={itemVariants} className="w-full">
          <SavedSearchBar 
            value={savedSearchQuery}
            onChange={setSavedSearchQuery}
          />
        </motion.div>
      )}

      {/* Real Filter and Sort Controls Block - Only show if listings exist */}
      {savedListings.length > 0 && !showSavedUpdates && (
        <motion.div variants={itemVariants} className="w-full space-y-3.5">
          <SavedFilterChips 
            activeFilter={activeSavedFilter} 
            onFilterChange={setActiveSavedFilter} 
          />
          <div className="flex items-center justify-between px-1 gap-4 flex-wrap">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
              <SavedSortControl 
                value={savedSort} 
                onChange={setSavedSort} 
              />
              
              {savedView === 'list' && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsCompareMode(!isCompareMode);
                    if (isCompareMode) {
                      setSelectedCompareIds([]);
                    }
                  }}
                  className={`h-7 px-3 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 border cursor-pointer select-none transition-colors ${
                    isCompareMode
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-3xs hover:bg-emerald-500'
                      : 'bg-white hover:bg-neutral-50 border-emerald-500/20 text-emerald-700 dark:bg-stone-900 dark:hover:bg-stone-850 dark:text-emerald-400'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>{isCompareMode ? 'Done Select' : 'Compare'}</span>
                </motion.button>
              )}

              <SavedViewToggle 
                view={savedView} 
                onViewChange={setSavedView} 
              />
            </div>
            
            <span className="text-[10px] font-extrabold text-neutral-400 dark:text-stone-500 select-none uppercase tracking-wider font-mono">
              Shortlist ({sorted.length})
            </span>
          </div>
        </motion.div>
      )}

      {/* Saved Collections section - Only show if saved listings exist */}
      {savedListings.length > 0 && !showSavedUpdates && (
        <motion.div variants={itemVariants} className="w-full">
          <SavedCollections 
            activeCollection={activeCollection}
            onCollectionChange={setActiveCollection}
          />
        </motion.div>
      )}

      {/* 2. Updates entry point */}
      {!showSavedUpdates && (savedListings.length > 0 || updates.length > 0) && (
        <motion.div variants={itemVariants} className="w-full">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSavedUpdates(true)}
            className="w-full bg-white/95 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-200/50 dark:border-stone-800/40 rounded-2.5xl p-3.5 shadow-3xs flex items-center justify-between text-left cursor-pointer transition-all"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 relative">
                <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-[9px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black text-neutral-800 dark:text-neutral-50 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Saved updates</span>
                </h3>
                <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400 truncate leading-tight mt-0.5">
                  {unreadCount > 0 
                    ? `You have ${unreadCount} new update${unreadCount === 1 ? '' : 's'} to review`
                    : 'All caught up! No unread notification alerts'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 shrink-0 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider pl-3.5 border-l border-neutral-200 dark:border-stone-800">
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Dynamic List Rendering with Fallback Empty Slate Cards and Suggestions */}
      <motion.div variants={itemVariants} className="w-full space-y-5">
        {showSavedUpdates ? (
          <SavedUpdates 
            updates={updates}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onClearRead={handleClearRead}
            onBack={() => setShowSavedUpdates(false)}
          />
        ) : isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : savedListings.length === 0 ? (
          <div className="space-y-6">
            {/* 1. Full empty state component */}
            <SavedEmptyState 
              onBrowseHomes={onExploreHomes}
            />
            {/* 2. Suggested homes below empty state */}
            <SavedSuggestions 
              onSaveSuggestion={handleSaveSuggestion}
              savedIds={savedListings.map((item) => item.id)}
            />
          </div>
        ) : sorted.length === 0 ? (
          <div className="space-y-6 animate-scaleIn">
            {/* 3. Compact No-results state */}
            <div className="bg-white/60 dark:bg-stone-900/40 backdrop-blur-md rounded-2.5xl border border-dashed border-neutral-250 dark:border-neutral-800 p-6 py-8 shadow-3xs text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-stone-850 flex items-center justify-center text-neutral-400 dark:text-stone-500">
                <Search className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-neutral-800 dark:text-stone-200">
                  No saved homes found
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-stone-400 leading-relaxed max-w-[200px] mx-auto">
                  Try clearing your search or filters.
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleClearFilters}
                className="h-8.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-neutral-800 dark:text-white text-[10.5px] font-bold cursor-pointer transition-colors"
              >
                Clear search
              </motion.button>
            </div>
            {/* 4. Suggested homes below search fallback */}
            <SavedSuggestions 
              onSaveSuggestion={handleSaveSuggestion}
              savedIds={savedListings.map((item) => item.id)}
            />
          </div>
        ) : (
          <div className="space-y-5">
            {/* 5. Render list stack of Saved listing cards or interactive mock map */}
            {savedView === 'map' ? (
              <SavedMapView 
                listings={sorted} 
                onUnsave={handleUnsave}
              />
            ) : (
              <SavedHomesList 
                listings={sorted} 
                onUnsave={handleUnsave}
                isCompareMode={isCompareMode}
                selectedCompareIds={selectedCompareIds}
                onToggleCompare={handleToggleCompare}
                onSelectListing={onSelectListing}
              />
            )}
            
            {/* 6. Real dynamic house-hunting advice advice banner replacing standard placeholders */}
            <SavedHelperBanner />
          </div>
        )}
      </motion.div>

      {/* Bottom spacing helper */}
      <div className="h-6" />

      {/* Floating compare sticky selector panel */}
      {selectedCompareIds.length > 0 && (
        <SavedCompareBar 
          selectedListings={savedListings.filter((lst) => selectedCompareIds.includes(lst.id))}
          onClear={() => setSelectedCompareIds([])}
          onCompare={() => setIsCompareSheetOpen(true)}
        />
      )}

      {/* Comparison Drawer /sheet modal */}
      <SavedCompareSheet 
        isOpen={isCompareSheetOpen}
        onClose={() => setIsCompareSheetOpen(false)}
        selectedListings={savedListings.filter((lst) => selectedCompareIds.includes(lst.id))}
        onClearSelection={() => {
          setSelectedCompareIds([]);
          setIsCompareSheetOpen(false);
        }}
      />

    </motion.div>
  );
}

