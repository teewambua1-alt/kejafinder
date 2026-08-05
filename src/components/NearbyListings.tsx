import React from 'react';
import { MapPin, Navigation, LocateFixed } from 'lucide-react';
import { motion } from 'motion/react';
import ListingCard from './ListingCard';
import ListingCardSkeleton from './ListingCardSkeleton';
import EmptyState from './ui/EmptyState';
import { useNearbyListings } from '../hooks/useNearbyListings';

interface NearbyListingsProps {
  onSelectListing?: (id: string) => void;
}

// Haversine distance in km -- used only for the "X.X km away" badge; the
// actual nearest-first ordering already happened server-side in the
// nearby_listings() RPC.
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Real geolocation-driven "nearby" section, backed by the nearby_listings()
 * Postgres RPC (see supabase/migrations/20260805000002_rls_and_functions.sql)
 * which already excludes any listing without real lat/lng. No listing has
 * real coordinates yet (Post Vacancy doesn't capture them at creation), so
 * the honest empty state below is the realistic state today -- this section
 * starts showing real results automatically once that data exists, with no
 * code change needed here.
 */
export default function NearbyListings({ onSelectListing }: NearbyListingsProps) {
  const { permissionState, listings, userCoords, isLoading, requestLocation } = useNearbyListings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
      className="w-full flex flex-col space-y-3.5"
    >
      <div className="flex items-center space-x-2 px-0.5">
        <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
        <h2 className="font-display text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
          Nearby listings
        </h2>
      </div>

      {permissionState === 'idle' && (
        <button
          onClick={requestLocation}
          className="w-full rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-dashed border-emerald-200 dark:border-emerald-900/50 p-5 flex items-center space-x-3.5 text-left cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Navigation className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-black text-neutral-800 dark:text-neutral-100">See homes near you</p>
            <p className="text-2xs font-semibold text-neutral-500 dark:text-stone-400 mt-0.5">
              Share your location to find vacancies close by.
            </p>
          </div>
        </button>
      )}

      {permissionState === 'denied' && (
        <EmptyState
          icon={LocateFixed}
          title="Location access needed"
          description="Enable location access in your browser settings to see homes near you."
        />
      )}

      {permissionState === 'unsupported' && (
        <EmptyState
          icon={LocateFixed}
          title="Location not supported"
          description="Your browser doesn't support location sharing on this device."
        />
      )}

      {(permissionState === 'requesting' || (permissionState === 'granted' && isLoading)) && (
        <div className="-mx-6 px-6 flex items-start space-x-4 overflow-x-auto no-scrollbar py-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {permissionState === 'granted' && !isLoading && listings.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="No nearby listings yet"
          description="No landlords near you have added exact locations yet -- check back soon."
        />
      )}

      {permissionState === 'granted' && !isLoading && listings.length > 0 && (
        <div className="-mx-6 px-6 flex items-start space-x-4 overflow-x-auto no-scrollbar py-2.5">
          {listings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + index * 0.05 }}
              className="relative"
            >
              <ListingCard listing={listing} onSelectListing={onSelectListing} />
              {userCoords && typeof listing.lat === 'number' && typeof listing.lng === 'number' && (
                <div className="absolute top-2.5 left-2.5 z-10 bg-black/60 backdrop-blur-md text-white text-2xs font-bold px-2 py-1 rounded-md border border-white/20 shadow-sm pointer-events-none">
                  {distanceKm(userCoords, { lat: listing.lat, lng: listing.lng }).toFixed(1)} km away
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
