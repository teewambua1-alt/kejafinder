# Changelog

All notable changes to this project will be documented in this file.

## [3.9.0] - current date
### Added
- Firestore draft listing creation for Post Vacancy.
- Submit-for-review flow that sets listings to pending_review.
- usePostListingDraft hook.
- Post listing service for creating, updating, and submitting listing drafts.
- Mapping from Post Vacancy form data to Firebase listing documents.
- Signed-out and role-based posting guards.
- Test Mode updates for Firestore posting status.
- Firebase setup documentation for testing Post Vacancy drafts.

### Changed
- Post Vacancy can now save listing details to Firestore for signed-in poster roles.
- Submitted listings remain hidden from public search until approved.
- Post Vacancy copy now clarifies that photo upload remains local/prototype-only.

### Notes
- Firebase Storage upload is not connected yet.
- Admin approval is not connected yet.
- Pending listings are not public.
- Reports, Contact Events, Dashboard backend, payments, analytics, Cloud Functions, and routing remain prototype-only/local.
- Form data should not be lost if Firestore write fails.

## [3.8.0] - current date
### Added
- Saved listings persistence explicitly to Firebase.
- `useSavedListings` hook to manage Firestore save states and local fallbacks safely.
- Saved Listings UI updates handling signed-in vs signed-out states.
- Firebase integration instructions for Saved Listings persistence in local test environment.
- Test Mode checklist updates for Saved listings persistence.

### Changed
- Local fallback is preserved natively for all unconfigured app states.
- Re-architected all instances of save functionality (`ListingCard`, `SearchResultCard`, `ListingImageGallery`, `SimilarHomeCard`, `FeaturedListing`, `ListingDetailsHeader`, `SavedPage`) to route through `useSavedListings`.
- Signed-out users are actively guided to log in if attempting to access cloud-persistent saves.

### Notes
- Firebase connection is strictly limited to Auth and Saved Listings.
- Post Vacancy, Reports, Contact trackers, and Dashboard features remain prototype-only.

## [3.7.0] - current date
### Added
- Read-only Firestore listings integration.
- Listing service for approved and available Firestore listings.
- Hooks for Firestore listing lists and listing details with local fallback.
- Firebase-to-prototype listing mapper.
- Firestore seed listings documentation.
- Test Mode updates for Firestore listing read status.

### Changed
- Home, Search, and Listing Details can now use Firestore listings when Firebase is configured.
- Local sample listings remain as fallback when Firebase is missing, empty, or unavailable.
- Firebase local setup docs now explain how to test listing reads.

### Notes
- Firestore integration is read-only in this version.
- Post Vacancy writes, Saved Listings persistence, Reports, Contact Events, Dashboard data, photo uploads, payments, analytics, Cloud Functions, and routing remain prototype-only/local.
- Listing views and contact click counters are not incremented yet.

## [3.6.0] - current date
### Added
- Firebase Authentication test integration.
- `AuthContext` to manage Firebase user state.
- Firebase Auth initialization in `src/main.tsx`.
- Refactored `AuthPhoneLoginForm` to use email/password sign-in.
- Refactored `AuthSignupBasicsForm` to collect password.
- Connected `AuthRoleSelection` to Firebase sign-up flow.
- Profile page handles conditional rendering of Auth Prompt vs Real Profile based on Firebase auth state.
- Update Profile action list to handle live prototype log-out.

### Changed
- Converted mock authentication layer to use live Firebase Email/Password auth in Test Mode.
- Phone fields are retained as profile metadata but no longer drive the active auth system.
- Test Mode prototype reporting now indicates Firebase Auth is active.
- `FIREBASE_LOCAL_SETUP.md` updated to reflect Auth is connected.

### Notes
- Firebase Email/Password auth is safe to use in frontend.
- Phone Auth, real SMS, and OTP are disabled.
- Firestore reads/writes, Storage uploads, persistence, payments, analytics, routing, and Cloud Functions are NOT connected.
- Current app continues using local state and sample data for listings, search, and dashboard.
- If Firebase env variables are missing, Auth page operates in a fallback mock state gracefully.

## [3.5.0] - current date
### Added
- Firebase setup and environment preparation.
- Safe Firebase client initializer with guarded configuration.
- Firebase collection path constants.
- Backend-ready Firebase TypeScript document types.
- Environment example for Firebase config.
- Firebase emulator-ready configuration.
- Firestore and Storage rules baselines.
- Firebase local setup documentation.

### Changed
- README now explains Firebase setup status and local configuration.
- Test Mode now reports Firebase setup as prepared but not connected to app flows.

### Notes
- Firebase remains dormant in the active prototype.
- No real Auth, Firestore reads/writes, Storage uploads, persistence, payments, analytics, routing, or Cloud Functions were added.
- Current app continues using local state and sample data.
- Next recommended stage is Firebase Auth test integration.

## [3.4.0] - current date
### Added
- Firebase backend planning documents.
- Firestore schema draft.
- Firebase Security Rules and Storage rules planning.
- Firebase data flow and implementation phase plan.

### Changed
- Backend direction updated to Firebase-first for the test backend stage.
- Removed active Firestore startup test from app entrypoint.
- README now references Firebase backend direction.
- Test Mode recommendations now point to Firebase setup and environment preparation.
- Supabase docs retained as future migration/reference material.

### Notes
- Firebase SDK files may exist, but Firebase is not connected to live app flows yet.
- No real Auth, Firestore reads/writes, Storage uploads, payments, persistence, analytics, or routing were added.
- Current app remains a local high-fidelity prototype.

## [3.3.0] - current date
### Added
- MVP backend architecture planning documents.
- Draft PostgreSQL/Supabase schema plan.
- Supabase RLS and role-based access plan.
- API and data flow plan for tenant search, posting, dashboard, admin moderation, reports, contact tracking, and listing freshness.
- Phased MVP backend rollout plan.

### Changed
- README now references backend planning documents.
- Test Mode recommendations can now point to backend schema implementation as the next technical stage.

### Notes
- This version is planning-only.
- No backend, Supabase client, authentication, storage upload, database query, persistence, payment, analytics, or routing implementation was added.
- Current app remains a local high-fidelity prototype.

## [3.2.0] - 2026-06-07
### Added
- Lightweight KejaFinder loading fallback for lazy-loaded pages.
- Page-level code splitting for larger prototype pages.
- Updated Test Mode performance checklist and issue board recommendations.

### Changed
- Refactored large page imports to lazy-load where safe.
- Updated Test Mode report output to mention bundle-size review and lazy loading.
- Kept local navigation behavior intact while reducing initial bundle pressure.

### Fixed
- Addressed the Test Mode QA item for bundle-size review by adding safe lazy loading and performance tracking.

### Notes
- No backend, Supabase, authentication, payments, persistence, analytics, routing, or new major features were added.
- If Vite still reports a chunk-size warning, the issue should remain tracked as “review” in Test Mode.
- Deeper performance optimization can be handled before MVP/backend integration.

## [3.0.0] - 2026-06-07
### Added
- Test Mode and Prototype Audit Dashboard.
- Internal TestModePage with local app health checklist.
- Test Mode summary cards and prototype readiness score.
- Flow checklist for core pages, tenant journey, poster journey, trust/safety, prototype-only systems, and UX/performance.
- Local status toggling for checklist items.
- Issue board for Add Next, Fix/Improve, and Remove/Simplify recommendations.
- AI review report panel that generates a local prototype review summary.
- Quick navigation buttons to major prototype pages.
- Local feedback for Test Mode actions.

### Changed
- App can now display Test Mode through local page state.
- Profile or Settings can open Test Mode from a safe internal entry point.

### Notes
- Test Mode is internal/prototype-only.
- No real automated testing framework, backend diagnostics, AI API, analytics, persistence, authentication, payments, support tickets, admin system, or routing was added.
- The current build may still show a bundle-size warning; code splitting can be handled later.

## [2.4.0] - 2026-06-07
### Added
- Landlord Dashboard mockup foundation.
- Mobile-first LandlordDashboardPage shell.
- LandlordDashboardHeader with back navigation.
- Mock landlord/caretaker profile summary card.
- Placeholder sections for overview stats, my listings management, listing status tabs, tenant inquiries, quick actions, and dashboard trust/safety notices.
- Local navigation support for opening the Landlord Dashboard where safe.
- Prototype dashboard actions for posting a vacancy, viewing public listings, and reading safety tips.
- Dashboard safety reminder.

### Changed
- App can now display a prototype Landlord Dashboard through local page state.
- Existing dashboard entry points can open the Landlord Dashboard where safely connected.

### Notes
- This version only creates the foundation for the Landlord Dashboard mockup.
- No real dashboard stats, listing management, tenant inquiries, edit/delete actions, analytics, authentication, backend, Supabase, payments, M-Pesa, persistence, or routing was added.
- Real dashboard sections will be added in later versions.

## [2.3.0] - 2026-06-06
### Added
- Full Contact/Support Page QA and prototype-matching pass.
- Contact/Support accessibility, responsiveness, animation, and interaction review.

### Changed
- Refined Contact/Support layout, spacing, card hierarchy, form behavior, feedback styling, FAQ behavior, and mobile responsiveness.
- Improved prototype-safe support actions and local feedback behavior.

### Fixed
- Minor Contact/Support overflow, spacing, accessibility, validation, animation, or interaction issues where found.
- Any build or lint issues caused by Contact/Support components.

### Notes
- Version 2.3.0 completes the first full Contact/Support Page prototype pass.
- No real support chat, ticket submission, report submission, email sending, WhatsApp automation, SMS, backend, authentication, payments, persistence, routing, analytics, newsletter signup, or CMS was added.

## [2.2.0] - 2026-06-06
### Added
- Complete Contact/Support Page prototype.
- Mobile-first ContactSupportPage shell and ContactSupportHeader.
- Support hero with quick help actions.
- Support categories for tenants, posters, agents, scouts, safety, and product feedback.
- Report issue support form mockup with local validation.
- Contact channels and response expectations section.
- Safety and scam support block.
- Support FAQ accordion.
- Local prototype feedback for support actions.

### Changed
- App can now display a prototype Contact/Support Page through local page state.
- Existing support entry points can open the Contact/Support Page where safely connected.

### Notes
- Support tools are prototype-only.
- No real support chat, ticket submission, report submission, contact form submission, email sending, WhatsApp automation, SMS, backend, authentication, payments, persistence, routing, analytics, newsletter signup, or CMS was added.

## [2.1.0] - 2026-06-06
### Added
- Final About Page QA and prototype-matching pass.
- Final About Page accessibility, animation, responsiveness, and mobile usability review.

