-- KejaFinder: Row Level Security policies + SECURITY DEFINER controlled-transition functions.
--
-- Design invariant this whole file exists to enforce: no client (including an admin, who
-- authenticates as the same shared `authenticated` Postgres role as everyone else) may ever
-- directly write moderation_status, verification_level, is_featured, the counter columns,
-- owner_id, or profiles.role/is_phone_verified/is_id_verified via a raw insert/update. Those
-- fields change only through the column-privilege-gated paths below or the SECURITY DEFINER
-- functions in this file. This is what closes both Critical Firestore-era vulnerabilities
-- (listing self-approval, profile role self-escalation) structurally rather than by convention.

alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.saved_listings enable row level security;
alter table public.listing_reports enable row level security;
alter table public.verification_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_actions enable row level security;

-- ============ is_admin() helper ============
-- SECURITY DEFINER is required for correctness, not just performance: admins has no SELECT
-- policy for authenticated/anon, so a SECURITY INVOKER version would see zero rows under RLS
-- and always return false, even for real admins. search_path is pinned to '' and every
-- reference is schema-qualified to prevent search-path hijacking.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ============ profiles ============
-- Owner + admin only, never public -- listing contact info lives on listings itself.
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id or (select public.is_admin()));

create policy "profiles_insert" on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update" on public.profiles for update
  using (auth.uid() = id or (select public.is_admin()))
  with check (auth.uid() = id or (select public.is_admin()));

revoke insert, update on public.profiles from authenticated, anon;
grant insert (id, full_name, phone, email, role, county, town, estate) on public.profiles to authenticated;
grant update (full_name, phone, avatar_url, county, town, estate) on public.profiles to authenticated;
-- role, is_phone_verified, is_id_verified: no UPDATE grant to anyone client-side, including
-- admins. role is set once at signup by the handle_new_user trigger (next migration). A mis-set
-- role or a verification-flag change is a Supabase Studio (service_role) operation, deliberately
-- not a client-facing RPC, since it should be rare.

-- ============ admins ============
-- Zero insert/update/delete policy for authenticated/anon at all -- the only way a row is ever
-- added is via the service_role key (Studio or a trusted script). No client code path exists.
create policy "admins_select" on public.admins for select
  using ((select public.is_admin()));

-- ============ listings ============
create policy "listings_select" on public.listings for select using (
  (moderation_status = 'approved' and availability_status = 'available' and is_available = true)
  or owner_id = auth.uid()
  or (select public.is_admin())
);

create policy "listings_insert" on public.listings for insert with check (
  owner_id = auth.uid()
  and exists (select 1 from public.profiles where id = auth.uid() and role in ('landlord','caretaker','agent','scout'))
);

create policy "listings_update" on public.listings for update
  using (
    (owner_id = auth.uid() and moderation_status in ('draft','pending_review'))
    or (select public.is_admin())
  )
  with check (
    owner_id = auth.uid() or (select public.is_admin())
  );

create policy "listings_delete" on public.listings for delete using (
  (owner_id = auth.uid() and moderation_status = 'draft')
  or (select public.is_admin())
);

revoke insert, update on public.listings from authenticated, anon;
grant insert (
  owner_id, title, description, house_type, monthly_rent, deposit_amount, water_charge,
  electricity_type, agent_fee, viewing_fee, county, town, estate, landmark, distance_from_road,
  toilet_type, bathroom_type, floor_level, security, contact_name, contact_role, contact_phone,
  whatsapp_phone, amenities, lat, lng
) on public.listings to authenticated;
grant update (
  title, description, house_type, monthly_rent, deposit_amount, water_charge, electricity_type,
  agent_fee, viewing_fee, county, town, estate, landmark, distance_from_road, toilet_type,
  bathroom_type, floor_level, security, contact_name, contact_role, contact_phone, whatsapp_phone,
  amenities, availability_status, is_available, lat, lng
) on public.listings to authenticated;
-- moderation_status, verification_level, is_featured, views_count, call_clicks_count,
-- whatsapp_clicks_count, report_count, owner_id, id, created_at: no grant at all, on INSERT or
-- UPDATE, to anyone client-side -- they change only via the functions below.

