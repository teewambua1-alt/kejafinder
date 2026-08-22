# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/kejafinder/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. If not, follow the rules below.

> **This file documents the system already implemented in the codebase** (`src/index.css` theme tokens +
> `src/components/ui/*` primitives + the in-app dev reference at `src/pages/DesignSystemPage.tsx`).
> It was reverse-engineered and validated, not generated from scratch — do not replace these values with
> a generic "real estate" template on a future run of this skill (see **Rejected Alternative** below).

---

**Project:** KejaFinder
**Category:** Marketplace (P2P) — rental/vacancy listings for the Kenyan market
**Stack:** React 19 + Vite + Tailwind CSS v4 (`@theme` tokens) + `motion` (Framer Motion successor) + `lucide-react`
**Platform:** Mobile-first PWA (installable, bottom-tab navigation), responsive up to desktop

---

## Global Rules

### Color Palette

Semantic tokens are defined once in `src/index.css` under `@theme` and layer on top of Tailwind's emerald/orange/neutral/stone scales — components should reach for the semantic name, not the raw Tailwind shade, in new code.

| Role | Value | CSS Variable | Tailwind equivalent |
|------|-------|--------------|----------------------|
| Brand Primary | Emerald | `--color-brand-primary` | `emerald-600` |
| Primary Hover | | `--color-brand-primary-hover` | `emerald-700` |
| Primary Active | | `--color-brand-primary-active` | `emerald-800` |
| Primary Light (tint bg) | | `--color-brand-primary-light` | `emerald-50` |
| Brand Accent (CTA/warm) | Orange | `--color-brand-accent` | `orange-500` |
| Accent Hover | | `--color-brand-accent-hover` | `orange-600` |
| Accent Light | | `--color-brand-accent-light` | `orange-50` |
| Success | | `--color-success` | `emerald-600` |
| Warning | | `--color-warning` | `orange-500` |
| Danger | | `--color-danger` | `red-500` |
| Info | | `--color-info` | `blue-500` |
| Surface (light) | `#ffffff` | `--color-surface` | `white` |
| Surface Muted (light bg) | `#f7fee7` | `--color-surface-muted` | light-lime off-white |
| Surface (dark) | `#0c0a09` | `--color-surface-dark` | `stone-950` |
| Text (light surfaces) | `#1c1917` | `--color-text-charcoal` | `neutral-850` |
| Text (dark surfaces) | `#f5f5f7` | `--color-text-inverse` | — |

**Dark mode** is class-based (`@variant dark (&:where(.dark, .dark *))` + `body.dark`), not `prefers-color-scheme`-only — toggled explicitly, so every new component needs an explicit `dark:` variant rather than relying on the media query.

In-between shades (`emerald-550`, `neutral-355`, `stone-450`, etc.) are defined via `color-mix(in oklch, ...)` because Tailwind only generates CSS for shades it knows about — several screens were already using fine-grained shades like `bg-orange-550` that silently resolved to fully transparent before these were added. **Do not delete these** even though they look redundant; they're patching real call sites, not decoration.

**Rejected alternative:** running this skill's generic `--design-system` search against "real estate rental marketplace" returns a teal/navy palette (`#0F766E`) with Cinzel/Josefin Sans (luxury real-estate serif pairing) and Glassmorphism as the style. That's tuned for high-end/luxury property brochure sites, not a mass-market Kenyan rental finder with safety-reporting and trust-badge features. The dataset's own **Marketplace (P2P)** product profile — the correct category for this app — recommends "trust colors + category colors + success green" with a Flat Design / Vibrant Block-based style, which is what's already built. Do not swap in the teal/serif/glass direction.

### Typography

- **Body / UI font:** Inter (`--font-sans`)
- **Display font:** Space Grotesk (`--font-display`) — used sparingly for large headings (e.g. `text-2xl font-display` on the About/marketing sections)
- **Mono:** JetBrains Mono (`--font-mono`) — hex/id values, dev-only surfaces

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

Type scale extends Tailwind's default (`text-xs` = 12px and up untouched) downward, because ~1,500 arbitrary `text-[Npx]` values (7–11.5px) had accumulated for dense mobile UI (badges, meta rows, micro labels):

