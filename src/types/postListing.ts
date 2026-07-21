export type PostStep = 1 | 2 | 3 | 4;

export type PostHouseType =
  | 'single_room'
  | 'bedsitter'
  | 'studio'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'mabati_other';

export type ContactRole = 'caretaker' | 'landlord' | 'agent' | 'scout';

export type PostListingDraft = {
  houseType: PostHouseType;
  rent: string;
  deposit: string;
  availabilityDate: string;
  description: string;
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
  amenities: string[];
  photos: string[];
  allowPhoneVerification: boolean;
  requestLocationCheck: boolean;
  requestScoutVerification: boolean;
  remindToUpdate: boolean;
};

