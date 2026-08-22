import React from 'react';
import { Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface PostTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PostTitleField({
  value,
  onChange,
}: PostTitleFieldProps) {
  const maxLength = 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-3.5 relative z-10"
      id="post-title-container-card"
    >
      <div className="flex flex-col space-y-1.5 w-full">
        <div className="flex items-center justify-between">
          <label htmlFor="title-input" className="text-[11px] font-extrabold text-neutral-705 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-450 stroke-[2]" />
            Listing title
          </label>
          <span className="text-2xs font-mono font-extrabold text-neutral-550 dark:text-stone-400">
            {value.length}/{maxLength}
          </span>
        </div>

        <input
          type="text"
          id="title-input"
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Bright bedsitter near Syokimau station"
          className="w-full h-12 px-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 text-xs font-bold text-neutral-800 dark:text-stone-105 placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:border-emerald-500/80 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-stone-900 transition-all font-sans"
        />

        <p className="text-[10px] font-bold text-neutral-550 dark:text-stone-400 pl-0.5 leading-relaxed">
          We suggest a title based on house type and town -- edit it to make your listing stand out.
        </p>
      </div>
    </motion.div>
  );
}