### Changed
- Refined About Page layout, spacing, card hierarchy, feedback styling, chip wrapping, tap targets, and mobile behavior.
- Improved consistency across hero/mission, problem/solution, who-we-serve, how-it-works, trust promise, and launch strategy sections.
- Cleaned About component styling, local interactions, prototype feedback, and accessibility where needed.

### Fixed
- Minor About Page overflow, spacing, accessibility, animation, or interaction issues where found.
- Any build or lint issues caused by About Page components.

### Notes
- Version 2.1.0 completes the first full About Page prototype pass.
- Future roadmap remains a placeholder for later work.
- No backend, authentication, payments, persistence, routing, analytics, newsletter signup, contact form, CMS, support chat, dashboard access, or real area launch tracking was added.
- Next work can begin on Contact/Support Page, Landlord Dashboard mockup, Admin Dashboard mockup, or app-wide QA.

## [2.0.7] - 2026-06-06
### Added
- About Page animation, spacing, responsiveness, and accessibility polish pass.

### Changed
- Refined About Page vertical spacing, card consistency, tap targets, feedback styling, chip wrapping, and mobile responsiveness.
- Improved Framer Motion animation consistency across hero, problem/solution, user groups, how-it-works, trust promise, and launch strategy sections.
- Improved accessibility labels, readable states, and mobile layout where needed.

### Notes
- No new About Page content sections were added.
- Future roadmap remains a placeholder for a later version.
- No backend, authentication, payments, persistence, routing, analytics, newsletter signup, contact form, CMS, or support chat was added.
- About Page is ready for the final QA and prototype-matching pass.

## [2.0.6] - 2026-06-06
### Added
- About Page local launch strategy section.
- Pilot area chips/cards for Athi River, Kitengela, Mlolongo, Rongai, Githurai, Kayole, Pipeline, Umoja, Juja, Thika, and Kasarani.
- First milestone card for collecting 100 real vacant rooms in one focused area.
- Manual validation steps for collecting and testing real local listings.
- Local focus explanation and expansion principle card.
- Prototype actions for searching pilot areas and posting vacancies.

### Changed
- Replaced the About Page local launch strategy placeholder with a real AboutLaunchStrategy component.

### Notes
- Launch strategy content is static/prototype-only.
- No real area launch tracking, listing collection workflow, scout dashboard, admin dashboard, backend, authentication, payments, persistence, routing, analytics, WhatsApp/Facebook sharing, newsletter signup, contact form, CMS, or support chat was added.
- Future roadmap section will be added later.

## [2.0.5] - 2026-06-06
### Added
- About Page trust and safety promise section.
- Main trust promise card.
- Trust principle cards for clear costs, fresh listings, reports, local details, honest badges, and physical viewing.
- Badge promise mini section.
- Deposit-before-viewing safety warning.
- Prototype actions for safety tips and verified-home search.

### Changed
- Replaced the About Page trust and safety promise placeholder with a real AboutTrustPromise component.

### Notes
- Trust promise content is static/prototype-only.
- No real verification workflow, report submission, listing expiry automation, backend filtering, authentication, payments, persistence, routing, analytics, newsletter signup, contact form, CMS, or support chat was added.
- Remaining About sections will be added later.

## [2.0.4] - 2026-06-06
### Added
- About Page “How KejaFinder works” section.
- Tenant journey steps for search, filtering, comparing, contacting, and visiting before payment.
- Landlord/caretaker journey steps for posting, uploading photos, submitting for review, responding, and updating availability.
- Trust actions card explaining saves, availability checks, reports, and badges.
- Search-to-payment safety timeline.
- Prototype actions for trying search and posting a vacancy.

### Changed
- Replaced the About Page “How KejaFinder works” placeholder with a real AboutHowItWorks component.

### Notes
- How-it-works content is static/prototype-only.
- Review, verification, and update flows are described as later MVP behavior where relevant.
- No backend, authentication, payments, persistence, routing, analytics, newsletter signup, contact form, CMS, support chat, real approval workflow, or dashboard permissions were added.
- Remaining About sections will be added later.

## [2.0.3] - 2026-06-06
### Added
- About Page “Who KejaFinder serves” section.
- User group cards for tenants, landlords, caretakers, agents, area scouts, and admins.
- Needs summaries and custom chips for each user group.
- “Built for ordinary renters” emphasis card.
- Trust balance note highlighting simple posting and renter protection.
- Prototype actions for finding a room and posting a vacancy.

### Changed
- Replaced the About Page “Who KejaFinder serves” placeholder with a real AboutWhoWeServe component.

### Notes
- User group content is static/prototype-only.
- Admins are described as later platform operators, not public signup users.
- No backend, authentication, permissions, dashboard access, payments, persistence, routing, analytics, newsletter signup, contact form, CMS, or support chat was added.
- Remaining About sections will be added later.

## [2.0.2] - 2026-06-06
### Added
- About Page problem and solution section.
- Manual house-search problem card documenting manual vacancy struggles.
- KejaFinder online-search solution card illustrating modern workflows.
- Before vs after comparison matrix to highlight the transformation.
- Impact statement explaining why search-first rental discovery matters.
- About safety reminder and prototype actions for search and safety.

### Changed
- Replaced the About Page problem and solution placeholder with a real AboutProblemSolution component.
- Customized local action-navigation triggers inside the About context.

### Notes
- Problem and solution content is static/prototype-only.
- No backend, authentication, payments, persistence, routing, analytics, newsletter signup, contact form, CMS, or support chat was added.
- Remaining About sections will be added later.

## [2.0.1] - 2026-06-06
### Added
- About hero and mission statement section.
- Local rental focus chips for single rooms, bedsitters, mabati houses, studios, student rooms, low-cost rentals, one bedrooms, and small estate rentals.
- Hero value highlights for faster search, local details, and direct contact.
- Prototype actions for searching homes and posting vacancies.
- About trust note with deposit-before-viewing safety reminder.

### Changed
- Replaced the About Page hero and mission placeholder with a real AboutHeroMission component.

### Notes
- About hero content is static/prototype-only.
- No backend, authentication, payments, persistence, routing, analytics, newsletter signup, contact form, CMS, or support chat was added.
- Remaining About sections will be added later.

## [2.0.0] - 2026-06-06
### Added
- About Page foundation.
- Mobile-first AboutPage shell.
- AboutHeader with back navigation.
- Placeholder sections for About hero, problem and solution, who KejaFinder serves, how it works, trust and safety promise, local launch strategy, and future roadmap.
- Local navigation support for opening the About Page where safe.
- Compact mission note explaining KejaFinder is built for ordinary renters and local housing users.

### Changed
- App can now display a prototype About Page through local page state.
- Existing About entry points can open the About Page where safely connected.

### Notes
- This version only creates the foundation for the About Page.
- No backend, authentication, payments, persistence, routing, analytics, newsletter signup, support chat, CMS, or contact form was added.
- Real About Page sections will be added in later versions.

## [1.9.0] - 2026-06-06
### Added
- Final Safety Page QA and prototype-matching pass.
- Final Safety Page accessibility, animation, responsiveness, and mobile usability review.

### Changed
- Refined Safety Page layout, spacing, card hierarchy, warning states, feedback styling, tap targets, and mobile behavior.
- Improved consistency across hero, deposit warning, checklist, trust badges, report guide, payment safety, contact safety, and FAQ sections.
- Cleaned Safety component styling, local interactions, and prototype feedback where needed.

### Fixed
- Minor Safety Page overflow, spacing, accessibility, animation, validation, or interaction issues where found.
- Any build or lint issues caused by Safety Page components.

### Notes
- Version 1.9.0 completes the first full Safety Page prototype pass.
- No real report submission, moderation dashboard, support chat, emergency feature, payment collection, M-Pesa integration, backend, authentication, persistence, routing, SMS, email, or WhatsApp automation was added.
- Next work can begin on About Page, Contact/Support Page, Landlord Dashboard mockup, Admin Dashboard mockup, or app-wide QA.

## [1.8.8] - 2026-06-06
### Added
- Safety Page animation, spacing, responsiveness, and accessibility polish pass.

### Changed
- Refined Safety Page vertical spacing, card consistency, tap targets, warning states, feedback styling, and mobile responsiveness.
- Improved Framer Motion animation consistency across hero, deposit warning, checklist, trust badges, report guide, payment safety, contact safety, and FAQ sections.
- Improved accessibility labels, readable states, and mobile layout where needed.

### Notes
- No new Safety Page content sections were added.
- No real report submission, moderation dashboard, support chat, emergency feature, payment collection, M-Pesa integration, backend, authentication, persistence, routing, SMS, email, or WhatsApp automation was added.
- Safety Page is ready for the 1.9.0 final QA and prototype-matching pass.

## [1.8.7] - 2026-06-06
### Added
- Safety FAQ section for the Safety Page.
- Mobile-first FAQ accordion covering deposits, payment pressure, verification badges, WhatsApp screenshots, agent fees, physical viewing, reporting, recently updated listings, viewing safely, and KejaFinder safety limits.
- Final safety reminder card.
- Prototype support and safer-listing actions.

### Changed
- Replaced the Safety Page FAQ placeholder with a real SafetyFAQ component.

### Notes
- FAQ content is educational and prototype-only.
- No real support chat, ticket submission, report submission, backend filtering, authentication, payments, persistence, routing, SMS, email, or WhatsApp automation was added.

## [1.8.6] - 2026-06-06
### Added
- Call and WhatsApp safety tips section for the Safety Page.
- Safe contact checklist for availability, costs, directions, contact identity, physical viewing, and current photos.
- WhatsApp message templates with local copy actions.
- Suspicious contact warning signs.
- Phone call safety tips.
- Prototype actions for opening a sample listing and reporting suspicious contact.

### Changed
- Replaced the Safety Page call and WhatsApp safety placeholder with a real SafetyContactTips component.

### Notes
- Contact safety content is educational and prototype-only.
- Copy actions are local only.
- No real WhatsApp sending, WhatsApp bot, SMS, email, in-app chat, backend, report submission, authentication, payments, persistence, routing, or contact analytics was added.

## [1.8.5] - 2026-06-06
### Added
- Agent fees and payment safety section for the Safety Page.
- Cost clarity guidance for rent, deposit, water, electricity, agent fees, and viewing fees.
- Safer vs risky payment behavior cards.
- Agent fee transparency guidance.
- M-Pesa safety note.
- Prototype actions for viewing homes with clear fees and reporting hidden fees.

### Changed
- Replaced the Safety Page agent fees and payment safety placeholder with a real SafetyPaymentGuide component.

### Notes
- Payment safety content is educational and prototype-only.
- No real M-Pesa integration, payment collection, wallet, escrow, backend filtering, report submission, authentication, persistence, routing, SMS, email, or WhatsApp automation was added.

