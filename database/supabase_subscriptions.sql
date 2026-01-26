-- 5. SUBSCRIPTIONS TABLE
create table if not exists subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  plan text not null check (plan in ('free', 'elite', 'ai_ultimate')),
  status text default 'active',
  payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

alter table subscriptions enable row level security;

create policy "Users can view their own subscription" on subscriptions
  for select using (auth.uid() = user_id);
  
-- Allow server (service role) to manage subscriptions, but users can read.
