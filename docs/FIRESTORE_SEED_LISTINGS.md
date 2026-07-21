# Firestore Seed Listings

This document provides sample JSON for manually seeding test listings into a connected Firestore database. 

## Purpose
Post Vacancy writes are not yet connected to Firestore in version 3.7.0. Therefore, to test the Firestore listings reads, you must manually create documents in your Firebase console.

## Environment Details
- **Collection**: `listings`
- Note: Use auto-generated IDs when creating documents in the Firebase console.

## Required Fields for Discovery
For a listing to appear publicly on the Home and Search pages, it **must** have:
- `moderationStatus`: `"approved"`
- `availabilityStatus`: `"available"`
- `isAvailable`: `true`

## Sample Listing 1: Bedsitter in Syokimau

```json
{
  "ownerId": "test-owner-1",
  "title": "Modern Bedsitter Next to Gateway Mall",
  "description": "Clean, spacious bedsitter with great water supply and security.",
  "houseType": "bedsitter",
  "monthlyRent": 8500,
  "depositAmount": 8500,
  "contactName": "John Caretaker",
  "contactPhone": "0700111222",
  "whatsappPhone": "0700111222",
  "contactRole": "caretaker",
  "county": "Machakos",
  "town": "Syokimau",
  "estate": "Mombasa Road",
  "landmark": "Near Gateway Mall",
  "amenities": ["Borehole Water", "24/7 Security", "Tiles"],
  "coverPhotoUrl": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "photoUrls": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"],
  "agentFee": 0,
  "viewingFee": 0,
  "verificationLevel": "none",
  "moderationStatus": "approved",
  "availabilityStatus": "available",
  "isAvailable": true,
  "isFeatured": false,
  "viewsCount": 12,
  "callClicksCount": 1,
  "whatsappClicksCount": 0,
  "reportCount": 0,
  "createdAt": "2023-11-01T10:00:00Z",
  "updatedAt": "2023-11-01T10:00:00Z"
}
```

## Sample Listing 2: Single Room in Athi River

```json
{
  "ownerId": "test-owner-2",
  "title": "Affordable Single Room",
  "description": "Safe, family-friendly compound.",
  "houseType": "single_room",
  "monthlyRent": 4000,
  "depositAmount": 4000,
  "contactName": "Mary Agent",
  "contactPhone": "0711222333",
  "whatsappPhone": "0711222333",
  "contactRole": "agent",
  "county": "Machakos",
  "town": "Athi River",
  "estate": "Devki Area",
  "landmark": "Near Devki gate",
  "amenities": ["Shared Bathroom", "Fresh Water"],
  "coverPhotoUrl": "https://images.unsplash.com/photo-1502672260266-1c1e52416451?auto=format&fit=crop&w=800&q=80",
  "photoUrls": ["https://images.unsplash.com/photo-1502672260266-1c1e52416451?auto=format&fit=crop&w=800&q=80"],
  "agentFee": 1000,
  "viewingFee": 500,
  "verificationLevel": "phone",
  "moderationStatus": "approved",
  "availabilityStatus": "available",
  "isAvailable": true,
  "isFeatured": true,
  "viewsCount": 40,
  "callClicksCount": 5,
  "whatsappClicksCount": 2,
  "reportCount": 0,
  "createdAt": "2023-11-05T10:00:00Z",
  "updatedAt": "2023-11-05T10:00:00Z"
}
```

## Sample Listing 3: 1 Bedroom in Kitengela

```json
{
  "ownerId": "test-owner-3",
  "title": "Spacious 1 Bedroom Master En-suite",
  "description": "Brand new 1 bedroom house with parking and excellent finishing.",
  "houseType": "one_bedroom",
  "monthlyRent": 15000,
  "depositAmount": 15000,
  "contactName": "Peter Landlord",
  "contactPhone": "0722333444",
  "whatsappPhone": "0722333444",
  "contactRole": "landlord",
  "county": "Kajiado",
  "town": "Kitengela",
  "estate": "Balozi",
  "landmark": "Near Balozi road",
  "amenities": ["Parking", "Master En-suite", "Balcony", "Borehole"],
  "coverPhotoUrl": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80",
  "photoUrls": ["https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80"],
  "agentFee": 0,
  "viewingFee": 0,
  "verificationLevel": "location",
  "moderationStatus": "approved",
  "availabilityStatus": "available",
  "isAvailable": true,
  "isFeatured": false,
  "viewsCount": 105,
  "callClicksCount": 12,
  "whatsappClicksCount": 8,
  "reportCount": 0,
  "createdAt": "2023-11-10T10:00:00Z",
  "updatedAt": "2023-11-10T10:00:00Z"
}
```

## Note on Saved Listings
Saved listing documents (`users/{userId}/savedListings/{listingId}`) are created automatically when a signed-in user toggles the save button. You do not need to manually create these documents unless testing edge cases. They denormalize key listing data so the complete listing isn't required just to render the Saved page.

## Note on Post Vacancy Drafts
Post Vacancy creates listing documents with `moderationStatus = "pending_review"` when submitted. These are not visible in public search.
To make a listing public during test mode, you must manually update the document to set:
- `moderationStatus = "approved"`
- `availabilityStatus = "available"`
- `isAvailable = true`

## Note on Images
Firebase Storage uploads are not connected in version 3.8.0. `coverPhotoUrl` and `photoUrls` should use external URLs (like Unsplash placeholders) or images from existing sample data.

## Missing Features
- Post Vacancy functionality does not create records yet.
- Support Reports do not write records.
- Counter increments (views, contacts) do not update records yet.
