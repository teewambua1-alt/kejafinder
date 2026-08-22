import { supabase } from '../lib/supabase/client';
import type { SupabaseListingWithImages } from './listingService';

// Unlike the Firestore version, saved_listings stores only (user_id,
// listing_id) — no denormalized copy of the listing's title/rent/etc. The
// actual data is always read fresh via this join, so a saved listing can
// never go stale the way a Firestore-style snapshot could.
const SAVED_SELECT = 'created_at, listings(*, listing_images(id, storage_path, category, position))';

/** A saved listing row plus when this user saved it. */
export type SavedListingRow = SupabaseListingWithImages & { saved_at: string };

export async function getUserSavedListings(userId: string): Promise<SavedListingRow[] | null> {
  const { data, error } = await supabase
    .from('saved_listings')
    .select(SAVED_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved listings:', error);
    return null;
  }

  // A joined listing can be null if it was deleted, or if RLS no longer
  // allows this user to see it (e.g. an owner-deleted draft) — drop those
  // rather than surfacing a broken card.
  // saved_listings.created_at is carried through as saved_at: it was already
  // being selected and then discarded, which is why every saved card read
  // "Saved recently" instead of the real date.
  return data
    .filter((row): row is typeof row & { listings: SupabaseListingWithImages } => row.listings !== null)
    .map((row) => ({ ...row.listings, saved_at: row.created_at }));
}

export async function saveListingForUser(userId: string, listingId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_listings')
    .upsert({ user_id: userId, listing_id: listingId }, { onConflict: 'user_id,listing_id' });

  if (error) {
    console.error('Error saving listing:', error);
    return false;
  }
  return true;
}

export async function removeSavedListingForUser(userId: string, listingId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_listings')
    .delete()
    .eq('user_id', userId)
    .eq('listing_id', listingId);

  if (error) {
    console.error('Error removing saved listing:', error);
    return false;
  }
  return true;
}

export async function isListingSavedForUser(userId: string, listingId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('saved_listings')
    .select('user_id')
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .maybeSingle();

  if (error) {
    console.error('Error checking saved status:', error);
    return false;
  }
  return !!data;
}
