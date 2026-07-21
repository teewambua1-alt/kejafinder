export type NotificationCategory =
  | "saved"
  | "message"
  | "safety"
  | "availability"
  | "price"
  | "verification"
  | "support";

export type NotificationActionType =
  | "view_listing"
  | "open_message"
  | "view_match"
  | "read_more"
  | "learn_safety"
  | "none";

export type KejaNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timeAgo: string;
  group: "today" | "earlier";
  isRead: boolean;
  actionLabel?: string;
  actionType?: NotificationActionType;
  imageUrl?: string;
  listingTitle?: string;
  location?: string;
  isImportant?: boolean;
};
