import React from 'react';
import { ShieldCheck, Lightbulb, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function SavedHelperBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-emerald-50/75 dark:bg-emerald-950/15 border border-emerald-500/15 rounded-2xl p-4.5 shadow-3xs flex items-start space-x-3.5 relative overflow-hidden"
    >
      {/* Decorative colored glow on background */}
      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-xl pointer-events-none" />

      {/* Modern Lightbulb/Shield icon wrapper */}
      <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
        <Lightbulb className="w-5 h-5 stroke-[2.2]" />
      </div>

      {/* Main typography items */}
      <div className="flex-1 min-w-0 space-y-1.5 pr-2">
        <div className="flex items-center space-x-1.5">
          <span className="text-2xs font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-widest leading-none">
            Trust & Safety Tip
          </span>
          <span className="h-1 w-1 rounded-full bg-emerald-300 dark:bg-emerald-700 shrink-0"></span>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 leading-none">KejaFinder recommendation</span>
        </div>
        
        <h4 className="text-xs font-black text-neutral-800 dark:text-stone-200 tracking-tight leading-snug">
          Tip: Compare before you visit
        </h4>
        
        <p className="text-[10.5px] text-neutral-600 dark:text-stone-400 font-medium leading-relaxed max-w-[420px]">
          Check rent, deposit, location, water, and verification badge status before placing any direct calls or traveling to stages.
        </p>
      </div>

    </motion.div>
  );
}
