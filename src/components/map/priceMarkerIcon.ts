import L from 'leaflet';

/**
 * Price-label markers as a plain HTML string, not `renderToString`.
 *
 * Theming decides this. `index.css` declares `@variant dark (&:where(.dark, .dark *))`
 * and ThemeContext puts `.dark` on <html>, so a marker styled by a real CSS
 * class re-themes every pin on toggle with zero React renders and zero
 * `setIcon` calls. `renderToString` cannot see ThemeContext, so it would force
 * rebuilding all 60 icons on every toggle and cost ~12KB of react-dom/server.
 *
 * Two hard rules follow from using innerHTML:
 *   1. Escape anything user-authored. `listing.title` is landlord-supplied.
 *   2. No Tailwind utilities inside the string -- the class scanner cannot see
 *      classes that only exist in a JS template literal, so they emit no CSS.
 *      The styles live in index.css under `.kf-price-marker`.
 */

export type MarkerState = 'default' | 'hovered' | 'selected';

/** Minimal, correct HTML-text escape. Order matters: & first. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Module-level cache. react-leaflet compares `props.icon` by reference and
 * calls `marker.setIcon()` when it changes, so returning the *same* object for
 * the same (label, state) means selecting one pin touches 2 markers, not 60.
 * Icons are immutable value objects, so sharing them across maps is safe.
 */
const cache = new Map<string, L.DivIcon>();
const CACHE_LIMIT = 512;

export function priceMarkerIcon(
  priceLabel: string,
  title: string,
  state: MarkerState = 'default'
): L.DivIcon {
  // Title is in the key because it lands in the accessible name; two listings
  // at the same price still need distinct labels.
  const key = `${priceLabel}|${title}|${state}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const stateClass = state === 'selected' ? ' kf-price-marker--selected' : '';
  const icon = L.divIcon({
    // The root carries the state class because L.DivIcon.createIcon reuses the
    // root div and replaces its innerHTML -- a transition on the pill would
    // never run, since the pill is a brand-new node every setIcon.
    className: `kf-price-marker${stateClass}`,
    html:
      `<span class="kf-price-marker__pill" aria-hidden="true">${escapeHtml(priceLabel)}</span>` +
      `<span class="kf-price-marker__sr">${escapeHtml(title)}, ${escapeHtml(priceLabel)} per month</span>`,
    // 0x0 so the pill sizes to its own text instead of being clipped to a
    // fixed box; the pill is positioned in CSS so its bottom point sits on the
    // coordinate. Leaflet still needs a size, and [0,0] is honest here.
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  if (cache.size >= CACHE_LIMIT) {
    // Cheap FIFO eviction -- Map preserves insertion order.
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, icon);
  return icon;
}
