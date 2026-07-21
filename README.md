# KejaFinder 🏠

KejaFinder is a highly-optimized, mobile-first rental vacancy discovery platform designed for Kenya. It enables users to browse authentic, active rental listings with exact pricing, direct landlord/caretaker contacts, verified trust indicators, and advanced localized notifications.

## Features & Prototype Architecture

- **Interactive Homepage & Search**: Advanced filters, localized chips, map toggle actions, and dynamic results lists.
- **Post Vacancy wizard**: multi-step listing publisher form with localized Nairobi/Kenya regions, pricing constraints, amenity checklist, photo picker, and contact configurations.
- **Saved Collections**: Compare properties side-by-side on a dedicated comparison sheet with exact distance, budget, and water supply status metadata.
- **Notifications Hub**: Interactive grouping of alert items (Today vs Earlier), sub-category filter tabs, price-drop triggers, isRead controls, and search matching.
- **Profile Hub & Active Settings Panel**: Unified control center featuring personal details edits, search preferences, help desk forms, and a structured settings hub routing to live prototype controls.
- **Aesthetic Brand Identity**: Emerald green primary actions (`#059669`), warm safety orange accents (`#f97316`), glassy component cards, crisp styling contrasts, fluid animations (`motion`), and eye-relaxing dark mode theme support.

## Tech Stack & Commands

This project uses React 19, Vite, Tailwind CSS v4, and Framer Motion (`motion/react`).

### Firebase backend direction
Backend planning documents are available in the `/docs` directory. They outline the database schema, security rules, and data flows using Firebase.
**Note:** The backend is not yet implemented. The application remains a local prototype. Firebase is selected for the test backend stage and setup files now exist, but Firebase is not connected to user flows yet. Setup docs are in `docs/FIREBASE_LOCAL_SETUP.md`. Firebase implementation will happen in phases. Supabase/PostgreSQL remains a future migration/reference option if relational complexity becomes a blocker.

### Development Server
```bash
npm install
npm run dev
```

### Build & Compilation Check
```bash
npm run build
npm run lint
```

---
*Created in Google AI Studio.*
