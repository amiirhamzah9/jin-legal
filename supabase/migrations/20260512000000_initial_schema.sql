-- Practice Areas
create table practice_areas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null,
  full_content text,
  icon_name text not null,
  display_order int not null default 0,
  created_at timestamptz default now()
);

-- Team Members
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  credentials text,
  role text not null,
  bio text,
  photo_url text,
  practice_areas text[],
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Blog Posts
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  category text,
  author_id uuid references team_members(id),
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz default now()
);

-- Careers
create table careers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type text not null,
  location text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Contact Leads
create table contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- Row Level Security: public read for content, no public read for leads
alter table practice_areas enable row level security;
alter table team_members enable row level security;
alter table blog_posts enable row level security;
alter table careers enable row level security;
alter table contact_leads enable row level security;

create policy "practice_areas read" on practice_areas for select to anon using (true);
create policy "team_members read active" on team_members for select to anon using (is_active = true);
create policy "blog_posts read published" on blog_posts for select to anon using (is_published = true);
create policy "careers read active" on careers for select to anon using (is_active = true);
create policy "contact_leads insert" on contact_leads for insert to anon with check (true);

create index idx_practice_areas_order on practice_areas(display_order);
create index idx_team_members_order on team_members(display_order) where is_active = true;
create index idx_blog_posts_published on blog_posts(published_at desc) where is_published = true;
