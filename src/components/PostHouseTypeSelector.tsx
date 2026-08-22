import React from 'react';
import { Bed, Sofa, Home, Building, LayoutGrid, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export type PostHouseType =
  | 'single_room'
  | 'bedsitter'
  | 'studio'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'mabati_other';

interface HouseTypeOption {
  id: PostHouseType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

interface PostHouseTypeSelectorProps {
  value: PostHouseType;
  onChange: (value: PostHouseType) => void;
}

export default function PostHouseTypeSelector({ value, onChange }: PostHouseTypeSelectorProps) {
  const options: HouseTypeOption[] = [
    { id: 'single_room', label: 'Single Room', icon: Bed, iconColor: 'text-emerald-700 dark:text-emerald-450' },
    { id: 'bedsitter', label: 'Bedsitter', icon: Bed, iconColor: 'text-orange-700 dark:text-orange-400' },
    { id: 'studio', label: 'Studio', icon: Sofa, iconColor: 'text-emerald-700 dark:text-emerald-450' },
    { id: 'one_bedroom', label: '1 Bedroom', icon: Home, iconColor: 'text-emerald-700 dark:text-emerald-450' },
    { id: 'two_bedroom', label: '2 Bedroom', icon: Building, iconColor: 'text-emerald-700 dark:text-emerald-450' },
    { id: 'mabati_other', label: 'Other', icon: LayoutGrid, iconColor: 'text-emerald-700 dark:text-emerald-450' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-4 relative z-10"
      id="post-house-type-selector-card"
    >
      {/* Section Indicator and Title Container */}
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          <Home className="w-4.5 h-4.5 stroke-[2]" />
        </div>
        <div className="flex flex-col space-y-0.5">
          <div className="flex items-center space-x-1.5">
            <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
              House Type
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700"></span>
            </span>
          </div>
          <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-400">
            Select the type of property you’re listing.
          </p>
        </div>
      </div>

      {/* Touch-Friendly House Types Selectable Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {options.map((option) => {
          const isSelected = value === option.id;
          const Icon = option.icon;

          return (
            <motion.button
              key={option.id}
              type="button"
              variants={cardVariants}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(option.id)}
              aria-pressed={isSelected}
              className={`flex flex-col items-center justify-center p-3.5 h-22 rounded-2xl border text-center transition-all duration-200 cursor-pointer select-none outline-none focus:ring-1 focus:ring-emerald-500/30 ${
                isSelected
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-700 dark:border-emerald-600/85 text-emerald-800 dark:text-emerald-300 shadow-xs ring-1 ring-emerald-500/20'
                  : 'bg-white/40 dark:bg-stone-850/40 border-neutral-100 dark:border-neutral-800/65 text-neutral-600 dark:text-stone-400 hover:border-neutral-200 dark:hover:border-stone-850 hover:bg-neutral-50/30 dark:hover:bg-stone-850/20'
              }`}
            >
              {/* Dynamic Icon with highlighted circular glow on select */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-all duration-305 ${
                  isSelected
                    ? option.id === 'bedsitter'
                      ? 'bg-orange-500/10 dark:bg-orange-500/15 scale-110'
                      : 'bg-emerald-500/10 dark:bg-emerald-500/15 scale-110'
                    : 'bg-neutral-50 dark:bg-stone-800/40'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 stroke-[2] ${
                    isSelected 
                      ? option.id === 'bedsitter' 
                        ? 'text-orange-700 dark:text-orange-400' 
                        : 'text-emerald-700 dark:text-emerald-400' 
                      : option.iconColor
                  }`}
                />
              </div>

              {/* Responsive Text Label */}
              <span
                className={`text-[10px] font-bold tracking-tight select-none transition-colors leading-tight ${
                  isSelected 
                    ? option.id === 'bedsitter'
                      ? 'text-orange-700 dark:text-orange-300 font-extrabold'
                      : 'text-emerald-700 dark:text-emerald-300 font-extrabold' 
                    : 'text-neutral-500 dark:text-stone-400'
                }`}
              >
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
