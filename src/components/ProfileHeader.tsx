import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, MapPinHouse, Sun, Moon, AlertCircle, Settings } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';
import { useToast } from '../context/ToastContext';

interface ProfileHeaderProps {
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
}

export default function ProfileHeader({ onNotificationsClick, onSettingsClick }: ProfileHeaderProps = {}) {
  const { isDark, toggleTheme } = useTheme();
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  const fullName = profile?.full_name || (user?.user_metadata?.full_name as string | undefined) || 'KejaFinder User';
  const photoURL = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=10b981&color=fff`;

  // The notifications table is real but has zero writers anywhere in the app
  // today (confirmed: no trigger, no insert policy for anyone) -- this will
  // honestly show no badge until a future phase actually writes rows to it.
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
      .then(({ count, error }) => {
        if (error) {
          console.error('Error fetching unread notification count:', error);
          return;
        }
        setUnreadCount(count ?? 0);
      });
  }, [user]);

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
          onClick={onNotificationsClick ? onNotificationsClick : () => showToast("Notifications aren't wired up to real data yet.", { icon: AlertCircle })}
          className="relative w-9 h-9 rounded-full bg-white dark:bg-stone-800/95 border border-neutral-200/50 dark:border-stone-800 flex items-center justify-center text-neutral-700 dark:text-neutral-200 shadow-2xs hover:bg-neutral-50 dark:hover:bg-stone-750/90 active:scale-95 transition-all cursor-pointer outline-none"
          aria-label="Open notifications"
        >
          <Bell className="w-4.5 h-4.5 text-neutral-700 dark:text-neutral-200 stroke-[2]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white font-sans text-[8.5px] font-bold flex items-center justify-center shadow-xs border border-white dark:border-stone-800">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
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
          onClick={() => showToast(user ? `Logged in as ${fullName}` : 'Not logged in', { icon: AlertCircle })}
          className="relative w-9 h-9 rounded-full p-[1.5px] bg-emerald-600/10 border border-emerald-500/30 shadow-2xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none"
          aria-label="Open profile info"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-neutral-200 dark:bg-stone-750 border border-white dark:border-stone-800">
            <img
              src={photoURL}
              alt={`${fullName} profile photo`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {user && <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-stone-800" />}
        </button>
      </div>
    </motion.header>
  );
}