-- ============ listing_images ============
create policy "listing_images_select" on public.listing_images for select using (
  exists (
    select 1 from public.listings l where l.id = listing_images.listing_id and (
      (l.moderation_status = 'approved' and l.availability_status = 'available' and l.is_available = true)
      or l.owner_id = auth.uid()
      or (select public.is_admin())
    )
  )
);

create policy "listing_images_insert" on public.listing_images for insert with check (
  exists (select 1 from public.listings l where l.id = listing_id and (l.owner_id = auth.uid() or (select public.is_admin())))
);

create policy "listing_images_delete" on public.listing_images for delete using (
  exists (select 1 from public.listings l where l.id = listing_images.listing_id and (l.owner_id = auth.uid() or (select public.is_admin())))
);

-- ============ saved_listings ============
create policy "saved_listings_all" on public.saved_listings for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============ listing_reports ============
-- Create for yourself only; admin-only read/manage (owners never see who reported them).
create policy "listing_reports_insert" on public.listing_reports for insert
  with check (reporter_id = auth.uid() and status = 'new');
create policy "listing_reports_select" on public.listing_reports for select
  using ((select public.is_admin()));
create policy "listing_reports_update" on public.listing_reports for update
  using ((select public.is_admin()));
create policy "listing_reports_delete" on public.listing_reports for delete
  using ((select public.is_admin()));

-- ============ verification_requests ============
create policy "verification_requests_insert" on public.verification_requests for insert
  with check (requester_id = auth.uid() and status = 'pending');
create policy "verification_requests_select" on public.verification_requests for select
  using (requester_id = auth.uid() or (select public.is_admin()));
create policy "verification_requests_update" on public.verification_requests for update
  using ((select public.is_admin()));
create policy "verification_requests_delete" on public.verification_requests for delete
  using ((requester_id = auth.uid() and status = 'pending') or (select public.is_admin()));

-- ============ notifications ============
-- System/trigger-generated only -- no client insert policy at all. Users manage read-state only.
create policy "notifications_select" on public.notifications for select
  using (user_id = auth.uid());
create policy "notifications_update" on public.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications_delete" on public.notifications for delete
  using (user_id = auth.uid());

revoke update on public.notifications from authenticated, anon;
grant update (is_read) on public.notifications to authenticated;

-- ============ admin_actions ============
-- Immutable audit log: admin-read-only, written only by admin_moderate_listing() below.
create policy "admin_actions_select" on public.admin_actions for select
  using ((select public.is_admin()));

-- ============ controlled state-transition functions ============
-- Every function: fully schema-qualified references, search_path pinned to '', hardcoded
-- dispatch (never dynamic SQL), re-checks auth.uid()/is_admin() internally since SECURITY
-- DEFINER bypasses RLS -- the function body IS the security boundary. EXECUTE is revoked from
-- PUBLIC and granted only to the roles that need it.

create or replace function public.submit_listing_for_review(p_listing_id uuid)
returns public.listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.listings;
begin
  update public.listings
    set moderation_status = 'pending_review'
    where id = p_listing_id
      and owner_id = auth.uid()
      and moderation_status = 'draft'
    returning * into v_row;

  if not found then
    raise exception 'Listing not found, not owned by you, or not in draft status.';
  end if;

  return v_row;
end;
$$;
revoke all on function public.submit_listing_for_review(uuid) from public;
grant execute on function public.submit_listing_for_review(uuid) to authenticated;

