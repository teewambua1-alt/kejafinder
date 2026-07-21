import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandlordDashboardHeader from '../components/LandlordDashboardHeader';
import { 
  Building2, 
  BarChart3, 
  RefreshCw, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  BookOpen,
  Filter,
  MessageSquare,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface LandlordDashboardPageProps {
  onBack: () => void;
  onGoPost?: () => void;
  onGoSearch?: () => void;
  onGoSafety?: () => void;
}

export default function LandlordDashboardPage({ onBack, onGoPost, onGoSearch, onGoSafety }: LandlordDashboardPageProps) {
  const [dashboardFeedback, setDashboardFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setDashboardFeedback(msg);
    setTimeout(() => setDashboardFeedback(null), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handlePost = () => {
    if (onGoPost) onGoPost();
    else showFeedback('Post vacancy flow coming soon.');
  };

  const handleSearch = () => {
    if (onGoSearch) onGoSearch();
    else showFeedback('Search page coming soon.');
  };

  const handleSafety = () => {
    if (onGoSafety) onGoSafety();
    else showFeedback('Safety page available from Profile.');
  };

  return (
    <div className="absolute inset-0 bg-neutral-50 dark:bg-stone-950 flex flex-col xl:items-center xl:bg-neutral-100 dark:xl:bg-stone-900 pb-20">
      <div className="w-full h-full flex flex-col bg-white dark:bg-stone-950 shadow-2xl xl:max-w-[440px] xl:h-[850px] xl:my-auto xl:rounded-[40px] xl:overflow-hidden relative xl:border xl:border-neutral-200/50 dark:xl:border-stone-800">
        
        {/* Animated Background Blur Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[40%] bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl rounded-full" />
        </div>

        <LandlordDashboardHeader onBack={onBack} />

        <div className="flex-1 overflow-y-auto scrollbar-hide z-10 px-4 pt-6 pb-28">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Title Area */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <h2 className="text-2xl font-black text-neutral-800 dark:text-stone-100 tracking-tight leading-tight">
                Landlord dashboard
              </h2>
              <p className="text-[13px] font-semibold text-neutral-500 dark:text-stone-400 leading-relaxed max-w-[280px] mx-auto">
                Manage your vacancies, tenant interest, and listing status.
              </p>
              <p className="inline-block mt-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 py-1.5 px-3 rounded-full border border-orange-100 dark:border-orange-900/30">
                This is a prototype dashboard. Real listing management will be added later.
              </p>
            </motion.div>

            {/* Prototype Action Buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handlePost}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-stone-900 border border-neutral-200/60 dark:border-stone-800/60 shadow-sm space-y-1.5 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-stone-300 text-center leading-tight">
                  Post new vacancy
                </span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleSearch}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-stone-900 border border-neutral-200/60 dark:border-stone-800/60 shadow-sm space-y-1.5 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-stone-300 text-center leading-tight">
                  View public listings
                </span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleSafety}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-stone-900 border border-neutral-200/60 dark:border-stone-800/60 shadow-sm space-y-1.5 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-stone-300 text-center leading-tight">
                  Read safety tips
                </span>
              </motion.button>
            </motion.div>

            {/* Dashboard Note */}
            <motion.div variants={itemVariants} className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/30 rounded-2.5xl p-4 flex items-start space-x-3 shadow-sm">
              <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11.5px] font-semibold text-emerald-800 dark:text-emerald-200 leading-snug">
                Landlords and caretakers will use this dashboard to update availability, mark houses as taken, and keep listings fresh.
              </p>
            </motion.div>

            {/* Mock Profile Summary Card */}
            <motion.div variants={itemVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2.5xl p-4 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-stone-800 flex items-center justify-center border border-neutral-200 dark:border-stone-700 shrink-0">
                <span className="text-[15px] font-black tracking-tight text-neutral-600 dark:text-stone-300">PM</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <h3 className="text-[14px] font-black text-neutral-800 dark:text-stone-100 truncate">Peter Mwangi</h3>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                    Prototype account
                  </span>
                </div>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 truncate">
                  Caretaker • Syokimau / Mlolongo
                </p>
                <div className="flex items-center space-x-1 mt-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-neutral-600 dark:text-stone-400 uppercase tracking-wide">
                    Phone Verified mockup
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Placeholder Sections */}
            <div className="space-y-3">
              {[
                { label: 'Overview stats', icon: BarChart3 },
                { label: 'My listings management', icon: Building2 },
                { label: 'Listing status tabs and filters', icon: Filter },
                { label: 'Tenant inquiry summary', icon: MessageSquare },
                { label: 'Quick listing actions', icon: Zap },
                { label: 'Dashboard trust and safety notices', icon: ShieldCheck }
              ].map((ph, idx) => {
                const Icon = ph.icon;
                return (
                  <motion.div 
                    variants={itemVariants} 
                    key={idx}
                    className="bg-white/60 dark:bg-stone-900/60 border border-dashed border-neutral-300 dark:border-stone-700 rounded-2xl p-4 flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Icon className="w-4 h-4 text-neutral-400 dark:text-stone-500" />
                    <span className="text-[12px] font-bold text-neutral-500 dark:text-stone-400">
                      {ph.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Safety Reminder */}
            <motion.div variants={itemVariants} className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/60 dark:border-orange-900/30 rounded-2.5xl p-4 shadow-sm flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11.5px] font-black text-orange-900 dark:text-orange-300 leading-tight mb-1">
                  Never send deposit before physically viewing the house and confirming the caretaker or landlord.
                </h4>
                <p className="text-[10.5px] font-medium text-orange-800/80 dark:text-orange-400/80 leading-snug">
                  Clear listings and honest contact details help renters stay safe.
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Global Feedback Toast */}
        <AnimatePresence>
          {dashboardFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="absolute left-1/2 top-20 z-[100] whitespace-nowrap bg-emerald-800/95 dark:bg-emerald-900/95 text-white px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md font-bold text-[11px] uppercase tracking-wider flex items-center space-x-2 border border-emerald-700 dark:border-emerald-800"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{dashboardFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
