import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type SortOption =
  | 'Most relevant'
  | 'Newest'
  | 'Cheapest'
  | 'Verified first'
  | 'Recently updated'
  | 'Most viewed'
  | 'Nearest';

export interface SortDropdownProps {
  selected?: SortOption;
  onChange?: (option: SortOption) => void;
}

export default function SortDropdown({ selected: propSelected, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState<SortOption>('Most relevant');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = propSelected !== undefined ? propSelected : localSelected;

  const options: SortOption[] = [
    'Most relevant',
    'Nearest',
    'Newest',
    'Cheapest',
    'Verified first',
    'Recently updated',
    'Most viewed',
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Move focus onto the selected (or first) option as soon as the menu opens
  useEffect(() => {
    if (!isOpen) return;
    const selectedIndex = options.findIndex((o) => o === selected);
    optionRefs.current[selectedIndex >= 0 ? selectedIndex : 0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSelect = (option: SortOption) => {
    if (onChange) {
      onChange(option);
    } else {
      setLocalSelected(option);
    }
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const currentIndex = optionRefs.current.findIndex((el) => el === document.activeElement);
    const delta = e.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = currentIndex === -1
      ? 0
      : (currentIndex + delta + options.length) % options.length;
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        ref={triggerRef}
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sort search results"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center space-x-1.5 text-xs font-semibold select-none outline-none border-none bg-transparent cursor-pointer p-1"
      >
        <span className="text-neutral-500 dark:text-stone-400 font-medium">Sort by:</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold transition-colors">
          {selected}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 stroke-[2.2] text-emerald-700 dark:text-emerald-450 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      {/* Dropdown Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-stone-850 border border-neutral-100 dark:border-stone-700 shadow-lg z-[var(--z-overlay)] py-1 origin-top-right focus:outline-none"
            role="listbox"
            onKeyDown={handleMenuKeyDown}
          >
            {options.map((option, index) => (
              <button
                key={option}
                ref={(el) => { optionRefs.current[index] = el; }}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={selected === option}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-none outline-none cursor-pointer transition-colors ${
                  selected === option
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-transparent text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-800'
                }`}
              >
                <span>{option}</span>
                {selected === option && (
                  <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
