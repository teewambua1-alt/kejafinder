import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';

interface ListingStickyContactBarProps {
  rent: number;
  phone: string;
  whatsapp: string;
  onCallClick?: () => void;
  onWhatsAppClick?: () => void;
}

/**
 * Persistent quick-action bar, always reachable while scrolling the details
 * page -- the same relationship Airbnb uses between its sticky price bar
 * and the full booking section further down. ListingContactCard (quick
 * WhatsApp prompt templates, contact-person card, safety note) stays where
 * it is in the normal content flow; this is the short, always-visible
 * version.
 *
 * Full-width opaque band (matching BottomNav.tsx's own bottom-bar
 * convention) rather than a floating rounded pill with transparent padding
 * around it -- a pill has gaps at its own edges that in-flow content can
 * peek through as it scrolls past underneath; a full-bleed band can't leak.
 */
export default function ListingStickyContactBar({ rent, phone, whatsapp, onCallClick, onWhatsAppClick }: ListingStickyContactBarProps) {
  const hasPhone = phone.length > 0;
  const hasWhatsapp = whatsapp.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="fixed bottom-16 md:bottom-0 inset-x-0 z-20 bg-white/98 dark:bg-stone-900/98 backdrop-blur-md border-t border-neutral-150/60 dark:border-stone-800/60 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="w-full md:max-w-3xl xl:max-w-7xl md:mx-auto px-4 md:px-8 xl:px-12 py-2.5">
        <div className="flex items-center gap-2.5 md:max-w-xs md:ml-auto">
          <div className="pl-0.5 pr-1 min-w-0 hidden xs:block">
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-500 leading-none truncate">
              KSh {rent.toLocaleString()}
            </p>
            <p className="text-2xs font-semibold text-neutral-550 dark:text-stone-400 leading-none mt-0.5">/month</p>
          </div>

          {hasPhone ? (
            <motion.a
              whileTap={{ scale: 0.96 }}
              href={`tel:${phone.replace(/\s+/g, '')}`}
              onClick={onCallClick}
              className="flex-1 h-11 rounded-xl border border-emerald-700 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer outline-none"
              aria-label="Call about this listing"
            >
              <Phone className="w-4 h-4 stroke-[2.2]" />
              <span>Call</span>
            </motion.a>
          ) : (
            <button
              disabled
              className="flex-1 h-11 rounded-xl border border-neutral-200 dark:border-stone-700 text-neutral-550 dark:text-stone-400 flex items-center justify-center gap-1.5 text-xs font-bold cursor-not-allowed outline-none"
              aria-label="No phone number on file"
            >
              <Phone className="w-4 h-4 stroke-[2.2]" />
              <span>No phone</span>
            </button>
          )}

          {hasWhatsapp ? (
            <motion.a
              whileTap={{ scale: 0.96 }}
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsAppClick}
              className="flex-1 h-11 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer outline-none"
              aria-label="WhatsApp about this listing"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.2]" />
              <span>WhatsApp</span>
            </motion.a>
          ) : (
            <button
              disabled
              className="flex-1 h-11 rounded-xl bg-neutral-100 dark:bg-stone-850 text-neutral-700 dark:text-stone-400 flex items-center justify-center gap-1.5 text-xs font-bold cursor-not-allowed outline-none"
              aria-label="No WhatsApp number on file"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.2]" />
              <span>No WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
