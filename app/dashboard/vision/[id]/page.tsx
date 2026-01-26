import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Target } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreateMilestoneModal } from '@/components/vision/CreateMilestoneModal'
import { CreateVisionModal } from '@/components/vision/CreateVisionModal'
import { MilestoneItem } from '@/components/vision/MilestoneItem'

export default async function VisionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch Vision
    const { data: vision, error: visionError } = await supabase
        .from('visions')
        .select('*')
        .eq('id', id)
        .single()

    if (visionError || !vision) {
        redirect('/dashboard/vision')
    }

    // Fetch Milestones
    const { data: milestones } = await supabase
        .from('milestones')
        .select('*')
        .eq('vision_id', id)
        .order('created_at', { ascending: true })

    // Fetch Tasks for this Vision? 
    // Actually tasks are on milestones, so we can fetch all tasks related to these milestones.
    const milestoneIds = milestones?.map(m => m.id) || []
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .in('milestone_id', milestoneIds)
        .order('created_at', { ascending: true })

    // Calculate Progress (Updated logic to include tasks)
    const totalMilestones = milestones?.length || 0
    const completedMilestones = milestones?.filter(m => m.status === 'Completed').length || 0

    // Vision progress weighted by milestones for now
    const progress = totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100)

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Navigation */}
            <div>
                <Link
                    href="/dashboard/vision"
                    className="inline-flex items-center text-sm text-neutral-500 hover:text-white transition mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Vision Board
                </Link>

                {/* Header */}
                {/* Header */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                                {vision.category}
                            </span>
                            <span className="text-sm text-neutral-500">{vision.time_horizon} Horizon</span>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-4xl font-bold text-white leading-tight">{vision.title}</h1>
                            {/* @ts-ignore */}
                            <CreateVisionModal initialData={vision} />
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-neutral-400 leading-relaxed whitespace-pre-wrap">{vision.description}</p>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="min-w-[280px] rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 shrink-0">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-neutral-300">Total Progress</span>
                            <span className="text-sm font-bold text-white">{progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                            <div className="flex items-center gap-1.5">
                                <Target className="h-3.5 w-3.5" />
                                <span>{completedMilestones}/{totalMilestones} Milestones Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Milestones Section */}
            <div className="space-y-6 border-t border-neutral-800 pt-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Execution Roadmap</h2>
                        <p className="text-neutral-500 text-sm mt-1">Break down your vision into achievable milestones.</p>
                    </div>
                    <CreateMilestoneModal visionId={vision.id} />
                </div>

                <div className="grid gap-4">
                    {milestones?.map((milestone) => {
                        const mileTasks = tasks?.filter(t => t.milestone_id === milestone.id) || []
                        return (
                            //@ts-ignore - types
                            <MilestoneItem key={milestone.id} milestone={milestone} tasks={mileTasks} />
                        )
                    })}

                    {milestones?.length === 0 && (
                        <div className="py-12 text-center text-neutral-500">
                            No milestones yet. Break your vision down into steps.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
