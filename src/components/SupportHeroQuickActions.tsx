import React from 'react';
import { motion } from 'motion/react';
import { Flag, ShieldCheck, Home, UserRound, Search, BookOpen } from 'lucide-react';

interface SupportHeroQuickActionsProps {
  onGoSearch?: () => void;
  onGoSafety?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function SupportHeroQuickActions({ onGoSearch, onGoSafety, onShowFeedback }: SupportHeroQuickActionsProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handleSearch = () => {
    if (onGoSearch) onGoSearch();
    else onShowFeedback('Search page coming soon.');
  };

  const handleSafety = () => {
    if (onGoSafety) onGoSafety();
    else onShowFeedback('Safety page available from Profile.');
  };

  return (
    <motion.div variants={itemVariants} className="w-full space-y-6">
      <div className="space-y-3 px-1 text-center">
        <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-900/50">
          KejaFinder Support
        </span>
        <h2 className="text-2xl font-black text-neutral-800 dark:text-stone-100 tracking-tight leading-tight">
          How can we help?
        </h2>
        <p className="text-[13px] font-semibold text-neutral-500 dark:text-stone-400 leading-relaxed max-w-[280px] mx-auto">
          Get help with listings, safety, posting, contact issues, or suspicious rental requests.
        </p>
        <p className="text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 py-1.5 px-3 rounded-full inline-block mt-2">
          Support tools are prototype-only for now. Real support workflows will be added later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            id: 'report-listing',
            title: 'Report a listing',
            desc: 'Wrong price, fake listing, already taken, scam request, or wrong photos.',
            icon: Flag,
            action: () => onShowFeedback('Report issue form is available below.'),
            color: 'orange'
          },
          {
            id: 'safety-help',
            title: 'Get safety help',
            desc: 'Deposit requests, suspicious contacts, agent fees, or M-Pesa PIN concerns.',
            icon: ShieldCheck,
            action: () => onShowFeedback('Safety help is available below.'),
            color: 'emerald'
          },
          {
            id: 'posting-help',
            title: 'Posting help',
            desc: 'Help for landlords, caretakers, agents, and area scouts.',
            icon: Home,
            action: () => onShowFeedback('Posting support is prototype-only for now.'),
            color: 'blue'
          },
          {
            id: 'account-help',
            title: 'Account help',
            desc: 'Login, phone verification, profile, or saved listings questions.',
            icon: UserRound,
            action: () => onShowFeedback('Account support is prototype-only for now.'),
            color: 'indigo'
          }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={item.action}
              className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2xl p-4 shadow-sm flex flex-col items-start text-left space-y-2.5 outline-none cursor-pointer hover:bg-neutral-50 dark:hover:bg-stone-800/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center
                ${item.color === 'orange' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-500' :
                  item.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' :
                  item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-500' :
                  'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="block text-[11px] font-black text-neutral-800 dark:text-stone-200 tracking-tight mb-0.5">
                  {item.title}
                </span>
                <span className="block text-[10px] font-medium text-neutral-500 dark:text-stone-400 leading-snug line-clamp-2">
                  {item.desc}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          className="flex-1 h-12 bg-emerald-650 hover:bg-emerald-600 text-white font-black text-[11.5px] uppercase tracking-wider rounded-xl.5 flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Browse homes</span>
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleSafety}
          className="flex-1 h-12 bg-white dark:bg-stone-800 text-neutral-800 dark:text-stone-200 border border-neutral-200/80 dark:border-stone-700 font-black text-[11.5px] uppercase tracking-wider rounded-xl.5 flex items-center justify-center space-x-2 shadow-sm hover:bg-neutral-50 dark:hover:bg-stone-750 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-550" />
          <span>Read safety tips</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
