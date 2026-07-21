import React from 'react';
import { motion } from 'motion/react';
import { Heart, Eye, MessageSquare, Home } from 'lucide-react';
import { profileStats } from '../data/profileData';

export default function ProfileStats() {
  // Map types to corresponding icon and visual styles
  const getStatConfig = (type: string) => {
    switch (type) {
      case 'saved':
        return {
          icon: Heart,
          bgColor: 'bg-rose-50 dark:bg-rose-950/20',
          textColor: 'text-rose-600 dark:text-rose-450',
          borderColor: 'border-rose-100 dark:border-rose-900/30'
        };
      case 'viewed':
        return {
          icon: Eye,
          bgColor: 'bg-teal-50 dark:bg-teal-950/20',
          textColor: 'text-teal-600 dark:text-teal-450',
          borderColor: 'border-teal-100 dark:border-teal-900/30'
        };
      case 'inquiries':
        return {
          icon: MessageSquare,
          bgColor: 'bg-amber-50 dark:bg-amber-950/20',
          textColor: 'text-amber-600 dark:text-amber-450',
          borderColor: 'border-amber-100 dark:border-amber-900/30'
        };
      case 'posted':
      default:
        return {
          icon: Home,
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
          textColor: 'text-emerald-600 dark:text-emerald-450',
          borderColor: 'border-emerald-100 dark:border-emerald-900/30'
        };
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl p-4 sm:p-4.5 shadow-3xs hover:shadow-2xs transition-shadow"
      id="profile-stats-widget"
    >
      <div className="grid grid-cols-4 divide-x divide-neutral-200/30 dark:divide-stone-800/65">
        {profileStats.map((stat) => {
          const config = getStatConfig(stat.type);
          const IconComp = config.icon;

          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="flex flex-col items-center justify-center text-center px-1 transition-transform"
              role="group"
              aria-label={`${stat.value} ${stat.label}`}
            >
              {/* Icon Badge circle */}
              <div className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center mb-1.5 shadow-4xs shrink-0`}>
                <IconComp className={`w-4 h-4 ${config.textColor} stroke-[2.2]`} />
              </div>

              {/* Stat numerical value */}
              <span className="text-sm sm:text-base font-black text-neutral-800 dark:text-stone-100 font-mono tracking-tight leading-none">
                {stat.value}
              </span>

              {/* Friendly short descriptive label */}
              <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold text-neutral-450 dark:text-stone-450 text-center leading-tight mt-1 line-clamp-1 max-w-full">
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
