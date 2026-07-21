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
}

export default function SearchFullMap({ listings, onSelectListing }: SearchFullMapProps) {
  // Determine center from first listing or fallback
  const center: [number, number] = [-1.2921, 36.8219];

  return (
    <div className="absolute inset-0 z-[40] bg-neutral-100 dark:bg-stone-900 overflow-hidden" style={{ top: '64px', bottom: '64px' }}>
      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {listings.map((listing) => {
          // Fallback coordinate generation for prototype
          // Real apps would use the listing.coordinates
          const lat = -1.2921 + (Math.random() - 0.5) * 0.1;
          const lng = 36.8219 + (Math.random() - 0.5) * 0.1;
          
          return (
            <Marker key={listing.id} position={[lat, lng]}>
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
