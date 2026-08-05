> Note: this was the original pre-implementation recommendation. It was shelved in favor of Firebase for a test stage, then the project migrated to Supabase for real before launch — see `docs/SUPABASE_ARCHITECTURE.md` and `docs/SUPABASE_SCHEMA.md` for what's actually implemented today.

# MVP Backend Architecture

## Backend Purpose
The first backend iteration must transition the KejaFinder prototype into a functional MVP. It should support:
- Real user accounts and authentication
- Real vacancy posting
- Admin approval workflows
- Listing photo uploads and storage
- Listing search and filtering
- Saved listings persistence
- Listing reports and safety flags
- Contact click tracking (calls and WhatsApp)
- Listing freshness and expiry logic
- Landlord dashboard data populating

## Recommended MVP Stack
We recommend **Supabase** as the primary backend-as-a-service for the MVP:
- **App Structure**: Move to Next.js later for better SEO and server-side rendering, but keep Vite for the current client-only prototype phase until required.
- **Auth**: Supabase Auth (Phone OTP, Email).
- **Database**: Supabase PostgreSQL.
- **Security**: Supabase Row Level Security (RLS) for data protection.
- **Storage**: Supabase Storage (or Cloudinary if advanced image processing is preferred) for listing images.
- **Logic**: PostgreSQL functions/triggers only where useful (e.g., updating timestamps, view counts). Edge Functions only later if complex third-party integrations are needed.

## What Not to Build Yet
To preserve momentum and focus on core value, do **not** build the following in the MVP:
- M-Pesa or other real payment integrations
- Paid listing boosts
- Agent subscription tiers
- AI assistants or chat bots
- Automated WhatsApp bots
- Native iOS/Android app (stick to progressive web app approach)
- In-app messaging/chat (use phone/WhatsApp)
- Tenant screening or background checks
- Digital rental contracts
- Complex interactive maps (use static or simple maps for now)
- Advanced analytics platforms

## Backend Principles
- **Trust before growth**: It is better to have fewer, higher-quality listings than a database full of scams.
- **Listings must stay fresh**: Outdated listings frustrate tenants; implement strict expiry logic.
- **No hidden costs**: Platform logic must reflect clear, honest pricing.
- **Search comes first**: The read path (searching listings) must be extremely fast and reliable.
- **Keep posting simple**: Do not create massive multi-page forms that deter caretakers.
- **Clear role permissions**: Tenants, landlords, and agents have different needs and boundaries.
- **Admin approval before public visibility**: All new listings must pass a moderation check initially.
- **Physical viewing before payment**: The backend should not facilitate rent deposits; keep safety warnings prominent.
