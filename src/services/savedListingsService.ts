import { collection, query, orderBy, getDocs, doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseDb, isFirebaseConfigured } from '../lib/firebase';
import { FirebaseSavedListing, FirebaseListingHouseType } from '../types/firebase';

export async function getUserSavedListings(userId: string): Promise<FirebaseSavedListing[] | null> {
  if (!isFirebaseConfigured || !firebaseDb || !userId) return null;

  try {
    const savedRef = collection(firebaseDb, 'users', userId, 'savedListings');
    const q = query(savedRef, orderBy('savedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as FirebaseSavedListing);
  } catch (error: any) {
    console.error('Error fetching saved listings:', error);
    // Fallback if index missing
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
       try {
         const savedRef = collection(firebaseDb, 'users', userId, 'savedListings');
         const q = query(savedRef);
         const snapshot = await getDocs(q);
         return snapshot.docs.map(doc => doc.data() as FirebaseSavedListing);
       } catch (fallbackError) {
         console.error('Fallback saved query error:', fallbackError);
         return null;
       }
    }
    return null;
  }
}

export async function saveListingForUser(userId: string, listing: any, isFirebaseListing = false): Promise<boolean> {
  if (!isFirebaseConfigured || !firebaseDb || !userId || !listing || !listing.id) return false;

  try {
    const listingId = listing.id;
    const houseType = isFirebaseListing ? listing.houseType : listing.type;
    
    // Default mapped values
    const title = listing.title || `${houseType || 'House'} in ${listing.town || 'Kenya'}`;
    const town = listing.town || listing.location || 'Kenya';
    const estate = listing.estate || listing.location || '';
    const landmark = listing.landmark || null;
    const monthlyRent = isFirebaseListing ? listing.monthlyRent : listing.rent || 0;
    const depositAmount = isFirebaseListing ? listing.depositAmount : listing.deposit || 0;
    
    // Images mapping
    let coverPhotoUrl = null;
    if (isFirebaseListing) {
      coverPhotoUrl = listing.coverPhotoUrl || (listing.photoUrls?.length > 0 ? listing.photoUrls[0] : null);
    } else {
      coverPhotoUrl = listing.image || listing.imageUrl || (listing.images?.length > 0 ? listing.images[0] : null);
    }

    const verificationLevel = listing.verificationLevel || 'none';
    const availabilityStatus = listing.availabilityStatus || 'available';
    const moderationStatus = listing.moderationStatus || 'approved';
    const isAvailable = listing.hasOwnProperty('isAvailable') ? listing.isAvailable : true;
    
    const contactPhone = listing.contactPhone || listing.caretakerPhone || null;
    const whatsappPhone = listing.whatsappPhone || contactPhone || null;

    const savedDoc: FirebaseSavedListing = {
      listingId,
      savedAt: serverTimestamp(),
      title,
      town,
      estate,
      landmark,
      houseType: houseType || 'other',
      monthlyRent,
      depositAmount,
      coverPhotoUrl,
      verificationLevel,
      availabilityStatus,
      moderationStatus,
      isAvailable,
      contactPhone,
      whatsappPhone
    };

    const docRef = doc(firebaseDb, 'users', userId, 'savedListings', listingId);
    await setDoc(docRef, savedDoc, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving listing:', error);
    return false;
  }
}

export async function removeSavedListingForUser(userId: string, listingId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !firebaseDb || !userId || !listingId) return false;

  try {
    const docRef = doc(firebaseDb, 'users', userId, 'savedListings', listingId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error removing saved listing:', error);
    return false;
  }
}

export async function isListingSavedForUser(userId: string, listingId: string): Promise<boolean> {
   if (!isFirebaseConfigured || !firebaseDb || !userId || !listingId) return false;

   try {
     const docRef = doc(firebaseDb, 'users', userId, 'savedListings', listingId);
     const docSnap = await getDoc(docRef);
     return docSnap.exists();
   } catch (error) {
     console.error('Error checking saved status:', error);
     return false;
   }
}