| Token | Size | Use |
|-------|------|-----|
| `text-3xs` | 8px | Micro uppercase labels |
| `text-2xs` | 10px | Badges, meta text |
| `text-xs` (Tailwind default) | 12px | Captions |
| `text-sm` (Tailwind default) | 14px | Body text |

New one-off pixel sizes in this range should reach for `text-3xs`/`text-2xs` instead of adding another `text-[10.5px]`.

### Spacing Variables

Tailwind's default scale (4px base) is the system — an "8px rhythm" in practice means preferring the even numeric steps below over new fractional additions.

| Token | Value | Usage |
|-------|-------|-------|
| `space-2` / `space-3` | 8px / 12px | Tight gaps, icon gaps |
| `space-4` | 16px | Standard padding |
| `space-6` | 24px | Section padding |
| `space-8` | 32px | Large gaps |
| `space-4.5` `space-5.5` `space-8.5` `space-13` | 18/22/34/52px | Pre-existing fractional tokens (~280 call sites) — kept, but don't add more |

### Shadow Depths & Radius

Shadows are deliberately subtle (near-flat, no glass/skeuomorphism) — opacity tops out at 0.05 even at the largest custom step:

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-5xs` | `0 1px 3px rgba(0,0,0,.02)` | Barely-there lift |
| `shadow-4xs` | `0 1px 4px rgba(0,0,0,.025)` | |
| `shadow-3xs` | `0 1.5px 6px rgba(0,0,0,.03)` | Default `Card` primitive |
| `shadow-2xs` | `0 3px 10px rgba(0,0,0,.05)` | `Card` hover / interactive state |
| Tailwind `shadow-sm` … `shadow-2xl` | default scale | Modals, sheets, featured/floating elements |

Radius: `rounded-xl`/`rounded-2xl` for cards and inputs, `rounded-2.5xl` (20px, custom token) and `rounded-3xl` for larger sheets/hero surfaces, `rounded-full` for avatars/pills/FAB.

---

## Component Specs

Real primitives live in `src/components/ui/` and render on the dev-only reference route `src/pages/DesignSystemPage.tsx` — check that page in a running dev build before hand-rolling a new variant of something that already exists there.

### Button (`src/components/ui/Button.tsx`)

5 variants × 3 sizes, wraps `motion.button` with a shared `whileTap={{ scale: 0.97 }}` press feel.

| Variant | Style |
|---------|-------|
| `primary` | `bg-emerald-600` → `emerald-700` hover, white text, subtle emerald shadow |
| `secondary` | `bg-emerald-50` tinted, emerald text, emerald border |
| `outline` | Translucent white/stone bg, emerald border/text |
| `ghost` | Transparent, neutral text, neutral hover bg |
| `danger` | `bg-orange-550` → `orange-600` hover (orange doubles as the danger/destructive color here, not red) |

Sizes: `sm` (h-9, rounded-xl), `md` (h-11, rounded-2xl), `lg` (h-13, rounded-2xl). Labels are `font-extrabold uppercase tracking-wider`. Icons use `stroke-[2.2]`. Disabled = `opacity-50 cursor-not-allowed` + no tap animation.

### Card (`src/components/ui/Card.tsx`)

`bg-white/95` (dark: `stone-900/95`), `border-neutral-200/50`, `rounded-2xl`, `shadow-3xs` by default. `interactive` prop adds `hover:shadow-2xs hover:border-emerald-500/20 cursor-pointer`. Padding presets: `none / sm(14px) / md(16px) / lg(18px)`.

### Also in `src/components/ui/`

`Input`, `Chip`, `Badge`, `Skeleton`, `EmptyState`, `ErrorState` — see `DesignSystemPage.tsx` for each one's live variants (e.g. `Badge` has `success/warning/danger/info/neutral`; `Chip` takes an icon + `selected` state; `Input` supports `prefix`, `hint`, `error`, `required`).

---

## Style Guidelines

**Style:** Flat Design (validated against this skill's `styles.csv` — matches: 2D, no gradients/heavy shadows, bold limited palette, icon-heavy, clean lines, low-cost/low-risk accessibility profile).

**Page pattern:** Mixed — marketing/About pages use a Hero-Centric pattern (single dominant hero + value prop strip + proof + CTA); the core app is a search/marketplace pattern (filter chips → results list/map → detail → contact).

**Icons:** `lucide-react` exclusively for structural/navigational icons. Stroke width convention: `stroke-[2.2]` standard, `stroke-[2.7]` for the emphasized active bottom-nav icon. Icon-only buttons already carry `aria-label` (see `BottomNav.tsx`).

**Motion:** `motion` (Framer Motion successor), not GSAP. Spring-based transitions are the established idiom — e.g. `BottomNav.tsx`'s sliding active-tab indicator uses `{ type: "spring", stiffness: 400, damping: 30 }`; press feedback everywhere uses `whileTap={{ scale: 0.97 }}`. New interactive elements should match this spring feel rather than introducing linear/ease-based timing.

**Layout:** Bottom tab nav, max 5 items, dynamically 4 or 5 depending on role (`Post` tab only shown to landlords/caretakers/agents/scouts, not tenants) — already compliant with the bottom-nav-limit and role-appropriate-nav guidelines. Safe-area insets are handled (`pb-[env(safe-area-inset-bottom,0px)]`).

---

## Anti-Patterns (Do NOT Use)

- ❌ Poor photos (dataset-flagged anti-pattern for this product category — invest in the gallery, and group by the real `listing_images.category`). Note: `PanoramaViewerModal` was **deleted** in Phase 1. No `panorama_url` column exists; the 360° button was showing a demo sphere from a hardcoded sample on every real listing. Do not reintroduce it without a column behind it.
- ❌ Glassmorphism / heavy blur, luxury serif display fonts (Cinzel etc.) — mismatched with the established flat, mobile-first, trust-driven direction (see Rejected Alternative above)
- ❌ Raw Tailwind color shades in new semantic contexts — reach for `brand-primary` / `success` / `danger` tokens instead of `emerald-600`/`red-500` directly where a semantic meaning is intended
- ❌ New fractional spacing tokens beyond the existing set — use the default 4px-based steps
- ❌ `cursor-pointer` missing on clickable non-button elements
- ❌ Instant state changes — this app's convention is spring transitions, not 0ms snaps

### Fixed during this audit: emoji used as functional icons

The "no emoji as structural icons" rule was violated in 9 files where an emoji stood in for a status/meaning icon (not decorative text). All were swapped for the matching `lucide-react` icon (`Footprints`, `MapPin`, `Info`, `Check`, `X`, `AlertTriangle`, `AlertCircle`, `CheckCircle2`), each `aria-hidden="true"` since the adjacent text already carries the meaning: `SavedListingCard.tsx`, `SavedCompareSheet.tsx`, `SavedUpdates.tsx` (×2), `SavedSuggestions.tsx`, `PostReviewSummary.tsx` (×5), `AboutTrustPromise.tsx` (×2), `AboutProblemSolution.tsx` (×2). `npm run typecheck` verified clean after the change.

### Fixed during this audit: `text-neutral-450`/`-350` failed contrast on white

`text-neutral-450` (`#a3a3a3`) measured **2.5:1** against a white surface — below both the 3:1 large-text floor and the 4.5:1 normal-text floor. `text-neutral-350` (`#bcbcbc`-ish color-mix) measured **~1.9:1**, worse still. Both were used exclusively as the light-mode half of an already-correct `dark:text-stone-*` pair (verified before changing anything — only one place in the whole codebase, `SearchResultCard.tsx:185`, uses `dark:text-neutral-350` as an intentional *dark-surface* value, and that one was left untouched). Swapped all 76 other occurrences (67 + 9) across 38 files to `text-neutral-550` (`#737373`, ~4.7:1, passes AA). `npm run typecheck` verified clean after the change.

