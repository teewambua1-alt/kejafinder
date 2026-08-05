import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileIdentityCard from '../components/ProfileIdentityCard';
import ProfileStats from '../components/ProfileStats';
import ProfileShortcuts from '../components/ProfileShortcuts';
import ProfileInteractedListings from '../components/ProfileInteractedListings';
import ProfileRecentActivity from '../components/ProfileRecentActivity';
import ProfileActionList from '../components/ProfileActionList';
import ProfileTrustStatus from '../components/ProfileTrustStatus';
import ProfileSettingsPanel, { ProfileSettingsPanelType } from '../components/ProfileSettingsPanel';
import ProfileSafetySupport from '../components/ProfileSafetySupport';
import ProfileModeSwitch from '../components/ProfileModeSwitch';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onTabChange?: (tab: string) => void;
  onOpenAuth?: () => void;
  onOpenSafety?: () => void;
  onOpenAbout?: () => void;
  onOpenSupport?: () => void;
  onOpenLandlordDashboard?: () => void;
  onOpenTestMode?: () => void;
  onOpenDesignSystem?: () => void;
}

export default function ProfilePage({ onTabChange, onOpenAuth, onOpenSafety, onOpenAbout, onOpenSupport, onOpenLandlordDashboard, onOpenTestMode, onOpenDesignSystem }: ProfilePageProps) {
  const { user: currentUser, signOut } = useAuth();
  const [profileMode, setProfileMode] = useState<"renter" | "poster">("renter");
  const [activeSettingsPanel, setActiveSettingsPanel] = useState<ProfileSettingsPanelType | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      handleSave("Logged out successfully");
    } catch (e) {
      handleSave("Failed to logout");
    }
  };

  // Stagger scale animation for placeholders
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.35, 
        ease: 'easeOut' 
      } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col py-2 space-y-5 animate-fadeIn pb-24"
    >
      {/* Visual background ambient blur spots */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Real Profile Header */}
      <ProfileHeader 
        onNotificationsClick={() => onTabChange?.('notifications')} 
        onSettingsClick={() => setActiveSettingsPanel('settings_home')}
      />

      {/* Page Title Section below the header row */}
      <motion.div variants={itemVariants} className="w-full space-y-0.5 px-1">
        <h1 className="text-xl font-black text-neutral-850 dark:text-neutral-100 uppercase tracking-tight">
          My Profile
        </h1>
        <p className="text-[11.5px] font-semibold text-neutral-550 dark:text-stone-400">
          Manage your account and preferences.
        </p>
      </motion.div>

      {/* Auth Prompt Banner - Show if NOT logged in */}
      {!currentUser && (
        <motion.div variants={itemVariants} className="w-full px-1">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-tight mb-1">
                Create an account
              </h3>
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-500 max-w-[200px]">
                Sign in to save your favorite houses, post vacancies, and access more features.
              </p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-shadow"
            >
              Login / Sign up
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 2. Real Profile Identity Card - Show if logged in */}
      {currentUser && (
        <ProfileIdentityCard profileMode={profileMode} />
      )}

      {/* Renter / Poster Mode Switcher Segment */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileModeSwitch 
          profileMode={profileMode} 
          setProfileMode={setProfileMode} 
          onTabChange={onTabChange} 
        />
      </motion.div>

      {/* Trust & Verification Status */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileTrustStatus />
      </motion.div>


      {/* 3. Real Profile Stats Row */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileStats />
      </motion.div>

      {/* 4. Real Profile Shortcuts */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileShortcuts onTabChange={onTabChange} onOpenSettings={() => setActiveSettingsPanel('settings_home')} onOpenSafety={onOpenSafety} onOpenLandlordDashboard={onOpenLandlordDashboard} onOpenTestMode={onOpenTestMode} onOpenDesignSystem={onOpenDesignSystem} />
      </motion.div>

      {/* 5. Recently Interacted listings */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileInteractedListings />
      </motion.div>

      {/* 6. Recent Activity Log */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileRecentActivity />
      </motion.div>

      {/* 7. Real Profile Action Preferences List */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileActionList onLogout={handleLogout} onOpenPanel={(pType) => {
          if (pType as string === 'about_page') {
            if (onOpenAbout) onOpenAbout();
          } else {
            setActiveSettingsPanel(pType);
          }
        }} />
      </motion.div>

      {/* 8. Safety & Support Component */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileSafetySupport onOpenSafety={onOpenSafety} onOpenSupport={onOpenSupport} />
      </motion.div>

      {/* Profile settings panel bottom sheet modal */}
      <ProfileSettingsPanel
        type={activeSettingsPanel!}
        isOpen={activeSettingsPanel !== null}
        onClose={() => setActiveSettingsPanel(null)}
        onSave={handleSave}
        onTypeChange={(newType) => setActiveSettingsPanel(newType)}
        onOpenAbout={onOpenAbout}
        onOpenSupport={onOpenSupport}
        onLogout={handleLogout}
      />

      {/* Feedback toast message notifications */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-x-0 bottom-24 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-auto shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
