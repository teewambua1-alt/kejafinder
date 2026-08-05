import { supabase } from './supabase/client';
import type { SupabaseListingWithImages } from '../services/listingService';
import type { Database } from '../types/database';
import { Listing, ListingType } from '../types/listing';
import { PostListingDraft } from '../types/postListing';

type ListingInsert = Database['public']['Tables']['listings']['Insert'];

const VALID_LISTING_TYPES: ListingType[] = ['single_room', 'bedsitter', 'studio', 'one_bedroom', 'two_bedroom', 'mabati'];

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

function publicImageUrl(storagePath: string): string {
  return supabase.storage.from('listing-photos').getPublicUrl(storagePath).data.publicUrl;
}

// house_type is a `text` column with a CHECK constraint, not a native Postgres
// enum, so Supabase's type generator has no Enums entry for it — the
// generated Row/Insert type is plain `string`. This union documents the
// actual allowed values (must stay in sync with the CHECK constraint in
// supabase/migrations/20260805000001_schema.sql).
type HouseType = 'single_room' | 'bedsitter' | 'mabati' | 'studio' | 'one_bedroom' | 'two_bedroom' | 'three_bedroom' | 'student_room' | 'other';

export function mapPostVacancyFormToSupabaseListing(draft: PostListingDraft): Partial<ListingInsert> {
  const houseTypeMap: Record<string, HouseType> = {
    'single_room': 'single_room',
    'bedsitter': 'bedsitter',
    'studio': 'studio',
    'one_bedroom': 'one_bedroom',
    'two_bedroom': 'two_bedroom',
    'mabati_other': 'mabati',
  };

  const rentAmount = parseInt(draft.rent.replace(/\D/g, ''), 10) || 0;
  const depositAmount = parseInt(draft.deposit.replace(/\D/g, ''), 10) || 0;

  return {
    house_type: houseTypeMap[draft.houseType] || 'other',
    monthly_rent: rentAmount,
    deposit_amount: depositAmount,
    agent_fee: 0,
    viewing_fee: 0,
    description: draft.description || '',
    county: draft.county || '',
    town: draft.town || '',
    estate: draft.estate || '',
    landmark: draft.landmark || '',
    distance_from_road: draft.distanceFromRoad || '',
    contact_name: draft.contactName || '',
    contact_role: draft.contactRole,
    contact_phone: draft.allowCalls ? draft.contactPhone : '',
    whatsapp_phone: draft.allowWhatsApp ? draft.whatsappPhone : '',
    amenities: draft.amenities || [],
  };
}

export function mapSupabaseListingToListing(row: SupabaseListingWithImages): Listing {
  const sortedImages = [...(row.listing_images || [])].sort((a, b) => a.position - b.position);
  const imageUrls = sortedImages.map((img) => publicImageUrl(img.storage_path));

  const type: ListingType = (VALID_LISTING_TYPES as string[]).includes(row.house_type)
    ? (row.house_type as ListingType)
    : ('other' as ListingType);

  const badges: string[] = [];
  if (row.verification_level && row.verification_level !== 'none') {
    badges.push(`${row.verification_level} Verified`);
  }
  if (row.is_featured) {
    badges.push('Featured');
  }

  return {
    id: row.id,
    title: row.title || `${row.house_type.replace('_', ' ')} in ${row.town || 'Kenya'}`,
    type,
    rent: row.monthly_rent || 0,
    deposit: row.deposit_amount || 0,
    location: row.estate || row.landmark || row.town,
    town: row.town,
    estate: row.estate,
    landmark: row.landmark ?? undefined,
    image: imageUrls[0] || PLACEHOLDER_IMAGE,
    imagesCount: imageUrls.length,
    amenities: row.amenities || [],
    badges,
    isFeatured: row.is_featured || false,
    isAvailable: row.is_available && row.availability_status === 'available',
    views: row.views_count || 0,
    contactPhone: row.contact_phone || '',
    whatsappPhone: row.whatsapp_phone || row.contact_phone || '',
    updatedAt: row.updated_at || new Date().toISOString(),
    distanceFromRoad: row.distance_from_road ?? undefined,
    county: row.county,
    lat: row.lat,
    lng: row.lng,
  };
}

export function mapSupabaseListingsToListings(rows: SupabaseListingWithImages[]): Listing[] {
  return rows.map(mapSupabaseListingToListing);
}
