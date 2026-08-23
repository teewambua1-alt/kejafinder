import React from 'react';
import { Phone, MessageCircle, User, ShieldCheck, Check, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { ContactRole } from '../types/postListing';

interface PostContactOptionsProps {
  contactName: string;
  contactRole: ContactRole;
  contactPhone: string;
  whatsappPhone: string;
  allowCalls: boolean;
  allowWhatsApp: boolean;
  errors: {
    contactName?: string;
    contactPhone?: string;
    whatsappPhone?: string;
    contactMethod?: string;
    contactPhoneFormat?: string;
    whatsappPhoneFormat?: string;
  };
  onChange: (fields: Partial<{
    contactName: string;
    contactRole: ContactRole;
    contactPhone: string;
    whatsappPhone: string;
    allowCalls: boolean;
    allowWhatsApp: boolean;
  }>) => void;
}

export default function PostContactOptions({
  contactName,
  contactRole,
  contactPhone,
  whatsappPhone,
  allowCalls,
  allowWhatsApp,
  errors,
  onChange,
}: PostContactOptionsProps) {
  const roles: { value: ContactRole; label: string }[] = [
    { value: 'caretaker', label: 'Caretaker' },
    { value: 'landlord', label: 'Landlord' },
    { value: 'agent', label: 'Agent' },
    { value: 'scout', label: 'Area Scout' },
  ];

  const handleUsePhoneForWhatsApp = () => {
    if (contactPhone) {
      onChange({ whatsappPhone: contactPhone });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-5 relative z-10"
      id="post-contact-container-card"
    >
      {/* Title Block */}
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          <Phone className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col space-y-0.5">
          <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Contact Options
          </h3>
          <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-400">
            Choose how tenants can reach you.
          </p>
        </div>
      </div>

      {/* Role Selector Pills */}
      <div className="flex flex-col space-y-2">
        <span className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
          Your Role
        </span>
        <div className="flex flex-wrap gap-2">
          {roles.map((item) => {
            const isSelected = contactRole === item.value;
            return (
              <motion.button
                key={item.value}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => onChange({ contactRole: item.value })}
                aria-pressed={isSelected}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer outline-none ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-700 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 font-extrabold'
                    : 'bg-white/40 dark:bg-stone-850/40 border-neutral-100 dark:border-neutral-800/60 text-neutral-600 dark:text-stone-400 hover:border-neutral-200'
                }`}
              >
                {item.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Inputs Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Person */}
        <div className="flex flex-col space-y-1.5 flex-1">
          <label htmlFor="contact-name-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            Contact Person <span className="text-emerald-700 dark:text-emerald-450">*</span>
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-4 w-4.5 h-4.5 text-neutral-550 dark:text-stone-605 pointer-events-none stroke-[2]" />
            <input
              type="text"
              id="contact-name-input"
              value={contactName}
              onChange={(e) => onChange({ contactName: e.target.value })}
              placeholder="Caretaker or landlord name"
              aria-invalid={!!errors.contactName}
              aria-describedby={errors.contactName ? "contact-name-error-msg" : undefined}
              className={`w-full h-12 pl-11 pr-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-xs font-bold text-neutral-800 dark:text-stone-105 placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all ${
                errors.contactName
                  ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                  : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.contactName && (
            <span id="contact-name-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
              {errors.contactName}
            </span>
          )}
        </div>

        {/* Contact Phone */}
        <div className="flex flex-col space-y-1.5 flex-1">
          <label htmlFor="contact-phone-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none flex items-center justify-between">
            <span>Phone Number {allowCalls && <span className="text-emerald-700">*</span>}</span>
          </label>
          <div className="relative flex items-center">
            <Phone className="absolute left-4 w-4.5 h-4.5 text-neutral-550 dark:text-stone-605 pointer-events-none stroke-[2]" />
            <input
              type="tel"
              inputMode="tel"
              id="contact-phone-input"
              value={contactPhone}
              onChange={(e) => onChange({ contactPhone: e.target.value })}
              placeholder="07XX XXX XXX"
              disabled={!allowCalls}
              aria-invalid={!!(errors.contactPhone || errors.contactPhoneFormat)}
              aria-describedby={
                errors.contactPhone
                  ? "contact-phone-error-msg"
                  : errors.contactPhoneFormat
                    ? "contact-phone-format-error-msg"
                    : undefined
              }
              className={`w-full h-12 pl-11 pr-4 rounded-2xl border text-xs font-bold tracking-wider focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all ${
                !allowCalls
                  ? 'bg-neutral-100/50 dark:bg-stone-900/50 border-neutral-150/40 text-neutral-700 cursor-not-allowed'
                  : 'bg-white/50 dark:bg-stone-850/40 text-neutral-800 dark:text-stone-105'
              } ${
                errors.contactPhone || errors.contactPhoneFormat
                  ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                  : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {allowCalls && errors.contactPhone && (
            <span id="contact-phone-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
              {errors.contactPhone}
            </span>
          )}
          {allowCalls && !errors.contactPhone && errors.contactPhoneFormat && (
            <span id="contact-phone-format-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
              {errors.contactPhoneFormat}
            </span>
          )}
        </div>
      </div>

      {/* WhatsApp Section */}
      <div className="flex flex-col space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label htmlFor="whatsapp-phone-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            WhatsApp Number {allowWhatsApp && <span className="text-emerald-700">*</span>}
          </label>
          {allowWhatsApp && contactPhone && whatsappPhone !== contactPhone && (
            <button
              type="button"
              onClick={handleUsePhoneForWhatsApp}
              className="text-[10px] font-black text-emerald-700 dark:text-emerald-450 uppercase tracking-wider hover:underline focus:outline-hidden cursor-pointer"
            >
              Use Phone Number
            </button>
          )}
        </div>
        <div className="relative flex items-center">
          <MessageCircle className="absolute left-4 w-4.5 h-4.5 text-neutral-550 dark:text-stone-605 pointer-events-none stroke-[2]" />
          <input
            type="tel"
            inputMode="tel"
            id="whatsapp-phone-input"
            value={whatsappPhone}
            onChange={(e) => onChange({ whatsappPhone: e.target.value })}
            placeholder="Same as phone or enter WhatsApp number"
            disabled={!allowWhatsApp}
            aria-invalid={!!(errors.whatsappPhone || errors.whatsappPhoneFormat)}
            aria-describedby={
              errors.whatsappPhone
                ? "whatsapp-phone-error-msg"
                : errors.whatsappPhoneFormat
                  ? "whatsapp-phone-format-error-msg"
                  : undefined
            }
            className={`w-full h-12 pl-11 pr-4 rounded-2xl border text-xs font-bold tracking-wider focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all ${
              !allowWhatsApp
                ? 'bg-neutral-100/50 dark:bg-stone-900/50 border-neutral-150/40 text-neutral-700 cursor-not-allowed'
                : 'bg-white/50 dark:bg-stone-850/40 text-neutral-800 dark:text-stone-105'
            } ${
              errors.whatsappPhone || errors.whatsappPhoneFormat
                ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
            }`}
          />
        </div>
        {allowWhatsApp && errors.whatsappPhone && (
          <span id="whatsapp-phone-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
            {errors.whatsappPhone}
          </span>
        )}
        {allowWhatsApp && !errors.whatsappPhone && errors.whatsappPhoneFormat && (
          <span id="whatsapp-phone-format-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
            {errors.whatsappPhoneFormat}
          </span>
        )}
      </div>

      {/* Toggle Rows section */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/40 space-y-3">
        <span className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
          Contact Preferences
        </span>

        {/* Option 1: Calls */}
        <div className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-stone-850/30 border border-neutral-100 dark:border-neutral-800/60 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              allowCalls 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450' 
                : 'bg-neutral-100 dark:bg-stone-800 text-neutral-700'
            }`}>
              <Phone className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-800 dark:text-stone-200">
                Call
              </span>
              <span className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 leading-normal">
                Allow tenants to call you directly.
              </span>
            </div>
          </div>
          
          {/* Custom Emerald Toggle Switch Button */}
          <button
            type="button"
            role="switch"
            aria-checked={allowCalls}
            onClick={() => onChange({ allowCalls: !allowCalls })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-1 focus:ring-emerald-500/20 ${
              allowCalls ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                allowCalls ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Option 2: WhatsApp Messages */}
        <div className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-stone-850/30 border border-neutral-100 dark:border-neutral-800/60 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              allowWhatsApp 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450' 
                : 'bg-neutral-100 dark:bg-stone-800 text-neutral-700'
            }`}>
              <MessageCircle className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-800 dark:text-stone-200">
                WhatsApp
              </span>
              <span className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 leading-normal">
                Allow tenants to message you on WhatsApp.
              </span>
            </div>
          </div>
          
          {/* Custom Emerald Toggle Switch Button */}
          <button
            type="button"
            role="switch"
            aria-checked={allowWhatsApp}
            onClick={() => onChange({ allowWhatsApp: !allowWhatsApp })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-1 focus:ring-emerald-500/20 ${
              allowWhatsApp ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                allowWhatsApp ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {errors.contactMethod && (
          <div className="flex items-center space-x-2 p-3 bg-red-500/5 rounded-xl border border-red-500/10 text-red-500 font-bold text-[10px] uppercase tracking-wide">
            <Info className="w-4 h-4 shrink-0 stroke-[2.2]" />
            <span>{errors.contactMethod}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
