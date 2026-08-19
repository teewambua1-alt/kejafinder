import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandlordDashboardHeader from '../components/LandlordDashboardHeader';
import ProfileStats, { ProfileStatItem } from '../components/ProfileStats';
import {
  Clock,
  Users,
  Flag,
  BadgeCheck,
  Check,
  X,
  ImageOff,
  ShieldAlert,
  ScrollText,
  Inbox,
} from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useIsAdmin } from '../hooks/useIsAdmin';
import type { AdminListingRow } from '../services/adminService';
import { getListingTypeLabel, ListingType } from '../types/listing';
import { supabase } from '../lib/supabase/client';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

interface AdminDashboardPageProps {
  onBack: () => void;
}

function publicThumbUrl(storagePath: string): string {
  return supabase.storage.from('listing-photos-pending').getPublicUrl(storagePath).data.publicUrl;
}

function PendingListingCard({
  listing,
  onApprove,
  onReject,
}: {
  key?: string | number;
  listing: AdminListingRow;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string, notes?: string) => Promise<boolean>;
}) {
  const [isBusy, setIsBusy] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [reason, setReason] = useState('');
  const cover = listing.listing_images?.[0]?.storage_path;

  const handleApprove = async () => {
    setIsBusy(true);
    await onApprove(listing.id);
    setIsBusy(false);
  };

  const handleReject = async () => {
    setIsBusy(true);
    await onReject(listing.id, reason.trim() || undefined);
    setIsBusy(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2.5xl p-4 shadow-sm space-y-3"
    >
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-stone-850 border border-neutral-200/60 dark:border-stone-800 shrink-0 flex items-center justify-center">
          {cover ? (
            <img src={publicThumbUrl(cover)} alt={listing.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
          ) : (
            <ImageOff className="w-5 h-5 text-neutral-550 dark:text-stone-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-black text-neutral-800 dark:text-stone-100 truncate">{listing.title}</h4>
          <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400 truncate">
            {getListingTypeLabel(listing.house_type as ListingType)} · {listing.estate}, {listing.town} · KSh {Number(listing.monthly_rent).toLocaleString()}/mo
          </p>
        </div>
      </div>

      {showRejectReason ? (
        <div className="space-y-2">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className="w-full h-9 px-3 rounded-xl border border-neutral-200 dark:border-stone-800 bg-neutral-50 dark:bg-stone-850 text-xs font-semibold text-neutral-800 dark:text-stone-200 outline-none focus:border-red-400"
          />
          <div className="flex items-center space-x-2">
            <motion.button type="button" whileTap={{ scale: 0.97 }} disabled={isBusy} onClick={handleReject} className="flex-1 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-wider disabled:opacity-60">
              {isBusy ? 'Rejecting...' : 'Confirm reject'}
            </motion.button>
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => setShowRejectReason(false)} className="flex-1 h-9 rounded-xl bg-neutral-100 dark:bg-stone-800 text-neutral-600 dark:text-stone-300 text-[11px] font-black uppercase tracking-wider">
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={isBusy}
            onClick={handleApprove}
            className="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 disabled:opacity-60"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isBusy ? 'Working...' : 'Approve'}</span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={isBusy}
            onClick={() => setShowRejectReason(true)}
            className="flex-1 h-9 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-[11px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject</span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function PendingListingCardSkeleton() {
  return (
    <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2.5xl p-4 shadow-sm space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton variant="block" className="w-14 h-14 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton variant="block" className="flex-1 h-9 rounded-xl" />
        <Skeleton variant="block" className="flex-1 h-9 rounded-xl" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage({ onBack }: AdminDashboardPageProps) {
  const { isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { stats, pendingListings, openReports, pendingVerifications, recentActions, isLoading, error, approveListing, rejectListing } = useAdminDashboard(isAdmin);
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error);
    }
  }, [error, showToast]);

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const usersByRole: Record<string, number> = stats?.usersByRole ?? {};
  const totalUsers = Object.values(usersByRole).reduce((a, b) => a + b, 0);
  const statItems: ProfileStatItem[] = [
    { label: 'Pending Review', value: stats?.pendingReview ?? 0, icon: Clock },
    { label: 'Total Users', value: totalUsers, icon: Users },
    { label: 'Open Reports', value: stats?.openReports ?? 0, icon: Flag },
    { label: 'Pending Verifications', value: stats?.pendingVerifications ?? 0, icon: BadgeCheck },
  ];

  if (!isCheckingAdmin && !isAdmin) {
    return (
      <div className="absolute inset-0 bg-neutral-50 dark:bg-stone-950 flex flex-col xl:items-center xl:bg-neutral-100 dark:xl:bg-stone-900 pb-20">
        <div className="w-full h-full flex flex-col bg-white dark:bg-stone-950 shadow-2xl xl:max-w-[440px] xl:h-[850px] xl:my-auto xl:rounded-[40px] xl:overflow-hidden relative xl:border xl:border-neutral-200/50 dark:xl:border-stone-800">
          <LandlordDashboardHeader onBack={onBack} />
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-3">
            <ShieldAlert className="w-10 h-10 text-orange-500" />
            <h2 className="text-base font-black text-neutral-800 dark:text-stone-100">Admin access required</h2>
            <p className="text-[12px] font-semibold text-neutral-500 dark:text-stone-400">
              Your account isn't an admin, so there's nothing real to show here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-neutral-50 dark:bg-stone-950 flex flex-col xl:items-center xl:bg-neutral-100 dark:xl:bg-stone-900 pb-20">
      <div className="w-full h-full flex flex-col bg-white dark:bg-stone-950 shadow-2xl xl:max-w-[440px] xl:h-[850px] xl:my-auto xl:rounded-[40px] xl:overflow-hidden relative xl:border xl:border-neutral-200/50 dark:xl:border-stone-800">
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[40%] bg-orange-100/40 dark:bg-orange-900/10 blur-3xl rounded-full" />
        </div>

        <LandlordDashboardHeader onBack={onBack} />

        <div className="flex-1 overflow-y-auto scrollbar-hide z-10 px-4 pt-6 pb-28">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-2xl font-black text-neutral-800 dark:text-stone-100 tracking-tight leading-tight">
                Admin dashboard
              </h2>
              <p className="text-[13px] font-semibold text-neutral-500 dark:text-stone-400 leading-relaxed max-w-[280px] mx-auto">
                Real platform stats and a live moderation queue.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <ProfileStats stats={statItems} />
            </motion.div>

            {/* Real moderation queue */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider px-1">
                Pending review ({pendingListings.length})
              </h3>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <PendingListingCardSkeleton key={i} />
                  ))}
                </div>
              ) : pendingListings.length === 0 ? (
                <div className="bg-white/70 dark:bg-stone-900/40 border border-dashed border-neutral-300 dark:border-stone-700 rounded-2xl p-6 text-center space-y-2">
                  <Inbox className="w-7 h-7 text-neutral-550 dark:text-stone-600 mx-auto" />
                  <p className="text-[12px] font-bold text-neutral-500 dark:text-stone-400">Nothing waiting for review right now.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {pendingListings.map((listing) => (
                    <PendingListingCard key={listing.id} listing={listing} onApprove={approveListing} onReject={rejectListing} />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Real open reports */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider px-1">
                Open reports ({openReports.length})
              </h3>
              {openReports.length === 0 ? (
                <div className="bg-white/70 dark:bg-stone-900/40 border border-dashed border-neutral-300 dark:border-stone-700 rounded-2xl p-5 text-center">
                  <p className="text-[11.5px] font-bold text-neutral-500 dark:text-stone-400">No open reports.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {openReports.map((report) => (
                    <div key={report.id} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-xl p-3.5">
                      <p className="text-[11.5px] font-black text-neutral-800 dark:text-stone-100 capitalize">{report.reason.replace(/_/g, ' ')}</p>
                      {report.message && <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400 mt-0.5">{report.message}</p>}
                      <p className="text-[9.5px] font-bold text-neutral-400 dark:text-stone-500 mt-1">{new Date(report.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Real pending verification requests -- honestly empty until Post Vacancy's trust toggles are wired to this table */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider px-1">
                Pending verification requests ({pendingVerifications.length})
              </h3>
              {pendingVerifications.length === 0 ? (
                <div className="bg-white/70 dark:bg-stone-900/40 border border-dashed border-neutral-300 dark:border-stone-700 rounded-2xl p-5 text-center">
                  <p className="text-[11.5px] font-bold text-neutral-500 dark:text-stone-400">No pending verification requests.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingVerifications.map((vr) => (
                    <div key={vr.id} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-xl p-3.5">
                      <p className="text-[11.5px] font-black text-neutral-800 dark:text-stone-100 capitalize">{vr.request_type.replace(/_/g, ' ')} verification</p>
                      <p className="text-[9.5px] font-bold text-neutral-400 dark:text-stone-500 mt-1">{new Date(vr.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Real recent admin actions -- the audit log, visible for the first time */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider px-1 flex items-center space-x-1.5">
                <ScrollText className="w-3.5 h-3.5" />
                <span>Recent admin actions</span>
              </h3>
              {recentActions.length === 0 ? (
                <div className="bg-white/70 dark:bg-stone-900/40 border border-dashed border-neutral-300 dark:border-stone-700 rounded-2xl p-5 text-center">
                  <p className="text-[11.5px] font-bold text-neutral-500 dark:text-stone-400">No admin actions yet.</p>
                </div>
              ) : (
                <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2xl overflow-hidden divide-y divide-neutral-100 dark:divide-stone-800/40">
                  {recentActions.map((action) => (
                    <div key={action.id} className="p-3.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-neutral-700 dark:text-stone-300">
                          <span className="font-black text-neutral-850 dark:text-stone-100">{action.adminName || 'An admin'}</span>{' '}
                          {action.action.replace(/_/g, ' ')}d a {action.target_type}
                        </p>
                        {action.notes && <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-500 mt-0.5 truncate">{action.notes}</p>}
                      </div>
                      <span className="text-[9px] font-bold text-neutral-400 dark:text-stone-500 shrink-0">
                        {new Date(action.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
