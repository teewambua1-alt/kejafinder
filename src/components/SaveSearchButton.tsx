import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedSearches } from '../hooks/useSavedSearches';
import { SearchFilters } from './SearchFilterSheet';
import { SortOption } from './SortDropdown';

interface SaveSearchButtonProps {
  query: string;
  filters: SearchFilters;
  sort: SortOption;
  onRequireAuth?: () => void;
}

export default function SaveSearchButton({ query, filters, sort, onRequireAuth }: SaveSearchButtonProps) {
  const { user } = useAuth();
  const { saveSearch } = useSavedSearches();
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    if (!user) {
      onRequireAuth?.();
      return;
    }
    setLabel(query.trim() || 'My search');
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!label.trim()) return;
    setIsSaving(true);
    const success = await saveSearch(label.trim(), query, filters, sort);
    setIsSaving(false);
    if (success) {
      setIsOpen(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    }
  };

  return (
    <div className="relative shrink-0" ref={panelRef}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={handleOpen}
        aria-label="Save this search"
        className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-stone-850 border border-neutral-200/50 dark:border-stone-800 flex items-center justify-center text-neutral-600 dark:text-stone-300 hover:bg-neutral-150 dark:hover:bg-stone-800 transition-colors cursor-pointer outline-none"
      >
        <motion.div
          animate={justSaved ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {justSaved ? (
            <BookmarkCheck className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400 stroke-[2.2]" />
          ) : (
            <Bookmark className="w-4.5 h-4.5 stroke-[2.2]" />
          )}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white dark:bg-stone-850 border border-neutral-100 dark:border-stone-700 shadow-lg z-[var(--z-overlay)] p-3.5 origin-top-right"
          >
            <label className="text-2xs font-bold text-neutral-600 dark:text-stone-400 uppercase tracking-wider">
              Save this search
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Bedsitters in Syokimau"
              className="w-full h-9 px-3 mt-1.5 rounded-lg border border-neutral-150 dark:border-neutral-800 bg-neutral-50 dark:bg-stone-900 text-xs font-semibold text-neutral-850 dark:text-neutral-150 placeholder-neutral-550 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !label.trim()}
              className="w-full h-9 mt-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-extrabold shadow-sm transition-colors border-none cursor-pointer outline-none"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
