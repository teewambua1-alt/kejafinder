import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface NotificationSafetyCardProps {
  onViewSafetyTips: () => void;
  onDismiss: () => void;
}

export default function NotificationSafetyCard({
  onViewSafetyTips,
  onDismiss
}: NotificationSafetyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full rounded-2.5xl p-5 border border-orange-500/25 bg-gradient-to-br from-orange-500/[0.03] to-white dark:from-orange-500/[0.015] dark:to-stone-900 shadow-3xs flex flex-col space-y-4"
    >
      <div className="flex items-start space-x-3.5">
        {/* Warm orange icon badge */}
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-orange-550/10 border border-orange-550/20 text-orange-650 dark:text-orange-400 shrink-0">
          <AlertTriangle className="w-5.25 h-5.25 stroke-[2.2]" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Tag heading label */}
          <span className="block text-[9.5px] font-black text-orange-650 dark:text-orange-400 uppercase tracking-widest leading-none">
            Safety reminder
          </span>

          {/* Exact mandatory warning text */}
          <h3 className="text-xs.2 font-black text-neutral-850 dark:text-neutral-100 uppercase tracking-tight leading-snug mt-1.5 font-sans">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </h3>

          {/* Subtext and instructions */}
          <p className="text-[11px] text-neutral-550 dark:text-stone-400 font-medium leading-relaxed mt-1.5 font-sans">
            Use Call or WhatsApp to confirm availability, directions, and caretaker details before visiting.
          </p>
        </div>
      </div>

      {/* Button CTAs panel */}
      <div className="flex items-center space-x-2 pl-1">
        {/* Primary safety action */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onViewSafetyTips}
          aria-label="View safety tips"
          className="py-1.5 px-4 rounded-xl text-[10.5px] font-extrabold uppercase tracking-wide bg-emerald-600 hover:bg-emerald-650 text-white shadow-3xs cursor-pointer outline-none transition-all"
        >
          View safety tips
        </motion.button>

        {/* Dismiss trigger */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onDismiss}
          aria-label="Dismiss safety reminder"
          className="py-1.5 px-4 rounded-xl text-[10.5px] font-extrabold uppercase tracking-wide text-neutral-450 dark:text-stone-400 hover:bg-neutral-150/40 dark:hover:bg-stone-850/40 border border-transparent hover:border-neutral-200/50 dark:hover:border-stone-800/30 cursor-pointer outline-none transition-all"
        >
          Dismiss
        </motion.button>
      </div>
    </motion.div>
  );
}
