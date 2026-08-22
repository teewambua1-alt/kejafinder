import React from 'react';
import { motion } from 'motion/react';
import { List, Map } from 'lucide-react';

interface SavedViewToggleProps {
  view: 'list' | 'map';
  onViewChange: (view: 'list' | 'map') => void;
}

export default function SavedViewToggle({ view, onViewChange }: SavedViewToggleProps) {
  return (
    <div className="flex bg-neutral-100 dark:bg-stone-850 p-1 rounded-full relative items-center justify-between w-[155px] select-none h-8">
      {/* Sliding indicator */}
      <div className="absolute inset-y-1 left-1 w-[calc(50%-4px)] flex rounded-full overflow-hidden">
        <motion.div
          layout
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-full h-full bg-emerald-700 rounded-full"
          style={{
            x: view === 'map' ? '100%' : '0%',
            transform: view === 'map' ? 'translateX(8px)' : 'translateX(0px)'
          }}
        />
      </div>

      <button
        onClick={() => onViewChange('list')}
        aria-pressed={view === 'list'}
        aria-label="Switch to list view"
        className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-full relative z-10 transition-colors cursor-pointer border-none outline-none ${
          view === 'list'
            ? 'text-white'
            : 'text-neutral-600 dark:text-stone-300 hover:text-neutral-800'
        }`}
      >
        <List className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>List</span>
      </button>

      <button
        onClick={() => onViewChange('map')}
        aria-pressed={view === 'map'}
        aria-label="Switch to map view"
        className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-full relative z-10 transition-colors cursor-pointer border-none outline-none ${
          view === 'map'
            ? 'text-white'
            : 'text-neutral-600 dark:text-stone-300 hover:text-neutral-800'
        }`}
      >
        <Map className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Map</span>
      </button>
    </div>
  );
}
