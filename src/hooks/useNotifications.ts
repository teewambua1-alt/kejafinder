import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KejaNotification } from '../types/notifications';
import {
  getMyNotifications,
  markNotificationsRead,
  setNotificationRead,
  deleteNotification,
} from '../services/notificationService';

/**
 * The signed-in account's notifications.
 *
 * Read-state changes are applied optimistically and rolled back on failure:
 * marking something read is not worth a spinner, but silently showing it as
 * read when the write failed would be a lie the next reload contradicts.
 */
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<KejaNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    const rows = await getMyNotifications();
    if (rows) {
      setNotifications(
        rows.map((r) => ({
          id: r.id,
          type: r.type,
          title: r.title,
          message: r.message,
          isRead: r.is_read,
          createdAt: r.created_at,
        }))
      );
    } else {
      setNotifications([]);
      setError('Could not load notifications.');
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = useCallback(async (id: string) => {
    const before = notifications;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    if (!(await setNotificationRead(id, true))) setNotifications(before);
  }, [notifications]);

  const markAllRead = useCallback(async () => {
    const ids = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (ids.length === 0) return;
    const before = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (!(await markNotificationsRead(ids))) setNotifications(before);
  }, [notifications]);

  const remove = useCallback(async (id: string) => {
    const before = notifications;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!(await deleteNotification(id))) setNotifications(before);
  }, [notifications]);

  return { notifications, unreadCount, isLoading, error, markRead, markAllRead, remove, refresh: load };
}
