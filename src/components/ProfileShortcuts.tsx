import React from 'react';
import { motion } from 'motion/react';
import {
  Bookmark,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  Settings,
  Building2,
  ShieldAlert
} from 'lucide-react';

interface ProfileShortcutsProps {
  onTabChange?: (tab: string) => void;
  onOpenSettings?: () => void;
  onOpenSafety?: () => void;
  onOpenOwnerDashboard?: () => void;
  onOpenAdminDashboard?: () => void;
  showOwnerDashboard?: boolean;
  showAdminDashboard?: boolean;
  showPostVacancy?: boolean;
}

export default function ProfileShortcuts({ onTabChange, onOpenSettings, onOpenSafety, onOpenOwnerDashboard, onOpenAdminDashboard, showOwnerDashboard = false, showAdminDashboard = false, showPostVacancy = true }: ProfileShortcutsProps) {
  const shortcuts = [
    {
      id: 'saved',
      title: 'Saved',
      subtitle: 'View saved homes',
      icon: Bookmark,
      ariaLabel: 'Open saved homes',
      onClick: () => onTabChange?.('saved')
    },
    ...(showPostVacancy ? [{
      id: 'post',
      title: 'Post Vacancy',
      subtitle: 'List a vacant home',
      icon: PlusCircle,
      ariaLabel: 'Post a vacancy',
      onClick: () => onTabChange?.('post')
    }] : []),
    ...(showOwnerDashboard ? [{
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Manage your listings',
      icon: Building2,
      ariaLabel: 'Open owner dashboard',
      onClick: () => onOpenOwnerDashboard?.()
    }] : []),
    ...(showAdminDashboard ? [{
      id: 'admin',
      title: 'Admin',
      subtitle: 'Moderate listings',
      icon: ShieldAlert,
      ariaLabel: 'Open admin dashboard',
      onClick: () => onOpenAdminDashboard?.()
    }] : []),
    {
      id: 'safety',
      title: 'Safety',
      subtitle: 'Tips & guidelines',
      icon: ShieldCheck,
      ariaLabel: 'Open safety tips',
      onClick: () => onOpenSafety?.()
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Manage your account & preferences',
      icon: Settings,
      ariaLabel: 'Open settings panel',
      onClick: () => onOpenSettings?.()
    }
  ];

  return (
    <div className="w-full space-y-3" id="profile-shortcuts-section">
      {/* Group header title */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          My shortcuts
        </h3>
      </div>

      {/* Grid container with 2 column grid for mobile */}
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map((shortcut) => {
          const IconComp = shortcut.icon;
          const isWide = shortcut.id === 'settings';
          return (
            <motion.button
              key={shortcut.id}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              onClick={shortcut.onClick}
              aria-label={shortcut.ariaLabel}
              className={`group text-left w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-2.5xl p-4 shadow-3xs hover:shadow-2xs transition-all cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                isWide
                  ? 'col-span-2 flex flex-row items-center space-x-3.5 min-h-[64px]'
                  : 'flex flex-col justify-between min-h-[105px]'
              }`}
            >
              {/* Icon badge */}
              <div className={`rounded-xl bg-emerald-50/80 dark:bg-emerald-950/25 border border-emerald-100/70 dark:border-emerald-900/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 ${
                isWide ? 'w-10 h-10' : 'w-8.5 h-8.5 mb-3'
              }`}>
                <IconComp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
              </div>

              {/* Text label details */}
              <div className={isWide ? 'flex-1 min-w-0' : ''}>
                <span className="block text-[11px] sm:text-[11.5px] font-black text-neutral-805 dark:text-stone-100 tracking-tight uppercase">
                  {shortcut.title}
                </span>
                <span className="block text-[8.5px] sm:text-[9.5px] font-semibold text-neutral-550 dark:text-stone-500 leading-tight mt-0.5">
                  {shortcut.subtitle}
                </span>
              </div>

              {isWide && (
                <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-stone-600 shrink-0 ml-1" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
