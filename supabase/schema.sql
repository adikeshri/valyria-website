-- Beta-tester sign-ups for valyria.dev.
-- Paste this into the Supabase dashboard → SQL Editor → Run (or apply with the
-- Supabase CLI). The website inserts rows straight from the browser using the
-- project's anon key; the RLS policy below is what makes that safe — anon can
-- INSERT and nothing else (no SELECT/UPDATE/DELETE).

create table if not exists public.beta_signups (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null,
  name        text not null,
  company     text not null,
  designation text not null,
  os          text,
  use_case    text,
  source      text,

  -- one row per email; a repeat submit returns 409, which the form treats as
  -- "already on the list"
  constraint beta_signups_email_key unique (email),

  -- cheap server-side sanity limits so junk can't bloat the table
  constraint beta_signups_email_shape   check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  constraint beta_signups_name_len      check (char_length(name) between 1 and 120),
  constraint beta_signups_company_len   check (char_length(company) between 1 and 160),
  constraint beta_signups_desig_len     check (char_length(designation) between 1 and 160),
  constraint beta_signups_usecase_len   check (use_case is null or char_length(use_case) <= 2000)
);

alter table public.beta_signups enable row level security;

-- Allow anonymous inserts only.
drop policy if exists "anon can insert beta signups" on public.beta_signups;
create policy "anon can insert beta signups"
  on public.beta_signups
  for insert
  to anon
  with check (true);

-- (No select policy on purpose: submissions are write-only from the browser.
--  Read them in the Supabase Table Editor, or with the service_role key.)
