import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Target, 
  ListChecks, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  PlusCircle, 
  AlertTriangle 
} from 'lucide-react';

interface AboutLaunchStrategyProps {
  onGoSearch?: () => void;
  onGoPost?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function AboutLaunchStrategy({ onGoSearch, onGoPost, onShowFeedback }: AboutLaunchStrategyProps) {
  
  const pilotAreas = [
    { name: "Athi River", type: "first-focus" },
    { name: "Kitengela", type: "first-focus" },
    { name: "Mlolongo", type: "first-focus" },
    { name: "Rongai", type: "pilot" },
    { name: "Githurai", type: "pilot" },
    { name: "Kayole", type: "pilot" },
    { name: "Pipeline", type: "pilot" },
    { name: "Umoja", type: "pilot" },
    { name: "Juja", type: "pilot" },
    { name: "Thika", type: "pilot" },
    { name: "Kasarani", type: "pilot" }
  ];

  const milestoneBullets = [
    "Real photos",
    "Correct rent and deposit",
    "Useful landmarks",
    "Caretaker or landlord contact",
    "Availability checked",
    "Safety reminders visible"
  ];

  const manualSteps = [
    "Walk around the pilot area.",
    "Talk to caretakers and landlords.",
    "Collect real vacancy details.",
    "Take photos with permission.",
    "Upload listings manually.",
    "Share listings in WhatsApp and Facebook groups.",
    "Track tenant interest and contact clicks."
  ];

  const whyLocalFocus = [
    "Local landmarks make listings easier to find.",
    "Caretaker relationships improve listing quality.",
    "Reports are easier to investigate.",
    "Fresh vacancies are easier to keep updated.",
    "One strong area builds trust faster than many empty areas."
  ];

  const handleSearchAction = () => {
    if (onGoSearch) {
      onGoSearch();
    } else {
      onShowFeedback("Pilot area search coming soon.");
    }
  };

  const handlePostAction = () => {
    if (onGoPost) {
      onGoPost();
    } else {
      onShowFeedback("Post vacancy flow coming soon.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      {/* 1. Header Block */}
      <motion.div variants={itemVariants} className="space-y-1.5 border-t border-neutral-200/40 dark:border-stone-800/40 pt-6">
        <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          Launch &amp; Focus Area
        </h3>
        <h2 className="text-lg font-black text-neutral-900 dark:text-stone-100 uppercase tracking-tight">
          Start small, win locally
        </h2>
        <p className="text-[12px] font-bold text-neutral-650 dark:text-stone-300 leading-snug">
          KejaFinder should prove value in one area before expanding everywhere.
        </p>
        <p className="text-[11px] font-semibold text-neutral-450 dark:text-stone-450 leading-relaxed">
          A focused local launch creates better listings, better trust, and better tenant results than a big empty platform.
        </p>
      </motion.div>

      {/* 2. Main Strategy Explanation Card */}
      <motion.div
        variants={itemVariants}
        className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.015] border border-emerald-500/15 dark:border-emerald-950/15 rounded-3xl p-5.5 shadow-3xs space-y-3"
      >
        <div className="flex items-center space-x-2 text-emerald-650 dark:text-emerald-450">
          <Target className="w-5 h-5 stroke-[2.2]" />
          <h4 className="text-[11.5px] font-black uppercase tracking-wider">
            Our launch approach
          </h4>
        </div>

        <div className="space-y-2 leading-relaxed">
          <p className="text-[11.5px] font-bold text-neutral-800 dark:text-stone-100">
            “KejaFinder will focus on one area first, collect real vacancies, verify useful local details, and learn from real tenant searches before expanding.”
          </p>
          <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400">
            The goal is not to look nationwide on day one. The goal is to help someone find a real vacant room faster than walking plot to plot.
          </p>
        </div>
      </motion.div>

      {/* 3. Pilot Area Selection list */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-stone-500 block">
          Pilot Candidate Neighborhoods
        </span>

        <div className="flex flex-wrap gap-2" role="region" aria-label="Pilot area candidates">
          {pilotAreas.map((area, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className={`px-3 py-1.5 rounded-full text-[10.5px] font-bold tracking-tight border flex items-center space-x-1.5 shadow-4xs select-none ${
                area.type === "first-focus"
                  ? "bg-amber-500/[0.1] text-amber-800 dark:text-amber-400 border-amber-500/30"
                  : "bg-white dark:bg-stone-900 text-neutral-600 dark:text-stone-300 border-neutral-200/50 dark:border-stone-850"
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${area.type === "first-focus" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`} />
              <span>{area.name}</span>
              {area.type === "first-focus" && (
                <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1 py-0.2 rounded-md">
                  First focus
                </span>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-[9px] font-semibold text-neutral-450 dark:text-stone-500 uppercase tracking-normal">
          * Focused pilot Candidate list for initial physical area scouting campaigns.
        </p>
      </motion.div>

      {/* 4. First Milestone Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-2 max-w-xs">
          <h4 className="text-[12px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-wider flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>First serious milestone</span>
          </h4>
          <p className="text-[11px] font-semibold text-neutral-500 dark:text-stone-400 leading-snug">
            Before scaling, KejaFinder should aim to collect 100 real vacant rooms in one focused area.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center bg-neutral-50 dark:bg-stone-850 rounded-2xl p-4 border border-neutral-150/40 dark:border-stone-800/40 min-w-[130px] shrink-0">
          <span className="text-2xl font-black text-emerald-650 dark:text-emerald-400 tracking-tight leading-none">
            100
          </span>
          <span className="text-[9px] font-bold text-neutral-450 dark:text-stone-450 uppercase tracking-widest mt-1">
            Vacant Rooms
          </span>
        </div>
      </motion.div>

      {/* 5. Milestone Checklist / Bullets */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5.5 shadow-3xs space-y-3"
      >
        <span className="text-[9px] font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest block">
          Milestone Listing Requirements
        </span>
        <div className="grid grid-cols-2 gap-2.5" role="list">
          {milestoneBullets.map((bullet, index) => (
            <div key={index} className="flex items-center space-x-2 text-[10.5px] font-bold text-neutral-700 dark:text-stone-300" role="listitem">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{bullet}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 6. Manual Validation Steps */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5.5 shadow-3xs space-y-4"
      >
        <div className="flex items-center space-x-2 pb-1 border-b border-neutral-100 dark:border-stone-850/50">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h4 className="text-[12px] font-black text-neutral-805 dark:text-stone-105 uppercase tracking-wider">
            Manual validation first
          </h4>
        </div>

        <div className="space-y-3" role="list">
          {manualSteps.map((step, idx) => (
            <div key={idx} className="flex space-x-3 items-start" role="listitem">
              <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-[10px] shrink-0 border border-emerald-500/10">
                {idx + 1}
              </div>
              <p className="text-[11px] font-semibold text-neutral-600 dark:text-stone-350 leading-relaxed pt-0.5">
                {step}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[9px] font-medium text-neutral-400 dark:text-stone-500 italic mt-1 leading-snug">
          * To ensure maximum truthfulness, listing collection starts by visiting rental plots manually before creating large automated syndications later.
        </p>
      </motion.div>

      {/* 7. Why Local Focus Matters */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5 shadow-3xs space-y-3.5"
      >
        <div className="flex items-center space-x-2 text-neutral-800 dark:text-stone-100">
          <ListChecks className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
          <h4 className="text-[11.5px] font-black uppercase tracking-wider">
            Why local focus matters
          </h4>
        </div>

        <ul className="space-y-2.5" role="list">
          {whyLocalFocus.map((point, index) => (
            <li key={index} className="flex items-start space-x-2" role="listitem">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span className="text-[10.5px] font-semibold text-neutral-600 dark:text-stone-350 leading-relaxed">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* 8. Expansion Principle Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/50 rounded-2.5xl p-4.5 text-center space-y-1.5"
      >
        <h5 className="text-[11px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-wide">
          Expand only after trust works
        </h5>
        <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400 leading-relaxed">
          KejaFinder should grow area by area after listings are useful, contact details work, reports are handled, and renters trust the experience.
        </p>
        <strong className="text-[9.5px] font-black text-emerald-650 dark:text-emerald-400 uppercase tracking-widest block pt-1">
          Trust before growth.
        </strong>
      </motion.div>

      {/* 9. Safety Alert Warning */}
      <motion.div
        variants={itemVariants}
        className="bg-amber-500/[0.04] dark:bg-amber-500/[0.02] border border-amber-500/15 dark:border-amber-900/20 rounded-2.5xl p-4.5 flex items-start space-x-3.5 shadow-4xs"
      >
        <AlertTriangle className="w-5.5 h-5.5 text-amber-650 dark:text-amber-500 shrink-0 stroke-[2.2] mt-0.5" />
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-500 leading-tight">
            “Never send deposit before physically viewing the house and confirming the caretaker or landlord.”
          </p>
          <p className="text-[10px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
            Even in pilot areas, physical viewing remains part of safe renting.
          </p>
        </div>
      </motion.div>

      {/* 10. CTA Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSearchAction}
          className="flex-1 h-11 bg-emerald-650 hover:bg-emerald-600 text-white font-black text-[11.5px] uppercase tracking-wider rounded-xl.5 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Search pilot areas"
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
          <span>Search pilot areas</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePostAction}
          className="flex-1 h-11 bg-white dark:bg-stone-900 hover:bg-neutral-50 dark:hover:bg-stone-850 text-neutral-800 dark:text-stone-105 border border-neutral-300 dark:border-stone-800 font-black text-[11.5px] uppercase tracking-wider rounded-xl.5 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Post a vacancy"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2] text-emerald-600 dark:text-emerald-400" />
          <span>Post a vacancy</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
