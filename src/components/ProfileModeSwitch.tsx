import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  PlusCircle, 
  Info, 
  AlertCircle,
  TrendingUp,
  Bookmark,
  Eye,
  MessageSquare,
  Bell,
  CheckCircle2,
  Building,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ProfileModeSwitchProps {
  profileMode: "renter" | "poster";
  setProfileMode: (mode: "renter" | "poster") => void;
  onTabChange?: (tab: string) => void;
}

export default function ProfileModeSwitch({ profileMode, setProfileMode, onTabChange }: ProfileModeSwitchProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleRenterPrimaryAction = () => {
    if (onTabChange) {
      onTabChange('search');
    } else {
      showToast("Search page transition is missing in this context.");
    }
  };

  const handleRenterSecondaryAction = () => {
    if (onTabChange) {
      onTabChange('saved');
    } else {
      showToast("Saved page transition is missing in this context.");
    }
  };

  const handlePosterPrimaryAction = () => {
    if (onTabChange) {
      onTabChange('post');
    } else {
      showToast("Post page transition is missing in this context.");
    }
  };

  const renterStats = [
    { label: "Saved Homes", val: "12", icon: Bookmark },
    { label: "Viewed Homes", val: "36", icon: Eye },
    { label: "Inquiries", val: "8", icon: MessageSquare },
    { label: "Search Alerts", val: "4", icon: Bell }
  ];

  const posterStats = [
    { label: "Posted Listings", val: "2", icon: Building },
    { label: "Pending Approval", val: "1", icon: AlertCircle },
    { label: "Listing Inquiries", val: "8", icon: MessageSquare },
    { label: "Trust Checks", val: "3", icon: ShieldCheck }
  ];

  return (
    <div className="w-full space-y-4" id="profile-mode-switch-wrapper">
      {/* Title & Subtitle block */}
      <div className="px-1 space-y-0.5">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          My KejaFinder mode
        </h3>
        <p className="text-[10px] font-semibold text-neutral-450 dark:text-stone-500 leading-relaxed">
          Switch between searching for homes and posting vacancies.
        </p>
      </div>

      {/* 3. Segmented control switcher */}
      <div className="w-full bg-neutral-100 dark:bg-stone-850 p-1 rounded-2xl flex items-center select-none shadow-3xs border border-neutral-150/40 dark:border-stone-800/60">
        <button
          type="button"
          aria-pressed={profileMode === "renter"}
          onClick={() => setProfileMode("renter")}
          className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 outline-none cursor-pointer border-none transition-all ${
            profileMode === "renter"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-neutral-500 dark:text-stone-400 hover:text-neutral-800 dark:hover:text-stone-105"
          }`}
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
          <span>Renter</span>
        </button>

        <button
          type="button"
          aria-pressed={profileMode === "poster"}
          onClick={() => setProfileMode("poster")}
          className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 outline-none cursor-pointer border-none transition-all ${
            profileMode === "poster"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-neutral-500 dark:text-stone-400 hover:text-neutral-800 dark:hover:text-stone-105"
          }`}
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2]" />
          <span>Poster</span>
        </button>
      </div>

      {/* 4. Active Card and Stats using framer-motion */}
      <AnimatePresence mode="wait">
        {profileMode === "renter" ? (
          <motion.div
            key="renter-mode-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl p-4.5 shadow-3xs space-y-4"
          >
            {/* Header info */}
            <div className="space-y-1">
              <span className="text-[12.5px] font-black text-neutral-800 dark:text-stone-100 uppercase tracking-tight block">
                Renter Mode
              </span>
              <p className="text-[10px] text-neutral-450 dark:text-stone-500 font-semibold leading-relaxed">
                Find, save, compare, and contact vacant homes near you.
              </p>
            </div>

            {/* Quick Metrics grid */}
            <div className="grid grid-cols-4 gap-2">
              {renterStats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="bg-neutral-50/75 dark:bg-stone-800/30 border border-neutral-200/30 dark:border-stone-800/40 rounded-2xl p-2 text-center flex flex-col justify-center items-center">
                    <StatIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] mb-1.5" />
                    <span className="text-[13px] sm:text-[13.5px] font-black text-neutral-800 dark:text-stone-100 font-mono tracking-tight leading-none">
                      {stat.val}
                    </span>
                    <span className="text-[7.5px] sm:text-[8.5px] font-extrabold text-neutral-400 dark:text-stone-500 uppercase tracking-wider block mt-1 leading-tight select-none line-clamp-1">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleRenterPrimaryAction}
                aria-label="Continue searching vacant homes"
                className="flex-1 py-3 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer outline-none shadow-3xs"
              >
                Continue searching
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleRenterSecondaryAction}
                aria-label="View saved homes collections"
                className="flex-1 py-3 bg-neutral-50 dark:bg-stone-800 hover:bg-neutral-100 dark:hover:bg-stone-800 border border-neutral-200 dark:border-stone-800 text-neutral-800 dark:text-stone-200 font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer outline-none"
              >
                View saved homes
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="poster-mode-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl p-4.5 shadow-3xs space-y-4"
          >
            {/* Header info */}
            <div className="space-y-1">
              <span className="text-[12.5px] font-black text-neutral-800 dark:text-stone-100 uppercase tracking-tight block">
                Poster Mode
              </span>
              <p className="text-[10px] text-neutral-450 dark:text-stone-500 font-semibold leading-relaxed">
                Post vacancies, manage listing interest, and build trust with renters.
              </p>
            </div>

            {/* Quick Metrics grid */}
            <div className="grid grid-cols-4 gap-2">
              {posterStats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="bg-neutral-50/75 dark:bg-stone-800/30 border border-neutral-200/30 dark:border-stone-800/40 rounded-2xl p-2 text-center flex flex-col justify-center items-center">
                    <StatIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] mb-1.5" />
                    <span className="text-[13px] sm:text-[13.5px] font-black text-neutral-800 dark:text-stone-100 font-mono tracking-tight leading-none">
                      {stat.val}
                    </span>
                    <span className="text-[7.5px] sm:text-[8.5px] font-extrabold text-neutral-400 dark:text-stone-500 uppercase tracking-wider block mt-1 leading-tight select-none line-clamp-1">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePosterPrimaryAction}
                aria-label="Post a fresh vacancy"
                className="flex-1 py-3 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer outline-none shadow-3xs"
              >
                Post vacancy
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast("Poster dashboard coming soon.")}
                aria-label="View poster tools"
                className="flex-1 py-3 bg-neutral-50 dark:bg-stone-800 hover:bg-neutral-100 dark:hover:bg-stone-800 border border-neutral-200 dark:border-stone-800 text-neutral-800 dark:text-stone-200 font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer outline-none"
              >
                View poster tools
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Mode helper informative sticker banner */}
      <div className="bg-emerald-500/[0.03] dark:bg-emerald-950/[0.03] border border-emerald-500/15 dark:border-emerald-900/20 rounded-2xl p-3.5 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5 stroke-[2.2]" />
        <p className="text-[10px] text-neutral-450 dark:text-stone-400 font-semibold leading-relaxed">
          Mode switching is a prototype preview. Real account roles, posting limits, and permissions will be configured in a later production release.
        </p>
      </div>

      {/* Internal interactive local feedback notifications toast */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-x-0 bottom-24 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-auto"
            >
              <AlertCircle className="w-4 h-4 text-emerald-450 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
