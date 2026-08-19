import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  HelpCircle,
  LogOut,
  Info,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';

export type ProfileSettingsPanelType =
  | "settings_home"
  | "personal_details"
  | "help_center"
  | "logout"
  | "about_page";

interface ProfileSettingsPanelProps {
  type: ProfileSettingsPanelType;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (message: string) => void;
  onTypeChange?: (type: ProfileSettingsPanelType) => void;
  onOpenAbout?: () => void;
  onOpenSupport?: () => void;
  onLogout?: () => void;
}

export default function ProfileSettingsPanel({ type, isOpen, onClose, onSave, onTypeChange, onOpenAbout, onOpenSupport, onLogout }: ProfileSettingsPanelProps) {
  const { user, profile, refreshProfile } = useAuth();

  // Direct redirect when about_page selected: closes bottom-sheet and opens the custom view
  React.useEffect(() => {
    if (isOpen && type === 'about_page') {
      onClose();
      if (onOpenAbout) {
        onOpenAbout();
      }
    }
    if (isOpen && type === 'help_center') {
      onClose();
      if (onOpenSupport) {
        onOpenSupport();
      }
    }
  }, [isOpen, type, onOpenAbout, onOpenSupport, onClose]);

  // Personal Details -- real data from useAuth(), re-synced whenever the
  // panel opens so a profile that finishes loading after mount isn't missed.
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [town, setTown] = useState(profile?.town || '');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  React.useEffect(() => {
    if (isOpen && type === 'personal_details') {
      setFullName(profile?.full_name || '');
      setPhone(profile?.phone || '');
      setTown(profile?.town || '');
    }
  }, [isOpen, type, profile]);

  const displayName = profile?.full_name || (user?.user_metadata?.full_name as string | undefined) || 'KejaFinder User';
  const photoURL = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff`;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  // Handle standard Done/Save button
  const handleDone = async () => {
    if (type === 'personal_details') {
      if (!user) {
        onSave?.('Log in to save profile changes.');
        onClose();
        return;
      }
      setIsSavingDetails(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim(), phone: phone.trim(), town: town.trim() || null })
        .eq('id', user.id);
      setIsSavingDetails(false);

      if (error) {
        console.error('Error saving personal details:', error);
        onSave?.('Could not save your changes. Please try again.');
        return;
      }
      await refreshProfile();
      onSave?.('Personal details updated.');
      onClose();
      return;
    }

    onSave?.('Settings preference panel updated.');
    onClose();
  };

  // Render contents according to panel type
  const renderPanelContents = () => {
    switch (type) {
      case 'settings_home':
        return (
          <div className="space-y-4">
            {/* Quick Profile Summary Card in Settings Hub */}
            <div className="p-4 rounded-2.5xl bg-neutral-50/70 dark:bg-stone-920 border border-neutral-150/70 dark:border-stone-850 flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white dark:border-stone-800 shadow-3xs shrink-0 bg-neutral-200 dark:bg-stone-750">
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[13px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-tight leading-none">
                  {displayName}
                </h4>
                <p className="text-[9.5px] font-semibold text-neutral-550 dark:text-stone-450 leading-none mt-1 uppercase tracking-wider">
                  {profile?.role || 'Member'}{memberSince ? ` · Member since ${memberSince}` : ''}
                </p>
              </div>
              <span className="text-[8px] font-black px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-400 border border-emerald-100/40 dark:border-emerald-900/30 uppercase tracking-widest font-sans">
                Active
              </span>
            </div>

            {/* List of categories */}
            <div className="space-y-3 pt-1">
              {[
                {
                  id: 'account',
                  title: 'Account',
                  desc: 'Personal details and verification',
                  icon: User,
                  action: () => onTypeChange?.('personal_details')
                },
                {
                  id: 'support',
                  title: 'Support',
                  desc: 'Help center and safety messages',
                  icon: HelpCircle,
                  action: () => onTypeChange?.('help_center')
                },
                {
                  id: 'about_page',
                  title: 'About KejaFinder',
                  desc: 'Our mission and local roadmap',
                  icon: Info,
                  action: () => onTypeChange?.('about_page')
                },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <button
                    type="button"
                    key={row.id}
                    onClick={row.action}
                    className="w-full p-3.5 flex items-center space-x-3 bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-2xl hover:bg-neutral-50/50 dark:hover:bg-stone-850/20 hover:border-emerald-555/15 transition-all text-left cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/10"
                  >
                    <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/25 border border-emerald-100/50 dark:border-emerald-900/40 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[12px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-tight leading-tight">
                        {row.title}
                      </span>
                      <span className="block text-[9px] font-semibold text-neutral-400 dark:text-stone-500 leading-none mt-0.5">
                        {row.desc}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-stone-600" />
                  </button>
                );
              })}
            </div>

            {/* Quick logout trigger row at the bottom */}
            <button
              type="button"
              onClick={() => onTypeChange?.('logout')}
              className="w-full mt-2 p-3.5 flex items-center justify-center space-x-2 text-center border border-dashed border-orange-200 dark:border-orange-950/30 hover:border-orange-550/35 bg-white dark:bg-stone-900 rounded-2.5xl transition-all cursor-pointer text-orange-550 dark:text-orange-400 outline-none"
            >
              <LogOut className="w-4 h-4 stroke-[2]" />
              <span className="text-[11px] font-black uppercase tracking-wider">Log Out Options</span>
            </button>
          </div>
        );

      case 'personal_details':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Personal Details</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Configure your contact card</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-550 dark:text-stone-500 uppercase tracking-widest block pl-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-stone-920 border border-neutral-100 dark:border-stone-850 rounded-xl px-3.5 py-2.5 text-xs font-black text-neutral-800 dark:text-stone-200 outline-none focus:border-emerald-500/50"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-550 dark:text-stone-500 uppercase tracking-widest block pl-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-stone-920 border border-neutral-100 dark:border-stone-850 rounded-xl px-3.5 py-2.5 text-xs font-black text-neutral-800 dark:text-stone-200 outline-none focus:border-emerald-500/50"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-550 dark:text-stone-500 uppercase tracking-widest block pl-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-neutral-100 dark:bg-stone-850 border border-neutral-100 dark:border-stone-850 rounded-xl px-3.5 py-2.5 text-xs font-black text-neutral-500 dark:text-stone-400 outline-none cursor-not-allowed"
                  placeholder="No email on this account"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-550 dark:text-stone-500 uppercase tracking-widest block pl-1">Town / Area</label>
                <input
                  type="text"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-stone-920 border border-neutral-100 dark:border-stone-850 rounded-xl px-3.5 py-2.5 text-xs font-black text-neutral-800 dark:text-stone-200 outline-none focus:border-emerald-500/50"
                  placeholder="e.g. Syokimau"
                />
              </div>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-stone-850 rounded-2xl border border-neutral-150/70 dark:border-stone-800 mt-2 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[10px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
                Email can't be changed here. Name, phone, and town are saved to your account when you tap Done.
              </p>
            </div>
          </div>
        );

      case 'logout':
        return (
          <div className="space-y-4 text-center py-4">
            {/* Visual Red Warning graphic illustration */}
            <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center mx-auto mb-3 text-orange-550 border border-orange-200">
              <LogOut className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="space-y-1.5 max-w-xs mx-auto">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Sign Out</h2>
              <p className="text-[11.5px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
                You'll need to log in again to access your account.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl border border-neutral-200 dark:border-stone-850 text-neutral-800 dark:text-stone-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer outline-none"
              >
                Cancel Action
              </button>
              <button
                onClick={() => {
                  onClose();
                  onLogout?.();
                }}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl bg-orange-550 text-white hover:bg-orange-600 transition-all cursor-pointer outline-none"
              >
                Log Out
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* A. Dark Translucent glass Backdrop layout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-end justify-center px-0 py-0"
            role="dialog"
            aria-modal="true"
          >
            {/* B. Slide-up visual panel sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-stone-900 border-t border-neutral-150/90 dark:border-stone-850 rounded-t-3xl p-5 shadow-xl flex flex-col max-h-[85vh] overflow-y-auto z-51 select-none pointer-events-auto"
            >
              {/* Drag Handle block decoration slider */}
              <div className="w-10 h-1 bg-neutral-200 dark:bg-stone-800 rounded-full mx-auto mb-4 shrink-0" />

              {/* Header rows with close icon button */}
              <div className="flex items-center justify-between pb-3 shrink-0">
                <div className="flex items-center space-x-1.5 min-w-0">
                  {type !== "settings_home" && onTypeChange && (
                    <button
                      type="button"
                      onClick={() => onTypeChange("settings_home")}
                      className="w-7 h-7 rounded-xl bg-neutral-50 dark:bg-stone-850 border border-neutral-150/50 dark:border-stone-805 flex items-center justify-center text-neutral-550 hover:text-neutral-800 dark:text-stone-400 dark:hover:text-stone-200 active:scale-95 transition-all outline-none cursor-pointer"
                      aria-label="Back to Settings Hub"
                    >
                      <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  )}
                  <span className="text-[9px] font-extrabold text-neutral-550 dark:text-stone-550 uppercase tracking-widest font-mono select-none truncate">
                    {type === "settings_home" ? "KejaFinder Settings" : "KejaFinder Panel"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-xl bg-neutral-50 dark:bg-stone-850 border border-neutral-150 dark:border-stone-800 flex items-center justify-center text-neutral-500 hover:text-neutral-800 dark:text-stone-400 dark:hover:text-stone-200 active:scale-95 transition-all outline-none cursor-pointer"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Dynamic Body content based on type */}
              <div className="flex-1 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-200">
                {renderPanelContents()}
              </div>

              {/* C. Bottom save/cancel confirmations container standard buttons */}
              {type !== 'logout' && (
                <div className="pt-4 border-t border-neutral-100 dark:divide-stone-850 flex items-center space-x-2 shrink-0">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border border-neutral-200 dark:border-stone-850 text-neutral-550 dark:text-stone-450 hover:bg-neutral-50 cursor-pointer outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDone}
                    className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 active:scale-97 transition-all cursor-pointer outline-none"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
