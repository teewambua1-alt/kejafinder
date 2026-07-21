export const COLLECTIONS = {
  USERS: 'users',
  LISTINGS: 'listings',
  LISTING_REPORTS: 'listingReports',
  CONTACT_EVENTS: 'contactEvents',
  AVAILABILITY_CHECKS: 'availabilityChecks',
  VERIFICATION_REQUESTS: 'verificationRequests',
  ADMIN_ACTIONS: 'adminActions',
  NOTIFICATIONS: 'notifications',
};

export const userDocPath = (userId: string) => `${COLLECTIONS.USERS}/${userId}`;
export const listingDocPath = (listingId: string) => `${COLLECTIONS.LISTINGS}/${listingId}`;
export const listingPhotosPath = (listingId: string) => `${COLLECTIONS.LISTINGS}/${listingId}/photos`;
export const userSavedListingsPath = (userId: string) => `${COLLECTIONS.USERS}/${userId}/savedListings`;
export const savedListingDocPath = (userId: string, listingId: string) => `${COLLECTIONS.USERS}/${userId}/savedListings/${listingId}`;
