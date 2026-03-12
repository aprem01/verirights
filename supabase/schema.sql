-- VeriRights Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Users (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users primary key,
  account_type text check (account_type in ('independent', 'label')),
  artist_name text,
  pro_affiliation text,
  ipi_number text,
  country text,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Tracks
create table if not exists track_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  track_title text not null,
  artist_name text,
  file_url text,
  forensic_score numeric,
  forensic_flags text[],
  status text default 'analyzing',
  created_at timestamptz default now()
);

-- Questionnaire responses (JSONB for flexibility)
create table if not exists questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references track_analyses(id),
  responses jsonb,
  attestation_name text,
  attested_at timestamptz,
  created_at timestamptz default now()
);

-- Human scores
create table if not exists human_scores (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references track_analyses(id),
  overall_score numeric,
  breakdown jsonb,
  eligibility text,
  flags text[],
  recommendation text,
  created_at timestamptz default now()
);

-- Registrations
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references track_analyses(id),
  cwr_file_url text,
  payment_id text,
  registered_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table track_analyses enable row level security;
alter table questionnaire_responses enable row level security;
alter table human_scores enable row level security;
alter table registrations enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Track analyses: users can CRUD their own tracks
create policy "Users can view own tracks"
  on track_analyses for select using (auth.uid() = user_id);
create policy "Users can insert own tracks"
  on track_analyses for insert with check (auth.uid() = user_id);
create policy "Users can update own tracks"
  on track_analyses for update using (auth.uid() = user_id);

-- Questionnaire responses: users can CRUD via their tracks
create policy "Users can view own questionnaire responses"
  on questionnaire_responses for select
  using (track_id in (select id from track_analyses where user_id = auth.uid()));
create policy "Users can insert own questionnaire responses"
  on questionnaire_responses for insert
  with check (track_id in (select id from track_analyses where user_id = auth.uid()));

-- Human scores: users can view scores for their tracks
create policy "Users can view own scores"
  on human_scores for select
  using (track_id in (select id from track_analyses where user_id = auth.uid()));

-- Registrations: users can view their registrations
create policy "Users can view own registrations"
  on registrations for select
  using (track_id in (select id from track_analyses where user_id = auth.uid()));

-- Storage bucket for audio files
-- Run in Supabase dashboard: Storage > Create new bucket "tracks" (public)
-- Or via SQL:
insert into storage.buckets (id, name, public) values ('tracks', 'tracks', true)
on conflict (id) do nothing;

-- Storage policy: users can upload to their own folder
create policy "Users can upload tracks"
  on storage.objects for insert
  with check (bucket_id = 'tracks' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view tracks"
  on storage.objects for select
  using (bucket_id = 'tracks');
