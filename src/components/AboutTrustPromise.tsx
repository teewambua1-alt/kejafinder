import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Receipt, 
  Wallet, 
  RefreshCw, 
  Clock, 
  Flag, 
  AlertTriangle, 
  MapPin, 
  ListChecks, 
  BadgeCheck, 
  Eye, 
  Home, 
  BookOpen,
  Search,
  Check
} from 'lucide-react';

interface AboutTrustPromiseProps {
  onGoSafety?: () => void;
  onGoSearch?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function AboutTrustPromise({ onGoSafety, onGoSearch, onShowFeedback }: AboutTrustPromiseProps) {
  
  const trustPrinciples = [
    {
      title: "No hidden costs",
      desc: "Rent, deposit, water, electricity, and agent fees should be shown clearly upfront.",
      icon: Receipt,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/45"
    },
    {
      title: "Fresh listings",
      desc: "Vacancies should be updated or set to expire later if caretakers don't confirm availability.",
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/45"
    },
    {
      title: "Report suspicious posts",
      desc: "Users should be able to report fake, wrong, duplicate, unsafe, or already-taken homes instantly.",
      icon: Flag,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/45"
    },
    {
      title: "Useful local details",
      desc: "Estate name, landmarks, stage distance, water availability, toilet setup, and direct contact numbers.",
      icon: MapPin,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/45"
    },
    {
      title: "Honest trust badges",
      desc: "Tags should explain exactly what was verified without promising fake guaranteed safety.",
      icon: BadgeCheck,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/45"
    },
    {
      title: "Physical viewing first",
      desc: "Users must physically view a house and confirm caretaker identities before paying any token.",
      icon: Eye,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/45"
    }
  ];

  const badgesExplained = [
    { name: "Phone Verified", meaning: "Caretaker or landlord contact number confirmed via verification check" },
    { name: "Location Checked", meaning: "Estate, landmark coordinates, and area details reviewed by scouts or platform" },
    { name: "Scout Verified", meaning: "Physical local scout visited coordinates to take real-time photos and check state" },
    { name: "Trusted Landlord", meaning: "History of consistent accurate listings, clear pricing, and low community reports" },
    { name: "Recently Updated", meaning: "Vacancy status confirmed recently by caretaker or landlord within standard periods" }
  ];

  const handleSafetyAction = () => {
    if (onGoSafety) {
      onGoSafety();
    } else {
      onShowFeedback("Safety page available from Profile.");
    }
  };

  const handleSearchAction = () => {
    if (onGoSearch) {
      onGoSearch();
    } else {
      onShowFeedback("Verified home search coming soon.");
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
      {/* 1. Header Title Block */}
      <motion.div variants={itemVariants} className="space-y-1.5 border-t border-neutral-200/40 dark:border-stone-800/40 pt-6">
        <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          Trust &amp; Safety Promise
        </h3>
        <h2 className="text-lg font-black text-neutral-900 dark:text-stone-100 uppercase tracking-tight">
          Trust comes before growth
        </h2>
        <p className="text-[12px] font-bold text-neutral-650 dark:text-stone-300 leading-snug">
          KejaFinder only works if renters can trust the listings they see.
        </p>
        <p className="text-[11px] font-semibold text-neutral-550 dark:text-stone-450 leading-relaxed">
          That means clear prices, local details, freshness, reports, and safety reminders must be visible from the start.
        </p>
      </motion.div>

      {/* 2. Main Promise Card */}
      <motion.div
        variants={itemVariants}
        className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border border-emerald-500/12 dark:border-emerald-900/15 rounded-3xl p-5.5 shadow-3xs space-y-3 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 dark:bg-emerald-500/[0.02] rounded-bl-full pointer-events-none" />
        
        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          <h4 className="text-[12px] font-black uppercase tracking-wider">
            Our promise
          </h4>
        </div>

        <div className="space-y-2.5">
          <p className="text-[11.5px] font-bold text-neutral-800 dark:text-stone-100 leading-relaxed">
            “We are building KejaFinder around practical trust: clear rental costs, useful local details, visible contact methods, safety reminders, and tools to report suspicious or outdated listings.”
          </p>
          <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400 leading-relaxed pt-1.5 border-t border-neutral-200/30 dark:border-stone-850/40">
            We will not pretend every listing is perfect. The goal is to help users make better decisions before travelling or paying.
          </p>
        </div>
      </motion.div>

      {/* 3. Six Trust Principle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="region" aria-label="Trust principles list">
        {trustPrinciples.map((principle, index) => {
          const IconComponent = principle.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -1 }}
              className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-2.5xl p-4 flex space-x-3.5 items-start shadow-4xs"
            >
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border border-neutral-200/10 shadow-3xs ${principle.color}`}>
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-[11.5px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-tight">
                  {principle.title}
                </h5>
                <p className="text-[10.5px] font-semibold text-neutral-550 dark:text-stone-400 leading-snug">
                  {principle.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Badge Promise Mini Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5 shadow-3xs space-y-3.5"
      >
        <div className="flex items-center space-x-2 text-neutral-850 dark:text-stone-100">
          <BadgeCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
          <h4 className="text-[11.5px] font-black uppercase tracking-wider">
            What badges should mean
          </h4>
        </div>

        <div className="space-y-2.5" role="list">
          {badgesExplained.map((badge, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 text-[11px]" role="listitem">
              <span className="text-emerald-600 dark:text-emerald-400 font-black shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
              </span>
              <p className="text-neutral-600 dark:text-stone-350 font-semibold leading-snug">
                <strong className="text-neutral-805 dark:text-stone-100 uppercase font-bold tracking-tight">{badge.name}:</strong> {badge.meaning}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1 bg-neutral-50 dark:bg-stone-850 p-2.5 rounded-lg border border-neutral-150/50 dark:border-stone-800/50 text-[10px] font-bold text-neutral-550 dark:text-stone-400 text-center uppercase tracking-normal">
          <AlertTriangle className="w-3 h-3 stroke-[2.2] shrink-0" aria-hidden="true" />
          Badges are trust signals, not payment guarantees.
        </div>
      </motion.div>

      {/* 5. Strong Warning Reminder */}
      <motion.div
        variants={itemVariants}
        className="bg-amber-500/[0.04] dark:bg-amber-500/[0.02] border border-amber-500/18 dark:border-amber-900/25 rounded-2.5xl p-4.5 space-y-2 shadow-4xs"
      >
        <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-500">
          <AlertTriangle className="w-5 h-5 shrink-0 stroke-[2.2] animate-pulse" />
          <h4 className="text-[11px] font-black uppercase tracking-wider">
            Critical Safety Warning
          </h4>
        </div>
        <p className="text-[10.5px] font-black uppercase text-amber-700 dark:text-amber-500 leading-snug">
          “Never send deposit before physically viewing the house and confirming the caretaker or landlord.”
        </p>
        <p className="text-[10px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
          KejaFinder helps renters compare options faster, but safe renting still requires physical viewing and confirmation.
        </p>
      </motion.div>

      {/* 6. Action buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSafetyAction}
          className="flex-1 h-11 bg-white dark:bg-stone-900 hover:bg-neutral-50 dark:hover:bg-stone-850 text-neutral-800 dark:text-stone-105 border border-neutral-300 dark:border-stone-800 font-black text-[11.5px] uppercase tracking-wider rounded-xl.5 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Read safety tips"
        >
          <BookOpen className="w-4 h-4 stroke-[2.2] text-amber-550" />
          <span>Read safety tips</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSearchAction}
          className="flex-1 h-11 bg-emerald-650 hover:bg-emerald-600 text-white font-black text-[11.5px] uppercase tracking-wider rounded-xl.5 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Search verified homes"
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
          <span>Search verified homes</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