## [1.8.4] - 2026-06-06
### Added
- Report listing guide section for the Safety Page.
- Report reason education for already taken homes, fake listings, wrong prices, wrong locations, scam requests, wrong photos, unsafe property, and duplicate listings.
- “What happens after you report?” prototype process card.
- Good report details tips card.
- Prototype report listing action and safety reminder.

### Changed
- Replaced the Safety Page report listing guide placeholder with a real SafetyReportGuide component.

### Notes
- Report guide content is educational and prototype-only.
- No real report submission, moderation dashboard, admin workflow, backend, authentication, payments, persistence, routing, SMS, email, WhatsApp automation, or support chat was added.

## [1.8.3] - 2026-06-06
### Added
- Trust badges explained section for the Safety Page.
- Badge education cards for Phone Verified, Location Checked, Scout Verified, Trusted Landlord, and Recently Updated.
- Badge caution card explaining that badges are not payment guarantees.
- Best signal combination summary.
- Prototype action for searching verified listings.

### Changed
- Replaced the Safety Page trust badges placeholder with a real SafetyTrustBadges component.

### Notes
- Trust badge content is educational and prototype-only.
- No real verification workflow, backend filtering, report submission, support chat, authentication, payments, persistence, routing, SMS, email, or WhatsApp automation was added.

## [1.8.2] - 2026-06-06
### Added
- Before-you-visit safety checklist section.
- Toggleable local checklist items for availability, rent/deposit, directions, contact identity, physical viewing, safe visit timing, and payment safety.
- Checklist completion progress summary and progress bar.
- Critical deposit-before-viewing reminder card.
- Prototype actions for searching verified homes and reporting suspicious listings.

### Changed
- Replaced the Safety Page before-you-visit checklist placeholder with a real SafetyVisitChecklist component.

### Notes
- Checklist state is local/prototype-only and is not persisted.
- Report and search actions are prototype-only where local navigation is not available.
- No backend, authentication, payments, persistence, routing, real report submission, support chat, SMS, email, or WhatsApp automation was added.

## [1.8.1] - 2026-06-06
### Added
- Safety hero section.
- Main deposit safety warning section.
- Safety highlight cards for confirming first, viewing physically, and reporting scams.
- Do/Don’t deposit safety guidance.
- Local prototype feedback for safety actions.

### Changed
- Replaced the Safety Page hero and deposit warning placeholders with real components.

### Notes
- Safety actions are prototype-only.
- No real report submission, support chat, backend, authentication, payments, persistence, routing, SMS, email, WhatsApp automation, or emergency services were added.
- Before-you-visit checklist and remaining safety sections will be added later.

## [1.8.0] - 2026-06-06
### Added
- Safety Page foundation.
- Mobile-first SafetyPage shell.
- SafetyHeader with back navigation.
- Placeholder sections for safety hero, deposit warning, before-you-visit checklist, trust badges, report guide, agent/payment safety, call/WhatsApp safety, and FAQ.
- Local navigation support for opening the Safety Page where safe.
- Compact safety reminder using the deposit-before-viewing warning.

### Changed
- App can now display a prototype Safety Page through local page state.
- Existing safety entry points can open the Safety Page where safely connected.

### Notes
- This version only creates the foundation for the Safety Page.
- No real report submission, support chat, backend, authentication, payments, persistence, routing, SMS, email, WhatsApp automation, or emergency services were added.
- Real Safety Page sections will be added in later versions.

## [1.7.0] - 2026-06-06
### Added
- Final Login/Signup QA and prototype-matching pass.
- Final Auth page accessibility, animation, responsiveness, and mobile usability review.

### Changed
- Refined Auth page layout, spacing, form states, card consistency, tap targets, and mobile behavior.
- Improved visual consistency across welcome choice, phone login, signup basics, role selection, OTP mockup, and trust onboarding.
- Cleaned Auth component styling, local validation, and prototype feedback where needed.

### Fixed
- Minor Auth page overflow, spacing, accessibility, validation, or interaction issues where found.
- Any build or lint issues caused by Auth components.

### Notes
- Version 1.7.0 completes the first full Login/Signup prototype pass.
- No real authentication, account creation, OTP sending, SMS, Supabase, backend, session persistence, protected routes, payments, routing, or real role permissions were added.
- Next work can begin on Safety Page, Contact/Support Page, Landlord Dashboard mockup, Admin Dashboard mockup, or app-wide QA.

## [1.6.7] - 2026-06-06
### Added
- Auth page animation, spacing, responsiveness, and accessibility polish pass.

### Changed
- Refined Auth page vertical spacing, card consistency, tap targets, input states, bottom padding, and mobile responsiveness.
- Improved Framer Motion animation consistency across welcome, phone login, signup basics, role selection, OTP, and trust onboarding sections.
- Improved local feedback, validation visibility, and accessibility labels where needed.

### Notes
- No new auth features were added.
- No real authentication, OTP, SMS, Supabase, backend, session persistence, protected routes, payments, routing, or role permissions were added.
- Auth page is ready for the 1.7.0 final QA and prototype-matching pass.

## [1.6.5] - 2026-06-06
### Added
- OTP verification mockup section.
- 6-digit OTP input with local validation.
- Prototype verification using mock code 123456.
- Resend code and change phone prototype actions.
- Phone verification trust note and deposit safety warning.

### Changed
- Replaced the AuthPage OTP verification placeholder with a real AuthOtpVerification component.

### Notes
- OTP verification is prototype-only.
- No real SMS, Supabase, backend, authentication, session persistence, protected routes, payments, or real routing were added.
- Trust and safety onboarding will be handled in a later version.

## [1.6.4] - 2026-06-06
### Added
- User role selection section for Tenant, Landlord, Caretaker, Agent, and Area Scout.
- Local selected-role state and validation.
- Dynamic role-specific helper notes.
- Poster trust note for landlord, caretaker, agent, and scout roles.
- Role selection safety warning.

### Changed
- Replaced the AuthPage user role selection placeholder with a real AuthRoleSelection component.
- Extended local auth draft data with selected role where needed.

### Notes
- Role selection is prototype-only.
- No real account creation, role permissions, dashboards, verification workflow, OTP, SMS, Supabase, backend, authentication, session persistence, payments, or routing were added.
- OTP verification mockup and trust onboarding will be handled in later versions.

## [1.6.3] - 2026-06-06
### Added
- Signup profile basics form for full name, phone number, optional email, and main area.
- Local validation for signup fields.
- Kenyan phone normalization reuse for signup phone numbers.
- Prototype Continue action for saving signup basics locally.
- “Why we ask” note and deposit safety warning.

### Changed
- Replaced the AuthPage signup basics placeholder with a real AuthSignupBasicsForm component.
- Extended local auth draft data with main area where needed.

### Notes
- Signup basics are prototype-only.
- No real account creation, OTP, SMS, Supabase, backend, authentication, session persistence, protected routes, payments, or real routing were added.
- Role selection and OTP mockup will be handled in later versions.

## [1.6.2] - 2026-06-06
### Added
- Phone login form for the Auth page.
- Kenyan phone number input with local validation and normalization.
- Prototype “Send login code” action.
- Secondary actions for creating an account and browsing as guest.
- Auth trust note and deposit safety warning.

### Changed
- Replaced the AuthPage phone login placeholder with a real AuthPhoneLoginForm component.

### Notes
- Phone login is prototype-only.
- No real SMS, OTP verification, Supabase, backend, authentication, session persistence, protected routes, payments, or real routing were added.
- OTP mockup will be handled in a later version.

## [1.6.1] - 2026-06-06
### Added
- Auth welcome and choice screen.
- Primary actions for continuing with phone, creating an account, browsing as guest, and posting a vacancy.
- Trust/benefit highlights for saved homes, caretaker contact, posting vacancies, and safety reminders.
- Role-aware teaser for tenants, landlords, caretakers, agents, and area scouts.
- Auth safety note with deposit-before-viewing reminder.
- Local prototype feedback for auth choice actions.

### Changed
- Replaced the AuthPage welcome/auth choice placeholder with a real AuthWelcomeChoice component.

### Notes
- Auth actions are prototype-only.
- No real login, signup, OTP, Supabase, backend, session persistence, protected routes, payments, or real routing were added.
- Phone login and signup sections will be added in later versions.

## [1.6.0] - 2026-06-06
### Added
- Login/Signup Page foundation.
- Mobile-first AuthPage shell.
- AuthHeader with back navigation.
- Placeholder sections for welcome/auth choice, phone login, signup basics, role selection, OTP verification, and trust onboarding.
- Local navigation support for opening the auth page where safe.

### Changed
- App can now display a prototype auth page through local page state.

### Notes
- This version only creates the foundation for Login/Signup.
- No real authentication, OTP, backend, Supabase, protected routes, payments, persistence, or real routing were added.
- Real auth UI sections will be added in later versions.

## [1.5.0] - 2026-06-05
### Added
- Final Listing Details Page QA and prototype-matching pass.
- Final Listing Details accessibility, animation, responsiveness, and mobile usability review.

### Changed
- Refined Listing Details layout, spacing, card consistency, bottom padding, and mobile behavior.
- Improved visual consistency across gallery, title, pricing, location, amenities, contact, trust/safety, report panel, and similar homes.
- Cleaned Listing Details component styling and local interactions where needed.
- Improved nested button handling for save, WhatsApp, report, and similar listing actions.

### Fixed
- Minor Listing Details overflow, spacing, accessibility, or interaction issues where found.
- Any build or lint issues caused by Listing Details components.

### Notes
- Version 1.5.0 completes the first full Listing Details prototype pass.
- No backend, authentication, payments, persistence, routing, real maps, geolocation, report submission, moderation workflow, analytics, M-Pesa, or in-app chat were added.
- Next work can begin on Login/Signup, Safety Page, Contact/Support Page, Landlord Dashboard mockup, Admin Dashboard mockup, or app-wide QA.

## [1.4.8] - 2026-06-05
### Added
- Listing Details animation, spacing, responsiveness, and accessibility polish pass.

### Changed
- Refined Listing Details vertical spacing, card consistency, tap targets, bottom padding, and mobile responsiveness.
- Improved Framer Motion animation consistency across gallery, pricing, location, amenities, contact, trust/safety, report panel, and similar homes.
- Improved nested button behavior for save, WhatsApp, report, and similar listing actions.
- Cleaned minor component styling and accessibility issues where safe.

### Notes
- No new Listing Details features were added.
- No backend, authentication, payments, persistence, routing, real maps, geolocation, analytics, report submission, or moderation workflow was added.
- Listing Details is ready for the 1.5.0 final QA and prototype-matching pass.

## [1.4.7] - 2026-06-05
### Added
- Similar homes section on Listing Details.
- Compact similar home cards with image, rent, deposit, location, house type, badges, amenities, save, and view actions.
- Local similar-listing selection behavior.
- Simple local similarity logic using location, house type, rent range, and trust signals.
- Empty similar homes fallback.

