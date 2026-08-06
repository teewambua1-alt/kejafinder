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
