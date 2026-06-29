-- ===== ウンポポ君のおさんぽマッチング : Supabase スキーマ =====
-- Supabase の SQL Editor に貼り付けて実行してください。

create table if not exists orgs (
  id text primary key,
  name text not null,
  rep_name text not null,
  email text not null,
  phone text default '',
  area text not null,
  website text default '',
  dog_count integer default 0,
  description text default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists walkers (
  id text primary key,
  name text not null,
  email text not null,
  phone text default '',
  area text not null,
  age_group text not null,
  motivation text default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key,
  walker_id text,
  walker_name text not null,
  org_id text,
  org_name text not null,
  amount integer not null default 500,
  system_fee integer not null default 100,
  donation integer not null default 400,
  status text not null default 'paid',
  note text default '',
  created_at timestamptz not null default now()
);

create table if not exists payouts (
  id text primary key,
  org_id text,
  org_name text not null,
  amount integer not null,
  period text not null,
  status text not null default 'paid',
  note text default '',
  created_at timestamptz not null default now()
);

-- RLS は有効化し、サーバ側（service_role キー）からのみ操作する想定。
alter table orgs enable row level security;
alter table walkers enable row level security;
alter table payments enable row level security;
alter table payouts enable row level security;

-- 公開フォームからの登録を anon キーで許可したい場合は、以下の insert ポリシーを追加します。
-- （本実装はサーバの service_role キー経由のため必須ではありません）
-- create policy "anon insert orgs" on orgs for insert to anon with check (true);
-- create policy "anon insert walkers" on walkers for insert to anon with check (true);
