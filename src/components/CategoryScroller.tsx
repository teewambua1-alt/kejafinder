import React from 'react';
import { LayoutGrid, Bed, BedSingle, Sofa, Home, Building2, House } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryItem {
  id: string;
  name: string;
  // Use specific React component type for Lucide icon
  icon: React.ComponentType<{ className?: string }>;
  isOrange?: boolean;
}

interface CategoryScrollerProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryScroller({ selectedCategory, onCategoryChange }: CategoryScrollerProps) {
  const categories: CategoryItem[] = [
    { id: 'all', name: 'All', icon: LayoutGrid },
    { id: 'single_room', name: 'Single Room', icon: Bed },
    { id: 'bedsitter', name: 'Bedsitter', icon: BedSingle, isOrange: true },
    { id: 'studio', name: 'Studio', icon: Sofa },
    { id: 'one_bedroom', name: '1 Bedroom', icon: Home },
    { id: 'two_bedroom', name: '2 Bedroom', icon: Building2 },
    { id: 'mabati', name: 'Mabati', icon: House },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.25 }}
      className="w-full flex flex-col space-y-3 pt-1"
    >
      {/* Category Horizontal Container */}
      <div className="-mx-6 px-6 flex items-center space-x-3.5 overflow-x-auto no-scrollbar py-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isActive = selectedCategory === category.id;
          
          // Determine icon color based on selection status and special bedsitter orange theme
          let iconColorClass = 'text-emerald-500';
          if (category.isOrange) {
            iconColorClass = isActive ? 'text-orange-500' : 'text-orange-400';
          } else if (isActive) {
            iconColorClass = 'text-emerald-600';
          }

          return (
            <motion.button
              key={category.id}
              id={`category-btn-${category.id}`}
              aria-pressed={isActive}
              whileTap={{ scale: 0.96 }}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col items-center justify-between p-3.5 w-[76px] h-[82px] rounded-2xl border cursor-pointer select-none outline-none transition-all duration-200 shrink-0 ${
                isActive 
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500/80 dark:border-emerald-600/75 shadow-xs' 
                  : 'bg-white dark:bg-stone-800/85 border-neutral-100 dark:border-neutral-700/60 shadow-2xs hover:border-neutral-200 dark:hover:border-neutral-600'
              }`}
            >
              {/* Centered Icon Container with visual backdrop */}
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? category.isOrange ? 'bg-orange-50 dark:bg-orange-950/40' : 'bg-emerald-100/50 dark:bg-emerald-900/10'
                  : 'bg-neutral-50 dark:bg-stone-900'
              }`}>
                <IconComponent className={`w-5 h-5 stroke-[2] ${iconColorClass}`} />
              </div>

              {/* Category Small Label */}
              <span className={`text-[10px] font-bold text-center truncate w-full transition-colors ${
                isActive 
                  ? 'text-neutral-900 dark:text-neutral-50 font-extrabold' 
                  : 'text-neutral-500 dark:text-neutral-400 font-medium'
              }`}>
                {category.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
