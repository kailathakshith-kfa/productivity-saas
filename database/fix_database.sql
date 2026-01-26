-- 1. Create Subscriptions Table (if missing)
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

-- 2. Enable RLS
alter table subscriptions enable row level security;

-- 3. Policy: Read Own
create policy "Users can view their own subscription" on subscriptions
  for select using (auth.uid() = user_id);

-- 4. Secure Function to Upsert Subscription (Bypasses RLS for write)
create or replace function upsert_subscription(
  p_plan text, 
  p_payment_id text
)
returns void
security definer
set search_path = public
as $$
begin
  insert into subscriptions (user_id, plan, payment_id, status, updated_at)
  values (auth.uid(), p_plan, p_payment_id, 'active', now())
  on conflict (user_id) do update
  set plan = excluded.plan,
      payment_id = excluded.payment_id,
      status = 'active',
      updated_at = now();
end;
$$ language plpgsql;
