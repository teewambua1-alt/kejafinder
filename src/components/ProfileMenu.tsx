import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, PlusCircle, Building2, Settings, Bug, Palette, LogOut, UserCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { isPosterRole } from '../lib/roles';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenTestMode?: () => void;
  onOpenDesignSystem?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  danger?: boolean;
}

/**
 * Desktop/tablet navbar profile dropdown. Mirrors the same curated
 * shortcuts as the profile page's own ProfileLinks list.
 * rather than the full granular settings list in data/profileData.ts --
 * a compact navbar menu needs top-level destinations, not every settings
 * sub-screen.
 */
export default function ProfileMenu({ isOpen, onClose, onTabChange, onOpenAuth, onOpenTestMode, onOpenDesignSystem }: ProfileMenuProps) {
  const { user, profile, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const canPost = isPosterRole(profile);

  const go = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  const handleLogout = async () => {
    onClose();
    try {
      await signOut();
    } catch {
      // Sign-out failures are surfaced by ProfilePage's own handler when
      // reached via the full profile page; this menu just fires and closes.
    }
  };

  // Role-gated, matching BottomNav, DesktopNavbar and ProfileLinks. This
  // menu was the one surface that gated nothing: every signed-in account -- a
  // tenant included -- was offered "Post a vacancy" and "Dashboard", both of
  // which then dead-end (usePostListingDraft rejects tenants on submit, and the
  // owner dashboard has nothing to show them).
  const items: MenuItem[] = [
    { id: 'saved', label: 'Saved homes', icon: Bookmark, onClick: () => go('saved') },
    ...(canPost
      ? [
          { id: 'post', label: 'Post a vacancy', icon: PlusCircle, onClick: () => go('post') },
          { id: 'dashboard', label: 'Dashboard', icon: Building2, onClick: () => go('landlord-dashboard') },
        ]
      : []),
    ...(isAdmin
      ? [{ id: 'admin', label: 'Admin dashboard', icon: ShieldAlert, onClick: () => go('admin-dashboard') }]
      : []),
    { id: 'profile', label: 'My profile & settings', icon: Settings, onClick: () => go('profile') },
  ];

  // Development tooling, and it was reaching production: every visitor to the
  // deployed site saw "Test Mode" and "Design System" in this menu. Vite
  // statically replaces import.meta.env.DEV, so this whole branch is dropped
  // from the production bundle rather than merely hidden.
  const devItems: MenuItem[] = import.meta.env.DEV
    ? [
        { id: 'test-mode', label: 'Test Mode', icon: Bug, onClick: () => { onOpenTestMode?.(); onClose(); } },
        { id: 'design-system', label: 'Design System', icon: Palette, onClick: () => { onOpenDesignSystem?.(); onClose(); } },
      ]
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[var(--z-navbar)]" onClick={onClose} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-stone-900 border border-neutral-200/60 dark:border-stone-800 rounded-2xl shadow-lg z-50 overflow-hidden"
            role="menu"
          >
            {user ? (
              <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-stone-800 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    {(profile?.full_name?.trim()?.[0] || user.email?.[0] || '?').toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-neutral-850 dark:text-stone-100 truncate">
                    {profile?.full_name || 'KejaFinder User'}
                  </p>
                  <p className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 truncate">
                    {profile?.role ? profile.role[0].toUpperCase() + profile.role.slice(1) : user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-stone-800 space-y-2">
                <div className="flex items-center space-x-2 text-neutral-700 dark:text-stone-300">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-xs font-bold">You're not signed in</span>
                </div>
                <button
                  onClick={() => { onOpenAuth(); onClose(); }}
                  className="w-full h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-2xs font-extrabold uppercase tracking-wider cursor-pointer"
                >
                  Log in or sign up
                </button>
              </div>
            )}

            <div className="py-1.5">
              {items.map((item) => (
                <button
                  key={item.id}
                  role="menuitem"
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-left text-xs font-bold text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-850/60 transition-colors cursor-pointer"
                >
                  <item.icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[2.2] shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {devItems.length > 0 && (
            <div className="py-1.5 border-t border-neutral-100 dark:border-stone-800">
              {devItems.map((item) => (
                <button
                  key={item.id}
                  role="menuitem"
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-left text-2xs font-bold text-neutral-550 dark:text-stone-400 hover:bg-neutral-50 dark:hover:bg-stone-850/60 transition-colors cursor-pointer"
                >
                  <item.icon className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            )}

            {user && (
              <div className="py-1.5 border-t border-neutral-100 dark:border-stone-800">
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-left text-xs font-bold text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 stroke-[2.2] shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
