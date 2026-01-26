import { createClient } from '@/lib/supabase/server'
import { VisionCard } from '@/components/vision/VisionCard'
import { CreateVisionModal } from '@/components/vision/CreateVisionModal'
import { Scroll3D } from '@/components/ui/Scroll3D'

export const dynamic = 'force-dynamic'

export default async function VisionBoardPage() {
    const supabase = await createClient()
    const { data: visions } = await supabase
        .from('visions')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Vision Board</h1>
                    <p className="mt-1 text-neutral-400">Click on a vision card to manage its milestones and tasks.</p>
                </div>
                <CreateVisionModal />
            </div>

            {/* DEBUG: Remove after fixing */}


            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visions?.map((vision) => (
                    //@ts-ignore - Supabase types not generated yet, safe for MVP
                    <Scroll3D key={vision.id}>
                        <VisionCard vision={vision} />
                    </Scroll3D>
                ))}

                {visions?.length === 0 && (
                    <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20">
                        <p className="text-neutral-500">No visions defined yet.</p>
                        <p className="text-sm text-neutral-600">Click "New Vision" to start.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
