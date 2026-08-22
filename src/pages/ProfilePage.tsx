import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Search, Home, Clock, CheckCircle2, Eye, MessageSquare } from 'lucide-react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileIdentityCard from '../components/ProfileIdentityCard';
import ProfileStats, { ProfileStatItem } from '../components/ProfileStats';
import ProfileLinks from '../components/ProfileLinks';
import ProfileTrustStatus from '../components/ProfileTrustStatus';
import ProfileSettingsPanel, { ProfileSettingsPanelType } from '../components/ProfileSettingsPanel';
import { useAuth } from '../context/AuthContext';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useOwnerListings } from '../hooks/useOwnerListings';
import { useSavedListings } from '../hooks/useSavedListings';
import { useSavedSearches } from '../hooks/useSavedSearches';
import { useToast } from '../context/ToastContext';
import { isPosterRole } from '../lib/roles';

interface ProfilePageProps {
  onTabChange?: (tab: string) => void;
  onOpenAuth?: () => void;
  onOpenSafety?: () => void;
  onOpenAbout?: () => void;
  onOpenSupport?: () => void;
  onOpenOwnerDashboard?: () => void;
  onOpenAdminDashboard?: () => void;
}

export default function ProfilePage({ onTabChange, onOpenAuth, onOpenSafety, onOpenAbout, onOpenSupport, onOpenOwnerDashboard, onOpenAdminDashboard }: ProfilePageProps) {
  const { user: currentUser, profile, signOut } = useAuth();
  const { showToast } = useToast();
  const [activeSettingsPanel, setActiveSettingsPanel] = useState<ProfileSettingsPanelType | null>(null);

  const isPoster = isPosterRole(profile);
  const { isAdmin } = useIsAdmin();

  // Every one of these real hooks is called unconditionally (rules of
  // hooks), but skips its own fetch internally when the account can't
  // possibly need that data -- see the `enabled` param on each.
  const { savedListings } = useSavedListings();
  const { savedSearches } = useSavedSearches();
  const { stats: ownerStats } = useOwnerListings(isPoster);

  const handleSave = (msg: string) => {
    showToast(msg);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      handleSave("Logged out successfully");
    } catch (e) {
      handleSave("Failed to logout");
    }
  };

  // Real stat set for the account's own role -- admin platform-wide numbers
  // live exclusively in the Admin Dashboard (an account can be both a
  // poster and an admin at once, so admin-ness must never crowd out their
  // own real listing stats here).
  const stats: ProfileStatItem[] = !currentUser
    ? []
    : isPoster
    ? [
        { label: 'Total Listings', value: ownerStats.total, icon: Home },
        { label: 'Pending Review', value: ownerStats.pendingReview, icon: Clock },
        { label: 'Live Now', value: ownerStats.liveNow, icon: CheckCircle2 },
        { label: 'Total Views', value: ownerStats.totalViews, icon: Eye },
        { label: 'Total Contacts', value: ownerStats.totalContacts, icon: MessageSquare },
      ]
    : [
        { label: 'Saved Homes', value: savedListings.length, icon: Heart },
        { label: 'Saved Searches', value: savedSearches.length, icon: Search },
      ];

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
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-orange-500/5 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

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
              {/* h2, not h3: this sits directly under the page h1, and h1 -> h3
                  skips a level. */}
              <h2 className="text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-tight mb-1">
                Create an account
              </h2>
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-500 max-w-[200px]">
                Sign in to save your favorite houses, post vacancies, and access more features.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-700 dark:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-shadow"
            >
              Login / Sign up
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 2. Real Profile Identity Card - Show if logged in */}
      {currentUser && <ProfileIdentityCard isAdmin={isAdmin} />}

      {/* Trust & Verification Status - real signals only */}
      {currentUser && (
        <motion.div variants={itemVariants} className="w-full">
          <ProfileTrustStatus
            isPhoneVerified={profile?.is_phone_verified ?? false}
            isIdVerified={profile?.is_id_verified ?? false}
          />
        </motion.div>
      )}

      {/* 3. Real Profile Stats Row -- different real numbers per real role */}
      {currentUser && (
        <motion.div variants={itemVariants} className="w-full">
          <ProfileStats stats={stats} />
        </motion.div>
      )}

      {/* One list of destinations, role-gated. Replaces ProfileShortcuts +
        * ProfileActionList + ProfileSafetySupport, which together duplicated
        * Safety and Help/Support and carried the deposit warning twice. */}
      <motion.div variants={itemVariants} className="w-full">
        <ProfileLinks
          isSignedIn={!!currentUser}
          canPost={isPoster}
          isAdmin={isAdmin}
          onTabChange={onTabChange}
          onOpenPersonalDetails={() => setActiveSettingsPanel('personal_details')}
          onOpenSettings={() => setActiveSettingsPanel('settings_home')}
          onOpenSafety={onOpenSafety}
          onOpenSupport={onOpenSupport}
          onOpenAbout={onOpenAbout}
          onOpenOwnerDashboard={onOpenOwnerDashboard}
          onOpenAdminDashboard={onOpenAdminDashboard}
          onLogout={handleLogout}
        />
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

    </motion.div>
  );
}
