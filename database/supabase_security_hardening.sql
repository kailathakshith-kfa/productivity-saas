-- SECURITY HARDENING SCIPT

-- 1. Strengthen Milestones Insert Policy
-- Ensure the linked Vision belongs to the same user
DROP POLICY IF EXISTS "Users can insert their own milestones" ON milestones;
CREATE POLICY "Users can insert their own milestones" ON milestones
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND
    EXISTS (
        SELECT 1 FROM visions 
        WHERE id = vision_id 
        AND user_id = auth.uid()
    )
  );

-- 2. Strengthen Tasks Insert Policy
-- Ensure the linked Milestone (if present) belongs to same user
DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND
    (
        milestone_id IS NULL 
        OR 
        EXISTS (
            SELECT 1 FROM milestones
            WHERE id = milestone_id
            AND user_id = auth.uid()
        )
    )
  );