create or replace function public.admin_moderate_listing(p_listing_id uuid, p_action text, p_notes text default null)
returns public.listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.listings;
begin
  if not (select public.is_admin()) then
    raise exception 'Admin privileges required.';
  end if;

  case p_action
    when 'approve' then
      update public.listings set moderation_status = 'approved', availability_status = 'available', is_available = true where id = p_listing_id returning * into v_row;
    when 'reject' then
      update public.listings set moderation_status = 'rejected', is_available = false where id = p_listing_id returning * into v_row;
    when 'reset_to_draft' then
      update public.listings set moderation_status = 'draft', is_available = false where id = p_listing_id returning * into v_row;
    when 'feature' then
      update public.listings set is_featured = true where id = p_listing_id returning * into v_row;
    when 'unfeature' then
      update public.listings set is_featured = false where id = p_listing_id returning * into v_row;
    when 'verify_phone' then
      update public.listings set verification_level = 'phone' where id = p_listing_id returning * into v_row;
    when 'verify_location' then
      update public.listings set verification_level = 'location' where id = p_listing_id returning * into v_row;
    when 'verify_scout' then
      update public.listings set verification_level = 'scout' where id = p_listing_id returning * into v_row;
    when 'verify_trusted' then
      update public.listings set verification_level = 'trusted' where id = p_listing_id returning * into v_row;
    else
      raise exception 'Unknown action: %', p_action;
  end case;

  if not found then
    raise exception 'Listing % not found.', p_listing_id;
  end if;

  insert into public.admin_actions (admin_id, target_type, target_id, action, notes)
    values (auth.uid(), 'listing', p_listing_id, p_action, p_notes);

  return v_row;
end;
$$;
revoke all on function public.admin_moderate_listing(uuid, text, text) from public;
grant execute on function public.admin_moderate_listing(uuid, text, text) to authenticated;

create or replace function public.increment_listing_view(p_listing_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.listings set views_count = views_count + 1
    where id = p_listing_id and moderation_status = 'approved';
$$;
revoke all on function public.increment_listing_view(uuid) from public;
grant execute on function public.increment_listing_view(uuid) to authenticated, anon;

create or replace function public.increment_contact_click(p_listing_id uuid, p_click_type text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_click_type = 'call' then
    update public.listings set call_clicks_count = call_clicks_count + 1
      where id = p_listing_id and moderation_status = 'approved';
  elsif p_click_type = 'whatsapp' then
    update public.listings set whatsapp_clicks_count = whatsapp_clicks_count + 1
      where id = p_listing_id and moderation_status = 'approved';
  else
    raise exception 'Invalid click type: %', p_click_type;
  end if;
end;
$$;
revoke all on function public.increment_contact_click(uuid, text) from public;
grant execute on function public.increment_contact_click(uuid, text) to authenticated, anon;

-- report_count is bumped automatically -- never a direct client-facing update path at all.
create or replace function public.bump_listing_report_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.listings set report_count = report_count + 1 where id = new.listing_id;
  return new;
end;
$$;

create trigger trg_bump_report_count after insert on public.listing_reports
  for each row execute function public.bump_listing_report_count();

-- Nearest-listing search, backing the blueprint's "Nearest" sort option that had no
-- supporting data model at all under Firestore.
create or replace function public.nearby_listings(p_lat double precision, p_lng double precision, p_radius_km double precision default 10)
returns setof public.listings
language sql
stable
set search_path = ''
as $$
  select l.*
  from public.listings l
  where l.moderation_status = 'approved'
    and l.availability_status = 'available'
    and l.is_available = true
    and l.lat is not null
    and l.lng is not null
    and public.earth_distance(public.ll_to_earth(p_lat, p_lng), public.ll_to_earth(l.lat, l.lng)) <= p_radius_km * 1000
  order by public.earth_distance(public.ll_to_earth(p_lat, p_lng), public.ll_to_earth(l.lat, l.lng)) asc;
$$;
revoke all on function public.nearby_listings(double precision, double precision, double precision) from public;
grant execute on function public.nearby_listings(double precision, double precision, double precision) to authenticated, anon;
