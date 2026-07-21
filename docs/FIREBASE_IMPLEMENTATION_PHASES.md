# Firebase Implementation Phases

## Phase 1: Backend Foundation
- Firebase project setup in AI Studio.
- Firebase Authentication setup.
- Firestore database creation and basic collections.
- Firebase Storage bucket configuration.
- Base Firebase Security Rules and Storage rules.
- Local Firebase Emulator setup (if needed later for testing).

## Phase 2: Listings Backend
- Replace local sample listings with Firestore queries (or prep for it).
- Real listing search and filter logic.
- Listing details sourced from Firestore documents.
- Firebase Storage integration for listing photos.
- Save listing persistence functionality for tenants.

## Phase 3: Posting Backend
- Auth-gated post vacancy flow implementation.
- Draft listing logic via Firestore writes.
- Photo upload to Firebase Storage with proper paths.
- Submit for review function (setting status to `pending_review`).
- Owner dashboard listing view using direct owner queries.

## Phase 4: Admin Approval
- Internal Admin dashboard creation.
- Pending listings queue processing using `where('moderationStatus', '==', 'pending_review')`.
- Approve/reject mechanisms via direct document updates.
- Firebase Security Rules validation for Admin actions.
- Report handling.
- Verification levels adjustments.

## Phase 5: Freshness and Contact Tracking
- Tracking contact events via `contactEvents` collection.
- Tracking view counts (can be batched via Cloud Functions to reduce writes).
- Capturing availability checks in `availabilityChecks`.
- Handling expiry logic (can be a scheduled Cloud Function or client-side filter).
- Managing Renewal flow.

## Phase 6: Polish Before Payments
- Security review and comprehensive Security Rules testing.
- Performance updates.
- Image compression optimizations for Storage.
- Support workflow integration.
