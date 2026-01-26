-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. VISIONS TABLE
create table if not exists visions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  category text check (category in ('Career', 'Money', 'Health', 'Skills', 'Personal')),
  time_horizon text check (time_horizon in ('6 months', '1 year', '3 years')),
  status text default 'In Progress',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table visions enable row level security;

-- Policies
create policy "Users can view their own visions" on visions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own visions" on visions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own visions" on visions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own visions" on visions
  for delete using (auth.uid() = user_id);


-- 2. MILESTONES TABLE
create table if not exists milestones (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  vision_id uuid references visions(id) on delete cascade not null,
  title text not null,
  description text,
  deadline date,
  status text default 'Not Started',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table milestones enable row level security;

create policy "Users can view their own milestones" on milestones
  for select using (auth.uid() = user_id);

create policy "Users can insert their own milestones" on milestones
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own milestones" on milestones
  for update using (auth.uid() = user_id);

create policy "Users can delete their own milestones" on milestones
  for delete using (auth.uid() = user_id);


-- 3. TASKS TABLE
create table if not exists tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  milestone_id uuid references milestones(id) on delete set null,
  title text not null,
  priority text default 'Medium',
  is_completed boolean default false,
  is_daily_priority boolean default false,
  planned_date date,
  due_date date,
  estimated_time integer, -- in minutes
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table tasks enable row level security;

create policy "Users can view their own tasks" on tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks" on tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks" on tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks" on tasks
  for delete using (auth.uid() = user_id);


-- 4. DAILY LOGS TABLE
create table if not exists daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  date date not null,
  reflection_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table daily_logs enable row level security;

create policy "Users can view their own logs" on daily_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert/update their own logs" on daily_logs
  for all using (auth.uid() = user_id);