### AA-safe colour pairs (added Phase 8) — measured, not assumed

A full-page contrast audit found **37 AA failures on the brand colours**. An earlier pass had reported zero, but it only sampled text on card surfaces — it never sampled filled buttons or brand-coloured text, which is where every failure was. Ratios below were measured in the running app with alpha layers composited.

| Pair | Before | After | Verdict |
|---|---|---|---|
| `text-emerald-600` on white | 3.65:1 | `text-emerald-700` → **5.36:1** | every price, at 15px bold |
| white on `bg-emerald-600` | 3.65:1 | `bg-emerald-700` → **5.36:1** | primary CTAs, badges |
| white on `bg-emerald-500` | 2.47:1 | `bg-emerald-700` | worst offender |
| white on `bg-orange-500` / `-550` | 2.89 / 3.16:1 | `bg-orange-700` → **5.66:1** | "Featured" badge |
| `text-orange-500` / `-600` on white | 2.89 / 3.58:1 | `text-orange-700` | "Deposit", warnings |
| `text-neutral-300` / `-400` on white | 1.48 / 2.58:1 | `text-neutral-550` → **4.74:1** | separators, hints |
| `dark:text-stone-600` on dark | 2.29:1 | `dark:text-stone-400` | failed in all 44 uses |
| `dark:text-stone-500` on dark | 3.65:1 | `dark:text-stone-400` | |

