/**
 * A notification, as `public.notifications` actually stores one.
 *
 * The previous shape declared thirteen fields; the table has six. The extra
 * eight -- `timeAgo`, `group`, `actionLabel`, `actionType`, `imageUrl`,
 * `listingTitle`, `location`, `isImportant` -- existed only to describe the
 * hardcoded `sampleNotifications` array, and the page rendered all of them as
 * if they were facts about the reader's account.
 *
 * They are gone rather than made optional, for the same reason Phase 1 deleted
 * the fabricated listing fields: absent is what makes the fabrication
 * unrepresentable. `created_at` is real, so relative time is derived rather
 * than stored as a string.
 */
export type KejaNotification = {
  id: string;
  /** notifications.type -- a plain `text` column with no CHECK constraint. */
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
