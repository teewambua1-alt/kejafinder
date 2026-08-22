import React from 'react';
import { motion } from 'motion/react';
import { useMotion } from '../lib/motion';

export interface PopularLocation {
  name: string;
  count: number;
}

interface PopularLocationsProps {
  locations: PopularLocation[];
  onSelectLocation: (name: string) => void;
}

/** Shown at most this many. Six pills read as a filter row; four read as shortcuts. */
const MAX_SHOWN = 4;

/**
 * Real aggregation of already-loaded approved listings by estate (computed in
 * App.tsx, not queried again here) -- never a curated or fake list. Renders
 * nothing when there is no data, rather than an empty-looking section.
 *
 * Kept on the home screen when the filter controls were removed, because this
 * is a shortcut *to* homes rather than configuration the user has to set up
 * first. Trimmed and quietened so it reads that way: no section icon, no card
 * chrome, and a cap of four.
 */
export default function PopularLocations({ locations, onSelectLocation }: PopularLocationsProps) {
  const m = useMotion();
  if (locations.length === 0) return null;

  const shown = locations.slice(0, MAX_SHOWN);

  return (
    <section className="w-full flex flex-col gap-3" aria-labelledby="popular-locations-heading">
      <h2
        id="popular-locations-heading"
        className="text-[11px] font-black uppercase tracking-widest text-neutral-550 dark:text-stone-400 px-0.5"
      >
        Browse by area
      </h2>

      <div className="flex flex-wrap gap-2">
        {shown.map((location) => (
          <motion.button
            key={location.name}
            whileTap={m.tap}
            onClick={() => onSelectLocation(location.name)}
            className="inline-flex items-baseline gap-1.5 px-3.5 h-10 rounded-full bg-white dark:bg-stone-900 border border-neutral-150 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-900/60 transition-colors cursor-pointer outline-none"
          >
            <span className="text-xs font-bold text-neutral-800 dark:text-stone-100">
              {location.name}
            </span>
            <span className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 tabular-nums">
              {location.count}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