**Rules that follow:**

- **Filled controls use the `-700` step**, never `-500`/`-600`, whenever they carry white text. There is no way to keep emerald-600 under white small text: `-600` only passes at ≥24px, or ≥18.66px bold, and every button label in this app is 11–14px.
- **Brand text on a light surface uses `-700`.** `-800`/`-900` are also fine; `-600` and lighter are not, except for display text at ≥24px.
- **Interaction states go darker, never lighter.** There were 32 uses of `hover:bg-emerald-500` over a `-600` base — a hover that lightened. Hover/active on a filled control is now `-800`. The exception is opacity tints (`hover:bg-emerald-500/5`) on transparent/outline buttons, where transparent → faint tint is the correct direction.
- **Borders on filled controls track their fill** (`border-emerald-700`). Hairline tints (`border-emerald-500/20`) on tinted surfaces are unchanged — those pass 3:1 on their own.
- **Dark mode is measured separately.** `dark:text-stone-400` is the muted tier (4.41:1 worst case, passing in 48 of 49 uses); anything below it fails. `dark:text-emerald-400` (9.0:1) and `dark:text-orange-400` (7.4:1) are the brand text colours on dark — a `-700` brand colour needs a `dark:` counterpart or it goes near-invisible.

**When checking contrast, composite the alpha layers.** Two probe bugs produced phantom results before this audit was trustworthy: a digit-regex read `oklch(0.439 0 0)` as `rgb(0, 439, 0)` (Tailwind v4 emits oklch), and treating a 10%-alpha emerald tint as opaque reported bright emerald text on it as a 1.31:1 failure. Normalise colours through a canvas and blend translucent ancestors onto the first opaque one.

### Layer scale (added Phase 6)

There were 12 distinct z-index values with no documented order, including `z-40`/`z-[40]` and `z-60`/`z-[60]` written in both syntaxes, a `z-[9999]` lightbox, and eight map overlays at `z-[1000]`. The scale now lives once, as custom properties in `:root` (Tailwind v4 has no `--z-index-*` theme namespace), and is referenced as `z-[var(--z-nav)]`:

| Token | Value | Owns |
|---|---|---|
| `--z-map` | 0 | `.leaflet-container` — a sealed stacking context |
| `--z-map-chrome` | 10 | locate button, coverage notice, docked card |
| `--z-sticky` | 20 | in-page sticky toolbars |
| `--z-nav` | 30 | BottomNav, ListingDetailsHeader |
| `--z-navbar` | 40 | DesktopNavbar, ProfileMenu backdrop |
| `--z-overlay` | 50 | sheets, modals, dropdowns, FABs, map takeover |
| `--z-assistant` | 60 | AIChatbot |
| `--z-lightbox` | 70 | full-screen image viewer |
| `--z-toast` | 100 | must outrank everything |

Do not add new numbers. If something needs a layer, it belongs at one of these.

Three companion variables kill the layout magic numbers: `--kf-navbar-h` (4rem), `--kf-bottomnav-h` (4rem), `--kf-page-pad-y` (2rem), each consumed by whatever needs to size around that chrome.

