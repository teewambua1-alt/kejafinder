import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { firebaseDb, isFirebaseConfigured } from '../lib/firebase';
import { FirebaseListing } from '../types/firebase';

export async function getApprovedAvailableListings(): Promise<FirebaseListing[] | null> {
  if (!isFirebaseConfigured || !firebaseDb) return null;

  try {
    const listingsRef = collection(firebaseDb, 'listings');
    const q = query(
      listingsRef,
      where('moderationStatus', '==', 'approved'),
      where('isAvailable', '==', true),
      where('availabilityStatus', '==', 'available'),
      orderBy('updatedAt', 'desc'),
      limit(30)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseListing[];
  } catch (error: any) {
    console.error('Error fetching approved available listings:', error);
    // If composite index fails, handle gracefully by falling back
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      console.warn('Index missing, trying without orderBy...');
      try {
        const listingsRef = collection(firebaseDb, 'listings');
        const qFallback = query(
          listingsRef,
          where('moderationStatus', '==', 'approved'),
          where('isAvailable', '==', true),
          where('availabilityStatus', '==', 'available'),
          limit(30)
        );
        const querySnapshotFallback = await getDocs(qFallback);
        return querySnapshotFallback.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseListing[];
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return null;
      }
    }
    return null; // Force fallback to local data
  }
}

export async function getApprovedListingById(listingId: string): Promise<FirebaseListing | null> {
  if (!isFirebaseConfigured || !firebaseDb) return null;

  try {
    const docRef = doc(firebaseDb, 'listings', listingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as FirebaseListing;
      // Only return if it's approved and available
      if (
        data.moderationStatus === 'approved' &&
        data.isAvailable === true &&
        data.availabilityStatus === 'available'
      ) {
        return {
          id: docSnap.id,
          ...data
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching listing by id:', error);
    return null;
  }
}

interface SearchParams {
  locationQuery?: string;
  houseType?: string;
  minRent?: number;
  maxRent?: number;
  verifiedOnly?: boolean;
}

export async function searchApprovedListings(params: SearchParams): Promise<FirebaseListing[] | null> {
  if (!isFirebaseConfigured || !firebaseDb) return null;

  try {
    // Start with the basic query
    const listingsRef = collection(firebaseDb, 'listings');
    let q = query(
      listingsRef,
      where('moderationStatus', '==', 'approved'),
      where('isAvailable', '==', true),
      where('availabilityStatus', '==', 'available'),
      limit(50) 
    );
    
    // We can only reliably apply filters that don't conflict with composite index needs easily here
    // For specific `houseType`, we could add a where clause if safe
    if (params.houseType && params.houseType !== 'All') {
        const queryWithHouseType = query(q, where('houseType', '==', params.houseType));
        try {
            // Test if composite index exists for houseType
            const snap = await getDocs(queryWithHouseType);
            q = queryWithHouseType;
        } catch(e) {
            console.warn('Index missing for houseType search, dropping to basic query');
        }
    }

    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseListing[];

    // Second level client-side secondary filter
    if (params.minRent) {
      results = results.filter(l => l.monthlyRent >= params.minRent!);
    }
    if (params.maxRent) {
      results = results.filter(l => l.monthlyRent <= params.maxRent!);
    }
    if (params.verifiedOnly) {
      results = results.filter(l => l.verificationLevel !== 'none');
    }
    if (params.locationQuery) {
        const qLower = params.locationQuery.toLowerCase();
        results = results.filter(l => 
            l.county?.toLowerCase().includes(qLower) || 
            l.town?.toLowerCase().includes(qLower) || 
            l.estate?.toLowerCase().includes(qLower) || 
            l.landmark?.toLowerCase().includes(qLower) ||
            l.title?.toLowerCase().includes(qLower)
        );
    }
    
    return results;

  } catch (error) {
    console.error('Error searching listings:', error);
    return null;
  }
}
