export type FirebaseUserRole = 'tenant' | 'landlord' | 'caretaker' | 'agent' | 'scout' | 'admin';
export type FirebaseListingHouseType = 'single_room' | 'bedsitter' | 'mabati' | 'studio' | 'one_bedroom' | 'two_bedroom' | 'three_bedroom' | 'student_room' | 'other';
export type FirebaseContactRole = 'landlord' | 'caretaker' | 'agent' | 'scout';
export type FirebaseAvailabilityStatus = 'available' | 'taken' | 'pending' | 'expired';
export type FirebaseModerationStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'reported';
export type FirebaseVerificationLevel = 'none' | 'phone' | 'location' | 'scout' | 'trusted';
export type FirebaseReportReason = 'fake_listing' | 'already_taken' | 'wrong_price' | 'wrong_location' | 'wrong_photos' | 'scam_request' | 'unsafe_property' | 'hidden_agent_fee' | 'duplicate' | 'other';
export type FirebaseReportStatus = 'new' | 'reviewing' | 'resolved' | 'dismissed';
export type FirebaseContactEventType = 'call_click' | 'whatsapp_click';
export type FirebaseAvailabilityCheckStatus = 'still_available_clicked' | 'reported_taken';
export type FirebaseVerificationRequestType = 'phone' | 'location' | 'scout' | 'landlord_trust';
export type FirebaseVerificationRequestStatus = 'pending' | 'approved' | 'rejected';

export interface FirebaseUserProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: FirebaseUserRole;
  avatarUrl?: string;
  county?: string;
  town?: string;
  estate?: string;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface FirebaseListing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  houseType: FirebaseListingHouseType;
  monthlyRent: number;
  depositAmount: number;
  waterCharge?: string;
  electricityType?: string;
  agentFee: number;
  viewingFee: number;
  county: string;
  town: string;
  estate: string;
  landmark: string;
  distanceFromRoad?: string;
  toiletType?: string;
  bathroomType?: string;
  floorLevel?: string;
  security?: string;
  contactName: string;
  contactRole: FirebaseContactRole;
  contactPhone: string;
  whatsappPhone?: string;
  amenities: string[];
  photoUrls: string[];
  coverPhotoUrl?: string;
  availabilityStatus: FirebaseAvailabilityStatus;
  moderationStatus: FirebaseModerationStatus;
  verificationLevel: FirebaseVerificationLevel;
  isFeatured: boolean;
  isAvailable: boolean;
  viewsCount: number;
  callClicksCount: number;
  whatsappClicksCount: number;
  reportCount: number;
  expiresAt?: any;
  createdAt: any;
  updatedAt: any;
}

export interface FirebaseListingPhoto {
  id: string;
  url: string;
  label?: string;
  isCover: boolean;
  createdAt: any;
}

export interface FirebaseSavedListing {
  listingId: string;
  savedAt: any;
  title: string;
  town: string;
  estate: string;
  landmark: string | null;
  houseType: string;
  monthlyRent: number;
  depositAmount: number;
  coverPhotoUrl: string | null;
  verificationLevel: string;
  availabilityStatus: string;
  moderationStatus: string;
  isAvailable: boolean;
  contactPhone: string | null;
  whatsappPhone: string | null;
}

export interface FirebaseListingReport {
  id: string;
  listingId: string;
  reporterId?: string;
  reason: FirebaseReportReason;
  message?: string;
  status: FirebaseReportStatus;
  createdAt: any;
  resolvedAt?: any;
}

export interface FirebaseContactEvent {
  id: string;
  listingId: string;
  userId?: string;
  eventType: FirebaseContactEventType;
  createdAt: any;
  userAgent?: string;
}

export interface FirebaseAvailabilityCheck {
  id: string;
  listingId: string;
  userId?: string;
  status: FirebaseAvailabilityCheckStatus;
  createdAt: any;
}

export interface FirebaseVerificationRequest {
  id: string;
  listingId?: string;
  requesterId: string;
  requestType: FirebaseVerificationRequestType;
  status: FirebaseVerificationRequestStatus;
  notes?: string;
  reviewedBy?: string;
  createdAt: any;
  reviewedAt?: any;
}

export interface FirebaseAdminAction {
  id: string;
  adminId: string;
  targetType: string;
  targetId: string;
  action: string;
  notes?: string;
  createdAt: any;
}

export interface FirebaseNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: any;
}
