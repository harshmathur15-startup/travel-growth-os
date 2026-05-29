-- Users table (mirrors Clerk, extended with plan/usage)
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email         text not null,
  name          text,
  plan          text not null default 'free',
  audits_this_month int not null default 0,
  audit_reset_date  date,
  created_at    timestamptz not null default now()
);

-- Businesses table (one per user for MVP)
create table if not exists businesses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users(id) on delete cascade,
  name            text not null,
  website_url     text not null,
  category        text not null,
  city            text not null,
  instagram       text,
  google_business text,
  created_at      timestamptz not null default now(),
  unique (user_id)
);

-- Audits table
create table if not exists audits (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  business_id   uuid not null references businesses(id) on delete cascade,
  status        text not null default 'pending',  -- pending | complete | failed
  overall_score int not null default 0,
  summary       text not null default '',
  created_at    timestamptz not null default now()
);

-- Audit dimensions (6 rows per audit)
create table if not exists audit_dimensions (
  id                  uuid primary key default gen_random_uuid(),
  audit_id            uuid not null references audits(id) on delete cascade,
  name                text not null,
  score               int not null,
  findings            text[] not null default '{}',
  top_recommendation  text not null,
  impact              text not null,
  created_at          timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_businesses_user_id on businesses(user_id);
create index if not exists idx_audits_user_id on audits(user_id);
create index if not exists idx_audits_status on audits(status);
create index if not exists idx_audit_dimensions_audit_id on audit_dimensions(audit_id);

-- Row-level security (optional but recommended)
alter table users enable row level security;
alter table businesses enable row level security;
alter table audits enable row level security;
alter table audit_dimensions enable row level security;

-- Service role bypasses RLS (used by server-side API routes)
-- No additional policies needed when using the service role key
