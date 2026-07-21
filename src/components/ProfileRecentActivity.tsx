import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Eye, 
  Phone, 
  ChevronRight, 
  AlertCircle, 
  Clock 
} from 'lucide-react';
import { recentActivities } from '../data/profileData';

export default function ProfileRecentActivity() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Helper to determine icon based on action type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'saved':
        return {
          icon: Heart,
          bgColor: 'bg-rose-500/10 text-rose-600 dark:bg-rose-450/15 dark:text-rose-400'
        };
      case 'viewed':
        return {
          icon: Eye,
          bgColor: 'bg-teal-500/10 text-teal-600 dark:bg-teal-450/15 dark:text-teal-400'
        };
      case 'contacted':
      default:
        return {
          icon: Phone,
          bgColor: 'bg-blue-500/10 text-blue-600 dark:bg-blue-450/15 dark:text-blue-400'
        };
    }
  };

  return (
    <div className="w-full space-y-3" id="profile-recent-activity-section">
      {/* Title & see all text */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          Recent activity
        </h3>
        <button 
          onClick={() => showToast('Full activity log diary is coming soon!')}
          className="flex items-center space-x-0.5 text-[10.5px] font-black text-emerald-600 dark:text-emerald-450 uppercase tracking-tight hover:text-emerald-700 hover:underline transition-colors cursor-pointer outline-none bg-transparent border-none"
          aria-label="See all activities"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>

      {/* Main activities container box panel list */}
      <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl overflow-hidden shadow-3xs">
        <div className="divide-y divide-neutral-100 dark:divide-stone-800/30">
          {recentActivities.map((activity, index) => {
            const iconConfig = getActivityIcon(activity.type);
            const IconComp = iconConfig.icon;

            return (
              <motion.button
                key={activity.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => showToast(`Listing details for is coming soon.`)}
                className="w-full p-3.5 text-left flex items-center space-x-3 hover:bg-neutral-50/50 dark:hover:bg-stone-850/40 transition-colors cursor-pointer outline-none"
              >
                {/* Exterior thumbnail image on the left */}
                <div className="w-13 h-13 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-stone-800 shrink-0 border border-neutral-200/40 dark:border-stone-800">
                  <img 
                    src={activity.imageUrl} 
                    alt={activity.title} 
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Sub action indicator circular badge float/position */}
                <div className={`w-7.5 h-7.5 rounded-full ${iconConfig.bgColor} border border-white dark:border-stone-900 shadow-3xs flex items-center justify-center shrink-0`}>
                  <IconComp className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>

                {/* Content text messages inside row */}
                <div className="flex-1 min-w-0 pr-1">
                  <span className="block text-[12px] font-black text-neutral-800 dark:text-stone-100 tracking-tight truncate leading-tight">
                    {activity.title}
                  </span>
                  <span className="block text-[10px] font-semibold text-neutral-400 dark:text-stone-500 truncate mt-0.5 leading-none">
                    {activity.subtitle}
                  </span>
                  <div className="flex items-center space-x-1 text-[9.5px] font-bold text-neutral-450 dark:text-stone-500 mt-1.5 leading-none">
                    <Clock className="w-3 h-3 text-neutral-400 dark:text-stone-500 stroke-[2.2]" />
                    <span>{activity.time}</span>
                  </div>
                </div>

                {/* Right chevron action list navigation */}
                <ChevronRight className="w-4.5 h-4.5 text-neutral-400 dark:text-stone-605 shrink-0 stroke-[2]" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Floating feedback alert toast info */}
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
