# Supabase Schema Reference

Source of truth: `supabase/migrations/*.sql`. This document is a readable
summary — if it ever disagrees with the migrations, the migrations win. See
`docs/SUPABASE_ARCHITECTURE.md` for the design rationale behind these
choices.

Generate/refresh the TypeScript types with:

```bash
supabase gen types typescript --linked > src/types/database.ts
```

Note: `house_type` and `contact_role` on `listings` are `text` columns with
CHECK constraints, not native Postgres enums, so
`Database['public']['Enums']` is empty. `src/lib/listingMappers.ts` defines
a local `HouseType` union that must be kept in sync with the CHECK
constraint by hand.

## Tables

### `profiles`
One row per `auth.users` row (same `id`, `on delete cascade`), created by
the `handle_new_user` trigger at signup. `role` is one of `tenant`,
`landlord`, `caretaker`, `agent`, `scout` — never `admin` (see
`docs/SUPABASE_ARCHITECTURE.md`'s admin model). `is_phone_verified` /
`is_id_verified` have no client-side UPDATE grant at all — admin-only via
Studio.

### `admins`
`user_id` primary key referencing `auth.users`. Zero client policies for
insert/update/delete — the only way a row is added is the service-role key.

### `listings`
The core table. Key columns: `owner_id`, pricing (`monthly_rent`,
`deposit_amount`, `agent_fee`, `viewing_fee`), location (`county`, `town`,
`estate`, `landmark`, `lat`/`lng`), `amenities text[]`, and the
system-owned/protected fields — `moderation_status`, `availability_status`,
`verification_level`, `is_featured`, `is_available`, `views_count`,
`call_clicks_count`, `whatsapp_clicks_count`, `report_count` — writable only
through the `SECURITY DEFINER` functions in
`20260805000002_rls_and_functions.sql`.

`search_vector` is a generated, stored `tsvector` column (title weighted A,
location fields weighted B, description weighted C) backing full-text
search via a GIN index. `lat`/`lng` back a GiST index
(`ll_to_earth`/`earth_distance`, via the `cube`/`earthdistance` extensions)
for the "nearest" sort. A partial index on
`(moderation_status, availability_status, created_at desc) where
moderation_status = 'approved'` keeps the public feed query fast without
indexing rows the feed will never match.

Validation constraints: `monthly_rent > 0`, `deposit_amount >= 0`,
`agent_fee >= 0`, `viewing_fee >= 0`, all counters `>= 0`.

### `listing_images`
`listing_id` (FK, cascade delete), `storage_path`, `category` (one of
`room`, `outside`, `toilet`, `kitchen`, `compound`, `other` — must match
`usePostListingDraft.ts`'s `SLOT_CATEGORIES`), `position`.

### `saved_listings`
Composite primary key `(user_id, listing_id)`. No extra columns — a save is
just the relationship, so it can never carry stale denormalized data about
the listing.

### `listing_reports`
`reporter_id` (nullable, `on delete set null` — a report survives its
reporter's account deletion), `reason` (fixed enum-like CHECK list),
`status` (`new` / `reviewing` / `resolved` / `dismissed`). Admin-only read —
owners never see who reported them, matching the original design intent.

### `verification_requests`
`request_type` (`phone` / `location` / `scout` / `landlord_trust`),
`status` (`pending` / `approved` / `rejected`), optional `listing_id`.

### `notifications`
`user_id`, `type`, `title`, `message`, `is_read`. System/trigger-generated
only — no client INSERT policy at all. Clients may only flip `is_read`
(column-level `GRANT UPDATE (is_read)`).

### `admin_actions`
Audit log, written only by `admin_moderate_listing()`. Admin-read-only,
immutable from the client (no insert/update/delete policy).

## Row Level Security summary

| Table | Select | Insert | Update | Delete |
|---|---|---|---|---|
| `profiles` | owner or admin | owner (self only) | owner or admin (protected columns excluded — see below) | — |
| `admins` | admin only | — (service-role only) | — | — |
| `listings` | public if approved+available, else owner/admin | owner (role-gated: landlord/caretaker/agent/scout) | owner (draft/pending_review only) or admin | owner (draft only) or admin |
| `listing_images` | follows parent listing's visibility | owner/admin of parent listing | — | owner/admin of parent listing |
| `saved_listings` | owner only | owner only | owner only | owner only |
| `listing_reports` | admin only | reporter (self, status forced to `new`) | admin only | admin only |
| `verification_requests` | requester or admin | requester (self, status forced to `pending`) | admin only | requester (while pending) or admin |
| `notifications` | owner only | — (trigger/system only) | owner (`is_read` only) | owner only |
| `admin_actions` | admin only | — (function only) | — | — |

"Protected columns excluded" on `profiles`/`listings` means: RLS's `USING`/
`WITH CHECK` clauses allow the row-level operation, but a column-level
`REVOKE`/`GRANT` on top additionally blocks specific columns from ever being
part of a client UPDATE — e.g. a landlord can update their own listing's
`monthly_rent`, but not its `moderation_status`, no matter what RLS alone
would allow.

## Storage buckets

| Bucket | Public | Who can write |
|---|---|---|
| `listing-photos-pending` | No | Owner of the listing (path `{listing_id}/...`), or admin |
| `listing-photos` | Yes (read) | Admin only (writes happen via the webhook's service-role client, not RLS) |

## Extensions used

`pgcrypto` (UUID generation), `cube` + `earthdistance` (lightweight
lat/lng distance — not full PostGIS, proportionate to "sort by distance").
