-- Update the expiration date for existing coupons to the end of 2026
UPDATE coupons
SET expires_at = '2026-12-31 23:59:59+00'
WHERE code IN ('LAUNCH2025', 'ULTIMATE2025');
