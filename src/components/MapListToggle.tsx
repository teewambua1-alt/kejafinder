import React from 'react';
import { Map, List } from 'lucide-react';
import { motion } from 'motion/react';

interface MapListToggleProps {
  activeView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
}

export default function MapListToggle({ activeView, onViewChange }: MapListToggleProps) {
  return (
    <div className="flex items-center p-1 bg-white/95 dark:bg-stone-850/95 backdrop-blur-md rounded-full border border-neutral-100/90 dark:border-neutral-700/80 shadow-md">
      {/* Map Segment Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => onViewChange('map')}
        className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold border-none outline-none select-none transition-all cursor-pointer ${
          activeView === 'map'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-transparent text-neutral-500 dark:text-stone-400 hover:text-neutral-800 dark:hover:text-neutral-200'
        }`}
      >
        <Map className="w-3.5 h-3.5 stroke-[2.2]" />
        <span>Map</span>
      </motion.button>

      {/* List Segment Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => onViewChange('list')}
        className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold border-none outline-none select-none transition-all cursor-pointer ${
          activeView === 'list'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-transparent text-neutral-500 dark:text-stone-400 hover:text-neutral-800 dark:hover:text-neutral-200'
        }`}
      >
        <List className="w-3.5 h-3.5 stroke-[2.2]" />
        <span>List</span>
      </motion.button>
    </div>
  );
}
