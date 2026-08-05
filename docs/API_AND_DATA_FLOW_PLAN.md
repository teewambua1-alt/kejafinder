> Note: this is a product-level flow sketch predating the Supabase implementation. Flows A (search), B (posting), and parts of G (image upload) are now implemented — see `docs/SUPABASE_ARCHITECTURE.md`. Flows C (landlord dashboard) and D (admin moderation UI) are still not built; moderation happens manually via Supabase Studio today.

# API and Data Flow Plan

## A. Tenant Search Flow
1. **Load**: App fetches `approved` and `available` listings.
2. **Filter**: Apply UI selections against the database (location via text match/enums, rent range, type, availability, amenities, verified, no agent fee).
3. **Details**: User opens listing. Fetch listing details and associated `listing_photos`.
4. **Analytics**: Increment view count later.
5. **Contact**: User taps Call or WhatsApp. Create a new `contact_events` record via RPC.
6. **Action**: User taps save (upsert `saved_listings`) or report (insert `listing_reports`).

## B. Post Vacancy Flow
1. **Auth**: User signs in.
2. **Drafting**: Create draft listing.
3. **Details**: Add details.
4. **Photos**: Upload photos.
5. **Submission**: Submit for review.
6. **Moderation**: Listing becomes `pending_review`.
7. **Approval**: Admin approves/rejects. Approved listing becomes public.

## C. Landlord Dashboard Flow
1. **Load**: Owner loads own listings.
2. **Status Viewing**: See active/pending/taken/reported categories.
3. **Metrics**: See views and contact clicks.
4. **Actions**: Mark as taken, renew, update listing.
5. **Issues**: Review reports.

## D. Admin Moderation Flow
1. **Queue**: Admin views pending listings.
2. **Review**: Checks photos, details, contact.
3. **Decision**: Approves, rejects, or requests edits.
4. **Operations**: Handles reports, updates verification levels, expires stale listings.

## E. Listing Freshness Flow
1. **Expiry Window**: Free listing expires after 14 days. Verified listing expires after 30 days.
2. **Renewal**: Owner can renew if still available.
3. **Crowdsourcing**: Users can tap “Is this still available?”.
4. **Auto-flag**: Many unavailable reports can flag listing for review.

## F. Safety & Reporting Flow
1. **Trigger**: User reports scam, wrong details, or taken listing.
2. **Review**: Admin reviews the report.
3. **Outcome**: Listing may become reported or hidden. Admin action logged.

## G. Image Upload Flow
1. **Upload**: User uploads photos.
2. **Storage**: Store in listing-specific folder.
3. **Cover**: Cover image is required.
4. **Processing**: Compress and validate later. Limit photos per listing.
