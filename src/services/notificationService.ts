import { supabase } from '../lib/supabase/client';

/**
 * Notifications, from the real table.
 *
 * `public.notifications` has existed since the first migration with a precise
 * privilege model, and nothing in the app had ever read it. The page ran
 * entirely on `sampleNotifications` -- a hardcoded array that told every user
 * things like "Price dropped on saved home: Spacious Bedsitter in Syokimau is
 * now KSh 8,000/month, down from KSh 9,000" and "Caretaker replied on WhatsApp:
 * Peter replied to your inquiry about Bedsitter in Rongai". None of it
 * happened. The second one invents a human interaction with a named person,
 * which is a worse fabrication than the fake verified badge Phase 1 removed.
 *
 * What the client is actually allowed to do, per the migration:
 *
 *   select  own rows            (user_id = auth.uid())
 *   update  is_read ONLY        -- `revoke update ... ; grant update (is_read)`
 *   delete  own rows
 *   insert  nothing at all      -- "System/trigger-generated only"
 *
 * That last line matters for expectations: **nothing currently writes to this
 * table.** No trigger, no function, no server route inserts a notification, so
 * for now the honest result of reading it is an empty list. Making it useful is
 * a database change, not a UI one -- the obvious first one being an insert
 * inside `admin_moderate_listing()` so a poster learns their listing was
 * approved or rejected.
 */

export interface NotificationRow {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const SELECT = 'id, type, title, message, is_read, created_at';

/** RLS already scopes this to the signed-in user; no filter needed. */
export async function getMyNotifications(limit = 60): Promise<NotificationRow[] | null> {
  const { data, error } = await supabase
    .from('notifications')
    .select(SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching notifications:', error);
    return null;
  }
  return (data ?? []) as NotificationRow[];
}

/**
 * `is_read` is the only column the client holds an UPDATE grant on, so this is
 * the full extent of what "editing" a notification can mean.
 */
export async function setNotificationRead(id: string, isRead: boolean): Promise<boolean> {
  const { error } = await supabase.from('notifications').update({ is_read: isRead }).eq('id', id);
  if (error) {
    console.error('Error updating notification read state:', error);
    return false;
  }
  return true;
}

/** One statement rather than N: `.in()` over the ids that are actually unread. */
export async function markNotificationsRead(ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const { error } = await supabase.from('notifications').update({ is_read: true }).in('id', ids);
  if (error) {
    console.error('Error marking notifications read:', error);
    return false;
  }
  return true;
}

export async function deleteNotification(id: string): Promise<boolean> {
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  if (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
  return true;
}
