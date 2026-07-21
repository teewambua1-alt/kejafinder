import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, MapPinHouse, Sun, Moon, AlertCircle, Settings } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { sampleProfileUser } from '../data/profileData';

interface ProfileHeaderProps {
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
}

export default function ProfileHeader({ onNotificationsClick, onSettingsClick }: ProfileHeaderProps = {}) {
  const { isDark, toggleTheme } = useTheme();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full flex items-center justify-between py-3 mb-4 relative z-20"
    >
      {/* KejaFinder Logo */}
      <div className="flex items-center space-x-2.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center shadow-2xs">
          <MapPinHouse className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-500 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <div className="text-xl tracking-tight leading-none font-sans font-extrabold select-none">
            <span className="text-emerald-600 dark:text-emerald-500">Keja</span>
            <span className="text-neutral-800 dark:text-neutral-100">Finder</span>
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium font-sans mt-0.5 tracking-wider uppercase">
            Vacancies Hub
          </span>
        </div>
      </div>

      {/* Quick Action Controls on the Right */}
      <div className="flex items-center space-x-2.5">
        {/* Theme toggle */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="relative w-9 h-9 rounded-full bg-white dark:bg-stone-800/95 border border-neutral-200/50 dark:border-stone-800 flex items-center justify-center text-neutral-700 dark:text-neutral-200 shadow-2xs hover:bg-neutral-50 dark:hover:bg-stone-750/90 transition-all cursor-pointer outline-none"
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun className="w-4.5 h-4.5 text-amber-400 stroke-[2]" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-neutral-600 stroke-[2]" />
          )}
        </motion.button>

        {/* Bell Notification Button */}
        <button 
          onClick={onNotificationsClick ? onNotificationsClick : () => showToast("You have 2 new notifications regarding saved searches.")}
          className="relative w-9 h-9 rounded-full bg-white dark:bg-stone-800/95 border border-neutral-200/50 dark:border-stone-800 flex items-center justify-center text-neutral-700 dark:text-neutral-200 shadow-2xs hover:bg-neutral-50 dark:hover:bg-stone-750/90 active:scale-95 transition-all cursor-pointer outline-none"
          aria-label="Open notifications"
        >
          <Bell className="w-4.5 h-4.5 text-neutral-700 dark:text-neutral-200 stroke-[2]" />
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white font-sans text-[8.5px] font-bold flex items-center justify-center shadow-xs border border-white dark:border-stone-800">
            2
          </span>
        </button>

        {/* Settings Button */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onSettingsClick}
          className="relative w-9 h-9 rounded-full bg-white dark:bg-stone-800/95 border border-neutral-200/50 dark:border-stone-800 flex items-center justify-center text-emerald-600 dark:text-emerald-500 shadow-2xs hover:bg-neutral-50 dark:hover:bg-stone-750/90 transition-all cursor-pointer outline-none"
          aria-label="Open settings"
        >
          <Settings className="w-4.5 h-4.5 stroke-[2.2]" />
        </motion.button>

        {/* User Profile Avatar with emerald status border ring */}
        <button 
          type="button"
          onClick={() => showToast(`Logged in as ${sampleProfileUser.fullName}`)}
          className="relative w-9 h-9 rounded-full p-[1.5px] bg-emerald-600/10 border border-emerald-500/30 shadow-2xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none"
          aria-label="Open profile info"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-neutral-200 dark:bg-stone-750 border border-white dark:border-stone-800">
            <img 
              src={sampleProfileUser.profilePhoto} 
              alt={`${sampleProfileUser.fullName} profile photo`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-stone-800" />
        </button>
      </div>

      {/* Toast Alert Popup */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-x-0 bottom-24 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-auto"
            >
              <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
