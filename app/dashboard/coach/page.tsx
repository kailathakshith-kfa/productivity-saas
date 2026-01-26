import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BrainCircuit, Lock } from 'lucide-react'
import Link from 'next/link'
import { CoachChat } from '@/components/coach/CoachChat'

export default async function AICoachPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single()

    const plan = subscription?.plan || 'free'
    const isUltimate = plan === 'ai_ultimate'

    if (!isUltimate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-fuchsia-500/20 blur-xl rounded-full" />
                    <div className="h-20 w-20 bg-[#080c14] border border-white/10 rounded-2xl flex items-center justify-center relative">
                        <Lock className="h-8 w-8 text-neutral-400" />
                    </div>
                </div>

                <div className="space-y-2 max-w-md">
                    <h1 className="text-3xl font-bold text-white">Unlock Your AI Coach</h1>
                    <p className="text-neutral-400">
                        The AI Strategy Coach uses your vision data to provide personalized execution plans, velocity checks, and breakdown suggestions.
                    </p>
                </div>

                <Link
                    href="/dashboard/settings"
                    className="group relative px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_30px_rgba(192,38,211,0.5)]"
                >
                    <span className="flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5" />
                        Upgrade to AI Ultimate
                    </span>
                </Link>
            </div>
        )
    }

    // --- FETCH CONTEXT DATA FOR AI ---
    // We want to pass a summary of the user's active visions and tasks to the AI.

    // 1. Get Visions
    const { data: visions } = await supabase
        .from('visions')
        .select('title, status, time_horizon')
        .eq('user_id', user.id)
        .eq('status', 'In Progress')
        .limit(5)

    // 2. Get Today's Tasks
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyTasks } = await supabase
        .from('tasks')
        .select('title, priority, is_completed')
        .eq('user_id', user.id)
        .eq('planned_date', today)

    // Construct Context String
    let contextString = "Current Date: " + today + "\n\n"

    if (visions && visions.length > 0) {
        contextString += "ACTIVE VISIONS:\n"
        visions.forEach(v => {
            contextString += `- ${v.title} (${v.time_horizon})\n`
        })
        contextString += "\n"
    } else {
        contextString += "No active visions found.\n"
    }

    if (dailyTasks && dailyTasks.length > 0) {
        contextString += "TODAY'S PLAN:\n"
        dailyTasks.forEach(t => {
            contextString += `- [${t.is_completed ? 'x' : ' '}] ${t.title} (${t.priority})\n`
        })
    } else {
        contextString += "No tasks planned for today yet.\n"
    }

    // Identify user name (fallback to 'Founder')
    // Ideally we fetch from profiles if it existed, but we don't have a profile table yet, just auth.
    const userName = user.email?.split('@')[0] || 'Founder'


    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                    <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Strategy Coach</h1>
                    <p className="text-sm text-neutral-400">Your personal execution strategist is online.</p>
                </div>
            </div>

            {/* AI Chat Interface (Client Component) */}
            <CoachChat context={contextString} userFirstName={userName} />
        </div>
    )
}
