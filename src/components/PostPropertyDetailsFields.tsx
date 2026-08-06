import React from 'react';
import { Droplets, Zap, ChevronDown, Layers, ShieldCheck, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

export type PostPropertyDetails = {
  waterCharge: string;
  electricityType: string;
  toiletType: string;
  bathroomType: string;
  floorLevel: string;
  security: string;
  agentFee: string;
  viewingFee: string;
};

interface PostPropertyDetailsFieldsProps extends PostPropertyDetails {
  onChange: (fields: Partial<PostPropertyDetails>) => void;
}

const WATER_CHARGE_OPTIONS = [
  'Included in rent',
  'Metered - pay as used',
  'Fixed monthly charge',
  'Borehole - no charge',
  'Other',
];

const ELECTRICITY_TYPE_OPTIONS = [
  'Token / prepaid',
  'Postpaid / monthly bill',
  'Included in rent',
  'Shared meter',
  'Other',
];

const selectClass =
  'w-full h-12 pl-4 pr-10 bg-white/50 dark:bg-stone-850/40 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 text-xs font-bold text-neutral-800 dark:text-stone-105 appearance-none focus:outline-hidden focus:ring-2 focus:border-emerald-500/80 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-stone-900 transition-all cursor-pointer font-sans';

const inputClass =
  'w-full h-12 px-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 text-xs font-bold text-neutral-800 dark:text-stone-105 placeholder-neutral-405 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:border-emerald-500/80 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-stone-900 transition-all font-sans';

export default function PostPropertyDetailsFields({
  waterCharge,
  electricityType,
  toiletType,
  bathroomType,
  floorLevel,
  security,
  agentFee,
  viewingFee,
  onChange,
}: PostPropertyDetailsFieldsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-4 relative z-10"
      id="post-property-details-container-card"
    >
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Layers className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col space-y-0.5">
          <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Utilities & condition
          </h3>
          <p className="text-[10px] font-semibold text-neutral-400 dark:text-stone-500">
            Optional, but the details tenants ask about first.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Water charge */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="water-charge-select" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450 stroke-[2]" />
            Water charge
          </label>
          <div className="relative flex items-center">
            <select
              id="water-charge-select"
              value={waterCharge}
              onChange={(e) => onChange({ waterCharge: e.target.value })}
              className={`${selectClass} ${waterCharge === '' ? 'text-neutral-400 dark:text-stone-600' : ''}`}
            >
              <option value="">Not specified</option>
              {WATER_CHARGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 w-4 h-4 text-neutral-400 dark:text-stone-500 pointer-events-none stroke-[2.2]" />
          </div>
        </div>

        {/* Electricity type */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="electricity-type-select" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450 stroke-[2]" />
            Electricity
          </label>
          <div className="relative flex items-center">
            <select
              id="electricity-type-select"
              value={electricityType}
              onChange={(e) => onChange({ electricityType: e.target.value })}
              className={`${selectClass} ${electricityType === '' ? 'text-neutral-400 dark:text-stone-600' : ''}`}
            >
              <option value="">Not specified</option>
              {ELECTRICITY_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 w-4 h-4 text-neutral-400 dark:text-stone-500 pointer-events-none stroke-[2.2]" />
          </div>
        </div>

        {/* Toilet type */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="toilet-type-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            Toilet
          </label>
          <input
            type="text"
            id="toilet-type-input"
            value={toiletType}
            onChange={(e) => onChange({ toiletType: e.target.value })}
            placeholder="e.g. Private, tiled"
            className={inputClass}
          />
        </div>

        {/* Bathroom type */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="bathroom-type-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            Bathroom
          </label>
          <input
            type="text"
            id="bathroom-type-input"
            value={bathroomType}
            onChange={(e) => onChange({ bathroomType: e.target.value })}
            placeholder="e.g. Shared with one other unit"
            className={inputClass}
          />
        </div>

        {/* Floor level */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="floor-level-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            Floor level
          </label>
          <input
            type="text"
            id="floor-level-input"
            value={floorLevel}
            onChange={(e) => onChange({ floorLevel: e.target.value })}
            placeholder="e.g. Ground floor, 2nd floor"
            className={inputClass}
          />
        </div>

        {/* Security */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="security-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450 stroke-[2]" />
            Security
          </label>
          <input
            type="text"
            id="security-input"
            value={security}
            onChange={(e) => onChange({ security: e.target.value })}
            placeholder="e.g. 24/7 guard, electric fence"
            className={inputClass}
          />
        </div>
      </div>

      {/* Agent fee / Viewing fee */}
      <div className="pt-1 space-y-1.5">
        <label className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center gap-1.5">
          <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450 stroke-[2]" />
          Extra one-off costs (optional)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-xs font-black text-neutral-400 dark:text-stone-505 pointer-events-none select-none tracking-tight font-sans">
              KSh
            </span>
            <input
              type="text"
              inputMode="numeric"
              id="agent-fee-input"
              value={agentFee}
              onChange={(e) => onChange({ agentFee: e.target.value.replace(/\D/g, '') })}
              placeholder="Agent fee"
              className={`${inputClass} pl-12`}
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-xs font-black text-neutral-400 dark:text-stone-505 pointer-events-none select-none tracking-tight font-sans">
              KSh
            </span>
            <input
              type="text"
              inputMode="numeric"
              id="viewing-fee-input"
              value={viewingFee}
              onChange={(e) => onChange({ viewingFee: e.target.value.replace(/\D/g, '') })}
              placeholder="Viewing fee"
              className={`${inputClass} pl-12`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
