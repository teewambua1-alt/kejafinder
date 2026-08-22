import type { VerificationLevel } from './listing';

/**
 * Kept as the canonical badge vocabulary that listingMappers emits into
 * `Listing.badges` and that the search filters match on. The detail page no
 * longer carries a `trustBadges` copy of it -- it reads the real
 * `verification_level` rung instead, which is the thing badges were derived
 * from in the first place.
 */
export type ListingTrustBadge =
  | "Phone Verified"
  | "Location Checked"
  | "Scout Verified"
  | "Trusted Landlord"
  | "Recently Updated";

/**
 * Detail-page view of a listing. Every field here must trace to a real column
 * in public.listings (see supabase/migrations/20260805000001_schema.sql).
 *
 * Fields deliberately removed because no column backs them -- they existed
 * only on the hardcoded sample this page used to merge over real data, so
 * every listing rendered them as fact: listingCode, panoramaUrl,
 * isPhoneVerified, responseTimeText, availabilityText, updatedAtText,
 * moveInDateText, nearbyStage, roadAccessText, directionsNote,
 * locationAccuracyText, floorLevel, ventilationText, lightingText,
 * noiseLevel, compoundText, preferredContactMethod, distanceFromRoadText.
 * Keep them out: absence is what forces each section to hide honestly.
 */
export type KejaListing = {
  id: string;
  title: string;
  houseType: string;
  rent: number;
  deposit: number;
  location: string;
  estate?: string;
  // Real listings.town / listings.county. The mapper always emitted these and
  // the page object always carried them; only this type failed to declare
  // them, so the detail page had no way to say "Kahawa, Nairobi" and printed
  // the derived `location` alias alone instead.
  town?: string;
  county?: string;
  landmark?: string;
  imageUrl?: string;
  images?: string[];
  amenities?: string[];
  caretakerName?: string;
  caretakerPhone?: string;
  whatsappPhone?: string;
  isSaved?: boolean;
  imagesCount?: number;
  typeLabel?: string;
  agentFee?: number;
  viewingFee?: number;
  waterCostText?: string;
  electricityText?: string;
  distanceFromRoad?: string;
  lat?: number | null;
  lng?: number | null;
  waterStatus?: string;
  electricityType?: string;
  toiletType?: string;
  bathroomType?: string;
  floorType?: string;
  securityText?: string;
  description?: string;
  contactName?: string;
  contactRole?: "landlord" | "caretaker" | "agent" | "scout";
  contactPhone?: string;
  reportCount?: number;
  isAvailable?: boolean;
  // Real, newly mapped through from Postgres
  updatedAt?: string;
  verificationLevel?: VerificationLevel;
  availabilityStatus?: string;
  views?: number;
};

export type ReportReason =
  | "already_taken"
  | "fake_listing"
  | "wrong_price"
  | "wrong_location"
  | "scam_request"
  | "hidden_agent_fee"
  | "wrong_photos"
  | "unsafe_property"
  | "duplicate_listing"
  | "other";
