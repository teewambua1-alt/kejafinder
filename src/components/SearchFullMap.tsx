import React from 'react';
import { Listing } from '../types/listing';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SearchFullMapProps {
  listings: Listing[];
  onSelectListing?: (id: string) => void;
  /** 'fullscreen' (default): mobile/tablet FAB takeover, absolutely positioned
   *  over the whole page. 'panel': in-flow, fills its parent container --
   *  used for the desktop sticky list+map split view. */
  variant?: 'fullscreen' | 'panel';
}

const NAIROBI_CENTER: [number, number] = [-1.2921, 36.8219];

// No listing has real geocoded coordinates yet (Post Vacancy doesn't
// capture them at creation) -- this deterministically derives a stable
// approximate pin per listing id so markers don't jump around on every
// re-render the way Math.random() did. Real lat/lng (once present) always
// takes priority below.
function approximateCoordinates(id: string): [number, number] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((hash % 1000) / 1000 - 0.5) * 0.1;
  const offsetLng = (((hash >> 8) % 1000) / 1000 - 0.5) * 0.1;
  return [NAIROBI_CENTER[0] + offsetLat, NAIROBI_CENTER[1] + offsetLng];
}

export default function SearchFullMap({ listings, onSelectListing, variant = 'fullscreen' }: SearchFullMapProps) {
  const containerClassName =
    variant === 'fullscreen'
      ? 'absolute inset-0 z-[40] bg-neutral-100 dark:bg-stone-900 overflow-hidden'
      : 'relative w-full h-full bg-neutral-100 dark:bg-stone-900 overflow-hidden rounded-2xl';

  return (
    <div className={containerClassName} style={variant === 'fullscreen' ? { top: '64px', bottom: '64px' } : undefined}>
      <MapContainer
        center={NAIROBI_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {listings.map((listing) => {
          const hasRealCoordinates = typeof listing.lat === 'number' && typeof listing.lng === 'number';
          const position: [number, number] = hasRealCoordinates
            ? [listing.lat as number, listing.lng as number]
            : approximateCoordinates(listing.id);

          return (
            <Marker key={listing.id} position={position}>
              <Popup>
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectListing?.(listing.id);
                  }}
                >
                  <p className="font-bold text-sm mb-1">{listing.title}</p>
                  <p className="text-emerald-600 font-bold">KSh {listing.rent.toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
