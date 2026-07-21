import { ProfileUser } from '../types/profile';

export interface ExtendedProfileUser extends ProfileUser {
  isRecentlyUpdated?: boolean;
}

export interface ProfileStatItem {
  label: string;
  value: number;
  type: "saved" | "viewed" | "inquiries" | "posted";
}

export const sampleProfileUser: ExtendedProfileUser = {
  id: 'usr-001',
  fullName: 'Amina Njeri',
  role: 'renter',
  phone: '+254 712 345 678',
  email: 'amina.njeri@example.com',
  location: 'Athi River, Machakos',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  isPhoneVerified: true,
  isLocationChecked: true,
  isScoutVerified: false,
  isRecentlyUpdated: true,
  joinedAt: 'May 2024'
};

export const profileStats: ProfileStatItem[] = [
  { label: "Saved Homes", value: 12, type: "saved" },
  { label: "Viewed Homes", value: 36, type: "viewed" },
  { label: "Inquiries", value: 8, type: "inquiries" },
  { label: "Posted Listings", value: 2, type: "posted" },
];

export interface InteractedListing {
  id: string;
  title: string;
  location: string;
  rent: string;
  statusBadge: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface RecentActivityItem {
  id: string;
  type: "saved" | "viewed" | "contacted";
  title: string;
  subtitle: string;
  time: string;
  imageUrl: string;
}

export const interactedListings: InteractedListing[] = [
  {
    id: "int-001",
    title: "Spacious Bedsitter",
    location: "Syokimau, Gateway Mall",
    rent: "KSh 8,000",
    statusBadge: "Viewed today",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=350&q=80",
    isFeatured: true
  },
  {
    id: "int-002",
    title: "1 Bedroom Apartment",
    location: "Rongai, Rimpa",
    rent: "KSh 12,500",
    statusBadge: "Viewed yesterday",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=350&q=80",
    isFeatured: false
  }
];

export const recentActivities: RecentActivityItem[] = [
  {
    id: "act-001",
    type: "saved",
    title: "Saved a bedsitter in Syokimau",
    subtitle: "Spacious Bedsitter — Syokimau",
    time: "Today · 10:32 AM",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "act-002",
    type: "viewed",
    title: "Viewed a single room in Athi River",
    subtitle: "Single Room — Athi River",
    time: "Yesterday · 4:15 PM",
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "act-003",
    type: "contacted",
    title: "Contacted caretaker in Rongai",
    subtitle: "Bedsitter — Rongai",
    time: "2 days ago · 9:08 AM",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80"
  }
];

export interface ProfileAction {
  id: string;
  title: string;
  description: string;
  iconName: string;
  type: "normal" | "danger";
  feedbackMessage: string;
  category: "account" | "support";
}

export const profileActions: ProfileAction[] = [
  {
    id: "personal-details",
    title: "Personal Details",
    description: "Manage your name, phone, and email",
    iconName: "User",
    type: "normal",
    feedbackMessage: "Profile editing coming soon.",
    category: "account"
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Search alerts and saved-home updates",
    iconName: "Bell",
    type: "normal",
    feedbackMessage: "Notification settings coming soon.",
    category: "account"
  },
  {
    id: "preferred-locations",
    title: "Preferred Locations",
    description: "Areas you search often",
    iconName: "MapPin",
    type: "normal",
    feedbackMessage: "Preferred locations coming soon.",
    category: "account"
  },
  {
    id: "budget-range",
    title: "Budget Range",
    description: "Your rent and deposit range",
    iconName: "Wallet",
    type: "normal",
    feedbackMessage: "Budget settings coming soon.",
    category: "account"
  },
  {
    id: "house-types",
    title: "House Types",
    description: "Single room, bedsitter, 1 bedroom",
    iconName: "Home",
    type: "normal",
    feedbackMessage: "House type preferences coming soon.",
    category: "account"
  },
  {
    id: "verification",
    title: "Verification",
    description: "Phone, location, and profile checks",
    iconName: "ShieldCheck",
    type: "normal",
    feedbackMessage: "Verification center coming soon.",
    category: "account"
  },
  {
    id: "help-center",
    title: "Help Center",
    description: "FAQs and support",
    iconName: "HelpCircle",
    type: "normal",
    feedbackMessage: "Help center coming soon.",
    category: "support"
  },
  {
    id: "about-page",
    title: "About KejaFinder",
    description: "Our mission, story & local roadmap",
    iconName: "HelpCircle",
    type: "normal",
    feedbackMessage: "Opening about page...",
    category: "support"
  },
  {
    id: "language",
    title: "Language",
    description: "English",
    iconName: "Globe",
    type: "normal",
    feedbackMessage: "Language settings coming soon.",
    category: "support"
  },
  {
    id: "logout",
    title: "Log Out",
    description: "Sign out of your account",
    iconName: "LogOut",
    type: "danger",
    feedbackMessage: "Log out action is disabled in this prototype.",
    category: "support"
  }
];

export interface TrustCheckItem {
  id: string;
  title: string;
  description: string;
  status: string;
  iconName: string;
  state: "completed" | "pending" | "optional";
}

export interface TrustStatusSchema {
  completion: number;
  badges: string[];
  checks: TrustCheckItem[];
}

export const profileTrustStatus: TrustStatusSchema = {
  completion: 75,
  badges: ["Phone Verified", "Location Checked", "Email Added"],
  checks: [
    {
      id: "phone",
      title: "Phone Verified",
      description: "Your phone number has been confirmed.",
      status: "Verified",
      iconName: "Phone",
      state: "completed"
    },
    {
      id: "location",
      title: "Location Checked",
      description: "Your main area has been reviewed.",
      status: "Checked",
      iconName: "MapPin",
      state: "completed"
    },
    {
      id: "email",
      title: "Email Added",
      description: "Your email is linked to this profile.",
      status: "Added",
      iconName: "Mail",
      state: "completed"
    },
    {
      id: "id-check",
      title: "ID Verification",
      description: "ID checks will be available later.",
      status: "Not started",
      iconName: "BadgeCheck",
      state: "pending"
    },
    {
      id: "scout-check",
      title: "Scout Verification",
      description: "For caretakers, agents, and landlords posting listings.",
      status: "Available for posters",
      iconName: "UserCheck",
      state: "optional"
    }
  ]
};