### Changed
- Replaced the Listing Details Similar homes placeholder with a real component.
- Extended local sample listing data with additional nearby listings where needed.

### Notes
- Similar homes use local/sample data only.
- Save and navigation behavior are prototype-only.
- No backend, persistence, routing, analytics, recommendation API, maps, authentication, or payments were added.

## [1.4.6] - 2026-06-05
### Added
- Listing trust and safety section.
- Trust badge card with badge descriptions.
- Verification explanation note.
- "Is this still available?" prototype action.
- Report listing card and local report panel.
- Safety warning card with deposit-before-viewing reminder.
- Scam warning checklist.

### Changed
- Replaced the Listing Details trust/safety placeholder with a real trust and safety component.
- Extended local listing data/types with trust, availability, and report-related fields.

### Notes
- Report and availability actions are local/prototype-only.
- No backend, authentication, payments, persistence, routing, moderation workflow, real report submission, or analytics were added.
- Similar homes will be added later.

## [1.4.5] - 2026-06-05
### Added
- Listing caretaker/contact card.
- Contact profile with caretaker name, role, phone number, WhatsApp number, response hint, and phone verification badge.
- Call and WhatsApp contact actions.
- Quick WhatsApp prompt options for availability, viewing, and directions.
- Contact safety note warning users not to send deposit before viewing.

### Changed
- Replaced the Listing Details caretaker contact placeholder with a real contact component.
- Extended local listing sample data with contact and preferred contact method fields.

### Notes
- Contact actions use local/sample listing data.
- WhatsApp opens with prefilled messages but no in-app chat or automatic sending was added.
- No backend, authentication, payments, persistence, routing, maps, real analytics, or message tracking were added.

## [1.4.4] - 2026-06-05
### Added
- Listing amenities and house condition section.
- Amenities grid for water, electricity, toilet, bathroom, floor, security, road access, Wi-Fi, and parking details.
- Key details card for water, electricity, toilet, bathroom, floor, and security.
- House condition card with room condition, floor level, ventilation, lighting, noise, and compound details.
- Practical description card.
- Missing-detail reminder note.

### Changed
- Replaced the Listing Details amenities placeholder with a real amenities and condition component.
- Extended local listing sample data with amenities, condition, and description fields.

### Notes
- Amenities and condition details use local/sample listing data only.
- No contact card, WhatsApp automation, backend, authentication, payments, persistence, routing, maps, AI, or analytics were added.

## [1.4.3] - 2026-06-05
### Added
- Listing location details section.
- Area, estate, landmark, road distance, nearby stage, and road access information.
- CSS-only approximate map preview.
- Prototype map actions for asking directions and opening map preview.
- Location safety note reminding users to confirm exact directions with the caretaker.

### Changed
- Replaced the Listing Details location placeholder with a real location component.
- Extended local listing sample data with local access and direction fields.

### Notes
- Location data is local/sample data only.
- Map preview is CSS-only and approximate.
- No real map SDK, geolocation, directions, backend, authentication, persistence, routing, payments, or analytics were added.

## [1.4.2] - 2026-06-05
### Added
- Listing pricing summary section.
- Monthly rent, deposit, agent fee, viewing fee, water, and electricity breakdown.
- Estimated upfront cost card.
- Availability and move-in summary.
- Pricing safety note warning users not to send deposit before viewing.

### Changed
- Replaced the Listing Details pricing placeholder with a real pricing component.
- Extended local listing sample data with pricing and availability fields.

### Notes
- Pricing uses local/sample listing data only.
- No payment flow, backend, authentication, persistence, routing, WhatsApp automation, maps, or analytics were added.
- Contact and cost-confirmation actions will be handled later.

## [1.4.1] - 2026-06-05
### Added
- Listing image gallery with main image, thumbnails, and image counter.
- Listing title and summary section.
- Listing trust badges in the title area.
- Local save/share feedback for Listing Details.
- Extended local listing sample data with images, availability, update text, and listing code.

### Changed
- Replaced Listing Details gallery and title placeholders with real components.

### Notes
- Gallery uses local/sample image data only.
- Share and save actions are prototype-only.
- Full pricing, location, amenities, contact, trust/safety, report, and similar homes sections will be added later.
- No backend, authentication, payments, persistence, routing, real maps, image upload, or analytics were added.

## [1.4.0] - 2026-06-05
### Added
- Created the Listing Details Page foundation (`ListingDetailsPage.tsx`).
- Created `ListingDetailsHeader.tsx` with customized back button, "Listing details" label, interactive save button, and share action triggers.
- Built-out responsive glassy placeholder cards inside `ListingDetailsPage` for image gallery, listing title, pricing, location, amenities, contact, safety & trust checklist, and similar homes.
- Integrated the Listing Details Page into the primary `App.tsx` state shell to support `'listing-details'` page transitions while keeping bottom navigation responsive.
- Programmed active tab-highlight routing preservation so the previous page tab remains highlighted inside the bottom navigation bar during active listing details exploration.
- Wired up click interactions on `ListingCard`, `SearchResultCard`, `SavedListingCard`, and `FeaturedListing` card bodies to open Listing Details while blocking nested click event propagation on buttons and links (`e.stopPropagation()`).
- Added type validation standards for `KejaListing` schemas inside `/src/types/listings.ts` and prepared sample properties inside `/src/data/listingsData.ts`.

### Changed
- Refactored index routing to support local state-driven page transitions without external routing dependencies or URL modifications.

### Notes
- KejaListing details resolution handles fallback and maps elements safely and dynamically.
- Interactive Call and WhatsApp triggers are fully active and do not conflict with the listing click context.
- No backend database synchronization, external search server APIs, or GPS map frameworks were added.

## [1.3.1] - 2026-06-05
### Added
- Prototype stabilization and design-system cleanup pass.

### Changed
- Replaced invalid Tailwind utility classes with valid Tailwind or arbitrary-value equivalents.
- Improved visual consistency across existing pages without adding new features.
- Cleaned notification filtering and prototype-only copy where safe.
- Updated package/README metadata for KejaFinder.

### Fixed
- Styling classes that were not being generated in the compiled CSS.
- Missing changelog continuity for earlier notification versions where needed.
- Minor accessibility and header consistency issues where safe.

### Notes
- No new pages or major product features were added.
- No backend, authentication, payments, persistence, routing, real push notifications, WhatsApp alerts, SMS, email, or map integrations were added.
- This version prepares the project for Listing Details Page work in 1.4.0.

## [1.3.0] - 2026-06-05
### Added
- Settings icon/shortcut on the Profile Page.
- Prototype Settings Hub entry point from the Profile menu.
- Local settings hub rows for account, notifications, search preferences, privacy and security, language, support, and app experience.

### Changed
- Profile Page now provides a clearer entry point into account and app settings.

### Notes
- Settings actions are prototype-only.
- No backend, authentication, payments, persistence, routing, real privacy controls, real notification permissions, SMS, email, WhatsApp alerts, or push notifications were added.

## [1.2.0] - 2026-06-05
### Added
- Final Notifications Page QA and prototype-matching pass.
- Final Notifications Page accessibility, animation, responsiveness, and mobile usability review.

### Changed
- Refined Notifications Page layout, spacing, card consistency, bottom padding, and mobile behavior.
- Improved visual consistency with uploaded Notifications Page references.
- Cleaned Notifications Page component styling and local interactions where needed.
- Improved notification feed, empty state, recommended alerts, and settings panel usability.

### Notes
- Version 1.2.0 completes the first full Notifications Page prototype pass.
- No new pages, backend, authentication, payments, persistence, routing, push notifications, WhatsApp alerts, SMS, email, real notification syncing, or browser notification permissions were added.
- Next work can begin on Listing Details Page, Contact/Support Page, Landlord Dashboard, Admin Dashboard, or app-wide QA.

## [1.1.9] - 2026-06-05
### Added
- Notifications Page animation, spacing, responsiveness, and accessibility polish pass.

### Changed
- Refined Notifications Page vertical spacing, card consistency, tap targets, bottom padding, and mobile responsiveness.
- Improved Framer Motion animation consistency across notification sections, cards, settings panel, and empty states.
- Improved notification feed, safety card, summary cards, recommended alerts, and settings panel usability.
- Cleaned minor component styling and accessibility issues where needed.

### Notes
- No new Notifications Page features were added.
- No backend, authentication, payments, persistence, routing, push notifications, WhatsApp alerts, SMS, email, real notification syncing, or browser notification permissions were added.
- Notifications Page is ready for the 1.2.0 final QA and prototype-matching pass.

## [1.1.8] - 2026-06-05
### Added
- Activity alert summary cards for unread notifications, saved-home updates, price drops, messages, and safety alerts.
- Local instant alerts toggle.
- Summary card interactions that update the current notification tab/filter state.
- Local feedback for summary card and instant alert actions.

### Changed
- Notifications Page now includes a quick activity overview above tabs and filters.
- Notification filtering can be triggered directly from summary cards.

### Notes
- Summary counts are computed from local notification state only.
- Instant alerts are prototype-only and do not request notification permissions.
- No backend, authentication, payments, persistence, routing, browser notification permissions, SMS, email, WhatsApp alerts, or push notification syncing were added.

## [1.1.7] - 2026-06-05
### Added
- Implemented core interactive read and unread toggles for each notification card.
- Provided real-time state feedback with localized active badges.

### Changed
- Cleaned list filtering based on the read/unread status of notification elements.

## [1.1.6] - 2026-06-05
### Added
- Notifications empty state for no notifications.
- No-results state for search, tab, and filter combinations.
- Recommended alerts section with local toggle states.
- Clear filters action for no-results state.
- Optional neutral All filter chip for notification filtering.

### Changed
- Notifications Page now handles empty and no-results states more gracefully.
- Notification filters can reset to a neutral state.

### Notes
- Recommended alert settings are local/prototype-only and are not persisted.
- No real push notifications, browser permissions, WhatsApp alerts, SMS, email, backend, authentication, payments, routing, or persistence were added.

## [1.1.5] - 2026-06-05
### Added
- Created the interactive `NotificationSafetyCard` component displaying the weekly featured safety reminder directive.
- Added standard interactive buttons ("View safety tips" and "Dismiss") on the safety reminder card.
- Implemented exact prescribed scam-warning texts: “Never send deposit before physically viewing the house and confirming the caretaker or landlord.”
- Implemented specific supporting text: “Use Call or WhatsApp to confirm availability, directions, and caretaker details before visiting.”
- Created `NotificationFeedActions` bar detailing dynamic unread metrics with quick actions ("Mark read" and cleanup options).

