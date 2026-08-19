import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing } from '../types/listing';
import { 
  MapPin, 
  Phone, 
  Layers, 
  Navigation, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  Heart,
  Calendar,
  AlertTriangle,
  Map as MapIcon,
  CircleDot
} from 'lucide-react';

interface SavedMapViewProps {
  listings: Listing[];
  onUnsave?: (id: string) => void;
}

// Deterministic mock coordinates mapping based on estate or deterministic hash for full spacing coverage
const getMockCoordinates = (listing: Listing, idx: number) => {
  const loc = (listing.location || '').toLowerCase();
  const estate = (listing.estate || '').toLowerCase();
  const town = (listing.town || '').toLowerCase();

  // 1. Syokimau
  if (loc.includes('syokimau') || estate.includes('syokimau') || town.includes('syokimau')) {
    return { x: 55 + (idx % 3) * 3, y: 28 + (idx % 2) * 4 };
  }
  // 2. Rongai
  if (loc.includes('rongai') || estate.includes('rongai') || town.includes('rongai')) {
    return { x: 22 + (idx % 3) * 3, y: 70 + (idx % 2) * 4 };
  }
  // 3. Kitengela
  if (loc.includes('kitengela') || estate.includes('kitengela') || town.includes('kitengela')) {
    return { x: 74 + (idx % 3) * 3, y: 76 + (idx % 2) * 4 };
  }
  // 4. Athi River
  if (loc.includes('athi') || estate.includes('athi') || town.includes('athi')) {
    return { x: 48 + (idx % 3) * 3, y: 82 + (idx % 2) * 4 };
  }
  // 5. Mlolongo
  if (loc.includes('mlolongo') || estate.includes('mlolongo') || town.includes('mlolongo')) {
    return { x: 78 + (idx % 3) * 3, y: 38 + (idx % 2) * 4 };
  }
  // 6. Ngong
  if (loc.includes('ngong') || estate.includes('ngong') || town.includes('ngong')) {
    return { x: 18 + (idx % 3) * 3, y: 44 + (idx % 2) * 4 };
  }
  // 7. General Nairobi or unknown: scatter deterministically
  const offsetsX = [45, 50, 35, 62, 30, 68, 42, 58];
  const offsetsY = [48, 55, 60, 50, 36, 62, 70, 42];
  const baseIdx = idx % offsetsX.length;
  return { x: offsetsX[baseIdx], y: offsetsY[baseIdx] };
};

