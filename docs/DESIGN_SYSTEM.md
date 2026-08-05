# KejaFinder Design System -- Phase 1

Foundational tokens and reusable UI primitives. This is the first of several
planned phases toward a polished MVP UI:

- **Phase 1 (this phase):** design tokens + reusable primitives, built and
  verified in isolation. No existing screen was redesigned.
- **Later phases:** migrate individual screens to the primitives below,
  replacing hand-rolled buttons/inputs/cards/empty states one screen at a
  time, plus any new UI patterns those screens need.

Live reference: open the app, go to **Profile -> My shortcuts -> Design
System** (dev-only entry point, same pattern as the existing Test Mode
shortcut). It renders every token and primitive below using the real
Tailwind build, in both light and dark mode.

## Principles

1. **Codify, don't reinvent.** Every color, spacing value, and component
   style below is extracted from patterns already dominant across the app
   (e.g. `emerald-600` primary buttons, `rounded-2xl` cards, `font-black
   uppercase tracking-wider` labels) -- not a new aesthetic.
2. **Additive tokens only.** Nothing in Tailwind's default scale (`text-xs`,
   `spacing-4`, etc.) was redefined, because doing so would instantly change
   every existing screen's rendering. New tokens fill real gaps instead.
3. **Primitives are opt-in.** Existing screens keep their current hand-rolled
   markup until a later phase deliberately migrates them. Nothing here
   changes what a user sees today, except the color-shade fix below (which
   fixes rendering that was already silently broken).

## Color palette

Defined in `src/index.css` under `@theme`. Semantic names map to the shades
already dominant across the app:

| Token | Value | Use |
|---|---|---|
| `--color-brand-primary` | `emerald-600` | Primary CTAs, links, active states |
| `--color-brand-primary-hover` | `emerald-700` | Hover state |
| `--color-brand-primary-light` | `emerald-50` | Tinted backgrounds |
| `--color-brand-accent` | `orange-500` | Warm accent, warnings, secondary CTAs |
| `--color-brand-accent-hover` | `orange-600` | Hover state |
| `--color-surface` | `#ffffff` | Cards, sheets |
| `--color-surface-muted` | `#f7fee7` | App background (light) |
| `--color-surface-dark` | `#0c0a09` | App background (dark) |
| `--color-text-charcoal` | `#1c1917` | Primary text on light surfaces |
| `--color-success` / `--color-warning` / `--color-danger` / `--color-info` | emerald / orange / red / blue | Status colors for badges, banners, form errors |

**Fixed a real bug while building this:** the app has long used fine-grained
custom shade numbers -- `orange-550`, `emerald-650`, `neutral-355`, `stone-880`,
and ~35 others -- that were never registered with Tailwind. Tailwind only
generates CSS for colors it's told about, so every one of these was silently
rendering **fully transparent** (confirmed via `getComputedStyle` on a real
button using `bg-orange-550`: `background-color: rgba(0, 0, 0, 0)`). All of
them are now defined in `@theme` as a `color-mix()` interpolation between
their two real neighboring stops (e.g. `emerald-650` = 50% between
`emerald-600` and `emerald-700`), so every existing screen using one of these
classes now renders its intended color -- no component code changed.

## Typography

Tailwind's default named sizes (`text-xs` = 12px through `text-4xl`) are
unchanged. Two new tokens fill the gap below `text-xs`, where roughly 1,500
one-off `text-[10px]`-style arbitrary values have accumulated across the app:

| Token | Size | Use |
|---|---|---|
| `text-3xs` | 8px | Smallest micro-labels |
| `text-2xs` | 10px | Badge text, meta captions |
| `text-xs` (default) | 12px | Body captions |
| `text-sm` (default) | 14px | Body text |

New and updated components should reach for `text-3xs`/`text-2xs` instead of
a new `text-[Npx]` value. Existing arbitrary values are not being mass-replaced
in this phase.

Weight: the app leans heavily on `font-black` and `font-extrabold` for labels
and headings (font-black alone appears 400+ times) -- keep that heavy,
label-forward weight in new work rather than defaulting to `font-normal`.

## Spacing (8px system)

Tailwind's default spacing scale is already 4px-based (`spacing-2` = 8px,
`spacing-4` = 16px, ...). "8px system" going forward means: **prefer the
even default steps** (`2/4/6/8/10/12/16`) over new fractional additions.

The existing fractional tokens (`spacing-4.5` = 18px, `spacing-5.5` = 22px,
`spacing-8.5` = 34px, `spacing-13` = 52px) have roughly 280 call sites across
the app and are kept as-is -- removing them would break existing layouts.
Just don't add more like them.

## Shadows & radius

Shadow scale: `shadow-5xs` (softest) through `shadow-2xl`. `shadow-4xs` and
`shadow-5xs` were referenced in a few components without ever being defined
(same silent-failure bug class as the colors above) -- now defined.

Radius scale in active use: `rounded-lg`, `rounded-xl`, `rounded-2xl`,
`rounded-2.5xl` (custom), `rounded-3xl`, `rounded-full`. No changes needed
here beyond documenting what's already established.

## Icons

Library: `lucide-react`, used throughout -- no new icon set introduced.
Convention: `w-4 h-4` for inline icons, `w-3.5 h-3.5` for compact/chip icons,
`stroke-[2.2]` as the standard stroke width (occasionally `stroke-[2]` or
`stroke-[2.5]` for emphasis).

## Components (`src/components/ui/`)

All new, additive -- nothing existing imports these yet.

| Component | Notes |
|---|---|
| `Button` | Variants: `primary` \| `secondary` \| `outline` \| `ghost` \| `danger`. Sizes: `sm` \| `md` \| `lg`. Wraps `motion.button` with the existing tap-scale feel. |
| `Input` | Label + error + hint + optional prefix (e.g. "KSh"), codified from the Post Vacancy form fields. |
| `Card` | Base surface container, `padding`: `none` \| `sm` \| `md` \| `lg`, optional `interactive` hover state. |
| `Chip` | Selectable pill, generalized from `FilterChips`. |
| `Badge` | Small status pill. Variants: `success` \| `warning` \| `danger` \| `info` \| `neutral`. |
| `Skeleton` | Generic pulsing block (`variant`: `block` \| `circle` \| `text`), extracted from `ListingCardSkeleton`'s shimmer pattern. |
| `EmptyState` | Generalized from `SavedEmptyState` -- icon, title, description, up to two CTAs. Use for any empty list/feed. |
| `ErrorState` | Same layout, orange-toned, with a retry action -- fills a real gap: `useListings`/`useListing` already expose an `error` string that had nowhere consistent to render. |

Import from the barrel: `import { Button, Input, Card, Chip, Badge, Skeleton, EmptyState, ErrorState } from '../components/ui';`

### A note on component prop types

This project has no `@types/react` installed (confirmed: `React.HTMLAttributes`
and `React.InputHTMLAttributes` resolve without their expected members here).
Don't `extends React.HTMLAttributes<...>` or similar in new components --
declare the exact props you need explicitly instead, the way `Card` and
`Input` do. `React.ReactNode`, `React.ChangeEvent<T>`, `React.MouseEvent<T>`,
etc. all resolve fine and are used safely elsewhere in the app.

## What's next (not part of this phase)

- Migrate individual screens to use these primitives (start with the
  highest-duplication ones: buttons and empty states).
- Consider replacing `ListingCardSkeleton`'s hand-rolled blocks with the new
  `Skeleton` primitive when that screen is next touched.
- Wire `ErrorState` into `useListings`/`useListing` consumers (Home, Search,
  Listing Details) so fetch failures show a real retry UI instead of nothing.
