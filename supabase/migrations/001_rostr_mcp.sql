-- SalesGency ROSTR MCP kit: tables for API keys, licenses, approvals and usage.
-- Run this once in the Supabase SQL editor (or `supabase db push`).
-- Row Level Security is ON with no policies, so only your server (service role key) can touch these tables.

create table if not exists rostr_api_keys (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  key_hash     text not null unique,   -- we store only a hash, never the key itself
  key_prefix   text not null,          -- first characters, so you can recognise a key in a list
  name         text not null default 'default',
  created_at   timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at   timestamptz
);

-- If you already track licenses in your entitlement engine, point lib/mcp/store.supabase.ts at that table instead.
create table if not exists rostr_entitlements (
  user_id    uuid not null,
  agent_slug text not null,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, agent_slug)
);

create table if not exists rostr_approvals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  agent_slug text not null,
  tool_name  text not null,
  input      jsonb not null,           -- exactly what was approved; this is what runs
  status     text not null default 'pending'
             check (status in ('pending','approved','rejected','executed')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists rostr_usage (
  id         bigint generated always as identity primary key,
  user_id    uuid not null,
  tool_name  text not null,
  ok         boolean not null,
  created_at timestamptz not null default now()
);

alter table rostr_api_keys     enable row level security;
alter table rostr_entitlements enable row level security;
alter table rostr_approvals    enable row level security;
alter table rostr_usage        enable row level security;