### Changed
- Replaced the "Featured safety alert" placeholder on `NotificationsPage.tsx` with the real interactive `NotificationSafetyCard`.
- Integrated `AnimatePresence` so the safety alert card dismisses with a beautiful exit-scale animation.
- Made the unread metrics banner in `NotificationsHeader` fully dynamic so it displays actual unread list counts or hides automatically if there are none.
- Tuned the `NotificationFeed` empty state to display customized friendly catch-up copies when unread filter conditions correspond to zero notifications.

### Notes
- Safety tip and feed action handlers are fully functional locally, triggering corresponding visual notification toast feedback.
- Notification feed updates and dismissals propagate reactively to the parent state.
- Backend database integration, routing, real push channels, SMS alerts, and auth scopes remain planned for upcoming roadmarks.

## [1.1.4] - 2026-06-05
### Added
- Created the interactive notification dismiss button which executes a localized exit transition.
- Supported list item animation handling under multiple state changes.

### Changed
- Reassigned action handler buttons to support individual item clearing animations.

## [1.1.3] - 2026-06-05
### Added
- Notification feed with local sample data.
- NotificationCard component for saved-home updates, price drops, messages, availability, safety, verification, and support notifications.
- NotificationFeed component with Today and Earlier grouping.
- Prototype notification action feedback.
- Basic local search, tab, and filter matching for the notification feed.

### Changed
- Replaced the notification feed placeholder from 1.1.0 with real notification feed cards.

### Notes
- Notification feed data is local/sample data only.
- Notification actions are prototype-only and do not navigate yet.
- Read/unread changes, dismiss actions, settings, real notifications, backend, authentication, persistence, payments, routing, SMS, email, and WhatsApp alerts were not added.

## [1.1.2] - 2026-06-05
### Added
- Implemented the notifications category filter chips for immediate tab refining.
- Provided local filter selection feedback.

### Changed
- Refined notifications search interaction to combine filters reactively without layout stutter.

## [1.1.1] - 2026-06-05
### Added
- Notifications Page header with KejaFinder branding, notification bell, badge, and avatar.
- Notifications Page title and subtitle.
- Notifications search bar with local input state.
- Prototype filter/settings button feedback.

### Changed
- Replaced the notifications header and search placeholders from 1.1.0 with real components.

### Notes
- Search is local UI state only and does not filter real notifications yet.
- Filter/settings button is prototype-only.
- No notification feed, settings panel, backend, authentication, persistence, payments, routing, push notifications, WhatsApp alerts, SMS, or email alerts were added.

## [1.1.0] - 2026-06-05
### Added
- Notifications Page foundation.
- Mobile-first notifications page shell.
- Placeholder areas for notifications header, search, filters, featured safety alert, notification feed, empty state, recommended alerts, and settings.
- Local navigation support from notification bell buttons to the Notifications Page if safe.

### Changed
- Notification bell buttons can open the prototype Notifications Page using local state.
- Bottom navigation remains visible on the Notifications Page without adding a new bottom nav item.

### Notes
- This version only creates the foundation for the Notifications Page.
- Real notification feed, settings, read/unread behavior, push notifications, WhatsApp alerts, backend, authentication, persistence, payments, and routing were not added.

## [1.0.0] - 2026-06-01
### Added
- Final Profile Page QA and prototype-matching pass.
- Final Profile Page accessibility, animation, responsiveness, and mobile usability review.

### Changed
- Removed harsh black strokes around each section to achieve a softer, highly premium visual aesthetic.
- Replaced non-standard Tailwind CSS class variables (such as custom alpha scales `neutral-150/90`, `stone-850`, and `stone-855`) with fully valid standard Tailwind alternatives.
- Standardized vertical margins, divide rows, and card border gradients across all key sub-modules: `ProfileIdentityCard`, `ProfileStats`, `ProfileShortcuts`, `ProfileTrustStatus`, `ProfileActionList`, `ProfileRecentActivity`, `ProfileSafetySupport`, `ProfileInteractedListings`, and `ProfileHeader`.
- Cleaned the Saved updates section in `SavedPage.tsx` to match the polished border style structure consistently.
- Improved settings panel usability and section-level polish.

### Notes
- Version 1.0.0 completes the first full Profile Page prototype pass.
- No new pages, backend, authentication, payments, persistence, routing, real notifications, real verification, real role switching, or support chat were added.
- Next work can begin on the Notifications Page, Listing Details Page, or app-wide QA.

## [0.9.9] - 2026-06-01
### Added
- Standardized visual consistency, spacing, animations, and accessibility across all KejaFinder Profile Page sub-components.
- Tuned Framer Motion transition curves and spring velocities to 0.18s-0.35s for pristine performance feel.
- Cleaned up quick metrics subtitle scaling and sizes inside renter and poster modes within ProfileModeSwitch.tsx.
- Optimized support shortcut labels and sizing inside ProfileSafetySupport.tsx to prevent horizontal text constraints.
- Integrated proper aria accessibility tags to ensure rich assistive screen-reader coverage.

### Changed
- Standardized vertical card spacing within the ProfilePage container layout.
- Spiced up card hover states and tap highlights for shortcuts and metrics grids.
- Set snappier progress bar completion velocity to match performance goals.

### Notes
- KejaFinder experiences are kept light to remain highly responsive under 320px, 375px, 390px, and 414px mobile widths.
- No backend systems or API secret layers were affected.

## [0.9.8] - 2026-06-01
### Added
- Renter/poster mode switch mockup on the Profile Page.
- Local Renter Mode summary with saved homes, viewed homes, inquiries, and search alerts.
- Local Poster Mode summary with posted listings, pending approval, listing inquiries, and trust checks.
- Prototype actions for continuing search, viewing saved homes, posting a vacancy, and viewing poster tools.
- Helper note explaining that mode switching is prototype-only.

### Changed
- Profile Page now previews both renter and poster account use cases.
- ProfileIdentityCard's dynamic role badge now reflects "Renter Mode" or "Poster Mode" based on the selected switch state.

### Notes
- Mode switching uses local state only.
- No real account roles, permissions, landlord dashboard, backend, authentication, payments, routing, notifications, or persistence were added.

## [0.9.7] - 2026-06-01
### Added
- Profile Safety & Support section.
- Safety warning card with deposit-before-viewing reminder.
- Before-you-visit checklist.
- Support shortcut cards for report listing, contact support, safety tips, and WhatsApp help.
- Local prototype feedback for safety/support actions.

### Changed
- Replaced the safety banner placeholder from 0.9.0 with a real ProfileSafetySupport component.

### Notes
- Safety and support actions are prototype-only.
- No real report flow, support chat, WhatsApp support, backend, authentication, payments, routing, notifications, or persistence was added.

## [0.9.6] - 2026-06-01
### Added
- Profile settings panel for account actions.
- Local settings views for personal details, notifications, preferred locations, budget range, house types, verification, help center, language, and logout.
- Local toggle and chip interactions inside settings panels.

### Changed
- ProfileActionList rows now open a prototype settings panel instead of only showing simple feedback.

### Notes
- Settings are local/prototype-only and are not persisted.
- No backend, authentication, payments, routing, real notifications, real verification, or logout behavior was added.

## [0.9.5] - 2026-06-01
### Added
- Profile Trust & Verification section.
- Profile completion progress card.
- Verification status rows for phone, location, email, ID verification, and scout verification.
- Trust badge summary.
- Trust note explaining that verification is reviewed by KejaFinder.
- Local prototype feedback for pending verification actions.

### Changed
- Profile Page now surfaces user trust and verification status more clearly.

### Notes
- Verification status uses local/sample data only.
- Users cannot self-verify profiles or listings.
- Real verification workflows, ID uploads, scout checks, backend, authentication, payments, routing, and persistence were not added.

## [0.9.4] - 2026-06-01
### Added
- Profile account actions and preferences list.
- Rows for personal details, notifications, preferred locations, budget range, house types, verification, help center, language, and logout.
- Local prototype feedback for account actions.

### Changed
- Replaced the Account actions placeholder from 0.9.0 with a real ProfileActionList component.

### Notes
- Account actions are prototype-only and do not open real settings pages.
- Log out is disabled in this prototype.
- No backend, authentication, persistence, payments, routing, or real notification system was added.


## [0.9.3] - 2026-06-01
### Added
- Profile recent activity section.
- Recently interacted listings section.
- Local sample activity data for saved, viewed, and contacted listing actions.
- Local visual interaction feedback for activity rows.

### Changed
- Replaced the Recent activity placeholder from 0.9.0 with real activity and interacted-listing components.

### Notes
- Activity data is local/sample data only.
- Activity rows and listing cards do not navigate yet.
- No backend, authentication, persistence, payments, routing, analytics, or real notification system was added.

## [0.9.2] - 2026-06-01
### Added
- Profile stats row with Saved Homes, Viewed Homes, Inquiries, and Posted Listings.
- Profile shortcut cards for Saved, Post Vacancy, Safety, and Support.
- Local visual shortcut interactions.

### Changed
- Replaced the Profile stats and Shortcuts placeholders from 0.9.0 with real components.

### Notes
- Stats use local/sample data only.
- Shortcuts are prototype navigation or visual actions only.
- No backend, authentication, persistence, payments, routing, or real analytics were added.

## [0.9.1] - 2026-06-01
### Added
- Profile Page header with KejaFinder branding, notification button, and avatar.
- Profile Page title and subtitle.
- Profile identity card with sample user details.
- Role badge and verification badges.
- Edit Profile visual action.

### Changed
- Replaced the profile header and identity card placeholders from 0.9.0 with real components.

### Notes
- Profile data is local/sample data only.
- Edit Profile is visual only in this version.
- No backend, authentication, persistence, payments, routing, or real verification logic was added.

## [0.9.0] - 2026-06-01
### Added
- Profile Page foundation.
- Mobile-first profile page shell.
- Placeholder areas for profile header, identity card, stats, shortcuts, recent activity, account actions, and safety banner.
- Temporary local navigation support for the Profile tab if needed.

### Changed
- Bottom navigation can visually support the Profile tab as active when viewing the Profile Page.

### Notes
- This version only creates the foundation for the Profile Page.
- Real profile identity, stats, shortcuts, activity, settings, verification, and support sections will be added in later versions.
- No backend, authentication, payments, persistence, notifications, routing, or real verification system was added.

## [0.8.0] - 2026-06-01
### Added
- Full Saved Page QA and prototype-matching pass.
- Final accessibility, animation, and responsive polish for Saved Page interactions.

### Changed
- Refined Saved Page spacing, card proportions, typography, shadows, bottom padding, and mobile layout.
- Improved visual consistency across saved cards, empty state, suggestions, collections, compare mode, map view, and saved updates.
- Cleaned minor component and styling issues where needed.

### Notes
- Version 0.8.0 completes the first Saved Page prototype pass.
- No new pages, backend, authentication, payments, persistence, routing, push notifications, or real map integration were added.
- Next work can begin on the Profile page, Notifications page, Listing Details page, or final app-wide QA.

