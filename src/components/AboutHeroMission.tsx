import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Home, 
  ArrowRight, 
  PlusCircle 
} from 'lucide-react';

interface AboutHeroMissionProps {
  onGoSearch?: () => void;
  onGoPost?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function AboutHeroMission({ onGoSearch, onGoPost, onShowFeedback }: AboutHeroMissionProps) {
  // Rental chips with distinct features
  const rentalChips = [
    { label: "Single rooms", highlight: false },
    { label: "Bedsitters", highlight: false },
    { label: "Mabati houses", highlight: true, accent: "orange" },
    { label: "Studios", highlight: false },
    { label: "Student rooms", highlight: false },
    { label: "Low-cost rentals", highlight: true, accent: "emerald" },
    { label: "One bedrooms", highlight: false },
    { label: "Small estate rentals", highlight: false }
  ];

  // Hero highlights
  const highlights = [
    {
      title: "Search faster",
      desc: "Find rooms by area, budget, and type.",
      icon: Search,
      color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      title: "Check local details",
      desc: "See rent, deposit, landmark, water, toilet, and road access.",
      icon: MapPin,
      color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      title: "Contact directly",
      desc: "Call or WhatsApp the caretaker or landlord.",
      icon: PhoneCall,
      color: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40"
    }
  ];

  const handleSearchAction = () => {
    if (onGoSearch) {
      onGoSearch();
    } else {
      onShowFeedback("Search page coming soon.");
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
      {/* 1. Main Hero Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5.5 shadow-sm space-y-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/[0.03] rounded-bl-full pointer-events-none" />
        
        {/* Eyebrow */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>Built for local rentals</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-stone-50 uppercase tracking-tight leading-none">
            No more walking plot to plot.
          </h2>
          <p className="text-xs sm:text-sm font-bold text-neutral-700 dark:text-stone-300">
            KejaFinder helps Kenyans find vacant, affordable rooms and houses by area, budget, house type, and availability.
          </p>
        </div>

        {/* Supporting paragraph */}
        <p className="text-[11.5px] font-semibold text-neutral-510 dark:text-stone-400 leading-relaxed">
          We are building a simpler way for tenants to discover real vacancies, compare rent and deposit, check local details, and contact caretakers or landlords directly.
        </p>

        {/* Local rental focus chips */}
        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-stone-850/60">
          <span className="text-2xs font-black text-neutral-550 dark:text-stone-400 uppercase tracking-widest block">
            Focus rental types:
          </span>
          <div className="flex flex-wrap gap-1.5" role="list">
            {rentalChips.map((chip, idx) => {
              const isHighlight = chip.highlight;
              const isOrange = chip.accent === 'orange';
              const bgClass = isHighlight
                ? isOrange
                  ? "bg-orange-500/10 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20"
                  : "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : "bg-neutral-100 dark:bg-stone-850 text-neutral-600 dark:text-stone-350 border-neutral-200/40 dark:border-stone-800/40";
              
              return (
                <span
                  key={idx}
                  role="listitem"
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase tracking-tight transition-all hover:scale-[1.02] ${bgClass}`}
                >
                  {chip.label}
                </span>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 2. Hero highlight values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {highlights.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -1 }}
              className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-2xl p-4 shadow-3xs flex sm:flex-col items-center sm:items-start text-left space-x-3.5 sm:space-x-0 sm:space-y-2.5"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-neutral-250/20 ${item.color}`}>
                <IconComp className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-black text-neutral-800 dark:text-stone-100 uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400 leading-tight">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Our Mission statement card */}
      <motion.div
        variants={itemVariants}
        className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border border-emerald-500/10 dark:border-emerald-900/15 rounded-3xl p-5 shadow-3xs space-y-3 relative overflow-hidden"
      >
        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
          <Home className="w-4.5 h-4.5 stroke-[2.2]" />
          <h3 className="text-xs font-black uppercase tracking-wider">Our Mission</h3>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black text-neutral-850 dark:text-stone-100 leading-relaxed uppercase tracking-tight">
            “To make vacant affordable rentals easier to find, easier to post, and safer to contact — starting with real local housing needs in Kenya.”
          </p>
          <p className="text-[11px] font-semibold text-neutral-510 dark:text-stone-400 leading-relaxed">
            KejaFinder is not only for premium apartments. It is for ordinary renters looking for single rooms, bedsitters, mabati houses, studios, student rooms, and low-cost homes.
          </p>
        </div>
      </motion.div>

      {/* 4. Action CTAs */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2.5">
        <motion.button
          onClick={handleSearchAction}
          whileTap={{ scale: 0.97 }}
          className="flex-1 h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[12px] uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
          aria-label="Search homes"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Search homes</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.button
          onClick={handlePostAction}
          whileTap={{ scale: 0.97 }}
          className="flex-1 h-12 bg-white dark:bg-stone-900 hover:bg-neutral-50 dark:hover:bg-stone-850 text-neutral-805 dark:text-stone-100 border border-neutral-300 dark:border-stone-800 font-black text-[12px] uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 shadow-3xs transition-colors cursor-pointer"
          aria-label="Post a vacancy"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5] text-emerald-700 dark:text-emerald-400" />
          <span>Post a vacancy</span>
        </motion.button>
      </motion.div>

    </motion.div>
  );
}
