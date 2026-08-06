import { supabase } from '../lib/supabase/client';
import type { Database } from '../types/database';

type ListingInsert = Database['public']['Tables']['listings']['Insert'];
type ListingUpdate = Database['public']['Tables']['listings']['Update'];
type ListingRow = Database['public']['Tables']['listings']['Row'];

export async function createListingDraft(userId: string, role: string, params: Partial<ListingInsert>): Promise<ListingRow | null> {
  if (role === 'tenant') return null;

  // title is NOT NULL in the schema; the Post Vacancy form never actually
  // collects one, so synthesize a reasonable one at write time rather than
  // leaving it to be reconstructed ad hoc every time a listing is displayed.
  const title = params.title?.trim()
    || `${(params.house_type || 'Room').replace(/_/g, ' ')} in ${params.town || 'Kenya'}`;

  const draft: ListingInsert = {
    owner_id: userId,
    title,
    description: params.description || '',
    house_type: params.house_type || 'other',
    monthly_rent: params.monthly_rent || 0,
    deposit_amount: params.deposit_amount || 0,
    water_charge: params.water_charge || '',
    electricity_type: params.electricity_type || '',
    agent_fee: params.agent_fee || 0,
    viewing_fee: params.viewing_fee || 0,
    county: params.county || '',
    town: params.town || '',
    estate: params.estate || '',
    landmark: params.landmark || '',
    distance_from_road: params.distance_from_road || '',
    lat: params.lat ?? null,
    lng: params.lng ?? null,
    toilet_type: params.toilet_type || '',
    bathroom_type: params.bathroom_type || '',
    floor_level: params.floor_level || '',
    security: params.security || '',
    contact_name: params.contact_name || '',
    contact_role: params.contact_role || 'landlord',
    contact_phone: params.contact_phone || '',
    whatsapp_phone: params.whatsapp_phone || '',
    amenities: params.amenities || [],
  };

  const { data, error } = await supabase
    .from('listings')
    .insert(draft)
    .select()
    .single();

  if (error) {
    console.error('Error creating listing draft:', error);
    return null;
  }
  return data;
}

export async function updateListingDraft(listingId: string, params: Partial<ListingUpdate>): Promise<boolean> {
  // Only owner-editable content fields are ever sent here — moderation_status,
  // verification_level, counters, etc. have no UPDATE grant at the database
  // level for the authenticated role, so including them would fail the
  // whole request rather than silently succeed. RLS also confirms ownership
  // and draft/pending_review status, independent of what the client claims.
  const updates: Partial<ListingUpdate> = { ...params };
  delete (updates as any).id;
  delete (updates as any).owner_id;
  delete (updates as any).moderation_status;
  delete (updates as any).created_at;

  const { error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', listingId);

  if (error) {
    console.error('Error updating listing draft:', error);
    return false;
  }
  return true;
}

export async function submitListingForReview(listingId: string): Promise<boolean> {
  const { error } = await supabase.rpc('submit_listing_for_review', { p_listing_id: listingId });

  if (error) {
    console.error('Error submitting listing for review:', error);
    return false;
  }
  return true;
}

export async function getOwnerDraftListing(listingId: string, userId: string): Promise<ListingRow | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching owner draft:', error);
    return null;
  }
  return data;
}
