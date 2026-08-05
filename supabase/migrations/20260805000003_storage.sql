-- KejaFinder: Storage buckets + policies.
--
-- Two buckets so approved listings' photos are genuinely public and CDN-cacheable (one
-- canonical URL shared by every visitor), while draft/pending-review photos stay private.
-- A listing's photos move between buckets when its moderation/availability status changes,
-- via a Database Webhook -> the existing Cloud Run server's /webhooks/listing-moderation route
-- (using the service_role key, which bypasses these policies entirely -- as intended for a
-- trusted server-side sync process).
--
-- Path convention in both buckets: {listing_id}/{image_id}.{ext}

insert into storage.buckets (id, name, public)
values ('listing-photos-pending', 'listing-photos-pending', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

create policy "pending_photos_owner_rw" on storage.objects for all using (
  bucket_id = 'listing-photos-pending'
  and exists (
    select 1 from public.listings l
    where l.id::text = (storage.foldername(name))[1]
      and (l.owner_id = auth.uid() or (select public.is_admin()))
  )
) with check (
  bucket_id = 'listing-photos-pending'
  and exists (
    select 1 from public.listings l
    where l.id::text = (storage.foldername(name))[1]
      and l.owner_id = auth.uid()
  )
);

-- Public bucket reads bypass RLS entirely via the public URL (that's the point of a public
-- bucket) -- this SELECT policy only matters for authenticated management operations.
create policy "public_photos_read" on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "public_photos_admin_write" on storage.objects for insert
  with check (bucket_id = 'listing-photos' and (select public.is_admin()));

create policy "public_photos_admin_delete" on storage.objects for delete
  using (bucket_id = 'listing-photos' and (select public.is_admin()));
