-- SECURITY HARDENING
-- Revoke access to the 'upsert_subscription' function from public/anon/authenticated users.
-- This ensures that only the Service Role (Admin) can verify payments and update plans.
-- Prevents users from manually calling this function from the browser console to get free upgrades.

REVOKE EXECUTE ON FUNCTION upsert_subscription(text, text) FROM public;
REVOKE EXECUTE ON FUNCTION upsert_subscription(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION upsert_subscription(text, text) FROM authenticated;

-- Only strictly allow service_role (which bypasses RLS anyway, but good to be explicit if we used roles)
GRANT EXECUTE ON FUNCTION upsert_subscription(text, text) TO service_role;
