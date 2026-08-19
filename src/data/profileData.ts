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
    id: "logout",
    title: "Log Out",
    description: "Sign out of your account",
    iconName: "LogOut",
    type: "danger",
    feedbackMessage: "Log out action is disabled in this prototype.",
    category: "support"
  }
];
