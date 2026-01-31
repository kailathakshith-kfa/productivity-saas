-- Create coupons table
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

-- RLS
alter table coupons enable row level security;

-- Only admins/service role can insert/update/delete coupons
-- Authenticated users can read coupons to check validity (or we can keep it hidden and use sensitive RPC/action)
-- Let's keep it hidden from public select, only accessible via secure server action.
create policy "Admins can manage coupons" on coupons
  for all using ( auth.uid() in ( select id from auth.users where is_super_admin = true ) ); 
-- Note: is_super_admin is hypothetical. For now, we'll rely on service_role for administration or just manual SQL for creation.
-- We won't add a policy for authenticated users to SELECT all coupons. 
-- The redemption logic will happen via a server action using a privileged client or careful query.
