import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCheck, ShieldCheck, LogIn } from 'lucide-react';
import NotificationsHeader from '../components/NotificationsHeader';
import NotificationFeed from '../components/NotificationFeed';
import EmptyState from '../components/ui/EmptyState';
import SafetyNote from '../components/ui/SafetyNote';
import Skeleton from '../components/ui/Skeleton';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';
import { useMotion } from '../lib/motion';

interface NotificationsPageProps {
  onOpenSafety?: () => void;
  onOpenAuth?: () => void;
}

/**
 * Notifications, from the real table.
 *
 * This page previously ran entirely on a hardcoded `sampleNotifications`
 * array. Every reader was told the same invented things -- a price drop on a
 * house they had never saved, and "Peter replied to your inquiry about
 * Bedsitter in Rongai", a reply from a person who does not exist. Around that
 * fiction sat 54 controls and 26 cards: a search bar, tab bar, filter chip
 * row, four summary counters, an alert-settings sheet and a recommended-alerts
 * panel -- machinery for slicing data that was never real, plus seven buttons
 * whose only effect was a "coming soon" toast.
 *
 * The alert-settings sheet was the worst of it: it reported "Alert preferences
 * saved successfully." while saving nothing anywhere. There is no preferences
 * column or table, so it is gone rather than restyled.
 *
 * What is left is what the schema supports: read your notifications, mark them
 * read, delete them. Filters and counters can come back the day there is
 * enough volume to need them -- which requires something writing to the table
 * first. Nothing does yet (see notificationService for what that would take),
 * so the honest state today is the empty state below.
 */
export default function NotificationsPage({ onOpenSafety, onOpenAuth }: NotificationsPageProps) {
  const { user } = useAuth();
  const m = useMotion();
  const { notifications, unreadCount, isLoading, error, markRead, markAllRead, remove } = useNotifications();

  const subtitle = useMemo(() => {
    if (!user) return 'Log in to see updates about your saved homes.';
    if (isLoading) return 'Checking for updates…';
    if (unreadCount > 0) return `${unreadCount} unread`;
    return 'You are all caught up.';
  }, [user, isLoading, unreadCount]);

  return (
    <motion.div
      variants={m.stagger(0.06)}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col gap-5 pb-24"
    >
      <NotificationsHeader unreadCount={unreadCount} />

      <motion.div variants={m.fadeUp} className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-neutral-850 dark:text-neutral-100">
            Notifications
          </h1>
          <p className="mt-0.5 text-2xs font-semibold text-neutral-550 dark:text-stone-400">{subtitle}</p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-stone-800 px-3 py-2 text-3xs font-black uppercase tracking-wider text-neutral-700 dark:text-stone-200 transition-colors hover:bg-neutral-50 dark:hover:bg-stone-850"
          >
            <CheckCheck className="h-3.5 w-3.5 stroke-[2.4]" aria-hidden="true" />
            Mark all read
          </button>
        )}
      </motion.div>

      <motion.div variants={m.fadeUp} className="w-full">
        {!user ? (
          <EmptyState
            icon={LogIn}
            title="Log in to see notifications"
            description="We'll tell you when something changes on a home you saved."
            primaryAction={onOpenAuth ? { label: 'Log in', onClick: onOpenAuth } : undefined}
          />
        ) : isLoading ? (
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <EmptyState icon={Bell} title="Could not load notifications" description={error} />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Nothing yet"
            description="When a home you saved changes price or availability, or a listing you posted is reviewed, it will show up here."
            secondaryAction={onOpenSafety ? { label: 'Safety tips', onClick: onOpenSafety, icon: ShieldCheck } : undefined}
          />
        ) : (
          <NotificationFeed notifications={notifications} onMarkRead={markRead} onRemove={remove} />
        )}
      </motion.div>

      {/* The page's one safety note, at the bottom where it does not crowd the
        * list. See ui/SafetyNote for why there is exactly one. */}
      <motion.div variants={m.fadeUp} className="px-1">
        <SafetyNote />
      </motion.div>
    </motion.div>
  );
}
