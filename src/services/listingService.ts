import { supabase } from '../lib/supabase/client';
import type { Database } from '../types/database';

export type SupabaseListing = Database['public']['Tables']['listings']['Row'];
export type SupabaseListingImage = Database['public']['Tables']['listing_images']['Row'];
// Matches the trimmed column list actually requested in LISTING_SELECT below,
// not the full listing_images row.
export type SupabaseListingImagePick = Pick<SupabaseListingImage, 'id' | 'storage_path' | 'category' | 'position'>;
export type SupabaseListingWithImages = SupabaseListing & {
  listing_images: SupabaseListingImagePick[];
};

// Embeds listing_images in the same round trip via the FK relationship,
// rather than a separate query per listing.
const LISTING_SELECT = '*, listing_images(id, storage_path, category, position)';

/**
 * Attaches listing_images to rows that came back without them (the
 * nearby_listings RPC returns bare rows). One extra query for the whole set,
 * not one per listing, and the caller's row order is preserved.
 */
async function attachImages(rows: SupabaseListing[]): Promise<SupabaseListingWithImages[]> {
  const { data, error } = await supabase
    .from('listing_images')
    .select('id, storage_path, category, position, listing_id')
    .in('listing_id', rows.map((r) => r.id));

  if (error) {
    console.error('Error fetching images for listings:', error);
    return rows.map((row) => ({ ...row, listing_images: [] }));
  }

  const byListing = new Map<string, SupabaseListingImagePick[]>();
  for (const img of data ?? []) {
    const bucket = byListing.get(img.listing_id) ?? [];
    bucket.push({ id: img.id, storage_path: img.storage_path, category: img.category, position: img.position });
    byListing.set(img.listing_id, bucket);
  }

  return rows.map((row) => ({ ...row, listing_images: byListing.get(row.id) ?? [] }));
}

export async function getApprovedAvailableListings(limitCount = 60): Promise<SupabaseListingWithImages[] | null> {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('moderation_status', 'approved')
    .eq('availability_status', 'available')
    .eq('is_available', true)
    .order('updated_at', { ascending: false })
    .limit(limitCount);

  if (error) {
    console.error('Error fetching approved available listings:', error);
    return null;
  }
  return data;
}

export async function getFeaturedListings(limitCount = 10): Promise<SupabaseListingWithImages[] | null> {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('is_featured', true)
    .eq('moderation_status', 'approved')
    .eq('availability_status', 'available')
    .eq('is_available', true)
    .order('updated_at', { ascending: false })
    .limit(limitCount);

  if (error) {
    console.error('Error fetching featured listings:', error);
    return null;
  }
  return data;
}

export async function getApprovedListingById(listingId: string): Promise<SupabaseListingWithImages | null> {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('id', listingId)
    .eq('moderation_status', 'approved')
    .eq('availability_status', 'available')
    .eq('is_available', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching listing by id:', error);
    return null;
  }
  return data;
}

// For an owner/admin viewing their own listing regardless of status — RLS
// (not this filter) is what actually restricts visibility.
export async function getOwnerDraftListing(listingId: string): Promise<SupabaseListingWithImages | null> {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('id', listingId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching owner draft:', error);
    return null;
  }
  return data;
}

export interface SearchParams {
  locationQuery?: string;
  houseType?: string;
  minRent?: number;
  maxRent?: number;
  verifiedOnly?: boolean;
  amenities?: string[];
  sortBy?: 'newest' | 'cheapest' | 'verified' | 'recent' | 'nearest';
  near?: { lat: number; lng: number; radiusKm?: number };
  page?: number;
  pageSize?: number;
}

export async function searchApprovedListings(params: SearchParams): Promise<SupabaseListingWithImages[] | null> {
  // Distance ordering isn't expressible via the query builder — nearby_listings
  // does it in the database via the earthdistance/cube extensions.
  if (params.sortBy === 'nearest' && params.near) {
    const { data, error } = await supabase.rpc('nearby_listings', {
      p_lat: params.near.lat,
      p_lng: params.near.lng,
      p_radius_km: params.near.radiusKm ?? 10,
    });
    if (error) {
      console.error('Error fetching nearby listings:', error);
      return null;
    }
    // The RPC returns bare listing rows -- it can't express the query
    // builder's embed. Previously they were back-filled with an empty
    // listing_images array, so every "nearby" card fell through to the
    // placeholder photo. Fetch the images for exactly these ids and attach
    // them, preserving the RPC's distance ordering.
    const rows = (data ?? []) as SupabaseListing[];
    if (rows.length === 0) return [];
    return attachImages(rows);
  }

  const pageSize = params.pageSize ?? 30;
  const page = params.page ?? 0;

  let query = supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('moderation_status', 'approved')
    .eq('availability_status', 'available')
    .eq('is_available', true);

  if (params.houseType && params.houseType !== 'All') {
    query = query.eq('house_type', params.houseType as SupabaseListing['house_type']);
  }
  if (params.minRent) {
    query = query.gte('monthly_rent', params.minRent);
  }
  if (params.maxRent) {
    query = query.lte('monthly_rent', params.maxRent);
  }
  if (params.verifiedOnly) {
    query = query.neq('verification_level', 'none');
  }
  if (params.amenities && params.amenities.length > 0) {
    query = query.overlaps('amenities', params.amenities);
  }
  if (params.locationQuery && params.locationQuery.trim()) {
    query = query.textSearch('search_vector', params.locationQuery.trim(), { type: 'websearch' });
  }

  switch (params.sortBy) {
    case 'cheapest':
      query = query.order('monthly_rent', { ascending: true });
      break;
    case 'verified':
      query = query.order('verification_level', { ascending: false });
      break;
    case 'newest':
    case 'recent':
    default:
      query = query.order('updated_at', { ascending: false });
      break;
  }

  query = query.range(page * pageSize, page * pageSize + pageSize - 1);

  const { data, error } = await query;
  if (error) {
    console.error('Error searching listings:', error);
    return null;
  }
  return data;
}

// Anon-callable, fire-and-forget by design (see increment_listing_view() in
// supabase/migrations/20260805000002_rls_and_functions.sql) -- a failed view
// count shouldn't block or error the page the user is trying to view.
export async function incrementListingView(listingId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_listing_view', { p_listing_id: listingId });
  if (error) {
    console.error('Error incrementing listing view count:', error);
  }
}

export async function incrementContactClick(listingId: string, clickType: 'call' | 'whatsapp'): Promise<void> {
  const { error } = await supabase.rpc('increment_contact_click', { p_listing_id: listingId, p_click_type: clickType });
  if (error) {
    console.error('Error incrementing contact click count:', error);
  }
}

// The report reason UI/type (src/types/listings.ts) predates the DB check
// constraint (supabase/migrations/20260805000001_schema.sql) and the two
// never got reconciled -- every other reason value matches exactly except
// this one.
const REPORT_REASON_DB_VALUE: Record<string, string> = {
  duplicate_listing: 'duplicate',
};

export async function submitListingReport(params: {
  listingId: string;
  reporterId: string;
  reason: string;
  message?: string;
}): Promise<boolean> {
  const { error } = await supabase.from('listing_reports').insert({
    listing_id: params.listingId,
    reporter_id: params.reporterId,
    reason: REPORT_REASON_DB_VALUE[params.reason] ?? params.reason,
    message: params.message || null,
  });

  if (error) {
    console.error('Error submitting listing report:', error);
    return false;
  }
  return true;
}
