> Note: Supabase/PostgreSQL was considered for the MVP backend, but Firebase is now selected for the test backend stage because of Google AI Studio integration. Keep this document as future migration/reference material.

# Draft Database Schema

This document outlines the initial PostgreSQL schema tables for the KejaFinder MVP.

## A. `profiles`
Stores user information and role assignments.
- `id` (uuid, primary key, references `auth.users`)
- `full_name` (text)
- `phone` (text)
- `email` (text, nullable)
- `role` (text, check: `tenant`, `landlord`, `caretaker`, `agent`, `scout`, `admin`)
- `avatar_url` (text, nullable)
- `county` (text, nullable)
- `town` (text, nullable)
- `estate` (text, nullable)
- `is_phone_verified` (boolean, default false)
- `is_id_verified` (boolean, default false)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## B. `listings`
Core rental property data.
- `id` (uuid, primary key)
- `owner_id` (uuid, references `profiles(id)`)
- `title` (text)
- `description` (text)
- `house_type` (text, check: `single_room`, `bedsitter`, `mabati`, `studio`, `one_bedroom`, `two_bedroom`, `three_bedroom`, `student_room`, `other`)
- `monthly_rent` (integer)
- `deposit_amount` (integer)
- `water_charge` (text, nullable)
- `electricity_type` (text, nullable)
- `agent_fee` (integer, default 0)
- `viewing_fee` (integer, default 0)
- `county` (text)
- `town` (text)
- `estate` (text)
- `landmark` (text)
- `distance_from_road` (text, nullable)
- `toilet_type` (text, nullable)
- `bathroom_type` (text, nullable)
- `floor_level` (text, nullable)
- `security` (text, nullable)
- `contact_name` (text)
- `contact_role` (text, check: `landlord`, `caretaker`, `agent`, `scout`)
- `contact_phone` (text)
- `whatsapp_phone` (text, nullable)
- `availability_status` (text, check: `available`, `taken`, `pending`, `expired`)
- `moderation_status` (text, check: `draft`, `pending_review`, `approved`, `rejected`, `reported`)
- `verification_level` (text, check: `none`, `phone`, `location`, `scout`, `trusted`)
- `is_featured` (boolean, default false)
- `is_available` (boolean, default true)
- `views_count` (integer, default 0)
- `call_clicks_count` (integer, default 0)
- `whatsapp_clicks_count` (integer, default 0)
- `report_count` (integer, default 0)
- `expires_at` (timestamptz, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## C. `listing_photos`
Manages standard and categorized property images.
- `id` (uuid, primary key)
- `listing_id` (uuid, references `listings(id)`)
- `url` (text)
- `storage_path` (text, nullable)
- `label` (text, nullable: `room`, `outside`, `toilet`, `kitchen`, `compound`, `landmark`, `other`)
- `is_cover` (boolean, default false)
- `sort_order` (integer, default 0)
- `created_at` (timestamptz)

## D. `listing_amenities`
Simple lookup table for features like WiFi, Borehole, etc.
- `id` (uuid, primary key)
- `listing_id` (uuid, references `listings(id)`)
- `amenity` (text)
- `created_at` (timestamptz)

## E. `saved_listings`
Tracks homes a tenant has bookmarked.
- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles(id)`)
- `listing_id` (uuid, references `listings(id)`)
- `created_at` (timestamptz)
- *Constraint: Unique (`user_id`, `listing_id`)*

## F. `listing_reports`
User-submitted flags for unsafe or inaccurate listings.
- `id` (uuid, primary key)
- `listing_id` (uuid, references `listings(id)`)
- `reporter_id` (uuid, references `profiles(id)`, nullable)
- `reason` (text, check: `fake_listing`, `already_taken`, `wrong_price`, `wrong_location`, `wrong_photos`, `scam_request`, `unsafe_property`, `hidden_agent_fee`, `duplicate`, `other`)
- `message` (text, nullable)
- `status` (text, check: `new`, `reviewing`, `resolved`, `dismissed`)
- `created_at` (timestamptz)
- `resolved_at` (timestamptz, nullable)

## G. `contact_events`
Analytics for measuring how often users request to communicate.
- `id` (uuid, primary key)
- `listing_id` (uuid, references `listings(id)`)
- `user_id` (uuid, references `profiles(id)`, nullable)
- `event_type` (text, check: `call_click`, `whatsapp_click`)
- `created_at` (timestamptz)
- `user_agent` (text, nullable)

## H. `availability_checks`
Crowdsourced status tracking.
- `id` (uuid, primary key)
- `listing_id` (uuid, references `listings(id)`)
- `user_id` (uuid, references `profiles(id)`, nullable)
- `status` (text, check: `still_available_clicked`, `reported_taken`)
- `created_at` (timestamptz)

## I. `verification_requests`
Requests from owners to gain trust badges.
- `id` (uuid, primary key)
- `listing_id` (uuid, references `listings(id)`, nullable)
- `requester_id` (uuid, references `profiles(id)`)
- `request_type` (text, check: `phone`, `location`, `scout`, `landlord_trust`)
- `status` (text, check: `pending`, `approved`, `rejected`)
- `notes` (text, nullable)
- `reviewed_by` (uuid, references `profiles(id)`, nullable)
- `created_at` (timestamptz)
- `reviewed_at` (timestamptz, nullable)

## J. `admin_actions`
Audit log for moderation events.
- `id` (uuid, primary key)
- `admin_id` (uuid, references `profiles(id)`)
- `target_type` (text, check: `listing`, `report`, `user`, `verification_request`)
- `target_id` (uuid)
- `action` (text)
- `notes` (text, nullable)
- `created_at` (timestamptz)

## K. `notifications`
In-app messaging to users.
- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles(id)`)
- `type` (text)
- `title` (text)
- `message` (text)
- `is_read` (boolean, default false)
- `created_at` (timestamptz)

## Future Considerations
- **Indexes**: Create indexes on `county`, `town`, `estate`, `house_type`, `monthly_rent` to speed up searches.
- **Foreign Keys**: Ensure ON DELETE CASCADE where appropriate (e.g., dropping a listing drops its photos).
- **Search**: Plan for PostgreSQL full-text search (`tsvector`) on `title` and `description` later.
- **Geolocation**: Add PostGIS or simple lat/lng fields for precise map features when feasible, currently omitted for MVP simplicity.
