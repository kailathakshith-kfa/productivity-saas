
-- Add image_url to visions table
ALTER TABLE visions 
ADD COLUMN IF NOT EXISTS image_url text;
