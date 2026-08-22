import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandlordDashboardHeader from '../components/LandlordDashboardHeader';
import ProfileStats, { ProfileStatItem } from '../components/ProfileStats';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  BookOpen,
  CheckCircle2,
  Home,
  Clock,
  Eye,
  MessageSquare,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  ImageOff,
  Ban,
} from 'lucide-react';
import { useOwnerListings } from '../hooks/useOwnerListings';
import type { OwnerListingRow } from '../services/ownerListingsService';
import { getListingTypeLabel, ListingType } from '../types/listing';
import { supabase } from '../lib/supabase/client';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

interface OwnerDashboardPageProps {
  onBack: () => void;
  onGoPost?: () => void;
  onGoSearch?: () => void;
  onGoSafety?: () => void;
  onSelectListing?: (id: string) => void;
}

function publicThumbUrl(storagePath: string): string {
  return supabase.storage.from('listing-photos').getPublicUrl(storagePath).data.publicUrl;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-neutral-100 dark:bg-stone-800 text-neutral-600 dark:text-stone-400 border-neutral-200 dark:border-stone-700' },
  pending_review: { label: 'Pending Review', className: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40' },
  approved: { label: 'Approved', className: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
  rejected: { label: 'Rejected', className: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40' },
};

function ListingRow({
  listing,
  onSelect,
  onDelete,
  onToggleAvailability,
}: {
  key?: string | number;
  listing: OwnerListingRow;
  onSelect?: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onToggleAvailability: (id: string, available: boolean) => Promise<boolean>;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const badge = STATUS_BADGE[listing.moderation_status] || STATUS_BADGE.draft;
  const cover = listing.listing_images?.[0]?.storage_path;
  const isLive = listing.moderation_status === 'approved' && listing.availability_status === 'available';

  const handleDelete = async () => {
    setIsBusy(true);
    await onDelete(listing.id);
    setIsBusy(false);
  };

  const handleToggle = async () => {
    setIsBusy(true);
    await onToggleAvailability(listing.id, listing.availability_status !== 'available');
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
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect?.(listing.id)}
        className="w-full flex items-center space-x-3 text-left cursor-pointer outline-none"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-stone-850 border border-neutral-200/60 dark:border-stone-800 shrink-0 flex items-center justify-center">
          {cover ? (
            <img src={publicThumbUrl(cover)} alt={listing.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
          ) : (
            <ImageOff className="w-5 h-5 text-neutral-550 dark:text-stone-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-black text-neutral-800 dark:text-stone-100 truncate">{listing.title}</h4>
          <p className="text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400 truncate">
            {getListingTypeLabel(listing.house_type as ListingType)} · KSh {Number(listing.monthly_rent).toLocaleString()}/mo
          </p>
        </div>
        <span className={`shrink-0 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${badge.className}`}>
          {badge.label}
        </span>
      </motion.button>

      {listing.moderation_status === 'approved' && (
        <div className="flex items-center justify-between text-[10.5px] font-bold text-neutral-500 dark:text-stone-400 px-0.5">
          <span className="flex items-center space-x-1"><Eye className="w-3.5 h-3.5" /><span>{listing.views_count} views</span></span>
          <span className="flex items-center space-x-1"><MessageSquare className="w-3.5 h-3.5" /><span>{listing.call_clicks_count + listing.whatsapp_clicks_count} contacts</span></span>
          <span className={`flex items-center space-x-1 ${isLive ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-550'}`}>
            {isLive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Live' : 'Taken'}</span>
          </span>
        </div>
      )}

      {/* Real actions -- exactly what RLS actually allows for each state */}
      {listing.moderation_status === 'draft' && (
        confirmingDelete ? (
          <div className="flex items-center space-x-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={isBusy}
              onClick={handleDelete}
              className="flex-1 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-wider disabled:opacity-60"
            >
              {isBusy ? 'Deleting...' : 'Confirm delete'}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setConfirmingDelete(false)}
              className="flex-1 h-9 rounded-xl bg-neutral-100 dark:bg-stone-800 text-neutral-600 dark:text-stone-300 text-[11px] font-black uppercase tracking-wider"
            >
              Cancel
            </motion.button>
          </div>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setConfirmingDelete(true)}
            className="w-full h-9 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-[11px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete draft</span>
          </motion.button>
        )
      )}

      {listing.moderation_status === 'pending_review' && (
        <div className="flex items-center space-x-2 text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/10 rounded-xl px-3 py-2">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Waiting for admin review -- usually within 2 hours.</span>
        </div>
      )}

      {listing.moderation_status === 'approved' && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={isBusy}
          onClick={handleToggle}
          className="w-full h-9 rounded-xl border border-neutral-200 dark:border-stone-800 text-neutral-700 dark:text-stone-300 text-[11px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 disabled:opacity-60"
        >
          {isLive ? <ToggleRight className="w-4 h-4 text-emerald-700" /> : <ToggleLeft className="w-4 h-4" />}
          <span>{isBusy ? 'Updating...' : isLive ? 'Mark as taken' : 'Mark as available'}</span>
        </motion.button>
      )}

      {listing.moderation_status === 'rejected' && (
        <div className="flex items-center space-x-2 text-[10.5px] font-bold text-red-700 dark:text-red-400 bg-red-50/60 dark:bg-red-950/10 rounded-xl px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>This listing was rejected. Contact support if you think this is a mistake.</span>
        </div>
      )}
    </motion.div>
  );
}

function ListingRowSkeleton() {
  return (
    <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2.5xl p-4 shadow-sm space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton variant="block" className="w-14 h-14 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
        <Skeleton variant="block" className="w-14 h-5 rounded-lg shrink-0" />
      </div>
      <Skeleton variant="block" className="w-full h-9 rounded-xl" />
    </div>
  );
}

export default function OwnerDashboardPage({ onBack, onGoPost, onGoSearch, onGoSafety, onSelectListing }: OwnerDashboardPageProps) {
  const { listings, stats, isLoading, error, deleteListing, setAvailability } = useOwnerListings();
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

  const statItems: ProfileStatItem[] = [
    { label: 'Total Listings', value: stats.total, icon: Home },
    { label: 'Pending Review', value: stats.pendingReview, icon: Clock },
    { label: 'Live Now', value: stats.liveNow, icon: CheckCircle2 },
    { label: 'Total Views', value: stats.totalViews, icon: Eye },
    { label: 'Total Contacts', value: stats.totalContacts, icon: MessageSquare },
  ];

  return (
    <div className="absolute inset-0 bg-neutral-50 dark:bg-stone-950 flex flex-col xl:items-center xl:bg-neutral-100 dark:xl:bg-stone-900 pb-20">
      <div className="w-full h-full flex flex-col bg-white dark:bg-stone-950 shadow-2xl xl:max-w-[440px] xl:h-[850px] xl:my-auto xl:rounded-[40px] xl:overflow-hidden relative xl:border xl:border-neutral-200/50 dark:xl:border-stone-800">

        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[40%] bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl rounded-full" />
        </div>

        <LandlordDashboardHeader onBack={onBack} />

        <div className="flex-1 overflow-y-auto scrollbar-hide z-10 px-4 pt-6 pb-28">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <h2 className="text-2xl font-black text-neutral-800 dark:text-stone-100 tracking-tight leading-tight">
                Your listings
              </h2>
              <p className="text-[13px] font-semibold text-neutral-500 dark:text-stone-400 leading-relaxed max-w-[280px] mx-auto">
                Manage your vacancies, availability, and listing status.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
              <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onGoPost} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-stone-900 border border-neutral-200/60 dark:border-stone-800/60 shadow-sm space-y-1.5 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-stone-300 text-center leading-tight">Post new vacancy</span>
              </motion.button>
              <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onGoSearch} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-stone-900 border border-neutral-200/60 dark:border-stone-800/60 shadow-sm space-y-1.5 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-stone-300 text-center leading-tight">View public listings</span>
              </motion.button>
              <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onGoSafety} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-stone-900 border border-neutral-200/60 dark:border-stone-800/60 shadow-sm space-y-1.5 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-stone-300 text-center leading-tight">Read safety tips</span>
              </motion.button>
            </motion.div>

            {stats.total > 0 && (
              <motion.div variants={itemVariants}>
                <ProfileStats stats={statItems} />
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ListingRowSkeleton key={i} />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="bg-white/70 dark:bg-stone-900/40 border border-dashed border-neutral-300 dark:border-stone-700 rounded-2xl p-6 text-center space-y-3">
                  <Home className="w-8 h-8 text-neutral-550 dark:text-stone-400 mx-auto" />
                  <p className="text-[12px] font-bold text-neutral-500 dark:text-stone-400">
                    You haven't posted any vacancies yet.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onGoPost}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black uppercase tracking-wider"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post your first vacancy</span>
                  </motion.button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {listings.map((listing) => (
                    <ListingRow
                      key={listing.id}
                      listing={listing}
                      onSelect={onSelectListing}
                      onDelete={deleteListing}
                      onToggleAvailability={setAvailability}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/60 dark:border-orange-900/30 rounded-2.5xl p-4 shadow-sm flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11.5px] font-black text-orange-900 dark:text-orange-300 leading-tight mb-1">
                  Never send deposit before physically viewing the house and confirming the caretaker or landlord.
                </h4>
                <p className="text-[10.5px] font-medium text-orange-800/80 dark:text-orange-400/80 leading-snug">
                  Clear listings and honest contact details help renters stay safe.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
