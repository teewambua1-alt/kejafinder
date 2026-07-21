import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, PhoneCall, Eye, Flag } from 'lucide-react';

interface SafetyHeroProps {
  onGoSearch?: () => void;
  onGoPost?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function SafetyHero({ 
  onGoSearch, 
  onGoPost, 
  onShowFeedback 
}: SafetyHeroProps) {
  const handleBrowse = () => {
    if (onGoSearch) {
      onGoSearch();
    } else {
      onShowFeedback("Search page coming soon.");
    }
  };

  const handlePost = () => {
    if (onGoPost) {
      onGoPost();
    } else {
      onShowFeedback("Post vacancy flow coming soon.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-6 shadow-sm relative overflow-hidden"
    >
      {/* Background tint/blob */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h2 className="text-2xl font-black text-neutral-850 dark:text-stone-100 tracking-tight leading-tight mb-2">
          Stay safe while finding your next keja
        </h2>
        
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 leading-relaxed mb-3">
          Learn how to confirm listings, avoid fake agents, and protect your money before visiting or paying.
        </p>
        
        <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400 leading-snug mb-6">
          KejaFinder helps you discover vacancies, but you should always confirm the house physically before making any payment.
        </p>

        {/* Quick Safety Stats / Pills */}
        <div className="flex flex-col space-y-3 w-full mb-6">
          <div className="flex items-center bg-neutral-50 dark:bg-stone-950 rounded-2xl p-3 border border-neutral-100 dark:border-stone-800">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 shrink-0">
              <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xs font-black text-neutral-800 dark:text-stone-200 uppercase tracking-wider mb-0.5">Confirm first</h3>
              <p className="text-[11px] font-semibold text-neutral-500 dark:text-stone-400 leading-tight">Call or WhatsApp before visiting.</p>
            </div>
          </div>

          <div className="flex items-center bg-neutral-50 dark:bg-stone-950 rounded-2xl p-3 border border-neutral-100 dark:border-stone-800">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 shrink-0">
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xs font-black text-neutral-800 dark:text-stone-200 uppercase tracking-wider mb-0.5">View physically</h3>
              <p className="text-[11px] font-semibold text-neutral-500 dark:text-stone-400 leading-tight">See the house before paying.</p>
            </div>
          </div>

          <div className="flex items-center bg-neutral-50 dark:bg-stone-950 rounded-2xl p-3 border border-neutral-100 dark:border-stone-800">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 shrink-0">
              <Flag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xs font-black text-neutral-800 dark:text-stone-200 uppercase tracking-wider mb-0.5">Report scams</h3>
              <p className="text-[11px] font-semibold text-neutral-500 dark:text-stone-400 leading-tight">Flag fake or outdated listings.</p>
            </div>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-col space-y-3 w-full">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleBrowse}
            className="w-full bg-emerald-600 dark:bg-emerald-500 text-white rounded-2xl py-3.5 px-4 shadow-md hover:shadow-lg transition-all font-black uppercase text-[12px] tracking-wider"
            aria-label="Browse homes safely"
          >
            Browse homes safely
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePost}
            className="w-full bg-neutral-100 dark:bg-stone-800 text-neutral-700 dark:text-stone-300 border border-neutral-200 dark:border-stone-700 rounded-2xl py-3.5 px-4 font-black uppercase text-[12px] tracking-wider hover:bg-neutral-200 dark:hover:bg-stone-700 transition-colors"
            aria-label="Post a vacancy safely"
          >
            Post a vacancy safely
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
