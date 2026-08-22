import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation, Footprints, Sparkles, Loader2, AlertCircle, MapPinOff } from 'lucide-react';
import type { KejaListing } from '../../types/listings';
import { PropertyMap } from '../map';
import { toMapPoint } from '../../lib/leaflet';
import { useMotion } from '../../lib/motion';
import { Card, CardTitle, FactRow } from './parts';

interface ListingLocationProps {
  listing: KejaListing;
  /** Fires the real contact-click metric, same as the contact card's buttons. */
  onWhatsAppClick?: () => void;
}

/**
 * Where it is and how you get there. One card.
 *
 * `ListingLocationDetails` was a heading plus four cards for three facts. The
 * landmark appeared twice inside it ("Near X" in the first card, then a
 * "Landmark" row in the second) and a third time in the title section. Its
 * button row paired a dead "Ask for directions" — which only fired a
 * "coming soon" toast — with the real Area Insight call, so the two looked
 * equally functional and only one was. Directions is now a real WhatsApp
 * message to the person who knows the way.
 *
 * The closing "confirm exact directions with the caretaker" note is gone: it
 * said the same thing as the button beside it.
 */
export default function ListingLocation({ listing, onWhatsAppClick }: ListingLocationProps) {
  const m = useMotion();
  const [insight, setInsight] = useState<string | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const point = toMapPoint(listing);
  const whatsapp = listing.whatsappPhone;
  const area = [listing.estate, listing.location].filter(Boolean)[0] ?? 'this area';

  const directionsHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        `Hi, I saw ${listing.title || 'your listing'} on KejaFinder. Please send me the exact directions.`
      )}`
    : null;

  const loadInsight = async () => {
    if (insight || isLoading) return;
    setIsLoading(true);
    setInsightError(null);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: `${area}, Kenya` }),
      });
      if (!res.ok) throw new Error(`insights responded ${res.status}`);
      const data = await res.json();
      setInsight(data.text);
    } catch (err) {
      console.error('Error fetching area insight:', err);
      setInsightError('Could not load area insight right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="space-y-4">
      <CardTitle>Getting there</CardTitle>

      {point ? (
        <div className="h-44 w-full overflow-hidden rounded-2xl border border-neutral-150 dark:border-stone-800 sm:h-52">
          <PropertyMap listings={[listing]} variant="preview" />
        </div>
      ) : (
        /* No coordinates means no pin. The old fallback geocoded the estate
         * name client-side on every render and dropped a pin on the centroid,
         * presenting it as the address. */
        <div className="flex items-start gap-3 rounded-2xl border border-dashed border-neutral-250 dark:border-stone-800 bg-neutral-50 dark:bg-stone-900/40 p-4">
          <MapPinOff className="mt-0.5 h-4.5 w-4.5 shrink-0 text-orange-700 dark:text-orange-400 stroke-[2.2]" aria-hidden="true" />
          <p className="text-xs font-semibold leading-relaxed text-neutral-700 dark:text-stone-300">
            The poster hasn't pinned this house on the map yet. Ask for directions
            before you travel.
          </p>
        </div>
      )}

      <div>
        <FactRow icon={Navigation} label="Landmark" value={listing.landmark} />
        <FactRow icon={Footprints} label="From the main road" value={listing.distanceFromRoad} />
      </div>

      <div className="flex flex-col gap-2.5 xs:flex-row">
        {directionsHref && (
          <motion.a
            whileTap={m.tap}
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-neutral-200 dark:border-stone-800 py-3 text-2xs font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300 transition-colors hover:bg-neutral-50 dark:hover:bg-stone-850"
          >
            <Navigation className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />
            Ask for directions
          </motion.a>
        )}
        <motion.button
          type="button"
          whileTap={m.tap}
          onClick={loadInsight}
          disabled={isLoading || !!insight}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/25 py-3 text-2xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />
          )}
          About this area
        </motion.button>
      </div>

      {/* Progressive disclosure: nothing here until asked for. */}
      <AnimatePresence>
        {(insight || insightError) && (
          <motion.div
            initial={m.reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={m.reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={m.reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {insightError ? (
              <p role="alert" className="flex items-start gap-2 rounded-2xl bg-orange-50 dark:bg-orange-950/25 p-4 text-xs font-semibold text-orange-800 dark:text-orange-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.2]" aria-hidden="true" />
                {insightError}
              </p>
            ) : (
              <p className="rounded-2xl bg-neutral-50 dark:bg-stone-850 p-4 text-xs font-medium leading-relaxed text-neutral-700 dark:text-stone-300">
                {insight}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