export default function SavedMapView({ listings, onUnsave }: SavedMapViewProps) {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [locateMsg, setLocateMsg] = useState(false);

  // Auto-select first listings if available
  useEffect(() => {
    if (listings.length > 0) {
      // Keep selected listing if still in modified view, else fallback to first
      const stillSaved = listings.some((item) => item.id === selectedListingId);
      if (!stillSaved) {
        setSelectedListingId(listings[0].id);
      }
    } else {
      setSelectedListingId(null);
    }
  }, [listings, selectedListingId]);

  const selectedListing = listings.find((item) => item.id === selectedListingId);

  const handleLocateClick = () => {
    setLocateMsg(true);
    setTimeout(() => {
      setLocateMsg(false);
    }, 3000);
  };

  const formatCurrency = (val: number) => `KSh ${val.toLocaleString()}`;

  const formatHouseType = (type: string) => {
    switch (type) {
      case 'single_room': return 'Single Room';
      case 'bedsitter': return 'Bedsitter';
      case 'studio': return 'Studio';
      case 'one_bedroom': return '1 Bedroom';
      case 'two_bedroom': return '2 Bedroom';
      case 'mabati': return 'Mabati House';
      default: return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4 select-none">
      
      {/* 1. Styled CSS-drawn Canvas Map Container */}
      <div className="relative w-full h-[280px] xs:h-[320px] rounded-3xl border border-neutral-150 dark:border-stone-800 bg-emerald-500/[0.04] dark:bg-stone-950/60 overflow-hidden shadow-inner flex flex-col justify-between">
        
        {/* Abstract Map Roads and Shapes Grid */}
        <div className="absolute inset-0 opacity-25 dark:opacity-20 pointer-events-none">
          {/* Main Diagonal Highway */}
          <div className="absolute w-[180%] h-4 bg-emerald-900/10 dark:bg-white/10 rotate-[22deg] -top-10 -left-10" />
          {/* Secondary Loop Expressway */}
          <div className="absolute w-full h-full border-4 border-emerald-900/5 dark:border-white/5 rounded-full -top-1/4 -left-1/3 scale-[1.1]" />
          <div className="absolute w-full h-full border-4 border-emerald-900/5 dark:border-white/5 rounded-full top-1/3 left-1/2 scale-[1.3]" />
          {/* Mombasa Road mockup */}
          <div className="absolute w-[200%] h-5 bg-neutral-900/5 dark:bg-stone-50/10 -rotate-[35deg] top-1/3 -left-10" />
          {/* Local stages lines */}
          <div className="absolute w-0.5 h-full bg-neutral-950/5 dark:bg-white/5 left-1/4" />
          <div className="absolute w-0.5 h-full bg-neutral-950/5 dark:bg-white/5 left-2/3" />
          <div className="absolute h-0.5 w-full bg-neutral-950/5 dark:bg-white/5 top-1/2" />
        </div>

        {/* CSS Map Labels landmarks */}
        <div className="absolute inset-0 pointer-events-none text-[8.5px] font-black text-neutral-400 dark:text-stone-600 uppercase tracking-widest leading-none">
          <span className="absolute top-[16%] left-[10%] opacity-80">Rongai Estate</span>
          <span className="absolute top-[48%] left-[8%] opacity-70">Ngong Stage</span>
          <span className="absolute top-[12%] right-[15%] opacity-80">Mlolongo Crossing</span>
          <span className="absolute top-[28%] left-[50%] opacity-90 text-emerald-600/60 dark:text-emerald-500/30 font-sans tracking-wide">Mombasa Road Highway</span>
          <span className="absolute top-[22%] left-[45%] opacity-85">Gateway Mall</span>
          <span className="absolute top-[34%] left-[64%] opacity-80">Syokimau Terminus</span>
          <span className="absolute bottom-[24%] left-[42%] opacity-80">Athi River Basin</span>
          <span className="absolute bottom-[16%] right-[14%] opacity-90">Kitengela Plains</span>
        </div>

        {/* Small floating Layer controls overlays */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2 z-10">
          <div className="flex items-center space-x-1 bg-white/90 dark:bg-stone-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-3xs border border-neutral-100 dark:border-stone-850 text-[10px] font-extrabold text-neutral-700 dark:text-stone-300">
            <Layers className="w-3.5 h-3.5 text-emerald-500 stroke-[2.2]" />
            <span>Estate Overlay Active</span>
          </div>
        </div>

        {/* Map Pins mapping */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence>
            {listings.map((item, idx) => {
              const coords = getMockCoordinates(item, idx);
              const isSelected = selectedListingId === item.id;
              
              // Map abbreviated title logic e.g. "8K", "12K", "16K"
              const kiloAmount = item.rent >= 1000 ? `${(item.rent / 1000).toFixed(0)}K` : item.rent;

              return (
                <motion.button
                  key={`pin-${item.id}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => setSelectedListingId(item.id)}
                  aria-label={`View ${item.title} on map`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 select-none pointer-events-auto cursor-pointer flex flex-col items-center group z-20 outline-none"
                >
                  {/* Dynamic pin node */}
                  <div className="relative flex flex-col items-center">
                    
                    {/* Ring Pulse indicator on active listings */}
                    {isSelected && (
                      <span className="absolute -inset-2.5 rounded-full bg-emerald-500/20 dark:bg-emerald-400/25 animate-ping opacity-75" />
                    )}

                    {/* Small price label flag on top */}
                    <div className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-mono font-black shadow-3xs border transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-neutral-800 border-neutral-200 dark:bg-stone-900 dark:text-stone-250 dark:border-stone-800'
                    }`}>
                      {kiloAmount}
                    </div>

                    {/* Visual caret pointer */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-2xs border transition-transform ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 scale-115'
                        : 'bg-white text-emerald-600 border-emerald-100 group-hover:bg-emerald-50 dark:bg-stone-900 dark:border-stone-800 dark:text-emerald-400'
                    }`}>
                      <MapIcon className="w-3 h-3 stroke-[2.2]" />
                    </div>

                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Locate Floating Action Controller */}
        <div className="absolute bottom-3 right-3 z-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLocateClick}
            aria-label="Preview current location"
            className="w-10 h-10 rounded-full bg-white/95 dark:bg-stone-900/95 border border-neutral-100 dark:border-stone-850 shadow-md flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 cursor-pointer"
          >
            <Navigation className="w-4.5 h-4.5 stroke-[2.2]" />
          </motion.button>
        </div>

        {/* Floating map warning alert toast message */}
        <AnimatePresence>
          {locateMsg && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-3 left-3 right-15 z-20 bg-neutral-900/95 dark:bg-stone-950/95 text-white text-[9.5px] font-extrabold px-3 py-2 rounded-xl shadow-lg border border-neutral-800 flex items-center space-x-1.5"
            >
              <CircleDot className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span>Location preview only in this prototype.</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 2. Interactive Map Selected Property Preview Card */}
      <AnimatePresence mode="wait">
        {selectedListing ? (
          <motion.div
            key={`map-preview-${selectedListing.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full bg-white/95 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-100 dark:border-neutral-850 rounded-2.5xl p-3 shadow-sm flex flex-col space-y-3 relative"
          >
            
            {/* Horizontal body column */}
            <div className="flex items-start space-x-3 w-full">
              
              {/* Thumbnail image and metadata */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-stone-950 shrink-0 shadow-3xs">
                <img
                  src={selectedListing.image}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-1 right-1 px-1 bg-neutral-900/80 text-[8px] font-extrabold text-white rounded">
                  1/{selectedListing.imagesCount || 5}
                </div>
              </div>

              {/* Header Texts */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1 justify-between">
                    <h4 className="text-xs font-black text-neutral-850 dark:text-stone-100 leading-tight truncate">
                      {selectedListing.title}
                    </h4>
                    
                    {/* Tiny inline heart unsave callback button */}
                    <button
                      onClick={() => onUnsave && onUnsave(selectedListing.id)}
                      className="text-red-500 dark:text-red-400 hover:scale-110 transition-transform p-0.5 -mr-1 cursor-pointer border-none bg-transparent"
                      title="Unsave home"
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-500 stroke-[2]" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-0.5 text-[10.5px] font-semibold text-neutral-500 dark:text-neutral-400">
                    <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{selectedListing.location}</span>
                  </div>
                </div>

                {/* Rates Row */}
                <div className="flex items-center space-x-3 mt-1.5 flex-wrap">
                  <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(selectedListing.rent)}
                    <span className="text-[8.5px] text-neutral-400 dark:text-stone-500 font-extrabold font-mono">/mo</span>
                  </span>
                  
                  <span className="text-[9.5px] font-bold text-neutral-500 dark:text-stone-400">
                    Deposit: {formatCurrency(selectedListing.deposit)}
                  </span>
                </div>

                {/* Sub features pill row */}
                <div className="flex gap-1.5 mt-1.5">
                  <span className="text-[8.5px] font-extrabold px-1 py-0.5 bg-neutral-100 dark:bg-stone-850 text-neutral-500 dark:text-stone-400 rounded uppercase">
                    {formatHouseType(selectedListing.type)}
                  </span>
                  
                  {selectedListing.badges && selectedListing.badges.length > 0 && (
                    <span className="text-[8.5px] font-extrabold px-1 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded flex items-center space-x-0.5">
                      <ShieldCheck className="w-2.5 h-2.5 shrink-0 text-emerald-500" />
                      <span>{selectedListing.badges[0]}</span>
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Calling trigger overlay grid */}
            <div className="flex justify-between items-center pt-2.5 border-t border-neutral-150/50 dark:border-stone-800/60 font-mono text-[9px] text-neutral-400 flex-wrap gap-2">
              <span className="flex items-center space-x-1 font-sans">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>Saved on {selectedListing.savedAt || "Recently"}</span>
              </span>

              <div className="flex items-center space-x-2">
                {selectedListing.contactPhone ? (
                  <motion.a
                    whileTap={{ scale: 0.96 }}
                    href={`tel:${selectedListing.contactPhone}`}
                    className="h-10 px-3 rounded-lg border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-850 text-[10px] font-sans font-black flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </motion.a>
                ) : (
                  <button
                    disabled
                    className="h-10 px-3 rounded-lg border border-neutral-200 dark:border-stone-700 text-neutral-400 dark:text-stone-600 text-[10px] font-sans font-black flex items-center space-x-1 cursor-not-allowed"
                  >
                    <Phone className="w-3 h-3" />
                    <span>No phone</span>
                  </button>
                )}

                {selectedListing.whatsappPhone ? (
                  <motion.a
                    whileTap={{ scale: 0.96 }}
                    href={`https://wa.me/${selectedListing.whatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-sans font-black flex items-center"
                  >
                    <span>WhatsApp</span>
                  </motion.a>
                ) : (
                  <button
                    disabled
                    className="h-10 px-3.5 rounded-lg bg-neutral-100 dark:bg-stone-850 text-neutral-400 dark:text-stone-600 text-[10px] font-sans font-black flex items-center cursor-not-allowed"
                  >
                    <span>No WhatsApp</span>
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        ) : (
          <div className="bg-neutral-50 dark:bg-stone-900/40 p-6 rounded-2.5xl text-center border-dashed border border-neutral-200 dark:border-stone-800">
            <p className="text-xs text-neutral-500 font-extrabold">Select a listing pin on the map to start reviews</p>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Global geographical map note advisor banner */}
      <div className="w-full bg-emerald-500/[0.04] dark:bg-emerald-950/10 border border-emerald-500/15 dark:border-emerald-500/10 p-3 rounded-2xl flex items-start space-x-2.5 leading-tight shadow-3xs">
        <AlertTriangle className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-300">
            Locations approximate!
          </h4>
          <p className="text-[10px] text-neutral-550 dark:text-natural-400 font-semibold leading-relaxed">
            Map locations are approximate. Confirm exact directions with the caretaker or your housing scout before visiting.
          </p>
        </div>
      </div>

    </div>
  );
}
