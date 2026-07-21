# Draft Firestore Schema

This document outlines the initial Firestore collections and document shapes for the KejaFinder MVP.

Note: We use camelCase field names for Firestore.

## A. `users/{userId}`
Stores user information and role assignments.
- `id` (string)
- `fullName` (string)
- `phone` (string)
- `email` (string, optional)
- `role` (string)
- `avatarUrl` (string, optional)
- `county` (string, optional)
- `town` (string, optional)
- `estate` (string, optional)
- `isPhoneVerified` (boolean)
- `isIdVerified` (boolean)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## B. `listings/{listingId}`
Core rental property data.
- `id` (string)
- `ownerId` (string)
- `title` (string)
- `description` (string)
- `houseType` (string)
- `monthlyRent` (number)
- `depositAmount` (number)
- `waterCharge` (string, optional)
- `electricityType` (string, optional)
- `agentFee` (number)
- `viewingFee` (number)
- `county` (string)
- `town` (string)
- `estate` (string)
- `landmark` (string)
- `distanceFromRoad` (string, optional)
- `toiletType` (string, optional)
- `bathroomType` (string, optional)
- `floorLevel` (string, optional)
- `security` (string, optional)
- `contactName` (string)
- `contactRole` (string)
- `contactPhone` (string)
- `whatsappPhone` (string, optional)
- `amenities` (array of strings)
- `photoUrls` (array of strings)
- `coverPhotoUrl` (string, optional)
- `availabilityStatus` (string)
- `moderationStatus` (string)
- `verificationLevel` (string)
- `isFeatured` (boolean)
- `isAvailable` (boolean)
- `viewsCount` (number)
- `callClicksCount` (number)
- `whatsappClicksCount` (number)
- `reportCount` (number)
- `expiresAt` (timestamp, optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## C. `listings/{listingId}/photos/{photoId}`
Subcollection for listing individual photos (if needed outside the array).
(Note: `photoUrls` array is used in the main document for most use cases, but this subcollection can be for metadata).

## D. `users/{userId}/savedListings/{listingId}`
Tracks homes a tenant has bookmarked.
- `id` (string)
- `listingId` (string)
- `createdAt` (timestamp)

**Denormalization Note:**
- Listing cards should store `coverPhotoUrl` directly.
- Saved listings can duplicate the title, rent, location, and cover image for cheaper reads.

## E. `listingReports/{reportId}`
User-submitted flags for unsafe or inaccurate listings.
- `id` (string)
- `listingId` (string)
- `reporterId` (string, optional)
- `reason` (string)
- `message` (string, optional)
- `status` (string)
- `createdAt` (timestamp)
- `resolvedAt` (timestamp, optional)

## F. `contactEvents/{eventId}`
Analytics for measuring how often users request to communicate.
- `id` (string)
- `listingId` (string)
- `userId` (string, optional)
- `eventType` (string)
- `createdAt` (timestamp)
- `userAgent` (string, optional)

## G. `availabilityChecks/{checkId}`
Crowdsourced status tracking.
- `id` (string)
- `listingId` (string)
- `userId` (string, optional)
- `status` (string)
- `createdAt` (timestamp)

## H. `verificationRequests/{requestId}`
Requests from owners to gain trust badges.
- `id` (string)
- `listingId` (string, optional)
- `requesterId` (string)
- `requestType` (string)
- `status` (string)
- `notes` (string, optional)
- `reviewedBy` (string, optional)
- `createdAt` (timestamp)
- `reviewedAt` (timestamp, optional)

## I. `adminActions/{actionId}`
Audit log for moderation events.
- `id` (string)
- `adminId` (string)
- `targetType` (string)
- `targetId` (string)
- `action` (string)
- `notes` (string, optional)
- `createdAt` (timestamp)

## J. `notifications/{notificationId}`
In-app messaging to users.
- `id` (string)
- `userId` (string)
- `type` (string)
- `title` (string)
- `message` (string)
- `isRead` (boolean)
- `createdAt` (timestamp)
