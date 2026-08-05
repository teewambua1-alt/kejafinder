import React from 'react';
import { MapPinned } from 'lucide-react';
import { motion } from 'motion/react';

export interface PopularLocation {
  name: string;
  count: number;
}

interface PopularLocationsProps {
  locations: PopularLocation[];
  onSelectLocation: (name: string) => void;
}

/**
 * Real client-side aggregation of already-loaded approved listings by
 * estate (computed in App.tsx, not queried again here) -- never a curated
 * or fake list. Renders nothing at all when there's no data yet, rather
 * than an empty-looking section or placeholder locations.
 */
export default function PopularLocations({ locations, onSelectLocation }: PopularLocationsProps) {
  if (locations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full flex flex-col space-y-3.5"
    >
      <div className="flex items-center space-x-2 px-0.5">
        <MapPinned className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
        <h2 className="font-display text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
          Popular locations
        </h2>
      </div>

      <div className="-mx-6 px-6 flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
        {locations.map((location, index) => (
          <motion.button
            key={location.name}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 * index }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectLocation(location.name)}
            className="flex flex-col items-start shrink-0 px-4 py-3 rounded-2xl bg-white dark:bg-stone-850 border border-neutral-100/80 dark:border-neutral-800/65 shadow-2xs hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors cursor-pointer outline-none"
          >
            <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">{location.name}</span>
            <span className="text-2xs font-semibold text-neutral-450 dark:text-stone-500 mt-0.5">
              {location.count} {location.count === 1 ? 'home' : 'homes'}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
