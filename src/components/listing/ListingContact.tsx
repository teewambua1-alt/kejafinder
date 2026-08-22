import { motion } from 'motion/react';
import { Phone, MessageCircle, Copy, CalendarCheck, Flag } from 'lucide-react';
import type { KejaListing } from '../../types/listings';
import { useToast } from '../../context/ToastContext';
import { useMotion } from '../../lib/motion';
import { Card, CardTitle, SafetyNote } from './parts';

interface ListingContactProps {
  listing: KejaListing;
  onCallClick?: () => void;
  onWhatsAppClick?: () => void;
  onReport?: () => void;
}

/**
 * Who to talk to, and the one warning that matters. One card plus the note.
 *
 * Consolidates the old `ListingContactCard` (five blocks) and
 * `ListingTrustSafety` (five more). Between them they duplicated: the trust
 * badges, already shown in the overview; the deposit warning, shown twice more
 * elsewhere on the page; a "Report this listing" block that repeats the flag
 * button in the page header; and an "Ask if available" button that only fired a
 * "noted locally" toast.
 *
 * The three WhatsApp quick prompts collapse to one. "Can I view today?" is
 * promoted to a real secondary action — it is the closest thing this product
 * has to scheduling a viewing, and it needs no new backend. "Send exact
 * directions" moved to the location card, where it is contextual; "Is it still
 * available?" is what the plain WhatsApp button already opens.
 */
export default function ListingContact({
  listing, onCallClick, onWhatsAppClick, onReport,
}: ListingContactProps) {
  const { showToast } = useToast();
  const m = useMotion();

  const name = listing.contactName || listing.caretakerName || 'Caretaker';
  const role = listing.contactRole || 'caretaker';
  const phone = listing.contactPhone || listing.caretakerPhone || '';
  const whatsapp = listing.whatsappPhone || '';
  const firstName = name.split(' ')[0];
  const title = listing.title || 'your listing';

  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const waLink = (text: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      showToast('Phone number copied.');
    } catch {
      showToast('Could not copy on this browser.');
    }
  };

  return (
    <div className="space-y-3">
      <Card className="space-y-4">
        <CardTitle>Contact</CardTitle>

        <div className="flex items-center gap-3.5">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-base font-black text-emerald-700 dark:text-emerald-400"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-neutral-850 dark:text-stone-100">
              {name}
              <span className="ml-2 align-middle text-2xs font-bold uppercase tracking-wider text-neutral-550 dark:text-stone-400 capitalize">
                {role}
              </span>
            </p>
            {phone ? (
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-600 dark:text-stone-300">{phone}</span>
                <button
                  type="button"
                  onClick={copyPhone}
                  aria-label="Copy phone number"
                  className="rounded-md p-1 text-neutral-550 transition-colors hover:bg-neutral-100 dark:hover:bg-stone-800"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <p className="mt-0.5 text-xs font-semibold italic text-neutral-550 dark:text-stone-400">
                No phone number on file
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2.5">
          {phone ? (
            <motion.a
              whileTap={m.tap}
              href={`tel:${phone.replace(/\s+/g, '')}`}
              onClick={onCallClick}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-neutral-200 dark:border-stone-800 py-3.5 text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-stone-200 transition-colors hover:bg-neutral-50 dark:hover:bg-stone-850"
              aria-label={`Call ${role} ${name}`}
            >
              <Phone className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />
              Call
            </motion.a>
          ) : (
            <button
              type="button"
              disabled
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-neutral-100 dark:bg-stone-850 py-3.5 text-xs font-black uppercase tracking-wider text-neutral-550 dark:text-stone-400"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              No phone
            </button>
          )}

          {whatsapp ? (
            <motion.a
              whileTap={m.tap}
              href={waLink(`Hi ${firstName}, I saw ${title} on KejaFinder. Is it still available?`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsAppClick}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-sm shadow-emerald-500/15 transition-colors hover:bg-emerald-800"
              aria-label={`WhatsApp ${role} ${name}`}
            >
              <MessageCircle className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />
              WhatsApp
            </motion.a>
          ) : (
            <button
              type="button"
              disabled
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-neutral-100 dark:bg-stone-850 py-3.5 text-xs font-black uppercase tracking-wider text-neutral-550 dark:text-stone-400"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              No WhatsApp
            </button>
          )}
        </div>

        {whatsapp && (
          <motion.a
            whileTap={m.tap}
            href={waLink(`Hi ${firstName}, I saw ${title} on KejaFinder. Can I view it today?`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/25 py-3 text-2xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 transition-colors"
          >
            <CalendarCheck className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />
            Ask to view today
          </motion.a>
        )}
      </Card>

      <SafetyNote />

      {onReport && (
        <button
          type="button"
          onClick={onReport}
          className="mx-auto flex items-center gap-1.5 py-1 text-2xs font-bold uppercase tracking-wider text-neutral-550 dark:text-stone-400 transition-colors hover:text-orange-700 dark:hover:text-orange-400"
        >
          <Flag className="h-3.5 w-3.5 stroke-[2.2]" aria-hidden="true" />
          Report this listing
        </button>
      )}
    </div>
  );
}
