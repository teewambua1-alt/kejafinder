import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { ListingType } from '../types/listing';

export type SearchFilters = {
  houseTypes: ListingType[];
  minRent: number | "";
  maxRent: number | "";
  minDeposit: number | "";
  maxDeposit: number | "";
  availableNow: boolean;
  verifiedOnly: boolean;
  amenities: string[];
  localDetails: string[];
};

export const defaultSearchFilters: SearchFilters = {
  houseTypes: [],
  minRent: "",
  maxRent: "",
  minDeposit: "",
  maxDeposit: "",
  availableNow: false,
  verifiedOnly: false,
  amenities: [],
  localDetails: []
};

interface SearchFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (updatedFilters: SearchFilters) => void;
  onClear: () => void;
}

export default function SearchFilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
  onClear
}: SearchFilterSheetProps) {
  // Use a draft state so edits are committed only on Apply click
  const [draft, setDraft] = useState<SearchFilters>({ ...filters });

  // Reset draft whenever filters or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setDraft({ ...filters });
    }
  }, [isOpen, filters]);

  const toggleHouseType = (type: ListingType) => {
    setDraft((prev) => {
      const isSelected = prev.houseTypes.includes(type);
      const houseTypes = isSelected
        ? prev.houseTypes.filter((t) => t !== type)
        : [...prev.houseTypes, type];
      return { ...prev, houseTypes };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setDraft((prev) => {
      const isSelected = prev.amenities.includes(amenity);
      const amenities = isSelected
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const toggleLocalDetail = (detail: string) => {
    setDraft((prev) => {
      const isSelected = prev.localDetails.includes(detail);
      const localDetails = isSelected
        ? prev.localDetails.filter((d) => d !== detail)
        : [...prev.localDetails, detail];
      return { ...prev, localDetails };
    });
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    onClear();
    setDraft({ ...defaultSearchFilters });
  };

  // Prevent background clicks from closing when clicking sheet panel itself
  const handleSheetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const houseTypeOptions: { value: ListingType; label: string }[] = [
    { value: 'single_room', label: 'Single Room' },
    { value: 'bedsitter', label: 'Bedsitter' },
    { value: 'studio', label: 'Studio' },
    { value: 'one_bedroom', label: '1 Bedroom' },
    { value: 'two_bedroom', label: '2 Bedroom' },
    { value: 'mabati', label: 'Mabati' }
  ];

  const amenityOptions = [
    'Water',
    'Token electricity',
    'Private toilet',
    'Shared toilet',
    'Private bathroom',
    'Shared bathroom',
    'Parking'
  ];

  const localDetailOptions = [
    'Near main road',
    'Near stage',
    'school',
    'Secure gate'
  ];

  // Helper labels for local detail pills mapping to user-friendly text
  const getLocalDetailLabel = (detail: string) => {
    switch (detail) {
      case 'Near main road':
        return 'Near main road';
      case 'Near stage':
        return 'Near bus stage';
      case 'school':
        return 'Near school';
      case 'Secure gate':
        return 'Secure gate';
      default:
        return detail;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 pointer-events-auto"
            aria-hidden="true"
          />

          {/* Bottom Sheet main panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            onClick={handleSheetClick}
            className="absolute inset-x-0 bottom-0 max-h-[82%] bg-white dark:bg-stone-900 rounded-t-3xl border-t border-neutral-100 dark:border-neutral-800 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] flex flex-col z-50 pointer-events-auto overflow-hidden animate-none font-sans"
          >
            {/* Drag Handle & Header block */}
            <div className="shrink-0 text-center pb-2 pt-3">
              <div className="w-12 h-1 bg-neutral-200 dark:bg-neutral-700/80 rounded-full mx-auto" />
              
              <div className="flex items-center justify-between px-6 mt-3">
                <h2 className="text-[17px] font-extrabold text-[#111] dark:text-neutral-50 tracking-tight">
                  Filter vacancies
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filters"
                  className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-850 hover:bg-neutral-100 dark:hover:bg-stone-800 flex items-center justify-center transition-colors border-none cursor-pointer outline-none"
                >
                  <X className="w-4 h-4 text-neutral-500 dark:text-neutral-400 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Scrollable filters body list content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 no-scrollbar pb-24">
              
              {/* Section A: House Type pills row */}
              <div className="space-y-2.5">
                <h3 className="text-[12px] font-bold text-neutral-500 dark:text-stone-400 uppercase tracking-wider">
                  House Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {houseTypeOptions.map((opt) => {
                    const isSelected = draft.houseTypes.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleHouseType(opt.value)}
                        className={`px-3.5 h-[34px] rounded-xl text-xs font-semibold border cursor-pointer select-none outline-none transition-all ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-neutral-800 text-neutral-750 dark:text-neutral-300 hover:border-neutral-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section B: Rent Range outputs inputs */}
              <div className="space-y-2.5">
                <h3 className="text-[12px] font-bold text-neutral-500 dark:text-stone-400 uppercase tracking-wider">
                  Rent Range (KSh /month)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-neutral-400 dark:text-stone-500">Min Rent</label>
                    <input
                      type="number"
                      placeholder="3,000"
                      value={draft.minRent}
                      onChange={(e) => setDraft({ ...draft, minRent: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50 dark:bg-stone-850 text-xs font-semibold text-neutral-850 dark:text-neutral-150 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-neutral-400 dark:text-stone-500">Max Rent</label>
                    <input
                      type="number"
                      placeholder="20,000"
                      value={draft.maxRent}
                      onChange={(e) => setDraft({ ...draft, maxRent: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50 dark:bg-stone-850 text-xs font-semibold text-neutral-850 dark:text-neutral-150 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section C: Deposit Range inputs */}
              <div className="space-y-2.5">
                <h3 className="text-[12px] font-bold text-neutral-500 dark:text-stone-400 uppercase tracking-wider">
                  Deposit Range (KSh)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-neutral-400 dark:text-stone-500">Min Deposit</label>
                    <input
                      type="number"
                      placeholder="1,500"
                      value={draft.minDeposit}
                      onChange={(e) => setDraft({ ...draft, minDeposit: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50 dark:bg-stone-850 text-xs font-semibold text-neutral-850 dark:text-neutral-150 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-neutral-400 dark:text-stone-500">Max Deposit</label>
                    <input
                      type="number"
                      placeholder="15,000"
                      value={draft.maxDeposit}
                      onChange={(e) => setDraft({ ...draft, maxDeposit: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50 dark:bg-stone-850 text-xs font-semibold text-neutral-850 dark:text-neutral-150 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section D: Quick Flags Filter Toggle row */}
              <div className="space-y-2.5">
                <h3 className="text-[12px] font-bold text-neutral-500 dark:text-stone-400 uppercase tracking-wider">
                  Quick Filters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {/* Available Now pill */}
                  <button
                    type="button"
                    aria-pressed={draft.availableNow}
                    onClick={() => setDraft({ ...draft, availableNow: !draft.availableNow })}
                    className={`px-3.5 h-[34px] rounded-xl text-xs font-semibold border cursor-pointer select-none outline-none transition-all ${
                      draft.availableNow
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-neutral-800 text-neutral-750 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    Available Now
                  </button>

                  {/* Verified Only pill */}
                  <button
                    type="button"
                    aria-pressed={draft.verifiedOnly}
                    onClick={() => setDraft({ ...draft, verifiedOnly: !draft.verifiedOnly })}
                    className={`px-3.5 h-[34px] rounded-xl text-xs font-semibold border cursor-pointer select-none outline-none transition-all ${
                      draft.verifiedOnly
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-neutral-800 text-neutral-750 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    Verified Only
                  </button>

                  {/* No Agent Fee pill */}
                  <button
                    type="button"
                    aria-pressed={draft.localDetails.includes('No Agent Fee')}
                    onClick={() => {
                      const isSelected = draft.localDetails.includes('No Agent Fee');
                      const localDetails = isSelected
                        ? draft.localDetails.filter((d) => d !== 'No Agent Fee')
                        : [...draft.localDetails, 'No Agent Fee'];
                      setDraft({ ...draft, localDetails });
                    }}
                    className={`px-3.5 h-[34px] rounded-xl text-xs font-semibold border cursor-pointer select-none outline-none transition-all ${
                      draft.localDetails.includes('No Agent Fee')
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-neutral-800 text-neutral-750 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    No Agent Fee
                  </button>

                  {/* Recently Updated pill */}
                  <button
                    type="button"
                    aria-pressed={draft.localDetails.includes('Recently Updated')}
                    onClick={() => {
                      const isSelected = draft.localDetails.includes('Recently Updated');
                      const localDetails = isSelected
                        ? draft.localDetails.filter((d) => d !== 'Recently Updated')
                        : [...draft.localDetails, 'Recently Updated'];
                      setDraft({ ...draft, localDetails });
                    }}
                    className={`px-3.5 h-[34px] rounded-xl text-xs font-semibold border cursor-pointer select-none outline-none transition-all ${
                      draft.localDetails.includes('Recently Updated')
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-neutral-800 text-neutral-750 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    Recently Updated
                  </button>
                </div>
              </div>

              {/* Section E: Amenities checkboxes toggle list */}
              <div className="space-y-2.5">
                <h3 className="text-[12px] font-bold text-neutral-500 dark:text-stone-400 uppercase tracking-wider">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map((amenity) => {
                    const isSelected = draft.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3.5 h-[34px] rounded-xl text-xs font-semibold border cursor-pointer select-none outline-none transition-all ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-neutral-800 text-neutral-750 dark:text-neutral-300 hover:border-neutral-300'
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section F: Local details toggles list */}
              <div className="space-y-2.5">
                <h3 className="text-[12px] font-bold text-neutral-500 dark:text-stone-400 uppercase tracking-wider">
                  Local Details
                </h3>
                <div className="flex flex-wrap gap-2">
                  {localDetailOptions.map((detail) => {
                    const isSelected = draft.localDetails.includes(detail);
                    return (
                      <button
                        key={detail}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleLocalDetail(detail)}
                        className={`px-3.5 h-[34px] rounded-xl text-xs font-semibold border cursor-pointer select-none outline-none transition-all ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-neutral-800 text-neutral-750 dark:text-neutral-300 hover:border-neutral-300'
                        }`}
                      >
                        {getLocalDetailLabel(detail)}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom sticky action bar with safe area padding */}
            <div className="shrink-0 bg-white/95 dark:bg-stone-900/95 border-t border-neutral-100 dark:border-neutral-800 px-6 py-4 flex items-center justify-between gap-4 pb-[env(safe-area-inset-bottom,20px)]">
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear filters"
                className="w-1/3 h-[42px] rounded-xl bg-neutral-100 hover:bg-neutral-150 dark:bg-stone-850 dark:hover:bg-stone-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-colors border-none cursor-pointer outline-none"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={handleApply}
                aria-label="Apply filters"
                className="flex-1 h-[42px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm transition-colors border-none cursor-pointer outline-none flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply filters</span>
              </button>
            </div>

          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
