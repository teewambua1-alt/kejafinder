import { Bell, MapPinHouse } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

export default function Header({ onNotificationsClick, onProfileClick }: HeaderProps = {}) {
  const { user, profile } = useAuth();
  const initial = profile?.full_name?.trim()?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full flex items-center justify-between py-2 relative z-10"
    >
      {/* KejaFinder Logo */}
      <div className="flex items-center space-x-2.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center shadow-xs">
          {/* Custom styled green house/location style icon */}
          <MapPinHouse className="w-5.5 h-5.5 text-emerald-700 dark:text-emerald-500 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <div className="text-xl tracking-tight leading-none font-sans font-extrabold select-none">
            <span className="text-emerald-700 dark:text-emerald-500">Keja</span>
            <span className="text-neutral-800 dark:text-neutral-100">Finder</span>
          </div>
          <span className="text-[10px] text-neutral-550 dark:text-neutral-400 font-medium font-sans mt-0.5 tracking-wider uppercase">
            Vacancies Hub
          </span>
        </div>
      </div>
 
      {/* Quick Action Controls on the Right */}
      <div className="flex items-center space-x-3">
        {/* Bell Notification Button */}
        <button 
          id="btn-notifications"
          onClick={onNotificationsClick}
          className="relative w-10 h-10 rounded-full bg-white dark:bg-stone-800/90 border border-neutral-100/80 dark:border-neutral-700/80 flex items-center justify-center text-neutral-700 dark:text-neutral-200 shadow-xs hover:bg-neutral-50 dark:hover:bg-stone-700/80 active:scale-95 transition-all outline-none cursor-pointer"
          aria-label="Open notifications"
        >
          <Bell className="w-5 h-5 text-neutral-700 dark:text-neutral-200 stroke-[2]" />
        </button>
 
        {/* User Profile Avatar with thin green ring */}
        <button
          type="button"
          onClick={onProfileClick}
          className="relative w-10 h-10 rounded-full p-[2px] bg-emerald-600/10 border border-emerald-500/35 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none"
          aria-label="Profile"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-neutral-200 dark:bg-stone-700 border border-white dark:border-stone-800 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : user && initial ? (
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">{initial}</span>
            ) : (
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-neutral-500 dark:text-stone-400"
              >
                <rect width="32" height="32" className="fill-neutral-200 dark:fill-stone-800" />
                <circle cx="16" cy="11" r="5" className="fill-neutral-600 dark:fill-stone-400" />
                <path d="M6 26.5C6 21.2533 10.2533 17 15.5 17H16.5C21.7467 17 26 21.2533 26 26.5V28H6V26.5Z" className="fill-neutral-600 dark:fill-stone-400" />
              </svg>
            )}
          </div>
          {/* Online status indicator -- only meaningful when actually signed in */}
          {user && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-700 rounded-full border-2 border-white dark:border-stone-800" />
          )}
        </button>
      </div>
    </motion.header>
  );
}
