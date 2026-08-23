import { motion } from 'motion/react';
import { KejaNotification } from '../types/notifications';
import NotificationCard from './NotificationCard';
import { useMotion } from '../lib/motion';
import { daysSince } from '../lib/relativeDate';

interface NotificationFeedProps {
  notifications: KejaNotification[];
  onMarkRead?: (id: string) => void;
  onRemove?: (id: string) => void;
}

/**
 * Grouped by when they arrived, derived from the real `created_at`.
 *
 * The previous version read a stored `group: 'today' | 'earlier'` string off
 * each notification -- a field with no column behind it, hardcoded per item in
 * the sample array. Every notification stayed in "Today" forever, however long
 * ago you had actually received it.
 */
export default function NotificationFeed({ notifications, onMarkRead, onRemove }: NotificationFeedProps) {
  const m = useMotion();
  const today: KejaNotification[] = [];
  const earlier: KejaNotification[] = [];
  for (const n of notifications) {
    ((daysSince(n.createdAt) ?? 99) < 1 ? today : earlier).push(n);
  }

  const groups = [
    { key: 'today', label: 'Today', items: today },
    { key: 'earlier', label: 'Earlier', items: earlier },
  ].filter((g) => g.items.length > 0);

  return (
    <motion.div variants={m.stagger(0.04)} initial="hidden" animate="show" className="flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-2.5">
          <h2 className="px-1 text-3xs font-black uppercase tracking-wider text-neutral-550 dark:text-stone-400">
            {group.label}
          </h2>
          {group.items.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={onMarkRead} onRemove={onRemove} />
          ))}
        </section>
      ))}
    </motion.div>
  );
}
