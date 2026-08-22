import type { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Who may post a vacancy.
 *
 * This rule was written four times, in two different ways. `BottomNav`,
 * `DesktopNavbar` and `usePostListingDraft` all tested `role !== 'tenant'`,
 * while `ProfilePage` used an explicit allowlist. They agree today only because
 * the `profiles.role` CHECK happens to allow exactly five values — add a sixth
 * (say `'viewer'`) and the three `!== 'tenant'` call sites would silently grant
 * it posting rights, including the one in `usePostListingDraft` that is the
 * actual gate on writes.
 *
 * An allowlist cannot fail that way, so it is the single spelling now.
 *
 * Note `'admin'` is deliberately absent: the CHECK constraint on
 * `profiles.role` cannot hold it, and admin-ness lives in the separate
 * `admins` table behind `is_admin()`. An account can be both a poster and an
 * admin, and neither implies the other.
 */
export const POSTER_ROLES = ['landlord', 'caretaker', 'agent', 'scout'] as const;

export type PosterRole = (typeof POSTER_ROLES)[number];

export function isPosterRole(profile: Pick<Profile, 'role'> | null | undefined): boolean {
  return !!profile && (POSTER_ROLES as readonly string[]).includes(profile.role);
}
