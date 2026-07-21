import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SavedSortControlProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  'Recently saved',
  'Cheapest',
  'Highest rent',
  'Verified first',
  'Recently updated'
];

export default function SavedSortControl({ value, onChange }: SavedSortControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative z-20">
      {/* Sort Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sort saved homes"
        aria-expanded={isOpen}
        className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/90 dark:bg-stone-880/90 border border-neutral-100/90 dark:border-neutral-800 shadow-3xs cursor-pointer text-xs font-semibold select-none outline-none focus:border-emerald-500/40"
      >
        <span className="text-neutral-500 dark:text-stone-400">Sort by:</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{value}</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-neutral-400 dark:text-stone-500 shrink-0 transition-transform duration-200 stroke-[2.2] ${
            isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
          }`} 
        />
      </motion.button>

      {/* Floating Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 mt-2 w-52 bg-white/95 dark:bg-stone-880/95 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-800/80 shadow-lg py-1.5 focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-bold text-neutral-700 dark:text-stone-200 hover:bg-neutral-50 dark:hover:bg-stone-800/80 transition-colors cursor-pointer select-none"
              >
                <span className={value === option ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>
                  {option}
                </span>
                
                {value === option && (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3.5]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
