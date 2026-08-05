# Supabase Architecture

KejaFinder's backend is Supabase: Postgres, Auth, Storage, and Row Level
Security (RLS). This replaces the earlier Firebase/Firestore direction
(`docs/FIREBASE_*.md`, deleted) and the pre-implementation
`SUPABASE_RLS_PLAN.md`/`DATABASE_SCHEMA_DRAFT.md` sketches (also deleted,
superseded by this document and `docs/SUPABASE_SCHEMA.md`).

This is a hard requirement, not an optional integration: every data hook
(`useListings`, `useListing`, `useSavedListings`, `usePostListingDraft`,
`AuthContext`) calls Supabase directly with no local-sample-data fallback.
`src/lib/supabase/client.ts` throws at import time if `VITE_SUPABASE_URL` or
`VITE_SUPABASE_ANON_KEY` are missing.

## Why Supabase, and why not a line-by-line Firestore port

The Firestore design had two Critical, exploitable-today gaps found during
the production readiness audit — a landlord could self-approve/self-feature
their own listing, and any tenant could self-escalate to landlord/agent/scout
by editing their own profile document — plus structural gaps Firestore has
no good answer for: no real full-text search, no amenities filtering
alongside a price range in one query, no geo "nearest" sort, and a hard
50-document search cap. Postgres/RLS closes the security gaps at the engine
level (not just app-code discipline) and gives native primitives for the
rest (`tsvector` full-text search, `text[]` + GIN for amenities,
`earthdistance` for geo sort).

## Admin privilege model

Admin is **not** a value in `profiles.role` — the `role` column's CHECK
constraint (`tenant | landlord | caretaker | agent | scout`) structurally
excludes `'admin'`, so "a profile row says admin" cannot exist in the
database regardless of application bugs. Admin privilege lives in a separate
`public.admins` table (`user_id` primary key), checked via the
`public.is_admin()` `SECURITY DEFINER` function. There is no client-facing
way to insert into `admins` — the only path is the service-role key via
Supabase Studio or a trusted script.

## System-owned fields are protected by column-level privileges, not just RLS

Fields like `moderation_status`, `verification_level`, `is_featured`, the
view/click/report counters, and `owner_id` are protected via Postgres
`REVOKE`/`GRANT UPDATE (col, ...)` — the engine rejects a write to those
columns before RLS policy evaluation even runs. This closes both original
Firestore-era vulnerabilities structurally, on **both** INSERT and UPDATE
(the original Firestore fix only covered UPDATE). The only way to change
these fields is through `SECURITY DEFINER` functions:

- `submit_listing_for_review(p_listing_id)` — owner-only, `draft` → `pending_review`.
- `admin_moderate_listing(p_listing_id, p_action, p_notes)` — admin-only;
  dispatches on a hardcoded `CASE` (`approve`, `reject`, `reset_to_draft`,
  `feature`, `unfeature`, `verify_phone`, `verify_location`, `verify_scout`,
  `verify_trusted`) and logs every call to `admin_actions`.
- `increment_listing_view(p_listing_id)` / `increment_contact_click(p_listing_id, p_click_type)` —
  anon-callable by design (anonymous browsing needs to register views/clicks),
  but only ever move a counter by exactly 1 on an already-approved listing.
  Known residual risk: counter-gaming via scripted repeated calls — accepted
  for v1, not rate-limited yet.
- `bump_listing_report_count()` — trigger, fires after `listing_reports` insert.

All of these are fully schema-qualified (`public.listings`, never bare
`listings`) with `set search_path = ''`, have `EXECUTE` revoked from
`PUBLIC` and granted only to the roles that need it, and re-check
`auth.uid()`/`is_admin()` internally — `SECURITY DEFINER` bypasses RLS, so
the function body itself is the security boundary, not the RLS policy on
the table it touches.

See `supabase/migrations/20260805000002_rls_and_functions.sql` for the full
SQL.

## Storage: two buckets, synced by a webhook

- `listing-photos-pending` (private) — draft/pending-review listing photos.
  Only the owner (or an admin) can read/write, enforced via a storage RLS
  policy that joins `(storage.foldername(name))[1]` (the listing UUID) back
  to `listings.owner_id`.
- `listing-photos` (public) — approved, available listings only. Genuinely
  public and CDN-cacheable — no signed-URL cache-fragmentation problem for
  a page every visitor loads.

A Supabase Database Webhook on `public.listings` (fires on `UPDATE` of
`moderation_status`/`availability_status`) calls `POST
/webhooks/listing-moderation` on the Cloud Run service (`server.ts`),
authenticated by a shared-secret header (`x-webhook-secret`, checked against
`SUPABASE_WEBHOOK_SECRET`). The handler uses the service-role key to move
that listing's objects between buckets (list → download → upload → remove —
chosen over a cross-bucket `move()`/`copy()` call to avoid depending on an
uncertain SDK version's exact signature): into `listing-photos` when a
listing becomes approved + available, back to `listing-photos-pending`
otherwise. See `docs/CLOUD_RUN_DEPLOY.md` for how to configure the webhook.

Path convention in both buckets: `{listing_id}/{image_id}.{ext}`.

## Auth flow

Supabase Auth (`signUp` / `signInWithPassword` / `signOut` /
`onAuthStateChange`) in `src/context/AuthContext.tsx`. Signup extra fields
(`full_name`, `phone`, `role`, `county`, `town`, `estate`) travel in
`options: { data: {...} }` (Supabase user metadata) and are read by a
trigger (`handle_new_user`, `supabase/migrations/20260805000004_auth_trigger.sql`)
that creates the `profiles` row **in the same transaction** as the
`auth.users` insert. This eliminates the Firebase-era signup-race bug class
structurally, not just patches it — there is no second async writer that
can resolve out of order, since the trigger has already run by the time
`supabase.auth.signUp()` resolves on the client.

This project has email confirmation enabled: `signUp()` does not return a
session until the user confirms via email. `AuthContext.signUp()` returns
`{ requiresEmailConfirmation: boolean }` and only fetches the profile
immediately if a session actually came back — otherwise the UI shows "check
your email" and the user logs in normally once confirmed.

`admin` is not a selectable signup role — enforced by the `role` CHECK
constraint itself, not just client-side UI logic. Real phone/OTP
verification is not implemented (Supabase Auth supports `signInWithOtp`
natively, but wiring a real SMS provider needs its own account/cost
decision) — this is honestly labeled "not yet implemented" in the UI rather
than a mock OTP screen.

## Service layer

- `src/services/listingService.ts` — public feed, search (`.textSearch()` on
  the generated `search_vector` column), amenities filtering
  (`.overlaps()`), pagination (`.range()`), and "nearest" sort via the
  `nearby_listings` RPC (`earthdistance`/`cube`).
- `src/services/postListingService.ts` — draft create/update, and
  `submit_listing_for_review` RPC for the draft → pending_review transition.
- `src/services/savedListingsService.ts` — plain upsert/delete against
  `saved_listings`, joined reads for the saved-listings page. No denormalized
  snapshot data (unlike the Firestore version) — a save is just
  `(user_id, listing_id)`, so it can never go stale relative to the listing.
- `src/services/photoUploadService.ts` — uploads to `listing-photos-pending`,
  inserts `listing_images` rows.

## Deployment

See `docs/CLOUD_RUN_DEPLOY.md` for the Cloud Run deployment steps, required
environment variables, and Database Webhook configuration.
