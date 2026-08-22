import React from 'react';
import { motion } from 'motion/react';
import { KejaNotification } from '../types/notifications';
import NotificationCard from './NotificationCard';

interface NotificationFeedProps {
  notifications: KejaNotification[];
  onNotificationAction: (id: string, actionType: string) => void;
  onNotificationDismiss: (id: string) => void;
}

export default function NotificationFeed({
  notifications,
  onNotificationAction,
  onNotificationDismiss
}: NotificationFeedProps) {

  // Split into Today and Earlier grouping
  const todayNotifications = notifications.filter(n => n.group === 'today');
  const earlierNotifications = notifications.filter(n => n.group === 'earlier');

  const hasToday = todayNotifications.length > 0;
  const hasEarlier = earlierNotifications.length > 0;

  // Stagger configurations for motion groups
  const groupVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full flex flex-col space-y-5">
      {/* 1. Today Group Section */}
      {hasToday && (
        <motion.div 
          variants={groupVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2 pl-1">
            <h2 className="text-[10.5px] font-black text-neutral-550 dark:text-stone-400 uppercase tracking-widest leading-none select-none">
              Today
            </h2>
            <div className="h-px bg-neutral-200 dark:bg-stone-850/60 flex-1" />
            <span className="text-[9px] font-mono font-bold text-neutral-550 dark:text-stone-400 px-1 bg-neutral-50 dark:bg-stone-900 rounded border border-neutral-100 dark:border-stone-850">
              {todayNotifications.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {todayNotifications.map(notification => (
              <motion.div key={notification.id} variants={itemVariants}>
                <NotificationCard 
                  notification={notification}
                  onActionClick={onNotificationAction}
                  onDismiss={onNotificationDismiss}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 2. Earlier Group Section */}
      {hasEarlier && (
        <motion.div 
          variants={groupVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2 pl-1">
            <h2 className="text-[10.5px] font-black text-neutral-550 dark:text-stone-400 uppercase tracking-widest leading-none select-none">
              Earlier
            </h2>
            <div className="h-px bg-neutral-200 dark:bg-stone-850/60 flex-1" />
            <span className="text-[9px] font-mono font-bold text-neutral-550 dark:text-stone-400 px-1 bg-neutral-50 dark:bg-stone-900 rounded border border-neutral-100 dark:border-stone-850">
              {earlierNotifications.length}
            </span>
          </div>

          <div className="space-y-3">
            {earlierNotifications.map(notification => (
              <motion.div key={notification.id} variants={itemVariants}>
                <NotificationCard 
                  notification={notification}
                  onActionClick={onNotificationAction}
                  onDismiss={onNotificationDismiss}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
