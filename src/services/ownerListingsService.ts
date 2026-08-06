import { supabase } from '../lib/supabase/client';
import type { Database } from '../types/database';

export type OwnerListingRow = Database['public']['Tables']['listings']['Row'] & {
  listing_images: Pick<Database['public']['Tables']['listing_images']['Row'], 'id' | 'storage_path' | 'position'>[];
};

const OWNER_LISTING_SELECT = '*, listing_images(id, storage_path, position)';

export async function getOwnerListings(ownerId: string): Promise<OwnerListingRow[] | null> {
  const { data, error } = await supabase
    .from('listings')
    .select(OWNER_LISTING_SELECT)
    .eq('owner_id', ownerId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching owner listings:', error);
    return null;
  }
  return data;
}

// listings_delete RLS only allows an owner to delete their own row while
// moderation_status = 'draft' -- pending_review/approved/rejected all reject
// this at the database level regardless of what the UI does.
export async function deleteOwnerListing(listingId: string): Promise<boolean> {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('moderation_status', 'draft');

  if (error) {
    console.error('Error deleting owner listing:', error);
    return false;
  }
  return true;
}

// Wraps the set_listing_availability() RPC (see
// supabase/migrations/20260806000002_owner_listing_actions.sql) -- a plain
// update() would be rejected by RLS for an approved listing; this is the
// only real path an owner has to mark their live listing taken/available.
export async function setListingAvailability(listingId: string, available: boolean): Promise<boolean> {
  const { error } = await supabase.rpc('set_listing_availability', {
    p_listing_id: listingId,
    p_available: available,
  });

  if (error) {
    console.error('Error setting listing availability:', error);
    return false;
  }
  return true;
}