## [0.7.9] - 2026-06-01
### Added
- Saved Updates entry card with dynamic unread badges counter.
- Full-screen `SavedUpdates` panel with interactive local sample data lists.
- Core sample categories for price drops, freshness, badges, and alerts.
- Read/Unread state togglers with single and bulk mark-all actions.
- Local toggles for alert notifications preference controls.
- Tenant safety helper guidelines highlighting secure deposit processes.

### Changed
- Users can switch view states between Saved homes collections list and active notifications alerts.
- Filter panels gracefully hide when the updates page is open to conserve cellular vertical estate.

### Notes
- KejaFinder notifications and alerts are fully functional prototype-mocked entities.

## [0.7.8] - 2026-06-01
### Added
- Saved List/Map view toggle element (`SavedViewToggle`).
- Interactive CSS-drawn geographic layout with local markers and roads (`SavedMapView`).
- Staggered marker pins equipped with individual rent price tags.
- Detailed map preview container with fully functioning caretaker contact triggers.
- Compact approximate warning notice and circular custom location button callback.

### Changed
- KejaFinder saved screen now supports fluent switches between lists of properties and visual map grids.
- Saved map view continuously refines pins list synchronised with the current categories and search query filters.

### Notes
- Map is a client-side layout representation and uses mock coordinate offsets.
- Compare selection flows remain safely optimized for the list layout.

## [0.7.7] - 2026-06-01
### Added
- Compare selection mode for saved homes with inline toast threshold reminders.
- Selection indicator overlays on `SavedListingCard`.
- Floating bottom glassy comparison tracker bar (`SavedCompareBar`) representing current selections.
- Multi-field comparisons modal layout (`SavedCompareSheet`) checking rent, deposit, location, types, amenities, trust badges, and save dates side-by-side.

### Changed
- `SavedListingCard` now supports compare selection active layout indicators.
- Unsaving a property removes it dynamically from competitive comparisons list.

### Notes
- Compare actions, warnings, and states operate on local react contexts.
- Supports side-by-side reviews for up to 3 saved listings.

## [0.7.6] - 2026-06-01
### Added
- Saved Collections section.
- Collection cards for Budget picks, Near transport, Verified homes, and Move this month.
- Local active collection state.
- Optional lightweight collection filtering if implemented.

### Changed
- Saved Page now includes collection cards above the saved homes list.
- Saved homes can be visually organized by common tenant needs.

### Notes
- Collections use local/prototype state only.
- Real collection creation, persistence, and management will be added later.
- No backend, authentication, payments, routing, persistence, or real map integration was added.

## [0.7.5] - 2026-06-01
### Added
- Saved homes empty state with Browse homes and Search nearby actions.
- No-results state for saved search/filter matches.
- Suggested homes section with 3 customized affordable Kenyan rental options.
- Dynamic save interaction for suggested homes with inline success messaging.
- Saved helper banner with dynamic compare recommendation tip.

### Changed
- Saved Page now handles empty saved lists and no-result search states.
- Replaced the saved helper/banner placeholder with styled advice.

### Notes
- Empty state, suggestions, and save behavior use local/prototype state only.
- No backend, persistence, authentication, payments, routing, or real map integration was added.
- Collections and compare mode will be added in later versions.

## [0.7.4] - 2026-06-01
### Added
- Local saved listings data source with 5 realistic Kenyan rental options.
- SavedHomesList component.
- Dynamically rendered lists using local sample data props.
- Optimistic local heart un-saving state with exit transitions.
- Interactive Search filtering covering title, estate, town, county, structure type, and badges.

### Changed
- Refactored SavedListingCard to accept dynamic Listing properties instead of preset previews.
- Swapped single card layout in SavedPage for a fully interactive local saved list.

### Notes
- Saved listings use client-side local states only; no localStorage persistence is active yet.
- Verification indicators, calling anchors, and whatsapp links are fully functional.
- Unsaved cards are deleted dynamically with beautiful pop transitions.
- Home, Search, and Post tabs remain completely intact.

## [0.7.3] - 2026-06-01
### Added
- Reusable SavedListingCard component.
- Static saved listing preview card.
- Saved heart toggle state.
- Saved date, amenities, trust badges, Call, and WhatsApp actions.

### Changed
- Replaced the saved homes list placeholder with one realistic saved listing preview card.

### Notes
- SavedListingCard is static in this version.
- Full saved homes list using local sample data will be added in version 0.7.4.
- No backend, persistence, authentication, payments, routing, or real map integration was added.

## [0.7.2] - 2026-06-01
### Added
- Saved Page filter chips for All, Recently Saved, Bedsitter, 1 Bedroom, and Verified.
- Saved sort control with local selected sort state.
- Sort dropdown options for Recently saved, Cheapest, Highest rent, Verified first, and Recently updated.

### Changed
- Replaced the saved filters placeholder from 0.7.0 with real filter and sort controls.

### Notes
- Saved filters and sorting are visual/local state only in this version.
- Real filtering and sorting will be connected after saved listing data is added.
- No backend, persistence, authentication, payments, routing, or real map integration was added.

## [0.7.1] - 2026-06-01
### Added
- Saved Page header with KejaFinder branding, notification button, and profile avatar.
- Saved Page title and subtitle.
- Controlled SavedSearchBar component.
- Local saved search query state.

### Changed
- Replaced the saved header and saved search placeholders from 0.7.0 with real components.

### Notes
- Saved search is local state only in this version.
- Filters and saved listing cards will be added in later versions.
- No backend, persistence, authentication, payments, routing, or real map integration was added.

## [0.7.0] - 2026-06-01
### Added
- Saved Page foundation.
- Mobile-first saved page shell.
- Placeholder areas for saved header, search, filters, saved homes list, and helper banner.
- Temporary local navigation support for the Saved tab if needed.

### Changed
- Bottom navigation can visually support the Saved tab as active when viewing the Saved Page.

### Notes
- This version only creates the foundation for the Saved Page.
- Real saved listings, filters, empty state, collections, and compare behavior will be added in later versions.
- No backend, persistence, authentication, payments, routing, or real map integration were added.

## [0.5.9] - 2026-06-01
### Added
- Step 4 Review screen.
- Editable summary cards for house details, location, amenities, photos, contact info, and verification requests.
- Listing preview inside the review step.
- Listing accuracy confirmation checkbox.
- Save Draft local prototype action.
- Submit for Review local success state.

### Changed
- Valid Step 3 submissions now lead into real Step 4 Review content.
- Step progress now reflects Step 4 as active when reviewing.
- Review edit actions can return users to earlier steps without clearing draft data.

### Notes
- Submit for Review is local/prototype-only.
- Listings are not sent to a backend and are not marked live.
- Real approval, storage, authentication, and dashboard flows will be added later.

## [0.5.8] - 2026-06-01
### Added
- Step 3 live listing preview card.
- Cover photo controls with Set as cover behavior.
- Improved photo count and photo quality guidance.
- Suggested photo labels for room, outside, toilet, kitchen, and compound photos.
- Polished recommended photos checklist.

### Changed
- Improved Step 3 photo grid layout, cover badge, empty slots, and spacing.
- Listing preview now reflects current draft data and uploaded cover photo.

### Notes
- Listing preview uses local draft data only.
- Photos are still previewed locally only and are not uploaded.
- Step 4 Review will be built in version 0.5.9.

## [0.5.7] - 2026-06-01
### Added
- Step 3 Photos uploader section layout.
- Responsive, premium Drag-and-Drop file picker wrapper featuring intuitive file checks (<10MB limit and JPG/PNG/WEBP format guides).
- Recommended photos checklist detailing room, building outside, kitchen, toilet, and compound criteria.
- Cover badge flag on the first uploaded photo to guide list curation.
- Soft recommendation banner if fewer than 3 photos are added.
- Live interactive mock file inputs allowing dynamic, multi-file local thumbnail rendering.
- Fully operational photo removal with precise file object URL revoking to maintain system memory.
- Clear photo quality notice card in warm alert styling warning against misrepresentation.
- Complete step-progress visual synchronization for Step 3 (active) and Step 1-2 (completed).

### Changed
- Transitioning from a valid Step 2 now displays the interactive Step 3 Photos uploader instead of a placeholder.
- Step 3 back controls return seamlessly to Step 2 preserving all current selections.
- Proceeding from Step 3 with a photo triggers smooth transition to a mock Step 4 Review view.

### Notes
- Photo previews use local object URLs; no cloud uploads, Supabase, Cloudinary, backend endpoints, or authentication rules have been added in this release.

## [0.5.6] - 2026-06-01
### Added
- Step 2 Amenities grid with multi-select cards.
- Step 2 Trust & Verification request toggles with tactile sliders.
- Local draft state for selected amenities and verification requests.
- Soft warning banner inside the amenities grid when zero items are selected.
- Trust disclaimer note explaining that verification requests require review.

### Changed
- Step 2 now embeds Amenities grid and Trust choices between location fields and action buttons.

### Notes
- Amenities and trust toggles use local/prototype state only.
- No backend, authentication, payments, real uploads, real map, or physical verification system was added.

## [0.5.5] - 2026-06-01
### Added
- Step 2 Location content.
- Location search input.
- Mock map preview with approximate listing pin.
- Location Details form with county, town/area, estate, landmark, and distance from main road.
- Location privacy/safety note.
- Back and Save & Continue buttons for Step 2.
- Step 2 validation for required location fields.

### Changed
- Valid Step 1 submissions now lead into real Step 2 Location content.
- Step progress now reflects Step 2 as active when viewing location fields.

### Notes
- Map preview is prototype-only and uses mock/CSS elements.
- No real maps, geolocation, backend, authentication, payments, or uploads were added.
- Amenities and verification toggles will be added in version 0.5.6.

## [0.5.4] - 2026-06-01
### Added
- Step 1 Contact Options section.
- Contact person, role, phone number, and WhatsApp number fields.
- Call and WhatsApp contact method toggles.
- Use phone number helper for WhatsApp number.
- Stronger Step 1 validation.
- Warning note for accurate listing information.

### Changed
- Continue validation now checks pricing, availability, and contact details.
- Post listing draft state now includes contact role and contact method preferences.

### Notes
- Contact details use local/prototype state only.
- Continue can move to Step 2 placeholder, but Step 2 fields are not built yet.
- No backend, authentication, payments, real uploads, or map integration was added.

## [0.5.3] - 2026-06-01
### Added
- Step 1 pricing fields for monthly rent and deposit (`PostPricingFields.tsx`).
- Availability date field (`PostAvailabilityField.tsx`).
- Description textarea with 500-character counter (`PostDescriptionField.tsx`).
- Full-width Continue button with ArrowRight feedback micro-interactions.
- Basic required-field validation for rent, deposit, and availability date, with auto-scrolling to the visual error focal point.
- Helper note for transparent pricing utilizing the ShieldCheck asset.

