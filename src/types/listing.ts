// Mirrors the listings.house_type CHECK constraint in
// supabase/migrations/20260805000001_schema.sql. The last three were missing
// here, so the mapper had to force-cast them with `as ListingType`.
export type ListingType =
  | 'single_room'
  | 'bedsitter'
  | 'studio'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'mabati'
  | 'three_bedroom'
  | 'student_room'
  | 'other';

// listings.verification_level -- a real ladder, not a boolean. The mapper
// previously collapsed it into a single badge string, losing the rank.
export type VerificationLevel = 'none' | 'phone' | 'location' | 'scout' | 'trusted';

export type Listing = {
  id: string;
  title: string;
  type: ListingType;
  rent: number;
  deposit: number;
  location: string;
  town: string;
  estate: string;
  landmark?: string;
  image: string;
  imagesCount?: number;
  amenities: string[];
  badges: string[];
  isFeatured?: boolean;
  isAvailable: boolean;
  isSaved?: boolean;
  contactPhone: string;
  whatsappPhone: string;
  updatedAt?: string;
  views?: number;
  typeLabel?: string; // Optional helper mapping
  savedAt?: string;
  distanceFromRoad?: string;
  county?: string;
  lat?: number | null;
  lng?: number | null;
  // Upfront-cost columns (agent_fee / viewing_fee) exist in Postgres and are
  // written at post time, but were never mapped through -- so the detail
  // page's "estimated upfront cost" was always just rent + deposit.
  agentFee?: number;
  viewingFee?: number;
  verificationLevel?: VerificationLevel;
  availabilityStatus?: string;
  // Real per-listing detail fields (Postgres columns already existed;
  // these were never mapped through until Phase 5's Listing Details fix).
  description?: string;
  waterStatus?: string;
  waterCostText?: string;
  electricityType?: string;
  electricityText?: string;
  toiletType?: string;
  bathroomType?: string;
  floorType?: string;
  securityText?: string;
  contactName?: string;
  contactRole?: string;
  images?: string[];
};

/**
 * Label per house_type. A Record (not a switch with a default) so adding a
 * value to ListingType is a compile error until it is labelled here -- the
 * previous switch had a `default` that silently returned the raw enum value.
 */
const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  single_room: 'Single Room',
  bedsitter: 'Bedsitter',
  studio: 'Studio',
  one_bedroom: '1 Bedroom',
  two_bedroom: '2 Bedroom',
  mabati: 'Mabati',
  three_bedroom: '3 Bedroom',
  student_room: 'Student Room',
  other: 'Other',
};

/**
 * Runtime whitelist, derived from the label map so the two cannot drift.
 * They did: ListingType gained three_bedroom/student_room/other while the
 * mapper kept a hand-written list of six, so both new types were silently
 * downgraded to 'other' on real data.
 */
export const LISTING_TYPES = Object.keys(LISTING_TYPE_LABELS) as ListingType[];

export function getListingTypeLabel(type: ListingType): string {
  return LISTING_TYPE_LABELS[type] ?? type;
}
