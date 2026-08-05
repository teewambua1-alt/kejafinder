export type TestStatus = "working" | "needs_fix" | "missing" | "prototype_only" | "review";

export type TestItem = {
  id: string;
  title: string;
  description: string;
  status: TestStatus;
  area: "core" | "tenant" | "poster" | "trust" | "support" | "performance" | "ux";
  actionLabel?: string;
  actionKey?: string;
};

export const initialTestItems: TestItem[] = [
  // Core pages
  { id: "c1", title: "Homepage loads", description: "Main landing page renders with featured and fresh vacancies.", status: "working", area: "core", actionLabel: "Go Home", actionKey: "home" },
  { id: "c2", title: "Search page opens", description: "Search UI opens with map and list toggles.", status: "working", area: "core", actionLabel: "Go Search", actionKey: "search" },
  { id: "c3", title: "Listing details opens from cards", description: "Clicking a listing navigates to the details view.", status: "working", area: "core", actionLabel: "View Home", actionKey: "home" },
  { id: "c4", title: "Post vacancy page opens", description: "Multi-step form for creating new listings.", status: "working", area: "core", actionLabel: "Go Post", actionKey: "post" },
  { id: "c5", title: "Saved page opens", description: "Saved listings view works visually.", status: "working", area: "core", actionLabel: "Go Saved", actionKey: "saved" },
  { id: "c6", title: "Profile page opens", description: "Main profile hub opens.", status: "working", area: "core", actionLabel: "Go Profile", actionKey: "profile" },
  { id: "c7", title: "Notifications page opens", description: "Notifications feed is visible.", status: "working", area: "core", actionLabel: "Go Profile", actionKey: "profile" },
  { id: "c8", title: "Auth page opens", description: "Mock login/signup flows are accessible.", status: "working", area: "core", actionLabel: "Go Auth", actionKey: "auth" },
  { id: "c9", title: "Safety page opens", description: "Safety and scam tips are readable.", status: "working", area: "core", actionLabel: "Go Safety", actionKey: "safety" },
  { id: "c10", title: "About page opens", description: "Platform mission and mechanics visible.", status: "working", area: "core", actionLabel: "Go About", actionKey: "about" },
  { id: "c11", title: "Contact/Support page opens", description: "Support channels and mock form work.", status: "working", area: "core", actionLabel: "Go Support", actionKey: "support" },
  { id: "c12", title: "Landlord dashboard opens", description: "Mockup of landlord management view.", status: "working", area: "core", actionLabel: "Go Dashboard", actionKey: "landlord-dashboard" },

  // Tenant journey
  { id: "t1", title: "Search by location", description: "Location search visually functions in prototype.", status: "prototype_only", area: "tenant", actionLabel: "Go Search", actionKey: "search" },
  { id: "t2", title: "Filter by category/type", description: "Pills and bottom sheet filter UI working.", status: "working", area: "tenant", actionLabel: "Go Search", actionKey: "search" },
  { id: "t3", title: "Open listing details", description: "Details view structured correctly.", status: "working", area: "tenant", actionLabel: "Go Home", actionKey: "home" },
  { id: "t4", title: "View rent and deposit", description: "Pricing is visible and broken down.", status: "working", area: "tenant" },
  { id: "t5", title: "Tap Call", description: "Call intent triggers feedback.", status: "prototype_only", area: "tenant" },
  { id: "t6", title: "Tap WhatsApp", description: "WhatsApp intent triggers feedback.", status: "prototype_only", area: "tenant" },
  { id: "t7", title: "Save listing", description: "Favicon toggles locally.", status: "working", area: "tenant" },
  { id: "t8", title: "Report listing mockup", description: "Report modal opens.", status: "working", area: "tenant" },
  { id: "t9", title: "Similar homes open locally", description: "Scrollable suggestions below details.", status: "working", area: "tenant" },

  // Poster journey
  { id: "p1", title: "Post vacancy step form opens", description: "Multi-step flow is accessible.", status: "working", area: "poster", actionLabel: "Go Post", actionKey: "post" },
  { id: "p2", title: "House details entered", description: "Form fields allow text input.", status: "working", area: "poster" },
  { id: "p3", title: "Location entered", description: "Area input with mock map.", status: "working", area: "poster" },
  { id: "p4", title: "Amenities selected", description: "Toggles for amenities work.", status: "working", area: "poster" },
  { id: "p5", title: "Photos mock upload works locally", description: "Placeholders can be added.", status: "prototype_only", area: "poster" },
  { id: "p6", title: "Contact details entered", description: "Phone and email fields editable.", status: "working", area: "poster" },
  { id: "p7", title: "Review step appears", description: "Summary before posting.", status: "working", area: "poster" },
  { id: "p8", title: "Post Vacancy writes to Supabase", description: "Saves draft and pending_review listings for signed-in poster roles.", status: "working", area: "poster" },

  // Trust and safety
  { id: "ts1", title: "Safety warning appears in key flows", description: "Warnings visible before contacting or posting.", status: "working", area: "trust" },
  { id: "ts2", title: "Report listing is prototype-only", description: "Local feedback only.", status: "prototype_only", area: "trust" },
  { id: "ts3", title: "Trust badges are visible", description: "Verified badges populate mock data.", status: "working", area: "trust" },
  { id: "ts4", title: "“Is this still available?” is local only", description: "Message prompt functionality.", status: "prototype_only", area: "trust" },
  { id: "ts5", title: "Support issue form is local only", description: "Submit feedback locally.", status: "prototype_only", area: "trust" },
  { id: "ts6", title: "No payment/M-Pesa is active", description: "Safe from real money transaction.", status: "working", area: "trust" },

  // Prototype-only systems
  { id: "pr1", title: "Auth uses Supabase Auth", description: "Email/password Supabase Auth is active; signup requires email confirmation.", status: "working", area: "support", actionLabel: "Go Auth", actionKey: "auth" },
  { id: "pr2", title: "OTP is bypassed", description: "Phone verification is skipped or bypassed in test mode.", status: "prototype_only", area: "support" },
  { id: "pr3", title: "Dashboard is mock only", description: "Landlord dashboard has no real stats.", status: "prototype_only", area: "support" },
  { id: "pr4", title: "Support is mock only", description: "No real tickets created.", status: "prototype_only", area: "support" },
  { id: "pr5", title: "Supabase listing reads are integrated", description: "Home, Search, and Listing Details load approved listings from Supabase.", status: "working", area: "support" },
  { id: "pr6", title: "Saved listings persistence", description: "Saved homes persist to Supabase for signed-in users.", status: "working", area: "support" },
  { id: "pr7", title: "Storage uploads", description: "Listing photos upload to Supabase Storage; sync to public bucket happens on admin approval.", status: "working", area: "support" },
  { id: "pr8", title: "Admin approval missing", description: "Listings must be manually approved via Supabase (no admin UI yet).", status: "missing", area: "support" },

  // UX and performance
  { id: "ux1", title: "Mobile bottom nav works", description: "Tab switching functions properly.", status: "working", area: "ux" },
  { id: "ux2", title: "No horizontal overflow on main pages", description: "Pages stay within 100vw.", status: "review", area: "ux" },
  { id: "ux3", title: "Buttons are large enough", description: "Tap targets meet minimum size.", status: "working", area: "ux" },
  { id: "ux4", title: "Build passes", description: "No typescript or lint errors.", status: "working", area: "performance" },
  { id: "ux5", title: "Bundle size reviewed and page-level code splitting added", description: "Large prototype pages now lazy-load where safe. Continue monitoring bundle size before backend/MVP.", status: "review", area: "performance" }
];
