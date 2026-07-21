> Note: Supabase/PostgreSQL was considered for the MVP backend, but Firebase is now selected for the test backend stage because of Google AI Studio integration. Keep this document as future migration/reference material.

# Supabase RLS and Security Plan

## Role Model
The application relies on distinct user personas. Supabase Auth will handle authentication, and a custom `role` claim or `profiles.role` column will be used in RLS policies.
- `tenant`: Default user browsing properties.
- `landlord`: Property owner managing listings directly.
- `caretaker`: Managing properties on behalf of a landlord.
- `agent`: Broker charging an agent fee.
- `scout`: Highly trusted platform contributor verifying homes.
- `admin`: Internal staff handling moderation and support.

## RLS Policy Outline

### `profiles`
- **Read**: Users can read limited public profile info where needed (e.g., verifying a poster's identity).
- **Create**: Users create their own profile upon signup (often via trigger).
- **Update**: Users can update their own profile.
- **Admin**: Admins can read, update, and manage all profiles.

### `listings`
- **Read (Public)**: Anyone can read listings if `moderation_status = 'approved'` AND `availability_status = 'available'` AND `is_available = true`.
- **Read (Owner)**: Owners can read their own listings regardless of status (draft, pending_review, rejected, taken).
- **Create**: Authenticated users can create listings.
- **Update (Owner)**: Owners can update their own listings freely while `draft` or `rejected`. If updating an `approved` listing, changes to primary fields (price, location, photos) might trigger a reversion to `pending_review`.
- **Status Change (Owner)**: Owners can freely mark their own listings as `taken` or request `renewal`.
- **Admin**: Admins can approve, reject, report, expire, or modify any listing.

### `listing_photos`
- **Read (Public)**: Anyone can view photos attached to public, approved listings.
- **Manage (Owner)**: Owners can insert, update, or delete photos for their own listings. If the listing is actively under review or already approved, changes may be restricted or trigger re-review.
- **Admin**: Admins can manage or hide any photo.

### `saved_listings`
- **Manage (User)**: Users can read, create, and delete their own saved listings only. No one else has access except admins.

### `listing_reports`
- **Create (User)**: Authenticated users can create reports. Anonymous reporting might be considered later via Edge Functions.
- **Read (Reporter)**: Reporters can read the status of their own reports.
- **Manage (Admin)**: Admins can read, update, and resolve all reports. Owners *cannot* see who reported them or the raw report data, only admin summaries if contacted.

### `contact_events` & `availability_checks`
- **Create (Public/User)**: Anyone can log a contact click; users can log availability status checks.
- **Read (Owner)**: Owners can read *aggregate counts* for their own listings, not specific event details.
- **Read (Admin)**: Admins can view all telemetry.

### `verification_requests`
- **Create (User)**: Users can open verification requests for themselves or their listings.
- **Manage (Admin)**: Admins review, approve, or reject these requests. Public cannot view pending requests.

### `admin_actions` & `notifications`
- **Admin Actions**: Strictly limited to `admin` role for read/write.
- **Notifications**: Users can read and update (mark as read) their own notifications. The system (trigger/function) or admins create them.

## Important Considerations
- **RLS Risks**: Improper policies can expose all user data or allow listing hijacking. RLS must be thoroughly tested before production.
- **Sensitive Fields**: Caretaker/Landlord exact phone numbers should be protected. Will they be exposed raw to the client or behind a proxy? For MVP, if exposed, ensure they only leak for approved listings.
- **Admin Handling**: Do not rely purely on client-side JS to grant admin status. Ensure custom claims or secure server-side checks dictates admin rights in PostgreSQL.
