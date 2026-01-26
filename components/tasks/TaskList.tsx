import { createClient } from '@/lib/supabase/client'
import { TaskItem } from '@/components/tasks/TaskItem'
import { CreateTaskInline } from '@/components/tasks/CreateTaskInline'
import { useEffect, useState } from 'react'

// Client component wrapper that fetches tasks for a specific milestone
// Note: We use a Client Component here to allow easier state management of the list if needed,
// but usually Server Components are better. 
// However, since we are inside a MilestoneItem which is client-side (for toggle state),
// keeping this logic encapsulated is clean. But fetching in a loop is bad. 
// BETTER: Fetch all tasks in the Page.tsx and pass them down grouped by milestone.
// Let's refactor VisionDetailPage to fetch tasks.
// BUT for now, to avoid rewriting the whole Page.tsx, let's create a Server Component responsible for listing tasks
// that we can suspend inside the MilestoneItem? No, MilestoneItem is client.
// Solution: Pass "initialTasks" to MilestoneItem.

// Wait, I need to update MilestoneItem.tsx to accept tasks and render this list.
// AND I need to update the page.tsx to fetch tasks.

export function TaskList({ tasks, milestoneId }: { tasks: any[], milestoneId: string }) {
    return (
        <div className="mt-2 ml-9 space-y-1">
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}
            <CreateTaskInline milestoneId={milestoneId} />
        </div>
    )
}
