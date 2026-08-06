-- ============ saved_searches ============
-- Mirrors saved_listings' shape and RLS policy exactly: owner-only, single
-- "for all" policy, no admin override needed (nothing here is moderated).
create table public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  query text not null default '',
  filters jsonb not null default '{}'::jsonb,
  sort text not null default 'Most relevant',
  created_at timestamptz not null default now()
);
create index idx_saved_searches_user on public.saved_searches(user_id, created_at desc);

alter table public.saved_searches enable row level security;

create policy "saved_searches_all" on public.saved_searches for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
