import React from 'react';
import { AlignLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface PostDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PostDescriptionField({
  value,
  onChange,
}: PostDescriptionFieldProps) {
  const maxLength = 500;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-3.5 relative z-10"
      id="post-description-container-card"
    >
      <div className="flex flex-col space-y-1.5 w-full">
        {/* Label and Character Limit Header */}
        <div className="flex items-center justify-between">
          <label htmlFor="description-input" className="text-[11px] font-extrabold text-neutral-705 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-450 stroke-[2]" />
            Description
          </label>
          <span className="text-2xs font-mono font-extrabold text-neutral-550 dark:text-stone-400">
            {value.length}/{maxLength} characters
          </span>
        </div>

        {/* Text Area Input */}
        <div className="relative">
          <textarea
            id="description-input"
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe the house, features, and any important details (e.g. proximity to road, tiled floors, borehole water availability)..."
            rows={4}
            className="w-full p-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 text-xs font-semibold text-neutral-800 dark:text-neutral-150 leading-relaxed placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:border-emerald-500/80 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-stone-900 transition-all resize-none"
          />
        </div>

        {/* Informative Hint */}
        <p className="text-[10px] font-bold text-neutral-550 dark:text-stone-400 pl-0.5 leading-relaxed">
          Briefly highlight security, payment terms, or neighborhood context to secure prospective tenets quickly.
        </p>
      </div>
    </motion.div>
  );
}