**`position: fixed` warning.** `AppShell`'s main container carries `backdrop-blur-md`, and `backdrop-filter` makes an element the containing block for every fixed descendant. So `fixed` inside the app resolves against AppShell's box, not the viewport — `top`/`bottom` arithmetic there is silently wrong. Prefer `inset-0`, which cannot be wrong about a box it fills entirely.

### Map conventions (added Phase 6)

- **One map component**: `components/map/PropertyMap`. It owns **zero height** — always `h-full`, and the caller sizes the parent. Use `svh`, never `dvh`, for map containers: `dvh` resizes continuously while the mobile URL bar animates, which turns one scroll into a resize storm.
- **`react-leaflet@5` freezes** `className`, `style`, `center`, `zoom` and every `MapOptions` field at first render. They are mount-time defaults, not controlled props. View changes go through a child component using `useMap()`; theme classes go on the wrapper, never on `MapContainer`.
- **Markers are `L.divIcon` with real CSS classes** (`.kf-price-marker` in `index.css`), not `renderToString`. A CSS class re-themes all pins on a theme toggle with zero React renders and zero `setIcon` calls. Two hard rules: escape user text (it reaches `innerHTML`), and no Tailwind utilities inside the HTML string — the class scanner cannot see classes that exist only in a JS template literal.
- **Every coordinate goes through `toMapPoint()`** in `lib/leaflet.ts`, which rejects null, non-finite, `(0,0)`, and anything outside a Kenya bounding box (that last check catches swapped lat/lng). A listing with no coordinates is **not plotted and the omission is disclosed** by `MapCoverageNotice`. Never fabricate a position — the deleted `approximateCoordinates` hashed the listing id into an offset around Nairobi, and `SavedMapView`'s `getMockCoordinates` returned CSS percentages from the estate name.
- **No `<Popup>`.** One selection model, two renderings: docked card on mobile, ringed-and-scrolled card on desktop. A popup with a clickable div inside it is a second interaction path no keyboard or screen-reader user will find.
- **Tile attribution must be links**, not plain text — OSM and CARTO both require it. And never override `.leaflet-top`/`.leaflet-bottom`: inside the container's stacking context those controls cannot escape anyway, and demoting them puts the marker pane over the zoom buttons and the attribution link.
- **Clustering: no.** 60 DOM markers is nothing. The threshold is pagination, not marker count — revisit when `.limit(60)` becomes a viewport query and >150 pins can land at once, and then use `supercluster` with the same `divIcon`.

---

## Pre-Delivery Checklist

Already true across the codebase (verified, not aspirational):
- [x] Icons are `lucide-react` SVGs, not emoji, anywhere in the app (repo-wide sweep, zero remaining emoji as of this audit)
- [x] `cursor-pointer` present on the shared `Button`/`Card` primitives
- [x] Spring-based press/hover feedback, not instant snaps
- [x] Bottom nav ≤ 5 items, role-aware
- [x] Safe-area insets respected on fixed bottom nav
- [x] `text-neutral-450`/`-350` no longer used on light surfaces (swapped to `text-neutral-550`, ~4.7:1)
- [x] Zero WCAG AA text-contrast failures across Home/Search/Saved/Profile in light **and** dark, filled buttons and brand text included (see the pair table above)

Still to verify per new/changed screen:
- [ ] No new emoji introduced for functional/status meaning (decorative emoji in plain prose is a separate, lower-stakes call)
- [ ] Dark mode contrast checked independently, not assumed from light mode
- [ ] Filled controls sampled too — a text-on-surface sweep will not catch white-on-brand failures
- [ ] Interaction states verified darker than their base, not lighter
- [ ] `prefers-reduced-motion` respected for spring/stagger animations
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] New semantic-colored elements use the `brand-*`/`success`/`warning`/`danger`/`info` tokens, not raw Tailwind shades
- [ ] z-index comes from the `--z-*` scale above, not a fresh number
- [ ] Any new arbitrary `text-[Npx]` justified — 741 remain across 112 files and are a known debt, so do not add to the pile
