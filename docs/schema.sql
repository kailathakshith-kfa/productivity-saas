-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. VISIONS
create table if not exists visions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  category text check (category in ('Career', 'Money', 'Health', 'Skills', 'Personal')),
  time_horizon text check (time_horizon in ('6 months', '1 year', '3 years')),
  status text default 'In Progress' check (status in ('In Progress', 'Completed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. MILESTONES
create table if not exists milestones (
  id uuid default uuid_generate_v4() primary key,
  vision_id uuid references visions(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null, -- denormalized for easier RLS
  title text not null,
  description text,
  deadline date,
  status text default 'Not Started' check (status in ('Not Started', 'In Progress', 'Completed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. TASKS
create table if not exists tasks (
  id uuid default uuid_generate_v4() primary key,
  milestone_id uuid references milestones(id) on delete set null, -- Nullable for ad-hoc tasks
  user_id uuid references auth.users(id) not null,
  title text not null,
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  due_date date,
  estimated_time int, -- in minutes
  is_completed boolean default false,
  planned_date date, -- For Daily Planner
  is_daily_priority boolean default false, -- For "Top 3"
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. DAILY LOGS (Reflections)
create table if not exists daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  date date not null,
  reflection_note text,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
);

-- RLS POLICIES
alter table visions enable row level security;
alter table milestones enable row level security;
alter table tasks enable row level security;
alter table daily_logs enable row level security;

-- Policies (Drop existing to allow idempotent runs if needed, though 'create policy if not exists' is not standard SQL, we use standard create)
-- We assume a clean slate or manual handling of existing policies.
-- For this file, I'll provide standard creation command. 

create policy "Users can CRUD their own visions" on visions
  for all using (auth.uid() = user_id);

create policy "Users can CRUD their own milestones" on milestones
  for all using (auth.uid() = user_id);

create policy "Users can CRUD their own tasks" on tasks
  for all using (auth.uid() = user_id);

create policy "Users can CRUD their own daily logs" on daily_logs
  for all using (auth.uid() = user_id);
