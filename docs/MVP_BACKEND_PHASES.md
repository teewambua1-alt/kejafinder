> Note: Phases 1-3 are done on Supabase (see `docs/SUPABASE_ARCHITECTURE.md`). Phase 4 (admin dashboard UI) is not built — moderation is manual via Supabase Studio. Phase 5 is partial (view/click counters exist; expiry/renewal logic does not). Phase 6 has not started.

# Phased MVP Backend Rollout Plan

## Phase 1: Backend Foundation
- Supabase project setup
- Tables creation
- Row Level Security (RLS) setup
- Seed data injection
- Profiles integration
- Auth setup
- Storage bucket configuration

## Phase 2: Listings Backend
- Replace sample listings with Supabase listings
- Listing search and filter
- Listing details sourced from database
- Listing photos rendering
- Save listing persistence functionality

## Phase 3: Posting Backend
- Auth-gated post vacancy flow
- Draft listing logic
- Photo upload mechanism
- Submit for review function
- Owner dashboard listing view

## Phase 4: Admin Approval
- Internal Admin dashboard
- Pending listings queue processing
- Approve/reject mechanisms
- Report handling
- Verification levels adjustments

## Phase 5: Freshness and Contact Tracking
- Tracking contact events
- Tracking view counts
- Capturing availability checks
- Handling expiry logic
- Managing Renewal flow

## Phase 6: Polish Before Payments
- Security review and testing
- RLS thorough testing
- Performance updates
- Image compression optimizations
- Support workflow integration
- Prepare architecture for M-Pesa (to be implemented later)
