# Firebase Local Setup

## Purpose
This document provides instructions on how to set up Firebase for local emulator testing.

## Current Status
Firebase Auth is **connected** to app flows in Test Mode (version 3.6.0). 
The app is currently supporting Email/Password authentication. Phone verification is bypassed/skipped.
Firestore listing reads are **connected** for Home, Search, and Listing Details (version 3.7.0). The app uses a local sample data fallback when Firebase is not configured or no listings are found.
Storage and other database interactions (writes, saved, reports) are still **not connected** to main app UI flows yet.

## Next Stages
The next stage is to implement Post Vacancy writes, Saved Listings persistence, and user feedback reports to Firestore. Production deployment is not part of this version.

## Testing Firestore Listing Reads
1. Configure Firebase env variables as shown above.
2. Enable Firestore in your Firebase console.
3. Add seed listings manually in the Firestore console. See `docs/FIRESTORE_SEED_LISTINGS.md` for JSON samples.
4. Essential listing fields for it to appear:
  - `moderationStatus`: `"approved"`
  - `availabilityStatus`: `"available"`
  - `isAvailable`: `true`
5. Run the app (`npm run dev`) and check the Home or Search page. Your Firestore listings should replace the sample fallback.
*Note: If no Firestore data exists or there is an error, the app gracefully falls back to local sample listings.*

## Testing saved listings persistence
1. Configure Firebase.
2. Enable Email/Password Auth.
3. Create/login test user.
4. Ensure Firestore rules are loaded or permissive only in emulator/test.
5. Open Search.
6. Save a listing.
7. Open Saved page.
8. Confirm saved listing appears.
9. Refresh page.
10. Confirm saved listing remains.
11. Unsave listing.
12. Confirm document is removed from: `users/{userId}/savedListings/{listingId}`

## Testing Post Vacancy Firestore drafts
1. Configure Firebase.
2. Sign up and log in as landlord/caretaker/agent/scout.
3. Open Post Vacancy.
4. Complete the form.
5. Set `moderationStatus` (wait, just tap Save Draft).
6. Tap Save Draft.
7. Confirm Firestore document exists in `listings`.
8. Submit for review.
9. Confirm `moderationStatus` is `pending_review`.
10. Confirm `isAvailable` is `false`.
11. Confirm listing does not appear in Search until approved manually.

## Required Environment Variables
To connect to a Firebase project (even locally or for the emulator if you want to mirror live project configs), you need to set up the environment block:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## How to Set Up
1. **Create Firebase Project**: Create a new project in the standard Firebase console.
2. **Enable Services**:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
3. **Copy Config**: Copy the web application config from the Firebase console and put the keys in `.env.local` based on `.env.example`.
4. **Install and Run**:
   ```bash
   npm install
   npm run dev
   ```
5. **Run Emulators (Optional but Recommended)**:
   Ensure `firebase-tools` is installed globally: `npm install -g firebase-tools`
   ```bash
   npm run firebase:emulators
   ```

## Emulator Notes
- The provided `firebase.json` specifies emulator ports (auth 9099, firestore 8080, storage 9199, hosting 5000, ui 4000).
- Remember to thoroughly test Firestore and Storage rules before connecting them directly to the main front-end UI flows.
