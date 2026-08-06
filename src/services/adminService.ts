import { supabase } from '../lib/supabase/client';
import type { Database } from '../types/database';

export type AdminListingRow = Database['public']['Tables']['listings']['Row'] & {
  listing_images: Pick<Database['public']['Tables']['listing_images']['Row'], 'id' | 'storage_path'>[];
};
export type ListingReportRow = Database['public']['Tables']['listing_reports']['Row'];
export type VerificationRequestRow = Database['public']['Tables']['verification_requests']['Row'];
export type AdminActionRow = Database['public']['Tables']['admin_actions']['Row'];
export type AdminActionWithActor = AdminActionRow & { adminName: string | null };

export interface AdminStats {
  pendingReview: number;
  usersByRole: Record<string, number>;
  openReports: number;
  pendingVerifications: number;
}

export async function getAdminStats(): Promise<AdminStats | null> {
  const [pendingRes, rolesRes, reportsRes, verificationsRes] = await Promise.all([
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('moderation_status', 'pending_review'),
    supabase.from('profiles').select('role'),
    supabase.from('listing_reports').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('verification_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  if (pendingRes.error || rolesRes.error || reportsRes.error || verificationsRes.error) {
    console.error('Error fetching admin stats:', pendingRes.error || rolesRes.error || reportsRes.error || verificationsRes.error);
    return null;
  }

  const usersByRole: Record<string, number> = {};
  (rolesRes.data || []).forEach((row) => {
    usersByRole[row.role] = (usersByRole[row.role] || 0) + 1;
  });

  return {
    pendingReview: pendingRes.count ?? 0,
    usersByRole,
    openReports: reportsRes.count ?? 0,
    pendingVerifications: verificationsRes.count ?? 0,
  };
}

export async function getPendingListings(): Promise<AdminListingRow[] | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_images(id, storage_path)')
    .eq('moderation_status', 'pending_review')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending listings:', error);
    return null;
  }
  return data;
}

export async function moderateListing(listingId: string, action: string, notes?: string): Promise<boolean> {
  const { error } = await supabase.rpc('admin_moderate_listing', {
    p_listing_id: listingId,
    p_action: action,
    p_notes: notes ?? null,
  });

  if (error) {
    console.error('Error moderating listing:', error);
    return false;
  }
  return true;
}

export async function getOpenReports(): Promise<ListingReportRow[] | null> {
  const { data, error } = await supabase
    .from('listing_reports')
    .select('*')
    .eq('status', 'new')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching open reports:', error);
    return null;
  }
  return data;
}

export async function getPendingVerificationRequests(): Promise<VerificationRequestRow[] | null> {
  const { data, error } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending verification requests:', error);
    return null;
  }
  return data;
}

// admin_actions.admin_id references auth.users(id), not public.profiles(id)
// directly -- PostgREST can't embed profiles off that edge in one query, so
// the actor's name is resolved with a second lookup instead.
export async function getRecentAdminActions(limitCount = 20): Promise<AdminActionWithActor[] | null> {
  const { data: actions, error } = await supabase
    .from('admin_actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limitCount);

  if (error) {
    console.error('Error fetching recent admin actions:', error);
    return null;
  }
  if (!actions || actions.length === 0) return [];

  const adminIds = Array.from(new Set(actions.map((a) => a.admin_id)));
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', adminIds);

  if (profilesError) {
    console.error('Error fetching admin actor names:', profilesError);
  }

  const nameById = new Map((profiles || []).map((p) => [p.id, p.full_name]));
  return actions.map((a) => ({ ...a, adminName: nameById.get(a.admin_id) ?? null }));
}
