# KejaFinder Navigation -- Phase 2

Responsive navigation and layout upgrade, built on top of the Phase 1 design system (`docs/DESIGN_SYSTEM.md`). Previously the entire app was a mobile phone-frame at every viewport size, with no top navbar, no working homepage search, no cross-tab page transitions, and a completely non-functional profile avatar button. This phase fixes all of that.

## Breakpoint strategy (3 tiers)

Tailwind's default breakpoints, no custom ones added:

| Tier | Width | Shell | Nav |
|---|---|---|---|
| Mobile | < 768px (`md`) | Unchanged phone-frame, fixed height, internal scroll | `BottomNav` |
| Tablet | 768px - 1279px (`md`-`xl`) | Full-width scrolling page, `max-w-3xl` content | `DesktopNavbar` (sticky top) |
| Desktop | >= 1280px (`xl`) | Full-width scrolling page, `max-w-7xl` content | Same `DesktopNavbar`; Search Results gets the side-by-side list+map split |

Tablet and desktop share one navbar and one shell branch -- they differ only in max-width/grid-column breakpoint values, not in structure. Mobile is a completely separate branch and was not touched beyond hiding/showing the right nav component.

**Why not duplicate the shell entirely per breakpoint?** `{children}` (every page) is rendered exactly once in `AppShell.tsx` regardless of breakpoint -- only the small `BottomNav`/`DesktopNavbar` components are mounted twice and toggled with responsive visibility classes (`md:hidden` / `hidden md:block`). Rendering full page trees twice and hiding one with CSS would double-fire data fetches, mount two Leaflet map instances, and risk two copies of form state going out of sync.

## New components

- **`src/components/DesktopNavbar.tsx`** -- sticky top navbar for tablet+desktop: logo, nav links (Explore/Saved/Post a vacancy) with a sliding active-state underline, a compact search pill, theme toggle, notifications bell, and the profile menu trigger.
- **`src/components/ProfileMenu.tsx`** -- dropdown from the navbar avatar. Content is a curated subset mirroring `ProfileShortcuts.tsx` (Saved, Post a vacancy, Dashboard, My profile & settings, dev shortcuts, Log out) rather than the full granular settings list in `data/profileData.ts` -- a compact menu needs top-level destinations, not every settings sub-screen. Signed-out state shows a real "You're not signed in" prompt instead of silently rendering nothing.
- **`src/hooks/useMediaQuery.ts`** -- small `window.matchMedia` hook, used only where React needs to know the breakpoint to decide whether to *mount* something (specifically: whether to mount the desktop split-view map). Everything else in this phase is plain CSS breakpoint classes; this hook exists because mounting a Leaflet map into a `display:none` container and revealing it later is a known source of blank/broken tiles.

## Bugs fixed along the way

- **The header profile avatar did nothing.** `Header.tsx`'s avatar button had no `onClick` at all and always showed a hardcoded silhouette regardless of sign-in state. Now navigates to Profile and shows the real signed-in user's initial or `avatar_url`.
- **The homepage search bar was a no-op.** `HeroSearch.tsx`'s submit handler called `e.preventDefault()` and stopped. Submitting now navigates to Search Results with the query pre-filled (`SearchResultsPage`'s new `initialQuery` prop).
- **Map markers jumped on every render.** `SearchFullMap.tsx` positioned every pin with `Math.random()` recomputed on each render. Replaced with a deterministic hash-based placement per listing id, and real `lat`/`lng` (now threaded through `Listing`/`listingMappers.ts` -- the column already existed in Postgres, selected via `LISTING_SELECT`'s `*`, just never mapped to the frontend type) take priority whenever present.
- **Duplicate headers at tablet/desktop.** `SavedPage.tsx` and `SearchResultsPage.tsx` both render their own `<Header>` (same as Home). With `DesktopNavbar` now global, these are wrapped `md:hidden` to avoid a stacked double-navbar.

## Search Results desktop split view

At `xl:` (1280px+), `SearchResultsPage.tsx` renders a list pane and a sticky `SearchFullMap` panel side-by-side instead of the mobile/tablet FAB-toggled full-screen takeover. `SearchFullMap` gained a `variant` prop (`'fullscreen'` for the existing mobile/tablet takeover, `'panel'` for the new in-flow sticky pane) -- same component, same data, different container styling. The split is gated behind `useMediaQuery`, not just a CSS breakpoint class, specifically so the map only ever mounts once its container has real size. Below `xl:`, behavior is pixel-for-pixel unchanged.

## What's deferred (not this phase)

- Rebuilding `ListingCard`/Home's carousels into a true Airbnb-style multi-column card grid -- Home's reflow at wider viewports comes entirely from `AppShell`'s new width-capped container; the carousels themselves are untouched.
- The pre-existing dead `xl:` floating-card frames in `ContactSupportPage.tsx`/`TestModePage.tsx`/`LandlordDashboardPage.tsx` (each independently tried to add responsive framing before this phase; their rules never took effect under the old shell and still don't -- noted, not fixed here).
- Real geocoding on listing creation -- Post Vacancy still doesn't capture `lat`/`lng` at source, so every current listing falls back to the deterministic approximate placement.
- Map clustering, "search this area on map move," or other advanced map interactions.
