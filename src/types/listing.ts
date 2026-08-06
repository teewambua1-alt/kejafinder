export type ListingType =
  | 'single_room'
  | 'bedsitter'
  | 'studio'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'mabati';

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
  panoramaUrl?: string;
  lat?: number | null;
  lng?: number | null;
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

export function getListingTypeLabel(type: ListingType): string {
  switch (type) {
    case 'single_room':
      return 'Single Room';
    case 'bedsitter':
      return 'Bedsitter';
    case 'studio':
      return 'Studio';
    case 'one_bedroom':
      return '1 Bedroom';
    case 'two_bedroom':
      return '2 Bedroom';
    case 'mabati':
      return 'Mabati';
    default:
      return type;
  }
}
