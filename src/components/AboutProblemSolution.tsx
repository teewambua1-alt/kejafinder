import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen,
  ArrowDownCircle,
  TrendingUp,
  X,
  Check
} from 'lucide-react';

interface AboutProblemSolutionProps {
  onGoSearch?: () => void;
  onGoSafety?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function AboutProblemSolution({ onGoSearch, onGoSafety, onShowFeedback }: AboutProblemSolutionProps) {
  
  const problemPoints = [
    "Travel to the area before knowing what is available",
    "Walk around different plots under the hot sun",
    "Ask random caretakers, neighbours, and shopkeepers",
    "Look for hand-written ‘room vacant’ papers on gates or walls",
    "Call random numbers matching unknown identities",
    "Waste valuable fare, time, and daily energy",
    "Risk paying fake agents or visiting outdated listings"
  ];

  const solutionPoints = [
    "Open KejaFinder anytime on phone or desktop",
    "Search by area, budget, room type, and availability",
    "View actual photos, rent, deposit breakdown, and amenities",
    "Compare local details and landmarks before travelling",
    "Call or WhatsApp the trusted caretaker or landlord directly",
    "Visit the house physically before committing to any payment",
    "Save favorite listings or report fake ones to help the community"
  ];

  const comparisonBefore = [
    "Walk first, hope later",
    "Guess vacant rooms",
    "Hidden fees or unclear rent",
    "Random unknown contacts",
    "Outdated paper gate posters"
  ];

  const comparisonAfter = [
    "Search first, visit informed",
    "Live availability updates",
    "Upfront rent & deposit costs",
    "Direct verified contact option",
    "Real-time list reviews & tags"
  ];

  const handleSearchAction = () => {
    if (onGoSearch) {
      onGoSearch();
    } else {
      onShowFeedback("Search page coming soon.");
    }
  };

  const handleSafetyAction = () => {
    if (onGoSafety) {
      onGoSafety();
    } else {
      onShowFeedback("Safety page available from Profile Settings.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* 1. Section Header Title Area */}
      <motion.div variants={itemVariants} className="space-y-1.5 border-t border-neutral-200/40 dark:border-stone-800/40 pt-6">
        <h3 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
          Problem &amp; Solution
        </h3>
        <h2 className="text-lg font-black text-neutral-900 dark:text-stone-100 uppercase tracking-tight">
          The problem we&apos;re solving
        </h2>
        <p className="text-[12px] font-bold text-neutral-600 dark:text-stone-300 leading-snug">
          Finding an affordable room should not mean wasting the whole day walking from plot to plot.
        </p>
        <p className="text-[11px] font-semibold text-neutral-550 dark:text-stone-450 leading-relaxed">
          KejaFinder turns local vacancy searching into a faster, clearer, and safer digital flow.
        </p>
      </motion.div>

      {/* 2. Manual Search Problem Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5 shadow-3xs space-y-3.5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 dark:bg-orange-500/[0.02] rounded-bl-full pointer-events-none" />
        
        <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-500">
          <AlertCircle className="w-5 h-5 shrink-0 stroke-[2.2]" />
          <h3 className="text-[12px] font-black uppercase tracking-wider">
            Today, finding a keja is too manual
          </h3>
        </div>

        <ul className="space-y-2" role="list">
          {problemPoints.map((point, index) => (
            <li key={index} className="flex items-start space-x-2" role="listitem">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-700 dark:bg-orange-600 shrink-0 mt-1.5" />
              <span className="text-[11px] font-semibold text-neutral-605 dark:text-stone-400 leading-snug">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* 3. KejaFinder Solution Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5 shadow-3xs space-y-3.5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/[0.02] rounded-bl-full pointer-events-none" />

        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0 stroke-[2.2]" />
          <h3 className="text-[12px] font-black uppercase tracking-wider">
            With KejaFinder, the search starts online
          </h3>
        </div>

        <ul className="space-y-2" role="list">
          {solutionPoints.map((point, index) => (
            <li key={index} className="flex items-start space-x-2" role="listitem">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-450 shrink-0 mt-1.5" />
              <span className="text-[11px] font-semibold text-neutral-605 dark:text-stone-400 leading-snug">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* 4. Before vs After Comparison */}
      <motion.div
        variants={itemVariants}
        className="bg-neutral-50/50 dark:bg-stone-900/20 border border-neutral-200 dark:border-stone-800/40 rounded-3xl p-4.5 space-y-3"
      >
        <span className="text-[10px] font-black text-neutral-550 dark:text-stone-400 uppercase tracking-widest block text-center sm:text-left">
          Quick Comparison
        </span>

        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Before Column */}
            <div className="bg-orange-500/[0.03] dark:bg-orange-500/[0.01] border border-orange-500/10 dark:border-orange-900/15 rounded-2xl p-3.5 space-y-2">
              <span className="flex items-center gap-1 text-[10px] font-black text-orange-700 dark:text-orange-500 uppercase tracking-wider">
                <AlertCircle className="w-3 h-3 stroke-[2.2] shrink-0" aria-hidden="true" />
                Before KejaFinder
              </span>
              <ul className="space-y-1.5 text-[10.5px] font-semibold text-neutral-510 dark:text-stone-400">
                {comparisonBefore.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <X className="w-3 h-3 stroke-[2.5] text-orange-700 dark:text-orange-400 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After Column */}
            <div className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border border-emerald-500/10 dark:border-emerald-950/15 rounded-2xl p-3.5 space-y-2">
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 dark:text-emerald-450 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 stroke-[2.2] shrink-0" aria-hidden="true" />
                After KejaFinder
              </span>
              <ul className="space-y-1.5 text-[10.5px] font-semibold text-neutral-510 dark:text-stone-400">
                {comparisonAfter.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <Check className="w-3 h-3 stroke-[2.5] text-emerald-700 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. Impact Statement Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5 shadow-3xs space-y-2.5"
      >
        <div className="flex items-center space-x-2 text-neutral-800 dark:text-stone-100">
          <TrendingUp className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400 stroke-[2.2]" />
          <h3 className="text-[11.5px] font-black uppercase tracking-tight">
            Why this matters
          </h3>
        </div>
        <p className="text-[11px] font-semibold text-neutral-510 dark:text-stone-400 leading-relaxed">
          For many renters, house hunting costs valuable time, transport fare, and daily energy before they even locate a real vacancy. KejaFinder helps tenants narrow down the options safely from home before they travel.
        </p>
        <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-normal leading-normal">
          “The goal is not to remove physical viewing. The goal is to make the visit more informed and safer.”
        </p>
      </motion.div>


      {/* 7. Action navigation buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSearchAction}
          className="flex-1 h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[11.5px] uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Start searching for vacant houses"
        >
          <Search className="w-4 h-4 stroke-[2.3]" />
          <span>Start searching</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSafetyAction}
          className="flex-1 h-11 bg-white dark:bg-stone-900 hover:bg-neutral-50 dark:hover:bg-stone-850 text-neutral-800 dark:text-stone-105 border border-neutral-300 dark:border-stone-800 font-black text-[11.5px] uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Read safety advice"
        >
          <BookOpen className="w-4 h-4 stroke-[2.2] text-orange-700 dark:text-orange-400" />
          <span>Read safety tips</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
