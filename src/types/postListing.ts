export type PostStep = 1 | 2 | 3 | 4 | 5;

export type PostHouseType =
  | 'single_room'
  | 'bedsitter'
  | 'studio'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'mabati_other';

export type ContactRole = 'caretaker' | 'landlord' | 'agent' | 'scout';

export type PostListingDraft = {
  title: string;
  houseType: PostHouseType;
  rent: string;
  deposit: string;
  availabilityDate: string;
  description: string;
  waterCharge: string;
  electricityType: string;
  toiletType: string;
  bathroomType: string;
  floorLevel: string;
  security: string;
  agentFee: string;
  viewingFee: string;
  contactName: string;
  contactRole: ContactRole;
  contactPhone: string;
  whatsappPhone: string;
  allowCalls: boolean;
  allowWhatsApp: boolean;
  county: string;
  town: string;
  estate: string;
  landmark: string;
  distanceFromRoad: string;
  lat: number | null;
  lng: number | null;
  amenities: string[];
  photos: string[];
  allowPhoneVerification: boolean;
  requestLocationCheck: boolean;
  requestScoutVerification: boolean;
  remindToUpdate: boolean;
};

