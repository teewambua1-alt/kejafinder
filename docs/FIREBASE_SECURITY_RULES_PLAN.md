# Firebase Security Rules Plan

## Firestore Rules

- **Users (`users/{userId}`)**: Users can read/update their own profile. Public profile reads should be limited to necessary fields only (e.g., verifying a poster's identity).
- **Listings (`listings/{listingId}`)**: Public users can read approved and available listings. Owners can read their own listings regardless of status (draft, pending_review, rejected, taken). Landlords, caretakers, agents, and scouts can create listings. Owners can update draft/pending listings. Admins can approve/reject/report/expire listings.
- **Saved Listings (`users/{userId}/savedListings/{listingId}`)**: Users can manage their own saved listings. No one else has access except admins.
- **Listing Reports (`listingReports/{reportId}`)**: Authenticated users can create reports. Admins manage and resolve all reports. Owners cannot see who reported them.
- **Contact Events (`contactEvents/{eventId}`)**: Public or authenticated users can create contact events. Owners can read aggregate counts for their own listings, but should not expose raw visitor identities to owners.
- **Verification Requests (`verificationRequests/{requestId}`)**: Users can create verification requests for their profile or listings. Admins review and approve/reject these requests. Public cannot view pending requests.
- **Notifications (`notifications/{notificationId}`)**: Users can read and update (mark as read) their own notifications.
- **Admin Actions (`adminActions/{actionId}`)**: Strictly limited to the `admin` role for read/write.
- **Admin Roles**: The Admin role should use custom claims later.
- **Sensitive Fields**: Phone numbers are sensitive and need careful exposure rules.
- **Production Check**: Security rules must be tested thoroughly before production.

## Firebase Storage Rules Plan

Recommended storage path:
`listing-photos/{ownerId}/{listingId}/{photoId}.jpg`

### Rules plan:
- Owners can upload photos only for their own listing.
- Public can read photos only for approved listings.
- Admins can manage all listing photos.
- Limit file size later.
- Restrict file types to images later.
