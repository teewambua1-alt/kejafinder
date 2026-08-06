import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  PlusCircle,
  ShieldCheck,
  LifeBuoy,
  ChevronRight,
  AlertCircle,
  Settings,
  Building2,
  Bug,
  Palette,
  ShieldAlert
} from 'lucide-react';

interface ProfileShortcutsProps {
  onTabChange?: (tab: string) => void;
  onOpenSettings?: () => void;
  onOpenSafety?: () => void;
  onOpenOwnerDashboard?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenTestMode?: () => void;
  onOpenDesignSystem?: () => void;
  showOwnerDashboard?: boolean;
  showAdminDashboard?: boolean;
  showPostVacancy?: boolean;
}

export default function ProfileShortcuts({ onTabChange, onOpenSettings, onOpenSafety, onOpenOwnerDashboard, onOpenAdminDashboard, onOpenTestMode, onOpenDesignSystem, showOwnerDashboard = false, showAdminDashboard = false, showPostVacancy = true }: ProfileShortcutsProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const shortcuts = [
    {
      id: 'saved',
      title: 'Saved',
      subtitle: 'View saved homes',
      icon: Bookmark,
      ariaLabel: 'Open saved homes',
      onClick: () => {
        if (onTabChange) {
          onTabChange('saved');
        } else {
          showToast('Saved homes navigation context missing');
        }
      }
    },
    ...(showPostVacancy ? [{
      id: 'post',
      title: 'Post Vacancy',
      subtitle: 'List a vacant home',
      icon: PlusCircle,
      ariaLabel: 'Post a vacancy',
      onClick: () => {
        if (onTabChange) {
          onTabChange('post');
        } else {
          showToast('Vacancy post form context missing');
        }
      }
    }] : []),
    ...(showOwnerDashboard ? [{
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Manage your listings',
      icon: Building2,
      ariaLabel: 'Open owner dashboard',
      onClick: () => {
        if (onOpenOwnerDashboard) {
          onOpenOwnerDashboard();
        } else {
          showToast('Owner dashboard is coming soon!');
        }
      }
    }] : []),
    ...(showAdminDashboard ? [{
      id: 'admin',
      title: 'Admin',
      subtitle: 'Moderate listings',
      icon: ShieldAlert,
      ariaLabel: 'Open admin dashboard',
      onClick: () => {
        if (onOpenAdminDashboard) {
          onOpenAdminDashboard();
        } else {
          showToast('Admin dashboard is coming soon!');
        }
      }
    }] : []),
    {
      id: 'safety',
      title: 'Safety',
      subtitle: 'Tips & guidelines',
      icon: ShieldCheck,
      ariaLabel: 'Open safety tips',
      onClick: () => {
        if (onOpenSafety) {
          onOpenSafety();
        } else {
          showToast('Safety guide is coming soon!');
        }
      }
    },
    {
      id: 'support',
      title: 'Support',
      subtitle: 'Get help anytime',
      icon: LifeBuoy,
      ariaLabel: 'Open support',
      onClick: () => {
        showToast('Support center is coming soon!');
      }
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Manage your account & preferences',
      icon: Settings,
      ariaLabel: 'Open settings panel',
      onClick: () => {
        if (onOpenSettings) {
          onOpenSettings();
        } else {
          showToast('Settings configuration dashboard is coming soon!');
        }
      }
    },
    {
      id: 'test_mode',
      title: 'Test Mode',
      subtitle: 'Audit prototype pages and flows.',
      icon: Bug,
      ariaLabel: 'Open test mode',
      onClick: () => {
        if (onOpenTestMode) {
          onOpenTestMode();
        } else {
          showToast('Test mode not available');
        }
      }
    },
    {
      id: 'design_system',
      title: 'Design System',
      subtitle: 'Tokens, buttons, inputs, and states.',
      icon: Palette,
      ariaLabel: 'Open design system reference',
      onClick: () => {
        if (onOpenDesignSystem) {
          onOpenDesignSystem();
        } else {
          showToast('Design system reference not available');
        }
      }
    }
  ];

  return (
    <div className="w-full space-y-3" id="profile-shortcuts-section">
      {/* Group header title and See all button */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          My shortcuts
        </h3>
        <button 
          onClick={() => showToast('Full shortcuts explorer coming soon!')}
          className="flex items-center space-x-0.5 text-[10.5px] font-black text-emerald-600 dark:text-emerald-450 uppercase tracking-tight hover:text-emerald-700 hover:underline transition-colors cursor-pointer outline-none bg-transparent border-none"
          aria-label="See all shortcuts"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>

      {/* Grid container with 2 column grid for mobile */}
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map((shortcut) => {
          const IconComp = shortcut.icon;
          const isWide = shortcut.id === 'settings' || shortcut.id === 'test_mode';
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
                <span className="block text-[8.5px] sm:text-[9.5px] font-semibold text-neutral-450 dark:text-stone-500 leading-tight mt-0.5">
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

      {/* Toast feedback alerts */}
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
