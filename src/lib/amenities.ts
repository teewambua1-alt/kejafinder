import {
  Droplets, Zap, Lock, Users, Bath, Grid, ShieldCheck,
  MapPin, Bus, BadgeCheck, Car, Tag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Canonical amenity vocabulary -- the ids actually stored in
 * listings.amenities (a text[]), with the label and icon each should render
 * as. Kept in step with PostAmenitiesGrid, which writes these ids, and with
 * SearchFilterSheet, which filters on them.
 *
 * Why this exists: the cards each had their own substring matcher keyed on
 * *display* names ('Wi-Fi', 'parking') rather than the stored ids. Since the
 * real values are snake_case, most branches never matched -- the Wi-Fi icon
 * could never fire because there is no wifi amenity -- and the cards then
 * printed the raw id, so users saw "water_available" instead of "Water
 * available".
 */
const AMENITIES: Record<string, { label: string; icon: LucideIcon }> = {
  water_available: { label: 'Water available', icon: Droplets },
  token_electricity: { label: 'Token electricity', icon: Zap },
  private_toilet: { label: 'Private toilet', icon: Lock },
  shared_toilet: { label: 'Shared toilet', icon: Users },
  private_bathroom: { label: 'Private bathroom', icon: Bath },
  shared_bathroom: { label: 'Shared bathroom', icon: Bath },
  tiled_floor: { label: 'Tiled floor', icon: Grid },
  secure_gate: { label: 'Secure gate', icon: ShieldCheck },
  near_main_road: { label: 'Near main road', icon: MapPin },
  near_bus_stage: { label: 'Near bus stage', icon: Bus },
  no_agent_fee: { label: 'No agent fee', icon: BadgeCheck },
  parking: { label: 'Parking', icon: Car },
};

export interface ResolvedAmenity {
  id: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Resolves a stored amenity id to a label and icon. Unknown values (older
 * rows, or free text) fall back to a de-slugged label rather than being
 * dropped -- the poster meant something by them.
 */
export function resolveAmenity(id: string): ResolvedAmenity {
  const known = AMENITIES[id];
  if (known) return { id, ...known };
  return {
    id,
    label: id.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    icon: Tag,
  };
}

export function resolveAmenities(ids: string[] | undefined): ResolvedAmenity[] {
  return (ids ?? []).map(resolveAmenity);
}
