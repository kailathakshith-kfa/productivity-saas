import { createClient } from '@/lib/supabase/server'
import { MilestoneItem } from '@/components/vision/MilestoneItem'
import Link from 'next/link'
import { Map as MapIcon } from 'lucide-react'
import { Scroll3D } from '@/components/ui/Scroll3D'

export const dynamic = 'force-dynamic'

export default async function MilestonesPage() {
    const supabase = await createClient()

    // Fetch all milestones with their associated tasks
    const { data: milestones } = await supabase
        .from('milestones')
        .select('*, tasks(*)')
        .order('deadline', { ascending: true })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">All Milestones</h1>
                <p className="mt-1 text-neutral-400">Master view of all your key checkpoints.</p>
            </div>

            <div className="grid gap-4">
                {milestones?.map((milestone) => (
                    <Scroll3D key={milestone.id} className="relative">
                        {/* @ts-ignore */}
                        <MilestoneItem milestone={milestone} tasks={milestone.tasks} />
                    </Scroll3D>
                ))}

                {(!milestones || milestones.length === 0) && (
                    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 space-y-4">
                        <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mb-2">
                            <MapIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white">No Milestones Yet</h3>
                        <p className="text-neutral-400 max-w-md">
                            Milestones are the key checkpoints for your Visions.
                            You have created a Vision, now you need to break it down.
                        </p>
                        <Link
                            href="/dashboard/vision"
                            className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
                        >
                            Go to Vision Board
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