### Changed
- Replaced the action button placeholder with the real Continue action.
- Expanded Step 1 content beyond house type selection.

### Notes
- Step 1 fields use local/prototype state only.
- Continue prepares the flow for Step 2 but does not build Step 2 content yet.
- No backend, authentication, payments, real uploads, or map integration was added.

## [0.5.2] - 2026-06-01
### Added
- Step 1 House Type selector (`PostHouseTypeSelector.tsx`) supporting Single Room, Bedsitter, Studio, 1 Bedroom, 2 Bedroom, and Mabati/Other choices.
- Tactile grid styling mimicking physical buttons with selected states, custom accent colors, icons, and micro-interaction scale triggers.
- Multiplatform-friendly focus ring support and aria accessibility attributes for the selector.

### Changed
- Replaced the Step 1 static placeholder markup with the real interactive House Type options selector.

### Notes
- House Type selection state is successfully updated and connected locally.
- Upcoming steps will overlay the pricing forms and caretaker contacts.

## [0.5.1] - 2026-06-01
### Added
- Created the real KejaFinder Post Vacancy branding header (`PostHeader.tsx`) with notification icons, numeric badges, and visual avatar properties.
- Built a highly polished, fully responsive four-step progress stepper (`PostStepProgress.tsx`) rendering active, inactive, and transition check states.
- Integrated the new static stepper and title blocks into the primary `PostVacancyPage.tsx` view shell.

### Changed
- Replaced the initial mockup header and step progress placeholders with production-ready reusable components.

### Notes
- Progress stepper tracks the initial step "Details" with graceful visual indicators.
- No inputs, local storage adapters or database integrations are introduced.

## [0.5.0] - 2026-06-01
### Added
- Post Vacancy Page foundation with mobile-first layout styling in `/src/pages/PostVacancyPage.tsx`.
- Form state models ready for active fields structure in `/src/types/postListing.ts`.
- Structured animated visual placeholder sections mapping Post Header, Step progress stepper, Step content area, and mobile navigation/action buttons.
- Fully integrated navigation triggers inside `/src/App.tsx` enabling seamless active switching to the Post Vacancy Page from the interactive bottom nav.

### Changed
- Refined other placeholder tab guides to mention the newly active Post tab.

### Notes
- This is the starter architectural foundation for the Post Vacancy Page flow.
- The interactive input fields, multi-step progress controls, and validation rules will be introduced layout-by-layout in subsequent planned steps.
- No backend systems, database records, payments, mock map integrations, or authentications were added in 0.5.0.

## [0.3.9] - 2026-05-31
### Added
- Search page animation consistency and spring feedback updates using Framer Motion (`motion/react`).
- Designed and styled interactive, premium green price tag badges (e.g. KSh 35K, KSh 22K) directly on the mock map preview.
- Added cross-platform safe-area bottom padding (`pb-[env(safe-area-inset-bottom,20px)]`) inside the Filter Sheet to prevent overlap on mobile devices.
- Refined focus state accessibility and added `aria-pressed` state attributes to search filter chips.

### Changed
- Reordered and polished vertical margins, inner padding metrics, and responsive flex spacing across listing cards, results summary, and the top-bar input.

### Notes
- This is a layout, interaction, and visual polish pass only.
- No new pages, backend databases, authentication steps, or real mapping SDK integrations were added.

## [0.3.8] - 2026-05-31
### Added
- Mobile filter bottom sheet for Search Results Page (`SearchFilterSheet.tsx`).
- Filter sections for house type selection, rent range inputs, deposit range inputs, availability toggle, verification filter, amenities, and local details.
- Local filter state in `SearchResultsPage` matching `SearchFilters` type rules.
- Fast, smooth Framer Motion backdrop fade and sheet slide entrance/exit animations.
- Active filter chip state indicators based on applied filter inputs.
- Clean "Apply filters" and "Clear filters" support.

### Changed
- Active filter configurations now combine seamlessly with keyword search queries and list sorting logic.
- The empty state "Clear search" action now resets search keyword query, sort type, and all active filters.

### Notes
- Filters are local/sample-data only.
- No backend, authentication, payments, routing, or real map integration was added.
- Specialized location matching is local; advanced map area filtering will be handled later.

## [0.3.7] - 2026-05-31
### Added
- Local search filtering for Search Results Page listings.
- Dynamic result count based on filtered listings.
- Controlled sort state with local sorting behavior.
- Empty state for no matching vacancies.
- Clear search action.

### Changed
- ResultsSummary now reflects the current filtered result count.
- SearchResultsList now renders sorted and filtered local data.
- SortDropdown can update the parent selected sort state.

### Notes
- Filtering and sorting are local/sample-data only.
- Advanced filters and bottom sheet behavior will be added in version 0.3.8.
- No backend, authentication, payments, routing, or real map integration was added.

## [0.3.6] - 2026-05-31
### Added
- Created the reusable `SearchResultsList` component (`src/components/SearchResultsList.tsx`) featuring container staggering animation entries on render.
- Extended `/src/data/listings.ts` to include 6 fully cohesive search results in Syokimau (featured apartments, bedsitters, single rooms, Expressway studios, etc.) using clean public Unsplash media links.
- Updated `SearchResultCard` component to accept the standard `Listing` prop to dynamically bind and format types, prices, amenities, and contact button states.
- Bound dynamic counts via the `{searchListings.length}` prop passed into the `ResultsSummary` component.
- Migrated legacy global listing models and homepage components to enjoy the brand-new type and clean arrays data structures.

### Changed
- Replaced the single static review card from version 0.3.5 in `/src/pages/SearchResultsPage.tsx` with a fully dynamic query-mapped `SearchResultsList` of 6 listings.

### Notes
- Search result counts and list sorting is local/visual only for now.
- Real sorting controls and filters query responses will be added in version 0.3.7.

## [0.3.5] - 2026-05-31
### Added
- Created the reusable `SearchResultCard` component (`src/components/SearchResultCard.tsx`) with dynamic text attributes.
- Integrated a live static search result card preview in the list.
- Implemented the layout metrics with an orange FEATURED badge, toggle heart icon, images count index, rate value, orange deposit accent, inline amenities row (Wi-Fi, Parking, Water 24/7), and verification checks.
- Bound call action links (`tel:+254700000000`) and WhatsApp link triggers (`https://wa.me/254700000000`).
- Configured local active save/heart state toggling inside the component with Framer Motion transitions.

### Changed
- Replaced the placeholder block inside `/src/pages/SearchResultsPage.tsx` with a real, gorgeous result card preview matching the design.

### Notes
- Result listings are structured statically for this milestone.
- Full dynamic JSON lists rendering and state shuffles will follow in version 0.3.6.

## [0.3.4] - 2026-05-31
### Added
- Results summary row showcasing exact vacant counting matching design criteria (“128 homes found in Syokimau”).
- Dynamic, interactive `SortDropdown` component featuring standard select capabilities.
- Complete set of sorting rules options including: Most relevant, Newest, Cheapest, Verified first, Recently updated, and Most viewed.

### Changed
- Replaced the results summary static card block placeholder from 0.3.0 with the fully dynamic results summary header and sorting triggers.

### Notes
- Selected sort labels bind and close automatically via custom mouse listeners on state transitions.
- Real array shuffling logic will be hooked up to the card templates in the next milestone.

## [0.3.3] - 2026-05-31
### Added
- Mock map preview card styled strictly using CSS layouts (`src/components/SearchMapPreview.tsx`).
- Created a beautifully stylized map environment featuring highways, road maps, water features, park blur-blobs, and landmarks.
- Positioned 5 interactive emerald listing pins across key coordinates on the map.
- Embedded a central pulsating blue current location indicator and outer circular locate button.
- Designed and built the segmented Map/List visual selector (`src/components/MapListToggle.tsx`) with Framer Motion active states.

### Changed
- Swapped the static map preview placeholder component on `/src/pages/SearchResultsPage.tsx` with the real mock map UI.

### Notes
- Map uses full CSS positioning to mimic cartographical structures weightlessly.
- Real Google Maps / geolocation SDK integration will remain deferred.

## [0.3.2] - 2026-05-31
### Added
- Search filter chips row below the SearchTopBar.
- Location, House Type, Budget, and Available Now chips.
- Local active chip state.
- Lucide icons for search filters.

### Changed
- Replaced the filter chips placeholder from 0.3.0 with the real filter chip row.

### Notes
- Filter chips are visual/local state only for now.
- Real filter bottom sheets and filtering logic will be added later.

## [0.3.1] - 2026-05-31
### Added
- Created the controlled `SearchTopBar` component (`src/components/SearchTopBar.tsx`) with dynamic text binding.
- Integrated the live, reusable `Header` component inside `src/pages/SearchResultsPage.tsx`.
- Implemented real-time local search state binding within the results view, defaulted to `"Syokimau"`.

### Changed
- Replaced the temporary search bar area placeholder with the fully functional controlled text input & visual filters trigger block.

### Notes
- Search query captures typings reactively in localized React state.
- Filters matrix launcher button displays with correct accessibility bindings.

## [0.3.0] - 2026-05-31
### Added
- Search Results Page foundation (`src/pages/SearchResultsPage.tsx`).
- Created a mobile-first search page layout shell aligned with existing aesthetic guidelines.
- Created beautiful placeholder sections for the search bar, category filters, map preview, listing summaries, and list view results.
- Expanded the main `App.tsx` state to support native active view toggling.
- Added smooth interactive triggers to switch views flawlessly.

### Changed
- Refactored `AppShell` and `BottomNav` to accept and handle controlled view states natively.
- Bottom navigation active state highlights appropriately sync with the search layouts view.

### Notes
- This version focuses solely on the foundation and mock structural blocks of the Search Results Page.
- No backend servers, auth, database syncing, or real Google Maps APIs were added.

## [0.2.1] - 2026-05-31
### Added
- Local sample listing data source including six premium, high-quality rent listings across Athi River, Rongai, Kitengela, Mlolongo, and Syokimau.
- Fully controlled homepage search state in `src/App.tsx`.
- Controlled category selection state linking scroller filters to listing data.
- Local filtering for Fresh vacancies, matching text dynamically across title, location, town, estate, landmark, badges, and amenities.
- Highly polished, compact empty state for Fresh vacancies when no listings match filters, featuring a "Clear search" quick action.

### Changed
- Fresh vacancies now renders filtered local data instead of fixed internal cards.
- Hero search, category scroller, and quick filter chips now communicate with the parent homepage state in `src/App.tsx`.
- Updated TypeScript types inside `src/types/listing.ts` to support detailed geographic parameters like `town`, `estate`, and `landmark`.

