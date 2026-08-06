-- Closes a real gap: listings_update's USING clause only allows an owner to
-- update their own row while moderation_status is 'draft' or 'pending_review',
-- so once a listing is approved the owner can't update it at all -- not even
-- to mark it taken/available, which the column-grant list (availability_status,
-- is_available are not in the "no client write" set) shows was never the
-- intent. A narrow SECURITY DEFINER function closes this the same way every
-- other sensitive transition in this file already works, rather than
-- loosening the blanket UPDATE policy.
create or replace function public.set_listing_availability(p_listing_id uuid, p_available boolean)
returns public.listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.listings;
begin
  update public.listings
    set availability_status = case when p_available then 'available' else 'taken' end,
        is_available = p_available
    where id = p_listing_id and owner_id = auth.uid() and moderation_status = 'approved'
    returning * into v_row;

  if not found then
    raise exception 'Listing not found, not owned by you, or not approved yet.';
  end if;

  return v_row;
end;
$$;
revoke all on function public.set_listing_availability(uuid, boolean) from public;
grant execute on function public.set_listing_availability(uuid, boolean) to authenticated;
