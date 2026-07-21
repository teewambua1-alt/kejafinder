import { collection, doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firebaseDb, isFirebaseConfigured } from '../lib/firebase';
import { FirebaseListing } from '../types/firebase';

export async function createListingDraft(userId: string, role: string, params: Partial<FirebaseListing>): Promise<FirebaseListing | null> {
  if (!isFirebaseConfigured || !firebaseDb || !userId) return null;
  
  // Tenants cannot post real vacancies
  if (role === 'tenant') return null;

  try {
    const listingsRef = collection(firebaseDb, 'listings');
    const newDocRef = doc(listingsRef);
    const listingId = newDocRef.id;

    const draft: FirebaseListing = {
      id: listingId,
      ownerId: userId,
      title: params.title || '',
      description: params.description || '',
      houseType: params.houseType || 'other',
      monthlyRent: params.monthlyRent || 0,
      depositAmount: params.depositAmount || 0,
      waterCharge: params.waterCharge || '',
      electricityType: params.electricityType || '',
      agentFee: params.agentFee || 0,
      viewingFee: params.viewingFee || 0,
      county: params.county || '',
      town: params.town || '',
      estate: params.estate || '',
      landmark: params.landmark || '',
      distanceFromRoad: params.distanceFromRoad || '',
      toiletType: params.toiletType || '',
      bathroomType: params.bathroomType || '',
      floorLevel: params.floorLevel || '',
      security: params.security || '',
      contactName: params.contactName || '',
      contactRole: (params.contactRole as any) || 'landlord',
      contactPhone: params.contactPhone || '',
      whatsappPhone: params.whatsappPhone || '',
      amenities: params.amenities || [],
      photoUrls: [],
      coverPhotoUrl: undefined,
      availabilityStatus: 'pending',
      moderationStatus: 'draft',
      verificationLevel: 'none',
      isFeatured: false,
      isAvailable: false,
      viewsCount: 0,
      callClicksCount: 0,
      whatsappClicksCount: 0,
      reportCount: 0,
      expiresAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(newDocRef, draft);
    return draft;
  } catch (error) {
    console.error('Error creating listing draft:', error);
    return null;
  }
}

export async function updateListingDraft(listingId: string, userId: string, params: Partial<FirebaseListing>): Promise<boolean> {
  if (!isFirebaseConfigured || !firebaseDb || !listingId || !userId) return false;

  try {
    const docRef = doc(firebaseDb, 'listings', listingId);
    
    // Create an update object, excluding protected fields
    const updates: any = { ...params };
    delete updates.id;
    delete updates.ownerId;
    delete updates.moderationStatus; // Do not allow changing moderation status directly
    delete updates.createdAt;
    
    updates.updatedAt = serverTimestamp();

    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating listing draft:', error);
    return false;
  }
}

export async function submitListingForReview(listingId: string, userId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !firebaseDb || !listingId || !userId) return false;

  try {
    const docRef = doc(firebaseDb, 'listings', listingId);
    
    await updateDoc(docRef, {
      moderationStatus: 'pending_review',
      availabilityStatus: 'pending',
      isAvailable: false,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error submitting listing for review:', error);
    return false;
  }
}

export async function getOwnerDraftListing(listingId: string, userId: string): Promise<FirebaseListing | null> {
  if (!isFirebaseConfigured || !firebaseDb || !listingId || !userId) return null;

  try {
    const docRef = doc(firebaseDb, 'listings', listingId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().ownerId === userId) {
      return docSnap.data() as FirebaseListing;
    }
    return null;
  } catch (error) {
    console.error('Error fetching owner draft:', error);
    return null;
  }
}
