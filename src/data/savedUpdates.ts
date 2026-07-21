export type SavedUpdateType =
  | "price_drop"
  | "recently_updated"
  | "verification"
  | "availability"
  | "reminder";

export interface SavedUpdate {
  id: string;
  listingId: string;
  type: SavedUpdateType;
  title: string;
  message: string;
  location: string;
  timeAgo: string;
  isRead: boolean;
}

export const initialSavedUpdates: SavedUpdate[] = [
  {
    id: "update-1",
    listingId: "saved-1",
    type: "price_drop",
    title: "Price dropped",
    message: "Spacious Bedsitter dropped from KSh 9,000 to KSh 8,500.",
    location: "Syokimau, Gateway Mall Area",
    timeAgo: "2 hours ago",
    isRead: false
  },
  {
    id: "update-2",
    listingId: "saved-2",
    type: "recently_updated",
    title: "Listing updated",
    message: "Cozy 1 Bedroom was updated recently. Confirm availability before visiting.",
    location: "Rongai, Rimpa",
    timeAgo: "Today",
    isRead: false
  },
  {
    id: "update-3",
    listingId: "saved-3",
    type: "verification",
    title: "Scout verification added",
    message: "Spacious 2 Bedroom now has a Scout Verified badge.",
    location: "Kitengela, Acacia",
    timeAgo: "Yesterday",
    isRead: false
  },
  {
    id: "update-4",
    listingId: "saved-4",
    type: "availability",
    title: "Check availability",
    message: "Single Room Near Stage has not been updated recently. Ask if it is still available.",
    location: "Athi River, Kwa Chief",
    timeAgo: "2 days ago",
    isRead: true
  },
  {
    id: "update-5",
    listingId: "saved-5",
    type: "reminder",
    title: "Visit reminder",
    message: "You saved Studio in Rongai. Call or WhatsApp before going to view.",
    location: "Rongai, Rimpa",
    timeAgo: "3 days ago",
    isRead: true
  }
];
