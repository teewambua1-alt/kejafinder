import { motion } from 'motion/react';
import {
  Bell, Heart, ShieldCheck, Tag, BadgeCheck, MessageCircle, Home, Check, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { KejaNotification } from '../types/notifications';
import { formatNotificationTime } from '../lib/relativeDate';
import { useMotion } from '../lib/motion';
import { cn } from '../lib/cn';

interface NotificationCardProps {
  notification: KejaNotification;
  onMarkRead?: (id: string) => void;
  onRemove?: (id: string) => void;
}

/**
 * One notification. Six real fields, no invented ones.
 *
 * The previous card rendered `imageUrl`, `listingTitle`, `location`,
 * `actionLabel`, `actionType`, `timeAgo` and `isImportant` -- none of which
 * exist as columns. They came from a hardcoded array, so every reader saw the
 * same photo of the same house next to a price drop that never happened.
 *
 * `notifications.type` is a plain `text` column with no CHECK constraint, so
 * the icon map below has a real default rather than assuming a closed set.
 */
const TYPE_ICON: Record<string, LucideIcon> = {
  saved: Heart,
  price: Tag,
  availability: Home,
  safety: ShieldCheck,
  verification: BadgeCheck,
  message: MessageCircle,
  listing_approved: BadgeCheck,
  listing_rejected: ShieldCheck,
};

export default function NotificationCard({ notification, onMarkRead, onRemove }: NotificationCardProps) {
  const m = useMotion();
  const Icon = TYPE_ICON[notification.type] ?? Bell;
  const time = formatNotificationTime(notification.createdAt);
  const unread = !notification.isRead;

  return (
    <motion.article
      variants={m.fadeUp}
      className={cn(
        'flex items-start gap-3.5 rounded-2xl border p-4 transition-colors',
        unread
          ? 'border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20'
          : 'border-neutral-150/70 dark:border-stone-800/70 bg-white dark:bg-stone-900'
      )}
    >
      <span
        className={cn(
          'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl',
          unread
            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
            : 'bg-neutral-100 dark:bg-stone-850 text-neutral-700 dark:text-stone-400'
        )}
        aria-hidden="true"
      >
        <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xs font-black text-neutral-850 dark:text-stone-100">
            {notification.title}
          </h3>
          {time && (
            <time
              dateTime={notification.createdAt}
              className="shrink-0 text-3xs font-bold uppercase tracking-wider text-neutral-550 dark:text-stone-400"
            >
              {time}
            </time>
          )}
        </div>
        <p className="mt-1 text-2xs font-medium leading-relaxed text-neutral-600 dark:text-stone-300">
          {notification.message}
        </p>
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        {unread && onMarkRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            aria-label={`Mark "${notification.title}" as read`}
            className="grid h-7 w-7 place-items-center rounded-full text-neutral-550 transition-colors hover:bg-emerald-100 hover:text-emerald-800 dark:text-stone-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
          >
            <Check className="h-3.5 w-3.5 stroke-[2.6]" aria-hidden="true" />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(notification.id)}
            aria-label={`Delete "${notification.title}"`}
            className="grid h-7 w-7 place-items-center rounded-full text-neutral-550 transition-colors hover:bg-orange-100 hover:text-orange-700 dark:text-stone-400 dark:hover:bg-orange-950/40 dark:hover:text-orange-400"
          >
            <X className="h-3.5 w-3.5 stroke-[2.6]" aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.article>
  );
}
