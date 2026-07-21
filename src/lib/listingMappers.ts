import { FirebaseListing, FirebaseSavedListing } from '../types/firebase';
import { Listing, ListingType } from '../types/listing';
import { PostListingDraft } from '../types/postListing';

export function mapPostVacancyFormToFirebaseListing(draft: PostListingDraft): Partial<FirebaseListing> {
  const houseTypeMap: Record<string, string> = {
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
    houseType: (houseTypeMap[draft.houseType] || 'other') as any,
    monthlyRent: rentAmount,
    depositAmount: depositAmount,
    agentFee: 0,
    viewingFee: 0,
    description: draft.description || '',
    county: draft.county || '',
    town: draft.town || '',
    estate: draft.estate || '',
    landmark: draft.landmark || '',
    distanceFromRoad: draft.distanceFromRoad || '',
    contactName: draft.contactName || '',
    contactRole: draft.contactRole,
    contactPhone: draft.allowCalls ? draft.contactPhone : '',
    whatsappPhone: draft.allowWhatsApp ? draft.whatsappPhone : '',
    amenities: draft.amenities || [],
    photoUrls: [], // do not persist local blobs
    coverPhotoUrl: undefined, // do not persist local blobs
    verificationLevel: 'none',
  };
}

export function mapFirebaseListingToListing(fbListing: FirebaseListing): Listing {
  const images = fbListing.photoUrls || [];
  if (fbListing.coverPhotoUrl && !images.includes(fbListing.coverPhotoUrl)) {
    images.unshift(fbListing.coverPhotoUrl);
  }

  // Derive simple type
  let type: ListingType = 'other' as ListingType;
  if (['single_room', 'bedsitter', 'studio', 'one_bedroom', 'two_bedroom', 'mabati'].includes(fbListing.houseType)) {
    type = fbListing.houseType as ListingType;
  }

  // Build badges
  const badges: string[] = [];
  if (fbListing.verificationLevel && fbListing.verificationLevel !== 'none') {
    badges.push(`${fbListing.verificationLevel} Verified`);
  }
  if (fbListing.isFeatured) {
    badges.push("Featured");
  }

  return {
    id: fbListing.id,
    title: fbListing.title || `${fbListing.houseType.replace('_', ' ')} in ${fbListing.town || 'Kenya'}`,
    type: type,
    rent: fbListing.monthlyRent || 0,
    deposit: fbListing.depositAmount || 0,
    // Prefer landmark/estate for general location display
    location: fbListing.estate || fbListing.landmark || fbListing.town,
    town: fbListing.town,
    estate: fbListing.estate,
    landmark: fbListing.landmark,
    image: fbListing.coverPhotoUrl || (images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
    imagesCount: images.length,
    amenities: fbListing.amenities || [],
    badges,
    isFeatured: fbListing.isFeatured || false,
    isAvailable: fbListing.isAvailable && fbListing.availabilityStatus === 'available',
    // Not mapping views immediately unless needed, but can map viewsCount to views
    views: fbListing.viewsCount || 0,
    contactPhone: fbListing.contactPhone || '',
    whatsappPhone: fbListing.whatsappPhone || fbListing.contactPhone || '',
    updatedAt: fbListing.updatedAt ? new Date(fbListing.updatedAt.toMillis ? fbListing.updatedAt.toMillis() : fbListing.updatedAt).toISOString() : new Date().toISOString(),
    distanceFromRoad: fbListing.distanceFromRoad,
    county: fbListing.county,
  };
}

export function mapFirebaseListingsToListings(fbListings: FirebaseListing[]): Listing[] {
  return fbListings.map(mapFirebaseListingToListing);
}

export function mapFirebaseSavedListingToListing(fbSaved: FirebaseSavedListing): Listing {
  let type: ListingType = 'other' as ListingType;
  if (['single_room', 'bedsitter', 'studio', 'one_bedroom', 'two_bedroom', 'mabati'].includes(fbSaved.houseType)) {
    type = fbSaved.houseType as ListingType;
  }

  const badges: string[] = [];
  if (fbSaved.verificationLevel && fbSaved.verificationLevel !== 'none') {
    badges.push(`${fbSaved.verificationLevel} Verified`);
  }

  return {
    id: fbSaved.listingId,
    title: fbSaved.title || `${fbSaved.houseType.replace('_', ' ')} in ${fbSaved.town || 'Kenya'}`,
    type: type,
    rent: fbSaved.monthlyRent || 0,
    deposit: fbSaved.depositAmount || 0,
    location: fbSaved.estate || fbSaved.landmark || fbSaved.town,
    town: fbSaved.town,
    estate: fbSaved.estate,
    landmark: fbSaved.landmark || undefined,
    image: fbSaved.coverPhotoUrl || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imagesCount: 1, // Safe default since we only store cover photo
    amenities: [], // Safe default
    badges,
    isFeatured: false,
    isAvailable: fbSaved.isAvailable && fbSaved.availabilityStatus === 'available',
    views: 0,
    contactPhone: fbSaved.contactPhone || '',
    whatsappPhone: fbSaved.whatsappPhone || fbSaved.contactPhone || '',
    updatedAt: fbSaved.savedAt ? new Date(fbSaved.savedAt.toMillis ? fbSaved.savedAt.toMillis() : fbSaved.savedAt).toISOString() : new Date().toISOString(),
  };
}
