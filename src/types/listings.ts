export type ListingTrustBadge =
  | "Phone Verified"
  | "Location Checked"
  | "Scout Verified"
  | "Trusted Landlord"
  | "Recently Updated";

export type KejaListing = {
  id: string;
  title: string;
  houseType: string;
  rent: number;
  deposit: number;
  location: string;
  estate?: string;
  landmark?: string;
  imageUrl?: string;
  images?: string[];
  amenities?: string[];
  trustBadges?: ListingTrustBadge[];
  caretakerName?: string;
  caretakerPhone?: string;
  whatsappPhone?: string;
  isSaved?: boolean;
  imagesCount?: number;
  typeLabel?: string;
  availabilityText?: string;
  updatedAtText?: string;
  listingCode?: string;
  agentFee?: number;
  viewingFee?: number;
  waterCostText?: string;
  electricityText?: string;
  moveInDateText?: string;
  currency?: "KSh";
  distanceFromRoadText?: string;
  distanceFromRoad?: string;
  lat?: number | null;
  lng?: number | null;
  nearbyStage?: string;
  roadAccessText?: string;
  directionsNote?: string;
  locationAccuracyText?: string;
  waterStatus?: string;
  electricityType?: string;
  toiletType?: string;
  bathroomType?: string;
  floorType?: string;
  securityText?: string;
  floorLevel?: string;
  ventilationText?: string;
  lightingText?: string;
  noiseLevel?: string;
  compoundText?: string;
  description?: string;
  contactName?: string;
  contactRole?: "landlord" | "caretaker" | "agent" | "scout";
  contactPhone?: string;
  preferredContactMethod?: "call" | "whatsapp" | "both";
  responseTimeText?: string;
  isPhoneVerified?: boolean;
  reportCount?: number;
  isAvailable?: boolean;
  panoramaUrl?: string;
};

export type ReportReason =
  | "already_taken"
  | "fake_listing"
  | "wrong_price"
  | "wrong_location"
  | "scam_request"
  | "wrong_photos"
  | "unsafe_property"
  | "duplicate_listing"
  | "other";
