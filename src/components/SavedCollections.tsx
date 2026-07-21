import React from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  Bus, 
  ShieldCheck, 
  CalendarDays,
  Sparkles
} from 'lucide-react';

interface CollectionOption {
  id: string;
  title: string;
  description: string;
  countLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  highlighted?: boolean;
}

interface SavedCollectionsProps {
  activeCollection: string | null;
  onCollectionChange: (id: string | null) => void;
}

const COLLECTIONS: CollectionOption[] = [
  {
    id: 'budget_picks',
    title: 'Budget Picks',
    description: 'Homes under KSh 10,000',
    countLabel: '3 homes',
    icon: Wallet,
    highlighted: true // Highlight design for budget-conscious Kenyan tenants
  },
  {
    id: 'near_transport',
    title: 'Near Transport',
    description: 'Close to stage or main road',
    countLabel: '4 homes',
    icon: Bus
  },
  {
    id: 'verified_homes',
    title: 'Verified Homes',
    description: 'Listings with trust badges',
    countLabel: '5 homes',
    icon: ShieldCheck
  },
  {
    id: 'move_this_month',
    title: 'Move This Month',
    description: 'Available soon or updated',
    countLabel: '2 homes',
    icon: CalendarDays
  }
];

export default function SavedCollections({ activeCollection, onCollectionChange }: SavedCollectionsProps) {
  const handleTap = (id: string) => {
    // Tapping the active collection again clears it
    if (activeCollection === id) {
      onCollectionChange(null);
    } else {
      onCollectionChange(id);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-3 pt-1 select-none">
      
      {/* Title & Subtitle row */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h3 className="text-[13.5px] font-black text-neutral-800 dark:text-neutral-50 tracking-tight font-sans">
            Collections
          </h3>
          <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400">
            Organize homes by budget, area, or move-in plan.
          </p>
        </div>
        
        {activeCollection && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onCollectionChange(null)}
            className="text-[9.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md cursor-pointer hover:bg-emerald-500/20 transition-colors"
          >
            Clear Active
          </motion.button>
        )}
      </div>

      {/* Horizontal Scroll Track */}
      <div className="w-full overflow-x-auto no-scrollbar pb-1 -mb-1 flex items-stretch space-x-3 scroll-smooth px-0.5">
        {COLLECTIONS.map((col) => {
          const IconComponent = col.icon;
          const isActive = activeCollection === col.id;

          return (
            <motion.button
              key={col.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTap(col.id)}
              aria-pressed={isActive}
              aria-label={`Open ${col.title} collection`}
              className={`w-[190px] xs:w-[210px] flex-shrink-0 text-left p-3.5 rounded-2.5xl transition-all border outline-none select-none relative flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-500/70 text-emerald-950 dark:text-white shadow-xs'
                  : col.highlighted
                    ? 'bg-gradient-to-br from-amber-50/40 to-white dark:from-stone-900/30 dark:to-stone-900/90 border-amber-500/20 dark:border-amber-500/10 shadow-3xs hover:border-amber-500/20'
                    : 'bg-white/95 dark:bg-stone-900/90 border-neutral-100/90 dark:border-neutral-800/80 shadow-3xs hover:border-neutral-200 dark:hover:border-neutral-700'
              }`}
            >
              <div className="space-y-2 w-full">
                {/* Icon Wrapper Row */}
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-3xs'
                      : col.highlighted
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <IconComponent className="w-4 h-4 stroke-[2.2]" />
                  </div>

                  {/* Top-right notification stars or details */}
                  {col.highlighted && !isActive && (
                    <span className="flex items-center space-x-0.5 text-[8px] font-black uppercase text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-500 fill-amber-500" />
                      <span>Worth saving</span>
                    </span>
                  )}
                </div>

                {/* Primary Labels */}
                <div className="space-y-0.5 pt-1.5">
                  <span className={`block text-xs font-black tracking-tight ${
                    isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-neutral-800 dark:text-stone-100'
                  }`}>
                    {col.title}
                  </span>
                  
                  <span className="block text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-snug">
                    {col.description}
                  </span>
                </div>
              </div>

              {/* Bottom pill counter */}
              <div className="mt-3.5 flex items-center justify-between">
                <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isActive 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-neutral-100 dark:bg-stone-850 text-neutral-500 dark:text-stone-400 font-mono'
                }`}>
                  {col.countLabel}
                </span>
                
                {isActive && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black flex items-center space-x-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Active</span>
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
