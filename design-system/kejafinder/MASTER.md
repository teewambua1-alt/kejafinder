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

- ❌ Poor photos / no virtual tours (dataset-flagged anti-pattern for this product category — the app already invests in `PanoramaViewerModal`, photo galleries; keep doing that)
- ❌ Glassmorphism / heavy blur, luxury serif display fonts (Cinzel etc.) — mismatched with the established flat, mobile-first, trust-driven direction (see Rejected Alternative above)
- ❌ Raw Tailwind color shades in new semantic contexts — reach for `brand-primary` / `success` / `danger` tokens instead of `emerald-600`/`red-500` directly where a semantic meaning is intended
- ❌ New fractional spacing tokens beyond the existing set — use the default 4px-based steps
- ❌ `cursor-pointer` missing on clickable non-button elements
- ❌ Instant state changes — this app's convention is spring transitions, not 0ms snaps

### Fixed during this audit: emoji used as functional icons

The "no emoji as structural icons" rule was violated in 9 files where an emoji stood in for a status/meaning icon (not decorative text). All were swapped for the matching `lucide-react` icon (`Footprints`, `MapPin`, `Info`, `Check`, `X`, `AlertTriangle`, `AlertCircle`, `CheckCircle2`), each `aria-hidden="true"` since the adjacent text already carries the meaning: `SavedListingCard.tsx`, `SavedCompareSheet.tsx`, `SavedUpdates.tsx` (×2), `SavedSuggestions.tsx`, `PostReviewSummary.tsx` (×5), `AboutTrustPromise.tsx` (×2), `AboutProblemSolution.tsx` (×2). `npm run typecheck` verified clean after the change.

### Fixed during this audit: `text-neutral-450`/`-350` failed contrast on white

`text-neutral-450` (`#a3a3a3`) measured **2.5:1** against a white surface — below both the 3:1 large-text floor and the 4.5:1 normal-text floor. `text-neutral-350` (`#bcbcbc`-ish color-mix) measured **~1.9:1**, worse still. Both were used exclusively as the light-mode half of an already-correct `dark:text-stone-*` pair (verified before changing anything — only one place in the whole codebase, `SearchResultCard.tsx:185`, uses `dark:text-neutral-350` as an intentional *dark-surface* value, and that one was left untouched). Swapped all 76 other occurrences (67 + 9) across 38 files to `text-neutral-550` (`#737373`, ~4.7:1, passes AA). `npm run typecheck` verified clean after the change.

---

## Pre-Delivery Checklist

Already true across the codebase (verified, not aspirational):
- [x] Icons are `lucide-react` SVGs, not emoji, anywhere in the app (repo-wide sweep, zero remaining emoji as of this audit)
- [x] `cursor-pointer` present on the shared `Button`/`Card` primitives
- [x] Spring-based press/hover feedback, not instant snaps
- [x] Bottom nav ≤ 5 items, role-aware
- [x] Safe-area insets respected on fixed bottom nav
- [x] `text-neutral-450`/`-350` no longer used on light surfaces (swapped to `text-neutral-550`, ~4.7:1)

Still to verify per new/changed screen:
- [ ] No new emoji introduced for functional/status meaning (decorative emoji in plain prose is a separate, lower-stakes call)
- [ ] Dark mode contrast checked independently, not assumed from light mode
- [ ] `prefers-reduced-motion` respected for spring/stagger animations
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] New semantic-colored elements use the `brand-*`/`success`/`warning`/`danger`/`info` tokens, not raw Tailwind shades
