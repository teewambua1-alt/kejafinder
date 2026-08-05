-- KejaFinder: auth.users -> public.profiles bootstrap trigger.
--
-- Creates the profile row in the SAME transaction as the auth.users insert, which eliminates
-- the Firebase-era signup race entirely (there, a Firestore onAuthStateChanged listener and the
-- signup flow's own profile write were two independent async operations that could resolve out
-- of order, leaving a new landlord/agent/scout stuck on a tenant fallback). There is no second
-- writer here at all -- by the time supabase.auth.signUp() resolves, this trigger has already run.
--
-- Extra signup fields travel in supabase.auth.signUp({ options: { data: { full_name, phone,
-- role, county, town, estate } } }), landing in auth.users.raw_user_meta_data.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'tenant');
  if v_role not in ('tenant','landlord','caretaker','agent','scout') then
    v_role := 'tenant';
  end if;

  insert into public.profiles (id, full_name, phone, email, role, county, town, estate)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    new.email,
    v_role,
    new.raw_user_meta_data->>'county',
    new.raw_user_meta_data->>'town',
    new.raw_user_meta_data->>'estate'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
