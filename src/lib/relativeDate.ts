const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Relative "when was this touched" label from a real timestamp. Returns null
 * when there is no timestamp, so callers can hide the row instead of printing
 * a reassuring guess -- the detail page used to render a hardcoded "Updated
 * today" on every listing regardless of its real updated_at.
 */
export function formatUpdatedAt(iso?: string | null): string | null {
  const days = daysSince(iso);
  if (days === null) return null;
  if (days < 1) return 'Updated today';
  if (days < 2) return 'Updated yesterday';
  if (days < 7) return `Updated ${Math.floor(days)} days ago`;
  if (days < 14) return 'Updated last week';
  if (days < 60) return `Updated ${Math.floor(days / 7)} weeks ago`;
  return `Updated ${Math.floor(days / 30)} months ago`;
}

/** Absolute date label for a saved-at timestamp, e.g. "Saved on 12 May 2025". */
export function formatSavedOn(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `Saved on ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function daysSince(iso?: string | null): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return (Date.now() - then) / MS_PER_DAY;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Relative time for a notification. Returns null for a missing timestamp so a
 * caller hides the line rather than printing "just now" about an unknown time
 * -- the old page stored a `timeAgo` string like "10:24 AM" on hardcoded data,
 * which never changed no matter when you opened it.
 */
export function formatNotificationTime(iso?: string | null): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
}
