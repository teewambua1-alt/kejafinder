# Firebase Data Flow Plan

## A. Tenant Search Flow
1. **Load**: App fetches `approved` and `available` listings.
2. **Filter**: Apply UI selections against the database (location, rent range, type, availability, amenities, verified, no agent fee).
3. **Details**: User opens listing. Fetch listing details from Firestore.
4. **Analytics**: Increment view count later (e.g., using Cloud Functions).
5. **Contact**: User taps Call or WhatsApp. Create a new `contactEvents` record.
6. **Action**: User taps save (write to `users/{userId}/savedListings`) or report (write to `listingReports`).

## B. Post Vacancy Flow
1. **Auth**: User signs in via Firebase Authentication.
2. **Drafting**: Create draft listing document in `listings/{listingId}`.
3. **Details**: Add details.
4. **Photos**: Upload photos to Firebase Storage (`listing-photos/...`).
5. **Submission**: Submit for review.
6. **Moderation**: Listing status is set to `pending_review`.
7. **Approval**: Admin approves/rejects. Approved listing becomes public.

## C. Landlord Dashboard Flow
1. **Load**: Owner loads their own listings.
2. **Status Viewing**: See active/pending/taken/reported categories.
3. **Metrics**: View metrics via aggregate counts and queries.
4. **Actions**: Mark as taken, renew, update listing. Update Firestore document.
5. **Issues**: Review listing reports.

## D. Admin Moderation Flow
1. **Queue**: Admin views pending listings.
2. **Review**: Checks photos, details, contact.
3. **Decision**: Approves, rejects, or requests edits.
4. **Operations**: Handles reports, updates verification levels, expires stale listings.

## E. Listing Freshness Flow
1. **Expiry Window**: Free listing expires after 14 days. Verified listing expires after 30 days.
2. **Renewal**: Owner can renew if still available.
3. **Crowdsourcing**: Users can tap “Is this still available?”, adding `availabilityChecks`.
4. **Auto-flag**: Many unavailable reports flag listing for review.

## F. Safety & Reporting Flow
1. **Trigger**: User reports scam, wrong details, or taken listing. Creates `listingReports` document.
2. **Review**: Admin reviews the report.
3. **Outcome**: Listing may become reported or hidden. `adminActions` is logged.

## G. Image Upload Flow
1. **Upload**: User uploads photos to Firebase Storage.
2. **Storage**: Store in listing-specific folder (`listing-photos/{ownerId}/{listingId}/`).
3. **Cover**: Cover image is required. Set `coverPhotoUrl`.
4. **Processing**: Compress and validate later. Limit photos per listing.
