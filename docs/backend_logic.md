# 🧠 BACKEND LOGIC & DATA FLOW

## 1. 🔄 Progress Calculation Logic
*Goal: Automatically update Milestone and Vision status based on Task completion.*

### A. Task ➔ Milestone Automation (Trigger)
**Logic:**
1.  When a `task` is updated (specifically `is_completed`):
2.  Check the parent `milestone_id`.
3.  Count total tasks for that milestone.
4.  Count completed tasks.
5.  **Update Milestone Status**:
    *   If `completed == total` ➔ Set Milestone Status `Completed`.
    *   If `completed > 0` AND `completed < total` ➔ Set Milestone Status `In Progress`.
    *   If `completed == 0` ➔ Set Milestone Status `Not Started`.

**Supabase Function (PL/pgSQL):**
```sql
create or replace function update_milestone_status()
returns trigger as $$
declare
  total_tasks int;
  completed_tasks int;
begin
  -- Get counts
  select count(*), count(*) filter (where is_completed = true)
  into total_tasks, completed_tasks
  from tasks
  where milestone_id = new.milestone_id;

  -- Update Milestone
  if total_tasks > 0 then
    if total_tasks = completed_tasks then
      update milestones set status = 'Completed' where id = new.milestone_id;
    elsif completed_tasks > 0 then
      update milestones set status = 'In Progress' where id = new.milestone_id;
    else
      update milestones set status = 'In Progress' where id = new.milestone_id; -- Optional: Keep as In Progress if started
    end if;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Trigger
create trigger on_task_change
after insert or update of is_completed on tasks
for each row execute function update_milestone_status();
```

### B. Milestone ➔ Vision Automation
*Similar logic can apply to Visions, but typically Vision progress is more qualitative. We will stick to manual status updates for Visions in MVP unless requested otherwise, to avoid "false completion" (a vision might need more milestones).*

---

## 2. 📅 Daily Planner Logic
*Goal: Manage the "Top 3" priorities and daily selection.*

### A. selecting Tasks for Today
**Operation:** `assign_task_to_date(task_id, date)`
*   **Update**: Set `planned_date` = `date`.
*   **Reset**: If assigning to a *new* date, ensure `is_daily_priority` is reset to `false` (until user explicitly makes it a top priority for that new day).

### B. Enforcing "Top 3" Priorities
**Operation:** `set_daily_priority(task_id, is_priority)`
*   **Validation**:
    *   If `is_priority` is being set to `TRUE`:
    *   Count existing priorities for that `task.planned_date` AND `user_id`.
    *   If Count >= 3 ➔ **Throw Error**: "You can only have 3 Top Priorities per day."

**Supabase Function (Constraint/Trigger):**
```sql
create or replace function check_daily_priority_limit()
returns trigger as $$
declare
  priority_count int;
begin
  if new.is_daily_priority = true then
    select count(*) into priority_count
    from tasks
    where user_id = new.user_id 
      and planned_date = new.planned_date
      and is_daily_priority = true
      and id != new.id; -- Exclude self if updating

    if priority_count >= 3 then
      raise exception 'Limit Reached: You can only define 3 Top Priorities per day.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;
```

---

## 3. 🛡️ Data Validation & Security
*   **RLS (Already defined in Step 3)**: strictly enforces `user_id = auth.uid()`.
*   **Input Validation**:
    *   `estimated_time`: Must be positive integer.
    *   `due_date`: Should ideally be >= Today (warning only).
