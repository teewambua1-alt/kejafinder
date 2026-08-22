import { Droplets, Zap, DoorClosed, Bath, Square, ShieldCheck } from 'lucide-react';
import type { KejaListing } from '../../types/listings';
import { resolveAmenities } from '../../lib/amenities';
import { Card, CardTitle, FactRow } from './parts';

interface ListingHouseProps {
  listing: KejaListing;
}

/**
 * Amenity ids that restate a specification row above. `water_available` next to
 * "Water — Included in rent" is the same subject said twice, and the free-text
 * column is the more useful of the two, so the chip is dropped whenever its
 * row has a value. Chips with no equivalent row (parking, near_bus_stage,
 * no_agent_fee, near_main_road) always show — they are the only things here the
 * poster opted into rather than filled in.
 */
const AMENITY_COVERED_BY: Record<string, keyof KejaListing> = {
  water_available: 'waterStatus',
  token_electricity: 'electricityType',
  private_toilet: 'toiletType',
  shared_toilet: 'toiletType',
  private_bathroom: 'bathroomType',
  shared_bathroom: 'bathroomType',
  tiled_floor: 'floorType',
  secure_gate: 'securityText',
};

/**
 * The house itself: the six real specification columns, the amenities the
 * poster ticked, and their description. One card.
 *
 * `ListingAmenitiesCondition` rendered the same six fields **twice in a row**
 * — once as a two-column grid of chips ("Amenities Grid"), then immediately
 * again as a list of rows ("Key Details"). Water and electricity then appeared
 * a third time in the pricing section's cost breakdown, because
 * `mapSupabaseListingToListing` maps each of those two columns under two
 * different names (`waterStatus`/`waterCostText`,
 * `electricityType`/`electricityText`) and both aliases had a consumer.
 *
 * It also carried a standing "some details may not be provided, confirm with
 * the caretaker" note, which is what every `Not specified` row already says,
 * per row, only more precisely.
 *
 * The real `listings.amenities` array was never rendered anywhere on this page.
 * It is the only thing here the poster opted into rather than filled in, so it
 * earns its own row of chips.
 */
export default function ListingHouse({ listing }: ListingHouseProps) {
  const amenities = resolveAmenities(listing.amenities).filter(({ id }) => {
    const field = AMENITY_COVERED_BY[id];
    return !field || !listing[field];
  });
  const description = listing.description?.trim();

  return (
    <Card className="space-y-5">
      <div>
        <CardTitle>The house</CardTitle>
        <div className="mt-1">
          <FactRow icon={Droplets} label="Water" value={listing.waterStatus} />
          <FactRow icon={Zap} label="Electricity" value={listing.electricityType} />
          <FactRow icon={DoorClosed} label="Toilet" value={listing.toiletType} />
          <FactRow icon={Bath} label="Bathroom" value={listing.bathroomType} />
          <FactRow icon={Square} label="Floor" value={listing.floorType} />
          <FactRow icon={ShieldCheck} label="Security" value={listing.securityText} />
        </div>
      </div>

      {amenities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {amenities.map(({ id, label, icon: Icon }) => (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-150 dark:border-stone-800 bg-neutral-50 dark:bg-stone-850 px-2.5 py-1.5 text-2xs font-bold text-neutral-700 dark:text-stone-300"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400 stroke-[2.2]" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      )}

      {description && (
        <p className="border-t border-neutral-100 dark:border-stone-800 pt-4 text-sm font-medium leading-relaxed text-neutral-600 dark:text-stone-300">
          {description}
        </p>
      )}
    </Card>
  );
}
