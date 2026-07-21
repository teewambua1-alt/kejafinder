import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Route, Footprints, BusFront, Map as MapIcon, Info, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { KejaListing } from '../types/listings';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A custom component to update map view when coordinates change
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface ListingLocationDetailsProps {
  listing: KejaListing;
  onAskDirections?: () => void;
  onOpenMap?: () => void;
}

function MapPreview({ listing, onOpenMap }: { listing: KejaListing, onOpenMap?: () => void }) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Try to get coordinates from Nominatim
    const fetchCoords = async () => {
      try {
        const query = encodeURIComponent(`${listing.estate || listing.location}, Kenya`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          // Fallback to Nairobi
          setCoordinates([-1.2921, 36.8219]);
        }
      } catch (err) {
        setCoordinates([-1.2921, 36.8219]);
      }
    };
    fetchCoords();
  }, [listing.estate, listing.location]);

  if (!coordinates) {
    return (
      <div className="w-full h-48 sm:h-56 bg-neutral-100 dark:bg-stone-850/80 rounded-2xl animate-pulse" />
    );
  }

  return (
    <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden relative border border-neutral-200/50 dark:border-stone-700/50 z-0">
      <MapContainer 
        center={coordinates} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            {listing.estate || listing.location}
          </Popup>
        </Marker>
        <ChangeView center={coordinates} zoom={13} />
      </MapContainer>

      {/* Map Labels */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-black text-neutral-700 dark:text-stone-300 shadow-sm border border-neutral-200/50 dark:border-stone-700/50 uppercase tracking-wider z-[1000] pointer-events-none">
        {listing.estate || listing.location}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onOpenMap}
        className="absolute bottom-3 right-3 w-10 h-10 shrink-0 bg-white dark:bg-stone-850 border border-neutral-200 dark:border-stone-700 rounded-full flex items-center justify-center text-neutral-600 dark:text-stone-300 shadow-sm z-[1000]"
        aria-label="Open map preview"
      >
        <MapIcon className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

export default function ListingLocationDetails({ listing, onAskDirections, onOpenMap }: ListingLocationDetailsProps) {
  const [insightText, setInsightText] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  const handleGetInsight = async () => {
    if (insightText) return; // Already have insight

    setIsLoadingInsight(true);
    setInsightError(null);

    const locationQuery = `${listing.estate || ''} ${listing.location || ''}, Nairobi, Kenya`.trim();

    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: locationQuery })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      setInsightText(data.text);
    } catch (error) {
      console.error("Error fetching insights:", error);
      setInsightError("Could not load area insights at this time. Please try again later.");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div variants={rowVariants} className="px-1">
        <h3 className="text-lg font-black text-neutral-850 dark:text-stone-50">Location</h3>
        <p className="text-xs font-semibold text-neutral-500 dark:text-stone-400 mt-0.5">
          Check the area, landmark, and access before visiting.
        </p>
      </motion.div>

      {/* 1. Main location card */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20">
          <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-black text-neutral-850 dark:text-stone-100">
            {listing.location}
          </h4>
          <p className="text-xs font-semibold text-neutral-600 dark:text-stone-400 mt-0.5">
            {listing.estate || listing.location}
          </p>
          {listing.landmark && (
            <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-500 mt-1">
              Near {listing.landmark}
            </p>
          )}
        </div>
      </motion.div>

      {/* 2. Local details grid/list */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-5">
        {listing.landmark && (
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-neutral-100 dark:border-stone-700">
              <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Landmark</p>
              <p className="text-xs font-black text-neutral-800 dark:text-stone-200">{listing.landmark}</p>
            </div>
          </div>
        )}

        {listing.distanceFromRoadText && (
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-neutral-100 dark:border-stone-700">
              <Footprints className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Main Road</p>
              <p className="text-xs font-black text-neutral-800 dark:text-stone-200">{listing.distanceFromRoadText}</p>
            </div>
          </div>
        )}

        {listing.nearbyStage && (
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-neutral-100 dark:border-stone-700">
              <BusFront className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Nearby Stage</p>
              <p className="text-xs font-black text-neutral-800 dark:text-stone-200">{listing.nearbyStage}</p>
            </div>
          </div>
        )}

        {listing.roadAccessText && (
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-neutral-100 dark:border-stone-700">
              <Route className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-450 dark:text-stone-500 tracking-wider mb-0.5">Road Access</p>
              <p className="text-xs font-black text-neutral-800 dark:text-stone-200">{listing.roadAccessText}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* 3. Interactive Leaflet Map preview */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        <MapPreview listing={listing} onOpenMap={onOpenMap} />
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onAskDirections}
            className="flex-1 bg-neutral-850 dark:bg-stone-100 text-white dark:text-stone-900 py-3.5 rounded-2xl text-[11px] uppercase font-black tracking-wider flex items-center justify-center space-x-2 border border-transparent shadow-sm"
            aria-label="Ask caretaker for directions"
          >
            <Navigation className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Ask for directions</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGetInsight}
            disabled={isLoadingInsight || !!insightText}
            className="flex-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 py-3.5 rounded-2xl text-[11px] uppercase font-black tracking-wider flex items-center justify-center space-x-2 border border-emerald-200 dark:border-emerald-800/50 shadow-sm disabled:opacity-50"
            aria-label="Get area insights"
          >
            {isLoadingInsight ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Area Insight</span>
          </motion.button>
        </div>

        {/* AI Insight Area */}
        <AnimatePresence>
          {(insightText || insightError) && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className={`p-4 rounded-2xl text-sm ${insightError ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/30 text-neutral-800 dark:text-neutral-200'} shadow-inner`}>
                {insightError ? (
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{insightError}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2 text-emerald-700 dark:text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold text-[11px] uppercase tracking-wider">AI Neighborhood Summary</span>
                    </div>
                    <p className="leading-relaxed text-[13px]">{insightText}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 4. Location safety note */}
      <motion.div variants={rowVariants} className="bg-orange-50/80 dark:bg-orange-950/20 border border-orange-100/80 dark:border-orange-900/30 rounded-2xl p-4 shadow-sm flex items-start space-x-3">
        <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <p className="text-[11.5px] font-semibold text-orange-800 dark:text-orange-300 leading-snug">
          {listing.directionsNote || "Exact directions should be confirmed with the caretaker before visiting."}
        </p>
      </motion.div>
    </motion.div>
  );
}
