import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface PostAvailabilityFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function PostAvailabilityField({
  value,
  error,
  onChange,
}: PostAvailabilityFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-4 relative z-10"
      id="post-availability-container-card"
    >
      <div className="flex flex-col space-y-1.5 w-full">
        <label htmlFor="avail-date-input" className="text-[11px] font-extrabold text-neutral-705 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-450 stroke-[2]" />
            Availability Date <span className="text-emerald-700 dark:text-emerald-450">*</span>
          </span>
          <span className="text-2xs font-mono text-neutral-550 uppercase tracking-widest font-black">Step 1 of 4</span>
        </label>

        <p className="text-[10px] font-bold text-neutral-550 dark:text-stone-400 pb-1">
          When will the vacant house be ready for the new renter to move in?
        </p>

        <div className="relative flex items-center">
          {/* Custom Calendar Icon overlay  */}
          <Calendar className="absolute left-4 w-4.5 h-4.5 text-emerald-700 dark:text-emerald-500 pointer-events-none stroke-[2]" />
          
          <input
            type="date"
            id="avail-date-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? "avail-error-msg" : undefined}
            className={`w-full h-12 pl-12 pr-10 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-xs font-black text-neutral-800 dark:text-neutral-105 tracking-tight uppercase placeholder-neutral-550 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all cursor-pointer ${
              error
                ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
            }`}
          />
          
          <ChevronDown className="absolute right-4 w-4 h-4 text-neutral-550 dark:text-stone-400 pointer-events-none stroke-[2.2]" />
        </div>

        {error && (
          <span id="avail-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
            {error}
          </span>
        )}
      </div>
    </motion.div>
  );
}
