import { createClient } from '@/lib/supabase/server'
import { DailyTaskItem } from '@/components/planner/DailyTaskItem'
import { TaskPool } from '@/components/planner/TaskPool'
import { DailyReflection } from '@/components/planner/DailyReflection'
import { DateNavigator } from '@/components/planner/DateNavigator'
import { CreateTaskModal } from '@/components/planner/CreateTaskModal'

export default async function PlannerPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
    // ... logic (Date determination logic remains the same)
    const supabase = await createClient()

    // 1. Determine Date (default to today URL param or server today)
    const params = await searchParams
    const today = new Date().toISOString().split('T')[0]
    const selectedDate = params.date || today

    // ... (rest of data fetching logic)
    const { data: plannedTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('planned_date', selectedDate)
        .order('is_daily_priority', { ascending: false })

    const topPriorities = plannedTasks?.filter(t => t.is_daily_priority) || []
    const otherPlanned = plannedTasks?.filter(t => !t.is_daily_priority) || []

    const { data: backlogTasks } = await supabase
        .from('tasks')
        .select('*, milestones(title)')
        .eq('is_completed', false)
        .not('planned_date', 'eq', selectedDate) // Exclude today's
        .order('created_at', { ascending: false })

    // ... backlog transforms
    const backlog = backlogTasks?.map(t => ({
        ...t,
        milestone_title: t.milestones?.title
    })) || []

    const { data: log } = await supabase
        .from('daily_logs')
        .select('reflection_note')
        .eq('date', selectedDate)
        .single()

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Daily Planner</h1>
                <CreateTaskModal currentDate={selectedDate} />
            </div>

            {/* Date Navigator */}
            <DateNavigator date={selectedDate} />

            {/* Top 3 Priorities */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-indigo-300">Top 3 Priorities</h2>
                <div className="space-y-3">
                    {topPriorities.map(task => (
                        <DailyTaskItem key={task.id} task={task} date={selectedDate} isTopPriority />
                    ))}
                    {topPriorities.length < 3 && (
                        <div className="rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-4 text-center text-sm text-indigo-400/50">
                            Select a task below and click the Star icon to promote it here.
                        </div>
                    )}
                </div>
            </section>

            {/* Other Tasks for Today */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Planned Tasks</h2>
                <div className="space-y-3">
                    {otherPlanned.map(task => (
                        <DailyTaskItem key={task.id} task={task} date={selectedDate} />
                    ))}
                    {otherPlanned.length === 0 && topPriorities.length === 0 && (
                        <p className="text-sm text-neutral-500">No tasks planned for today.</p>
                    )}
                </div>
            </section>

            {/* Task Pool */}
            <section>
                <TaskPool tasks={backlog} currentDate={selectedDate} />
            </section>

            {/* Reflection */}
            <section className="border-t border-neutral-800 pt-8">
                <DailyReflection initialNote={log?.reflection_note || ''} date={selectedDate} />
            </section>
        </div>
    )
}