### Notes
- Filtering is fully local and runs entirely client-side.
- No backend, routing, authentication, Supabase, maps, or payments were added.
- Budget and advanced location dropdown filter behaviors will be integrated in subsequent updates.

## [0.2.0] - 2026-05-31
### Added
- Full homepage QA and prototype-matching pass.
- Final visual alignment review for the first homepage prototype.

### Changed
- Refined spacing, proportions, typography, shadows, and mobile layout.
- Improved visual consistency across header, search, filters, categories, listings, safety banner, and bottom navigation.
- Cleaned minor component, styling, and responsive issues.

### Notes
- Version 0.2.0 completes the first homepage prototype pass.
- No new pages, backend, authentication, payments, or maps were added.
- Next work can begin on search results page, listing details page, or post vacancy flow.

## [0.1.9] - 2026-05-31
### Added
- Created the application-wide context manager `src/components/ThemeContext.tsx` with dynamic dark-mode state propagation and local-storage persistence.
- Added a gorgeous, interactive theme toggle button on the header, displaying dynamically styled Sun/Moon icons with scale-feedback.
- Configured native Tailwind CSS v4 `@variant dark` rules inside `src/index.css` targeting high-contrast dark charcoal and deep slate body transitions.

### Changed
- Refactored all existing UI modules to support premier high-contrast dark mode classes with the `dark:` prefix, including:
  - **AppShell**: Stationary glass shadow borders, deep slate backdrops, and active gradients.
  - **Header & Logo**: Contrast-refined branding titles, notified bell indicators, and profile border rings.
  - **HeroSearch**: Primary input containers, search indicators, slider details, and core location-highlight subtitles.
  - **FilterChips**: Adapted active emerald layers and deep slate inactive chips.
  - **CategoryScroller**: High-contrast active categories, icon backdrops, and label colors.
  - **FeaturedListing & ListingCard**: Slate-stone vacancy panels, verified check tags, heart bookmark buttons, and adaptive call/whatsapp anchors.
  - **SafetyBanner**: Custom transparent emerald-gradient backgrounds, bold amber header prints, and dark-stone dismiss buttons.
  - **BottomNav**: Unified dark glass chassis, bright text highlights, and custom raised Post container gradients.

### Notes
- Visual state changes trigger with hardware-accelerated transitions for zero lag or pop on toggle events.

## [0.1.8] - 2026-05-31
### Added
- Created the `src/components/BottomNav.tsx` sticky navigation bar featuring Home, Search, Post, Saved, and Profile destinations.
- Configured a raised, prominent, circular emerald Post action button with a signature vector Plus symbol.
- Integrated standard Lucide React icons (`Home`, `Search`, `Plus`, `Heart`, `User`) matching Kenyan prototype definitions perfectly.
- Programmed active tab highlighting via standard local state tracking and micro-touch rebound physics using Framer Motion (`whileTap`).
- Bound tap target bounds strictly over accessible 44px mobile guidelines.

### Changed
- Integrated `BottomNav` directly inside `src/components/AppShell.tsx` to remain completely stationary beneath scrolling cards.
- Restructured content container bottom margins and scroll paddings (`pb-28`) ensuring the `SafetyBanner` and lower list items are never cut off.

### Notes
- Active state resides locally in-memory awaiting dynamic route routing integration.
- Nav design aligns seamlessly at critical 375px viewport breakpoints for consistent mobile execution.

## [0.1.7] - 2026-05-31
### Added
- Created the reusable `src/components/SafetyBanner.tsx` component targeting anti-scam protection and tenant security.
- Incorporated the exact warning message reminding renters not to pay deposit prior to physical viewings.
- Styled the safety container with light emerald gradients, subtle background estate SVG diagrams, and high-visibility check overlays.
- Configured state-controlled dismiss actions using Framer Motion's `AnimatePresence` to exit gracefully.

### Changed
- Rendered `SafetyBanner` in `src/App.tsx` directly below the Fresh vacancies grid block.

### Notes
- Banner state stays local to prevent unnecessary re-fetches.
- Tap targets adhere to optimal 44px boundaries.

## [0.1.6] - 2026-05-31
### Added
- Created the **Fresh vacancies** module including the `src/components/FreshVacancies.tsx` listing row under the featured container.
- Engineered reusable small `src/components/ListingCard.tsx` cards with premium Kenyan rental attributes.
- Drafted static listings sample data and types mapping over properties: Single Room in Athi River, Bedsitter in Rongai, and 1 Bedroom in Kitengela.
- Incorporated local, state-driven Heart save triggers, specific feature icons (Wi-Fi, Borehole Water, Token Prep), and official Check / Shield trust overlays.
- Integrated Call (`tel:+254700000000`) and WhatsApp (`https://wa.me/254700000000`) action anchors for seamless mobile-initiated caretaker connection.

### Changed
- Rendered `FreshVacancies` section below the featured image carousel in `src/App.tsx`.

### Notes
- Horizontal scrolling operates smoothly on all device sizes with custom no-scrollbar definitions.
- Local contact and whatsapp links are safe, functional placeholders adhering to international numbers.

## [0.1.5] - 2026-05-31
### Added
- Created `src/components/FeaturedListing.tsx` component portraying the signature large visual featured card below the categories row.
- Programmed a photorealistic, cozy studio layout interior representation displaying "Spacious Bedsitter Syokimau".
- Formulated key listing parameters matching Kenyan benchmarks: Large emerald print rent text ("KSh 8,000 /month") paired with orange-highlighted security deposit markers ("Deposit: KSh 8,000").
- Designed decorative badges including orange stellar "FEATURED" pill and a glass-molded saved "Heart" trigger with smooth state updates and active tap animations.
- Highlighted amenities with standard rounded chips ("Wi-Fi", "Parking", "Water 24/7") and integrated an official "Scout Verified" emerald check container.
- Constructed translucent photo counters (`1/8`) and three lower carousel indicator dots with custom active status highlighting.

### Changed
- Imported and rendered `FeaturedListing` dynamically in `src/App.tsx` directly beneath the `CategoryScroller`.

### Notes
- Image rendering forces safe `referrerPolicy="no-referrer"` protocols across all browsers.
- Local bookmark heart states operate directly in memory without unrequested side-effects.

## [0.1.4] - 2026-05-31
### Added
- Created a horizontal house-type category scroller inside `/src/components/CategoryScroller.tsx`.
- Formulated category cards for: All, Single Room, Bedsitter, Studio, 1 Bedroom, 2 Bedroom, and Mabati.
- Added premium Lucide React icons matching the prototype direction (`LayoutGrid`, `Bed`, `BedSingle`, `Sofa`, `Home`, `Building2`, `House`).
- Styled the Bedsitter icon with a warm orange accent color to accurately correspond with the visual reference.
- Implemented smart local state tracking using standard React hook selection logic (`selectedCategory`).
- Applied active status indicators with an emerald green background, border highlight, and micro-tap scale responsive bounds via Framer Motion.

### Changed
- Rendered `CategoryScroller` section dynamically inside `src/App.tsx` directly below the quick filter chips row.

### Notes
- Horizontal scrolling behaves smoothly with minimal system footprint.
- All category elements adhere completely to Kenyan rental vernacular (e.g., Mabati, Bedsitter, Single Room).

## [0.1.3] - 2026-05-31
### Added
- Created `src/components/FilterChips.tsx` featuring horizontal scroll controls, touch-friendly tap targets, and no-scrollbar custom styling.
- Styled four dynamic filter categories: Location, House Type, Budget, and Available Now.
- Added premium emerald green icons (MapPin, Home, Wallet, and CalendarDays) and custom visual chevrons matching the mobile prototype.
- Integrated interactive local toggle states tracking the active select-chip smoothly.
- Implemented micro-tap interaction physics (`whileTap={{ scale: 0.97 }}`) via Framer Motion.

### Changed
- Rendered `FilterChips` section directly inside `src/App.tsx` matching correct spatial padding under the search pill container.
- Updated the developer roadmap tracker flags to set the Quick Filter Chips status as active/completed.

### Notes
- Filter attributes reside locally with clean layout scaling across responsive widths.

## [0.1.2] - 2026-05-31
### Added
- Created `src/components/HeroSearch.tsx` component containing the large visual headline, subtitle, and search logic.
- Implemented responsive text hierarchy featuring premium dark charcoal typography paired with brand emerald green highlighting near you boundaries.
- Formulated an elegant, large, glass-molded searching pill equipped with active Lucide React `Search` and `SlidersHorizontal` action icons.
- Built active state trackers capturing keystrokes and filtering triggers locally in a clean react state variable.
- Staged smooth micro-entrance slide animation triggers targeting the hero section with active translation configurations.

### Changed
- Integrated HeroSearch dynamically inside `src/App.tsx` below the standard main navigation bar.
- Refocused roadmap markers assigning Completed tags to the Hero Hub progress items.

### Notes
- Keja estate querying remains client-confined to preserve maximum performance benchmarks during this visual construction phase.

## [0.1.1] - 2026-05-31
### Added
- Implemented modular `Header` component inside `src/components/Header.tsx`.
- Integrated KejaFinder brand logo on the left using `MapPinHouse` (emerald green badge) and two-color text hierarchy ("Keja" in emerald green and "Finder" in dark charcoal).
- Added glassy notification bell button on the right, overlaid with a bright warm orange notification badge with number "2".
- Introduced an elegant circular profile placeholder container wrapped inside a subtle emerald border ring mimicking active user sessions.
- Applied micro-animations to the header entrance using Framer Motion (`motion/react`) for a premium layout feel on load.

### Changed
- Rendered the completed `Header` component inside `src/App.tsx`.
- Updated the visual developer roadmap checklist to show the Header task as completed.

### Notes
- Keeps perfect alignment with the provided mobile prototype UI details.
- Avoided mock state initialization to preserve baseline performance.

## [0.1.0] - 2026-05-31
### Added
- React and TypeScript layout shell initialized.
- Custom mobile-first `AppShell` container centered on desktop with premium background blur gradients.
- Tailwind CSS custom `@theme` configuration with Inter, Space Grotesk, and JetBrains Mono fonts.
- Semantic Kenyan design color tokens (`--color-brand-primary` and `--color-brand-accent`).
- Roadmap placeholder sections targeting future version integration endpoints.

### Changed
- Configured HTML title inside `index.html` to target KejaFinder.
- Updated `metadata.json` metadata description and title identifiers.
- Removed physical device mockup frame, speaker notch, simulated status bar, and time indicators to ensure a cleaner, borderless web interface.

### Notes
- KejaFinder branding successfully aligned with premium local Kenyan english guidelines (e.g. bedsitters, single rooms, vacant houses).
- No mock database models or APIs added in this baseline layout setup, maintaining pristine client state.
