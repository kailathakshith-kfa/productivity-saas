-- Add subscription_id column to subscriptions table to support auto-pay
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS subscription_id text;

-- Optional: Add index for faster lookups if you query by subscription_id later
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscription_id ON subscriptions(subscription_id);
