import { KejaNotification } from '../types/notifications';

export const sampleNotifications: KejaNotification[] = [
  {
    id: "notif-1",
    category: "price",
    title: "Price dropped on saved home",
    message: "Spacious Bedsitter in Syokimau is now KSh 8,000/month, down from KSh 9,000.",
    timeAgo: "10:24 AM",
    group: "today",
    isRead: false,
    actionLabel: "View",
    actionType: "view_listing",
    listingTitle: "Spacious Bedsitter",
    location: "Syokimau, Gateway Mall",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "notif-2",
    category: "saved",
    title: "Listing recently updated",
    message: "1 Bedroom in Kitengela has new photos and an updated description.",
    timeAgo: "9:12 AM",
    group: "today",
    isRead: false,
    actionLabel: "View",
    actionType: "view_listing",
    listingTitle: "1 Bedroom in Kitengela",
    location: "Kitengela, Near Milele Center",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "notif-3",
    category: "message",
    title: "Caretaker replied on WhatsApp",
    message: "Peter replied to your inquiry about Bedsitter in Rongai.",
    timeAgo: "8:05 AM",
    group: "today",
    isRead: false,
    actionLabel: "Open",
    actionType: "open_message",
    listingTitle: "Bedsitter in Rongai"
  },
  {
    id: "notif-4",
    category: "verification",
    title: "Scout verification completed",
    message: "Bedsitter in Ruaka has been marked Scout Verified.",
    timeAgo: "7:18 AM",
    group: "today",
    isRead: false,
    actionLabel: "View",
    actionType: "view_listing",
    listingTitle: "Bedsitter in Ruaka",
    location: "Ruaka, Bypass Junction"
  },
  {
    id: "notif-5",
    category: "safety",
    title: "Safety reminder",
    message: "Never pay a deposit before physically viewing the house and confirming the caretaker.",
    timeAgo: "7:00 AM",
    group: "today",
    isRead: true,
    actionLabel: "Learn more",
    actionType: "learn_safety",
    isImportant: true
  },
  {
    id: "notif-6",
    category: "saved",
    title: "Added to your saved homes",
    message: "You saved Studio in South B, Nairobi.",
    timeAgo: "Yesterday, 6:45 PM",
    group: "earlier",
    isRead: true,
    actionLabel: "View",
    actionType: "view_listing",
    listingTitle: "Studio in South B",
    location: "South B, near Plainsview",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "notif-7",
    category: "support",
    title: "Message from KejaFinder",
    message: "New homes matching your preferences are ready to view.",
    timeAgo: "Yesterday, 5:30 PM",
    group: "earlier",
    isRead: true,
    actionLabel: "View",
    actionType: "read_more"
  },
  {
    id: "notif-8",
    category: "availability",
    title: "Saved property is still available",
    message: "Your saved 1 Bedroom in Kitengela is still available.",
    timeAgo: "Yesterday, 4:20 PM",
    group: "earlier",
    isRead: false,
    actionLabel: "View property",
    actionType: "view_listing",
    listingTitle: "1 Bedroom in Kitengela",
    location: "Kitengela, Near Milele Center",
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=150"
  }
];
