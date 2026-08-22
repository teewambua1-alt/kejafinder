import React from 'react';
import { ShieldCheck, PhoneCall, MapPin, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface PostTrustTogglesProps {
  allowPhoneVerification: boolean;
  requestLocationCheck: boolean;
  requestScoutVerification: boolean;
  remindToUpdate: boolean;
  onChange: (fields: Partial<{
    allowPhoneVerification: boolean;
    requestLocationCheck: boolean;
    requestScoutVerification: boolean;
    remindToUpdate: boolean;
  }>) => void;
}

export default function PostTrustToggles({
  allowPhoneVerification,
  requestLocationCheck,
  requestScoutVerification,
  remindToUpdate,
  onChange,
}: PostTrustTogglesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-4"
    >
      {/* Title block */}
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col space-y-0.5">
          <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Trust & Verification
          </h3>
          <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-400">
            Help KejaFinder review your listing and build renter trust.
          </p>
        </div>
      </div>

      {/* Safety warning disclaimer note */}
      <div className="flex items-start space-x-2.5 p-3.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-emerald-800 dark:text-emerald-400">
        <ShieldCheck className="w-4.5 h-4.5 text-emerald-700 shrink-0 stroke-[2.2]" />
        <span className="text-[10px] font-bold tracking-tight leading-relaxed">
          Verification requests are reviewed by KejaFinder. Your listing will appear with a "Pending Check" status until physically or remotely verified by our scouts.
        </span>
      </div>

      {/* Toggle list container */}
      <div className="space-y-3">
        {/* Toggle 1: Phone Verification */}
        <div className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-stone-850/30 border border-neutral-100 dark:border-neutral-800/60 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              allowPhoneVerification 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450' 
                : 'bg-neutral-100 dark:bg-stone-800 text-neutral-700'
            }`}>
              <PhoneCall className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex flex-col max-w-[180px] sm:max-w-xs">
              <span className="text-xs font-bold text-neutral-800 dark:text-stone-200">
                Allow phone verification
              </span>
              <span className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 leading-normal">
                We may confirm this number before showing trust badges.
              </span>
            </div>
          </div>
          
          <button
            type="button"
            role="switch"
            aria-checked={allowPhoneVerification}
            onClick={() => onChange({ allowPhoneVerification: !allowPhoneVerification })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-1 focus:ring-emerald-500/20 ${
              allowPhoneVerification ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                allowPhoneVerification ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Location Check Request */}
        <div className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-stone-850/30 border border-neutral-100 dark:border-neutral-800/60 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              requestLocationCheck 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450' 
                : 'bg-neutral-100 dark:bg-stone-800 text-neutral-700'
            }`}>
              <MapPin className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex flex-col max-w-[180px] sm:max-w-xs">
              <span className="text-xs font-bold text-neutral-800 dark:text-stone-200">
                Request location check
              </span>
              <span className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 leading-normal">
                KejaFinder can review the location details before approval.
              </span>
            </div>
          </div>
          
          <button
            type="button"
            role="switch"
            aria-checked={requestLocationCheck}
            onClick={() => onChange({ requestLocationCheck: !requestLocationCheck })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-1 focus:ring-emerald-500/20 ${
              requestLocationCheck ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                requestLocationCheck ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Scout Verification Request */}
        <div className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-stone-850/30 border border-neutral-100 dark:border-neutral-800/60 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              requestScoutVerification 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450' 
                : 'bg-neutral-100 dark:bg-stone-800 text-neutral-700'
            }`}>
              <CheckSquare className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex flex-col max-w-[180px] sm:max-w-xs">
              <span className="text-xs font-bold text-neutral-800 dark:text-stone-200">
                Request scout verification
              </span>
              <span className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 leading-normal">
                A local scout may physically check the house later.
              </span>
            </div>
          </div>
          
          <button
            type="button"
            role="switch"
            aria-checked={requestScoutVerification}
            onClick={() => onChange({ requestScoutVerification: !requestScoutVerification })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-1 focus:ring-emerald-500/20 ${
              requestScoutVerification ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                requestScoutVerification ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 4: Recently Updated Reminder */}
        <div className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-stone-850/30 border border-neutral-100 dark:border-neutral-800/60 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              remindToUpdate 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450' 
                : 'bg-neutral-100 dark:bg-stone-800 text-neutral-700'
            }`}>
              <Clock className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex flex-col max-w-[180px] sm:max-w-xs">
              <span className="text-xs font-bold text-neutral-800 dark:text-stone-200">
                Remind me to update availability
              </span>
              <span className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 leading-normal">
                Fresh listings help renters avoid wasted visits.
              </span>
            </div>
          </div>
          
          <button
            type="button"
            role="switch"
            aria-checked={remindToUpdate}
            onClick={() => onChange({ remindToUpdate: !remindToUpdate })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-1 focus:ring-emerald-500/20 ${
              remindToUpdate ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                remindToUpdate ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
