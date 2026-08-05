-- KejaFinder: initial Postgres schema (Firebase -> Supabase migration, Phase A)

create extension if not exists pgcrypto;
create extension if not exists cube;
create extension if not exists earthdistance;

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  role text not null default 'tenant' check (role in ('tenant','landlord','caretaker','agent','scout')),
  avatar_url text,
  county text,
  town text,
  estate text,
  is_phone_verified boolean not null default false,
  is_id_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_profiles_role on public.profiles(role);

-- ============ admins ============
-- Deliberately separate from profiles.role, which cannot hold 'admin' at all (see CHECK above).
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ============ listings ============
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  house_type text not null check (house_type in ('single_room','bedsitter','mabati','studio','one_bedroom','two_bedroom','three_bedroom','student_room','other')),
  monthly_rent numeric(10,2) not null check (monthly_rent > 0),
  deposit_amount numeric(10,2) not null default 0 check (deposit_amount >= 0),
  water_charge text,
  electricity_type text,
  agent_fee numeric(10,2) not null default 0 check (agent_fee >= 0),
  viewing_fee numeric(10,2) not null default 0 check (viewing_fee >= 0),
  county text not null,
  town text not null,
  estate text not null,
  landmark text,
  distance_from_road text,
  toilet_type text,
  bathroom_type text,
  floor_level text,
  security text,
  contact_name text not null,
  contact_role text not null check (contact_role in ('landlord','caretaker','agent','scout')),
  contact_phone text not null,
  whatsapp_phone text,
  amenities text[] not null default '{}',
  moderation_status text not null default 'draft' check (moderation_status in ('draft','pending_review','approved','rejected')),
  availability_status text not null default 'pending' check (availability_status in ('available','taken','pending','expired')),
  verification_level text not null default 'none' check (verification_level in ('none','phone','location','scout','trusted')),
  is_featured boolean not null default false,
  is_available boolean not null default false,
  views_count integer not null default 0 check (views_count >= 0),
  call_clicks_count integer not null default 0 check (call_clicks_count >= 0),
  whatsapp_clicks_count integer not null default 0 check (whatsapp_clicks_count >= 0),
  report_count integer not null default 0 check (report_count >= 0),
  lat double precision,
  lng double precision,
  search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(estate,'') || ' ' || coalesce(town,'') || ' ' || coalesce(county,'') || ' ' || coalesce(landmark,'')), 'B') ||
    setweight(to_tsvector('simple', coalesce(description,'')), 'C')
  ) stored,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_listings_public_feed on public.listings (moderation_status, availability_status, created_at desc) where moderation_status = 'approved';
create index idx_listings_owner on public.listings(owner_id);
create index idx_listings_amenities on public.listings using gin(amenities);
create index idx_listings_search on public.listings using gin(search_vector);
create index idx_listings_geo on public.listings using gist (ll_to_earth(lat, lng));
create index idx_listings_rent on public.listings(monthly_rent) where moderation_status = 'approved';

-- ============ listing_images ============
create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  category text check (category in ('room','outside','toilet','kitchen','compound','other')),
  position smallint not null default 0,
  created_at timestamptz not null default now()
);
create index idx_listing_images_listing on public.listing_images(listing_id, position);

-- ============ saved_listings ============
create table public.saved_listings (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);
create index idx_saved_listings_listing on public.saved_listings(listing_id);

-- ============ listing_reports ============
create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason text not null check (reason in ('fake_listing','already_taken','wrong_price','wrong_location','wrong_photos','scam_request','unsafe_property','hidden_agent_fee','duplicate','other')),
  message text,
  status text not null default 'new' check (status in ('new','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index idx_listing_reports_listing on public.listing_reports(listing_id);
create index idx_listing_reports_status on public.listing_reports(status);

-- ============ verification_requests ============
create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  request_type text not null check (request_type in ('phone','location','scout','landlord_trust')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index idx_verification_requests_requester on public.verification_requests(requester_id);
create index idx_verification_requests_status on public.verification_requests(status);

-- ============ notifications ============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on public.notifications(user_id, is_read, created_at desc);

-- ============ admin_actions ============
-- Beyond the minimum 8 tables: an audit log, written only by admin_moderate_listing() (see functions migration).
create table public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id),
  target_type text not null check (target_type in ('listing','report','user','verification_request')),
  target_id uuid not null,
  action text not null,
  notes text,
  created_at timestamptz not null default now()
);
create index idx_admin_actions_target on public.admin_actions(target_type, target_id);

-- ============ updated_at trigger ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();
