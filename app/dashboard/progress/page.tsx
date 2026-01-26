import { createClient } from '@/lib/supabase/server'
import { Target, CheckSquare, Zap, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProgressPage() {
    const supabase = await createClient()

    // 1. Fetch Metrics
    // Total Visions
    const { count: visionCount } = await supabase.from('visions').select('*', { count: 'exact', head: true })

    // Milestones Progress
    const { data: milestones } = await supabase.from('milestones').select('status')
    const totalMilestones = milestones?.length || 0
    const completedMilestones = milestones?.filter(m => m.status === 'Completed').length || 0
    const milestoneProgress = totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100)

    // Tasks Completed
    const { data: tasks } = await supabase.from('tasks').select('is_completed, is_daily_priority')
    const totalTasks = tasks?.length || 0
    const completedTasks = tasks?.filter(t => t.is_completed).length || 0

    // Focus Score: % of Daily Priority Tasks that are completed.
    const priorityTasks = tasks?.filter(t => t.is_daily_priority) || []
    const completedPriority = priorityTasks.filter(t => t.is_completed).length
    const totalPriority = priorityTasks.length
    const focusScore = totalPriority === 0 ? 0 : Math.round((completedPriority / totalPriority) * 100)

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Progress Overview</h1>
                <p className="mt-1 text-neutral-400">Track your execution velocity.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Target className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Active Visions</p>
                            <p className="text-2xl font-bold text-white">{visionCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                            <CheckSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Tasks Done</p>
                            <p className="text-2xl font-bold text-white">{completedTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Milestone Progress</p>
                            <p className="text-2xl font-bold text-white">{milestoneProgress}%</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Focus Score</p>
                            <p className="text-2xl font-bold text-white">{focusScore}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Pending Milestones */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Pending Milestones</h3>
                    <div className="space-y-4">
                        {milestones?.filter(m => m.status !== 'Completed').slice(0, 5).map((m: any, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-900/50">
                                <div className="h-2 w-2 rounded-full bg-brand-cyan" />
                                <span className="text-neutral-300 text-sm">Milestone #{i + 1} (Pending)</span>
                                {/* We selected only 'status' above, need to fix query if we want titles */}
                            </div>
                        ))}
                        {(!milestones || milestones.length === 0) && <p className="text-neutral-500">No milestones found.</p>}
                    </div>
                </div>

                {/* Recent Activity Mockup (Since we don't have activity log table yet) */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Velocity</h3>
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-500/20 rounded-t-sm hover:bg-brand-cyan/40 transition relative group">
                                <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm group-hover:bg-brand-cyan transition-colors" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500 mt-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
