import { useState, useCallback } from 'react';
import { Listing } from '../types/listing';
import { searchApprovedListings } from '../services/listingService';
import { mapSupabaseListingsToListings } from '../lib/listingMappers';

export type NearbyPermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

const RADIUS_KM = 15;

export function useNearbyListings() {
  const [permissionState, setPermissionState] = useState<NearbyPermissionState>('idle');
  const [listings, setListings] = useState<Listing[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setPermissionState('unsupported');
      return;
    }

    setPermissionState('requesting');
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });
        setPermissionState('granted');

        try {
          const rows = await searchApprovedListings({
            sortBy: 'nearest',
            near: { lat, lng, radiusKm: RADIUS_KM },
          });
          setListings(rows ? mapSupabaseListingsToListings(rows) : []);
          if (!rows) setError('Could not load nearby listings.');
        } catch (err) {
          console.error('Error fetching nearby listings in hook:', err);
          setListings([]);
          setError('Could not load nearby listings.');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setPermissionState('denied');
        setIsLoading(false);
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  return {
    permissionState,
    listings,
    userCoords,
    isLoading,
    error,
    requestLocation,
    radiusKm: RADIUS_KM,
  };
}
