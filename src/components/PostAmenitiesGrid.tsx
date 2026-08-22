import React from 'react';
import { 
  Droplets, 
  Zap, 
  Lock, 
  Users, 
  Bath, 
  Grid, 
  ShieldCheck, 
  MapPin, 
  Bus, 
  BadgeCheck, 
  Car, 
  Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';

interface PostAmenitiesGridProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
  warning?: string;
}

interface AmenityItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AMENITIES_LIST: AmenityItem[] = [
  { id: 'water_available', label: 'Water available', icon: Droplets },
  { id: 'token_electricity', label: 'Token electricity', icon: Zap },
  { id: 'private_toilet', label: 'Private toilet', icon: Lock },
  { id: 'shared_toilet', label: 'Shared toilet', icon: Users },
  { id: 'private_bathroom', label: 'Private bathroom', icon: Bath },
  { id: 'shared_bathroom', label: 'Shared bathroom', icon: Bath },
  { id: 'tiled_floor', label: 'Tiled floor', icon: Grid },
  { id: 'secure_gate', label: 'Secure gate', icon: ShieldCheck },
  { id: 'near_main_road', label: 'Near main road', icon: MapPin },
  { id: 'near_bus_stage', label: 'Near bus stage', icon: Bus },
  { id: 'no_agent_fee', label: 'No agent fee', icon: BadgeCheck },
  { id: 'parking', label: 'Parking', icon: Car },
];

export default function PostAmenitiesGrid({
  selectedAmenities,
  onChange,
  warning,
}: PostAmenitiesGridProps) {
  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      onChange(selectedAmenities.filter((item) => item !== id));
    } else {
      onChange([...selectedAmenities, id]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-4"
    >
      {/* Title */}
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          <Sparkles className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col space-y-0.5">
          <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Amenities
          </h3>
          <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-400">
            Select what tenants should know before visiting.
          </p>
        </div>
      </div>

      {/* Soft warning if no amenities are selected */}
      {warning && (
        <div className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider bg-amber-500/5 px-3 py-2 rounded-xl border border-amber-500/10 flex items-center space-x-1.5 leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>{warning}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {AMENITIES_LIST.map((amenity) => {
          const isSelected = selectedAmenities.includes(amenity.id);
          const Icon = amenity.icon;

          return (
            <motion.button
              key={amenity.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleAmenity(amenity.id)}
              aria-pressed={isSelected}
              className={`flex items-center space-x-2.5 p-3 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer text-left focus:outline-hidden ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-700 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 font-extrabold shadow-xs shadow-emerald-500/5'
                  : 'bg-white/40 dark:bg-stone-850/40 border-neutral-150/40 dark:border-neutral-800/60 text-neutral-750 dark:text-stone-300 hover:border-neutral-255'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450'
                    : 'bg-neutral-100 dark:bg-stone-800 text-neutral-550 dark:text-stone-550'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="leading-tight text-[11px] truncate select-none">
                {amenity.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
