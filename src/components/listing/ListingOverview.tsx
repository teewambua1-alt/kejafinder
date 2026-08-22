import { MapPin, Clock, ShieldCheck } from 'lucide-react';
import type { KejaListing } from '../../types/listings';
import { formatUpdatedAt } from '../../lib/relativeDate';
import { Card, Pill } from './parts';

interface ListingOverviewProps {
  listing: KejaListing;
}

/** Rank order of listings.verification_level. Only the reached rung is shown. */
const VERIFICATION_LABEL: Record<string, string> = {
  phone: 'Phone verified',
  location: 'Location checked',
  scout: 'Scout verified',
  trusted: 'Trusted landlord',
};

/**
 * What this house is, where it is, and whether it is still going — one card.
 *
 * Replaces `ListingTitleSection`, which carried four stacked blocks and
 * repeated itself inside its own markup: the house type appeared as a pill at
 * the top *and* in a "Quick Summary Strip" at the bottom, where it printed the
 * raw enum (`one_bedroom`) instead of the label. That same strip listed the
 * first three amenity ids verbatim under the heading "Feature", so users read
 * `water_available`. Those amenities now render properly, once, in the house
 * card via `resolveAmenities`.
 *
 * Location also lived here *and* twice more in `ListingLocationDetails`. It is
 * stated once here, as the answer to "where", and the location card below is
 * now only the map and the travel facts.
 */
export default function ListingOverview({ listing }: ListingOverviewProps) {
  const updatedAt = formatUpdatedAt(listing.updatedAt);
  const level = listing.verificationLevel;
  const verification = level && level !== 'none' ? VERIFICATION_LABEL[level] : undefined;

  // estate then town -- not `location`, which the mapper derives as
  // `estate || landmark || town` and would therefore just repeat the estate.
  // Deduped because estate and town are frequently the same string on real
  // rows, and "Rongai, Rongai" reads as a bug.
  const place =
    [listing.estate, listing.town]
      .filter((part): part is string => !!part?.trim())
      .filter((part, i, all) => all.indexOf(part) === i)
      .join(', ') || listing.location;

  return (
    <Card className="space-y-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <Pill>{listing.typeLabel || listing.houseType}</Pill>
        <Pill tone={listing.isAvailable ? 'positive' : 'caution'}>
          {listing.isAvailable ? 'Available' : 'Availability unconfirmed'}
        </Pill>
        {/* The real rung on the ladder, not a boolean. There is no generic
          * "verified" state and none is implied when the level is 'none'. */}
        {verification && (
          <Pill tone="positive" icon={ShieldCheck}>{verification}</Pill>
        )}
      </div>

      <h1 className="text-2xl font-black leading-tight tracking-tight text-neutral-850 dark:text-stone-50">
        {listing.title}
      </h1>

      <div className="space-y-1.5">
        <p className="flex items-start gap-2 text-sm font-medium text-neutral-600 dark:text-stone-300">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-550 stroke-[2.2]" aria-hidden="true" />
          <span className="leading-snug">{place}</span>
        </p>
        {updatedAt && (
          <p className="flex items-center gap-2 text-xs font-semibold text-neutral-550 dark:text-stone-400">
            <Clock className="h-4 w-4 shrink-0 stroke-[2.2]" aria-hidden="true" />
            {updatedAt}
          </p>
        )}
      </div>
    </Card>
  );
}
