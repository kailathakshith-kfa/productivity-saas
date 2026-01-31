-- 1. Create coupons table
create table if not exists coupons (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  plan_id text not null check (plan_id in ('elite', 'ai_ultimate')),
  max_uses integer default 1,
  uses integer default 0,
  expires_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS
alter table coupons enable row level security;

-- 3. Create Admin Policy (allows service_role to manage)
create policy "Admins can manage coupons" on coupons
  for all using ( auth.uid() in ( select id from auth.users where is_super_admin = true ) );
  
-- Note: existing 'service_role' always bypasses RLS, so the above policy is for future admin users.

-- 4. Seed Initial Coupon (The one you tried to create!)
INSERT INTO coupons (code, plan_id, max_uses, expires_at)
VALUES 
  ('LAUNCH2025', 'elite', 100, '2026-12-31'),
  ('ULTIMATE2025', 'ai_ultimate', 50, '2026-12-31')
ON CONFLICT (code) DO NOTHING;
