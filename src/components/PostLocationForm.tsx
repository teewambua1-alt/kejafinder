import React from 'react';
import { MapPin, Landmark, Footprints, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface PostLocationFormProps {
  county: string;
  town: string;
  estate: string;
  landmark: string;
  distanceFromRoad: string;
  errors: {
    county?: string;
    town?: string;
    estate?: string;
    landmark?: string;
  };
  onChange: (fields: Partial<{
    county: string;
    town: string;
    estate: string;
    landmark: string;
    distanceFromRoad: string;
  }>) => void;
}

export const COUNTIES_LIST = [
  'Nairobi',
  'Kiambu',
  'Machakos',
  'Kajiado',
  'Nakuru',
  'Mombasa',
  'Kisumu',
  'Uasin Gishu',
];

export default function PostLocationForm({
  county,
  town,
  estate,
  landmark,
  distanceFromRoad,
  errors,
  onChange,
}: PostLocationFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-5"
    >
      {/* Description Title Header */}
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          <MapPin className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col space-y-0.5">
          <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Location Details
          </h3>
          <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-400">
            Add clear local details so tenants can find the house easily.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* County Select & Town Field in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* County Selection */}
          <div className="flex flex-col space-y-1.5 flex-1">
            <label htmlFor="county-select" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
              County <span className="text-emerald-700">*</span>
            </label>
            <div className="relative flex items-center">
              <select
                id="county-select"
                value={county}
                onChange={(e) => onChange({ county: e.target.value })}
                aria-invalid={!!errors.county}
                aria-describedby={errors.county ? "county-error-msg" : undefined}
                className={`w-full h-12 px-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-xs font-bold text-neutral-800 dark:text-stone-105 appearance-none focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all cursor-pointer font-sans ${
                  county === '' ? 'text-neutral-550 dark:text-stone-400' : ''
                } ${
                  errors.county
                    ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                    : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
                }`}
              >
                <option value="" disabled className="text-neutral-550">Select county</option>
                {COUNTIES_LIST.map((item) => (
                  <option key={item} value={item} className="text-neutral-800 dark:text-stone-100">
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 w-4 h-4 text-neutral-550 dark:text-stone-400 pointer-events-none stroke-[2.2]" />
            </div>
            {errors.county && (
              <span id="county-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
                {errors.county}
              </span>
            )}
          </div>

          {/* Town / Area Input */}
          <div className="flex flex-col space-y-1.5 flex-1">
            <label htmlFor="town-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
              Town / Area <span className="text-emerald-700">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                id="town-input"
                value={town}
                onChange={(e) => onChange({ town: e.target.value })}
                placeholder="e.g. Syokimau, Athi River, Rongai"
                aria-invalid={!!errors.town}
                aria-describedby={errors.town ? "town-error-msg" : undefined}
                className={`w-full h-12 px-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-xs font-bold text-neutral-800 dark:text-stone-105 placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all font-sans ${
                  errors.town
                    ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                    : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
                }`}
              />
            </div>
            {errors.town && (
              <span id="town-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
                {errors.town}
              </span>
            )}
          </div>
        </div>

        {/* Estate Field */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="estate-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            Estate <span className="text-emerald-700">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id="estate-input"
              value={estate}
              onChange={(e) => onChange({ estate: e.target.value })}
              placeholder="e.g. Gateway Mall Area, Kwa Chief"
              aria-invalid={!!errors.estate}
              aria-describedby={errors.estate ? "estate-error-msg" : undefined}
              className={`w-full h-12 px-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-xs font-bold text-neutral-800 dark:text-stone-105 placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all font-sans ${
                errors.estate
                  ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                  : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.estate && (
            <span id="estate-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
              {errors.estate}
            </span>
          )}
        </div>

        {/* Nearby Landmark */}
        <div className="flex flex-col space-y-1.5 flex-1">
          <label htmlFor="landmark-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center justify-between">
            <span>Nearby Landmark <span className="text-emerald-700">*</span></span>
          </label>
          <div className="relative flex items-center">
            <Landmark className="absolute left-4 w-4.5 h-4.5 text-neutral-550 dark:text-stone-605 pointer-events-none stroke-[2]" />
            <input
              type="text"
              id="landmark-input"
              value={landmark}
              onChange={(e) => onChange({ landmark: e.target.value })}
              placeholder="e.g. Near Gateway Mall or main stage"
              aria-invalid={!!errors.landmark}
              aria-describedby={errors.landmark ? "landmark-error-msg" : undefined}
              className={`w-full h-12 pl-11 pr-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-xs font-bold text-neutral-800 dark:text-stone-105 placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all font-sans ${
                errors.landmark
                  ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                  : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.landmark && (
            <span id="landmark-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
              {errors.landmark}
            </span>
          )}
        </div>

        {/* Distance from main road */}
        <div className="flex flex-col space-y-1.5 flex-1">
          <label htmlFor="distance-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            Distance from main road <span className="text-neutral-550 dark:text-stone-400">(Optional)</span>
          </label>
          <div className="relative flex items-center">
            <Footprints className="absolute left-4 w-4.5 h-4.5 text-neutral-550 dark:text-stone-605 pointer-events-none stroke-[2]" />
            <input
              type="text"
              id="distance-input"
              value={distanceFromRoad}
              onChange={(e) => onChange({ distanceFromRoad: e.target.value })}
              placeholder="e.g. 5 minutes walk from main road"
              className="w-full h-12 pl-11 pr-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 text-xs font-bold text-neutral-800 dark:text-stone-105 placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 focus:border-emerald-500/80 focus:ring-emerald-500/20 transition-all font-sans"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
