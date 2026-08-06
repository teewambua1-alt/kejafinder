import React, { useState } from 'react';
import { Bell, MapPinHouse, Sun, Moon, Search, Home, Heart, PlusCircle, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';
import { useAuth } from '../context/AuthContext';
import ProfileMenu from './ProfileMenu';

interface DesktopNavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNotificationsClick?: () => void;
  onOpenAuth?: () => void;
  onOpenTestMode?: () => void;
  onOpenDesignSystem?: () => void;
  onSearchSubmit?: (query: string) => void;
}

const BASE_NAV_LINKS = [
  { id: 'home', label: 'Explore', icon: Home },
  { id: 'saved', label: 'Saved', icon: Heart },
];
const POST_NAV_LINK = { id: 'post', label: 'Post a vacancy', icon: PlusCircle };

/**
 * Sticky top navbar shown at tablet/desktop widths (md: and up), replacing
 * BottomNav for those breakpoints. Mobile is untouched -- this component
 * never renders below md.
 */
export default function DesktopNavbar({
  activeTab,
  onTabChange,
  onNotificationsClick,
  onOpenAuth,
  onOpenTestMode,
  onOpenDesignSystem,
  onSearchSubmit,
}: DesktopNavbarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { user, profile } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const initial = profile?.full_name?.trim()?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase();
  // Tenant accounts can't submit vacancies -- see BottomNav's identical gate.
  const navLinks = profile?.role === 'tenant' ? BASE_NAV_LINKS : [...BASE_NAV_LINKS, POST_NAV_LINK];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(query);
  };

  return (
    <div className="hidden md:block sticky top-0 z-40 w-full border-b border-neutral-200/60 dark:border-stone-800 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto px-6 xl:px-10 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <button
          onClick={() => onTabChange?.('home')}
          className="flex items-center space-x-2.5 shrink-0 cursor-pointer outline-none"
          aria-label="Go to home"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center shadow-xs">
            <MapPinHouse className="w-5 h-5 text-emerald-600 dark:text-emerald-500 stroke-[2.2]" />
          </div>
          <div className="text-lg tracking-tight leading-none font-sans font-extrabold select-none hidden lg:block">
            <span className="text-emerald-600 dark:text-emerald-500">Keja</span>
            <span className="text-neutral-800 dark:text-neutral-100">Finder</span>
          </div>
        </button>

        {/* Nav links with active-state indicator */}
        <nav className="flex items-center space-x-1 shrink-0">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange?.(link.id)}
                className="relative px-3.5 py-2 text-xs font-bold text-neutral-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer outline-none"
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={isActive ? 'text-emerald-700 dark:text-emerald-400' : ''}>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="desktop-nav-active"
                    className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Compact search pill */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="flex items-center bg-neutral-100/70 dark:bg-stone-900 rounded-full border border-neutral-200/60 dark:border-stone-800 px-4 h-10 focus-within:border-emerald-500/50 transition-colors">
            <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2.5 stroke-[2.2]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search estate, area, landmark..."
              className="w-full bg-transparent text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-450 outline-none"
              aria-label="Search vacancies"
            />
          </div>
        </form>

        {/* Right controls */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-white dark:bg-stone-800/90 border border-neutral-100/80 dark:border-neutral-700/80 flex items-center justify-center text-neutral-700 dark:text-neutral-200 shadow-xs hover:bg-neutral-50 dark:hover:bg-stone-700/80 transition-all outline-none cursor-pointer"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400 stroke-[2]" /> : <Moon className="w-4.5 h-4.5 text-neutral-600 stroke-[2]" />}
          </button>

          <button
            onClick={onNotificationsClick}
            className="relative w-9 h-9 rounded-full bg-white dark:bg-stone-800/90 border border-neutral-100/80 dark:border-neutral-700/80 flex items-center justify-center text-neutral-700 dark:text-neutral-200 shadow-xs hover:bg-neutral-50 dark:hover:bg-stone-700/80 transition-all outline-none cursor-pointer"
            aria-label="Open notifications"
          >
            <Bell className="w-4.5 h-4.5 stroke-[2]" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen((v) => !v)}
              className="relative w-9 h-9 rounded-full p-[2px] bg-emerald-600/10 border border-emerald-500/35 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none"
              aria-label="Open profile menu"
              aria-expanded={isProfileMenuOpen}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-200 dark:bg-stone-700 border border-white dark:border-stone-800 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : user && initial ? (
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{initial}</span>
                ) : (
                  <UserCircle className="w-5 h-5 text-neutral-450 dark:text-stone-500" />
                )}
              </div>
            </button>
            <ProfileMenu
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
              onTabChange={(tab) => onTabChange?.(tab)}
              onOpenAuth={() => onOpenAuth?.()}
              onOpenTestMode={onOpenTestMode}
              onOpenDesignSystem={onOpenDesignSystem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
