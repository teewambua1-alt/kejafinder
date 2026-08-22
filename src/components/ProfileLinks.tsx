import React from 'react';
import { motion } from 'motion/react';
import type { TargetAndTransition } from 'motion/react';
import {
  Bookmark, PlusCircle, Building2, ShieldAlert, Settings, User,
  ShieldCheck, LifeBuoy, Info, LogOut, ChevronRight, AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMotion } from '../lib/motion';
import { cn } from '../lib/cn';

interface ProfileLinksProps {
  onTabChange?: (tab: string) => void;
  onOpenPersonalDetails?: () => void;
  onOpenSettings?: () => void;
  onOpenSafety?: () => void;
  onOpenSupport?: () => void;
  onOpenAbout?: () => void;
  onOpenOwnerDashboard?: () => void;
  onOpenAdminDashboard?: () => void;
  onLogout?: () => void;
  isSignedIn?: boolean;
  canPost?: boolean;
  isAdmin?: boolean;
}

interface Row {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  danger?: boolean;
}

/**
 * Everywhere you can go from your profile. One card, two groups.
 *
 * This replaces three components that between them offered twelve controls and
 * duplicated two destinations:
 *
 * - `ProfileShortcuts` — six tiles (Saved, Post, Dashboard, Admin, **Safety**,
 *   Settings)
 * - `ProfileActionList` — four rows (Personal details, **Help centre**, About,
 *   Log out), driven by a `profileActions` data file whose `feedbackMessage`
 *   fields ("Profile editing coming soon.") were never read
 * - `ProfileSafetySupport` — four cards, of which two were buttons that
 *   repeated **Safety** and **Help/Support**, and two were a deposit warning
 *   plus a five-item "before you visit" checklist that the Safety page — one
 *   tap away, and linked from here — already owns in full. The deposit warning
 *   itself appeared twice inside that one component.
 *
 * A single list also makes the role gating auditable at a glance, which is how
 * `ProfileMenu` came to be the one surface offering "Post a vacancy" to
 * tenants.
 */
export default function ProfileLinks({
  onTabChange, onOpenPersonalDetails, onOpenSettings, onOpenSafety, onOpenSupport,
  onOpenAbout, onOpenOwnerDashboard, onOpenAdminDashboard, onLogout,
  isSignedIn = false, canPost = false, isAdmin = false,
}: ProfileLinksProps) {
  const m = useMotion();

  const destinations: Row[] = [
    { id: 'saved', label: 'Saved homes', icon: Bookmark, onClick: () => onTabChange?.('saved') },
    ...(canPost
      ? [
          { id: 'post', label: 'Post a vacancy', icon: PlusCircle, onClick: () => onTabChange?.('post') },
          { id: 'dashboard', label: 'Manage your listings', icon: Building2, onClick: onOpenOwnerDashboard },
        ]
      : []),
    ...(isAdmin
      ? [{ id: 'admin', label: 'Moderate listings', icon: ShieldAlert, onClick: onOpenAdminDashboard }]
      : []),
  ];

  const account: Row[] = [
    ...(isSignedIn
      ? [{ id: 'details', label: 'Personal details', icon: User, onClick: onOpenPersonalDetails }]
      : []),
    { id: 'settings', label: 'Settings', icon: Settings, onClick: onOpenSettings },
    { id: 'safety', label: 'Safety tips', icon: ShieldCheck, onClick: onOpenSafety },
    { id: 'support', label: 'Help & support', icon: LifeBuoy, onClick: onOpenSupport },
    { id: 'about', label: 'About KejaFinder', icon: Info, onClick: onOpenAbout },
    ...(isSignedIn
      ? [{ id: 'logout', label: 'Log out', icon: LogOut, onClick: onLogout, danger: true }]
      : []),
  ];

  return (
    <div className="w-full space-y-3">
      <div className="bg-white dark:bg-stone-900 border border-neutral-150/70 dark:border-stone-800/70 rounded-3xl shadow-2xs overflow-hidden">
        {destinations.length > 0 && (
          <div className="divide-y divide-neutral-100 dark:divide-stone-800/60">
            {destinations.map((row) => <LinkRow key={row.id} row={row} tap={m.tap} />)}
          </div>
        )}
        <div
          className={cn(
            'divide-y divide-neutral-100 dark:divide-stone-800/60',
            destinations.length > 0 && 'border-t-4 border-neutral-50 dark:border-stone-950/60'
          )}
        >
          {account.map((row) => <LinkRow key={row.id} row={row} tap={m.tap} />)}
        </div>
      </div>

      {/* One line, where three cards used to be. The full checklist lives on
        * the Safety page, which the row above links to. */}
      <button
        type="button"
        onClick={onOpenSafety}
        className="flex w-full items-start gap-3 rounded-2xl border border-orange-200/60 dark:border-orange-900/40 bg-orange-50/80 dark:bg-orange-950/20 p-4 text-left transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/30"
      >
        <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-orange-700 dark:text-orange-400 stroke-[2.2]" aria-hidden="true" />
        <span className="text-xs font-semibold leading-relaxed text-orange-800 dark:text-orange-300">
          KejaFinder never collects deposits. Never pay before seeing the house in
          person — <span className="underline decoration-orange-400/60">read the safety checklist</span>.
        </span>
      </button>
    </div>
  );
}

function LinkRow({ row, tap }: { row: Row; tap: TargetAndTransition }) {
  return (
    <motion.button
      type="button"
      whileTap={tap}
      onClick={row.onClick}
      className="flex w-full items-center gap-3.5 p-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-stone-850/40 cursor-pointer outline-none"
    >
      <row.icon
        className={cn(
          'h-4.5 w-4.5 shrink-0 stroke-[2.2]',
          row.danger ? 'text-orange-700 dark:text-orange-400' : 'text-emerald-700 dark:text-emerald-400'
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          'flex-1 text-xs font-bold',
          row.danger ? 'text-orange-700 dark:text-orange-400' : 'text-neutral-800 dark:text-stone-100'
        )}
      >
        {row.label}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-550 dark:text-stone-400 stroke-[2.2]" aria-hidden="true" />
    </motion.button>
  );
}
