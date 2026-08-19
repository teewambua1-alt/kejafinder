import React from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export interface ProfileStatItem {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface ProfileStatsProps {
  stats: ProfileStatItem[];
}

const COLOR_VARIANTS = [
  { bg: 'bg-rose-50 dark:bg-rose-950/20', text: 'text-rose-600 dark:text-rose-450', border: 'border-rose-100 dark:border-rose-900/30' },
  { bg: 'bg-teal-50 dark:bg-teal-950/20', text: 'text-teal-600 dark:text-teal-450', border: 'border-teal-100 dark:border-teal-900/30' },
  { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600 dark:text-amber-450', border: 'border-amber-100 dark:border-amber-900/30' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-600 dark:text-emerald-450', border: 'border-emerald-100 dark:border-emerald-900/30' },
  { bg: 'bg-sky-50 dark:bg-sky-950/20', text: 'text-sky-600 dark:text-sky-450', border: 'border-sky-100 dark:border-sky-900/30' },
];

// Purely presentational -- every value is real data computed by the caller
// per the signed-in account's actual role (Tenant/Landlord/Caretaker/Agent/
// Scout/Admin all show a different, real stat set here).
export default function ProfileStats({ stats }: ProfileStatsProps) {
  if (stats.length === 0) return null;

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const config = COLOR_VARIANTS[index % COLOR_VARIANTS.length];
          const IconComp = stat.icon;

          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="flex flex-col items-center justify-center text-center px-1 transition-transform"
              role="group"
              aria-label={`${stat.value} ${stat.label}`}
            >
              <div className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full ${config.bg} border ${config.border} flex items-center justify-center mb-1.5 shadow-4xs shrink-0`}>
                <IconComp className={`w-4 h-4 ${config.text} stroke-[2.2]`} />
              </div>

              <span className="text-sm sm:text-base font-black text-neutral-800 dark:text-stone-100 font-mono tracking-tight leading-none">
                {stat.value}
              </span>

              <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold text-neutral-550 dark:text-stone-450 text-center leading-tight mt-1 line-clamp-1 max-w-full">
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
