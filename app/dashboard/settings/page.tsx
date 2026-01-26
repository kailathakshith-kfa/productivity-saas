'use client'

import { useState, useEffect } from 'react'
import { User, Bell, Shield, LogOut, Check, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { RazorpayButton } from '@/components/checkout/RazorpayButton'

export default function SettingsPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [plan, setPlan] = useState<string>('free')



    useEffect(() => {
        const fetchPlan = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('subscriptions')
                    .select('plan')
                    .eq('user_id', user.id)
                    .single()

                if (data?.plan) {
                    setPlan(data.plan)
                }
            }
        }
        fetchPlan()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate update
        setTimeout(() => {
            setLoading(false)
            setSuccessMessage('Profile updated successfully')
            setTimeout(() => setSuccessMessage(''), 3000)
        }, 1000)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>

            {/* Profile Section */}
            <div className="premium-card">
                <div className="flex items-center gap-4 mb-6">
                    <User className="h-6 w-6 text-brand-cyan" />
                    <h2 className="text-lg font-semibold text-white">Profile Information</h2>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-400 uppercase">First Name</label>
                            <input
                                type="text"
                                placeholder="Founder"
                                className="w-full rounded-lg bg-black/50 border border-white/10 px-4 py-2 text-white focus:border-brand-cyan outline-none transition-all placeholder:text-neutral-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-400 uppercase">Last Name</label>
                            <input
                                type="text"
                                placeholder="One"
                                className="w-full rounded-lg bg-black/50 border border-white/10 px-4 py-2 text-white focus:border-brand-cyan outline-none transition-all placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-400 uppercase">Founder Email</label>
                        <input
                            type="email"
                            disabled
                            value="founder@startup.com"
                            className="w-full rounded-lg bg-black/20 border border-white/5 px-4 py-2 text-neutral-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        {successMessage ? (
                            <span className="text-emerald-400 text-sm flex items-center gap-2">
                                <Check className="h-4 w-4" /> {successMessage}
                            </span>
                        ) : <span></span>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-brand-cyan px-6 py-2 font-bold text-brand-dark transition-all hover:bg-brand-glow hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Plan & Billing */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Upgrade Plan</h2>
                        <p className="text-xs text-brand-cyan">Current: {plan === 'elite' ? 'Elite Plan' : plan === 'ai_ultimate' ? 'AI Ultimate' : 'Free Beta Access'}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Elite Plan */}
                    <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-brand-navy/50 p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-all" />
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 mb-2 border border-blue-500/20">POPULAR</span>
                        <h3 className="text-xl font-bold text-white">Elite</h3>
                        <div className="flex items-end gap-1 my-2">
                            <span className="text-3xl font-bold text-white">₹199</span>
                            <span className="text-sm text-neutral-400 mb-1">/mo</span>
                        </div>
                        <p className="text-xs text-neutral-400 mb-6">For serious founders.</p>

                        <ul className="space-y-2 mb-6">
                            {['Unlimited Vision Boards', 'Unlimited Milestones', 'Advanced Analytics', 'Priority Support'].map(f => (
                                <li key={f} className="flex items-center gap-2 text-xs text-neutral-300">
                                    <Check className="h-3 w-3 text-blue-400" /> {f}
                                </li>
                            ))}
                        </ul>

                        {plan === 'elite' ? (
                            <button disabled className="w-full rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-300 font-bold py-2 cursor-default flex items-center justify-center gap-2">
                                <Check className="h-4 w-4" /> Current Plan
                            </button>
                        ) : (
                            <RazorpayButton
                                planId="elite"
                                buttonText="Get Elite"
                                className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border-none font-bold py-2"
                            />
                        )}
                    </div>

                    {/* AI Ultimate Plan */}
                    <div className="rounded-2xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 to-brand-navy/50 p-6 relative overflow-hidden group hover:border-fuchsia-500/50 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-fuchsia-500/30 transition-all" />
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-400 mb-2 border border-fuchsia-500/20">BEST VALUE</span>
                        <h3 className="text-xl font-bold text-white">AI Ultimate</h3>
                        <div className="flex items-end gap-1 my-2">
                            <span className="text-3xl font-bold text-white">₹299</span>
                            <span className="text-sm text-neutral-400 mb-1">/mo</span>
                        </div>
                        <p className="text-xs text-neutral-400 mb-6">With personal AI Coach.</p>

                        <ul className="space-y-2 mb-6">
                            {['Everything in Elite', 'Private AI Strategy Coach', 'Smart Task Breakdown', 'Velocity Predictions'].map(f => (
                                <li key={f} className="flex items-center gap-2 text-xs text-neutral-300">
                                    <Check className="h-3 w-3 text-fuchsia-400" /> {f}
                                </li>
                            ))}
                        </ul>

                        {plan === 'ai_ultimate' ? (
                            <button disabled className="w-full rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-300 font-bold py-2 cursor-default flex items-center justify-center gap-2">
                                <Check className="h-4 w-4" /> Current Plan
                            </button>
                        ) : (
                            <RazorpayButton
                                planId="ai_ultimate"
                                buttonText={plan === 'elite' ? "Upgrade to Ultimate" : "Get AI Ultimate"}
                                className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(192,38,211,0.3)] border-none font-bold py-2"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications (Mock) */}
            <div className="premium-card opacity-80">
                <div className="flex items-center gap-4 mb-4">
                    <Bell className="h-6 w-6 text-brand-cyan" />
                    <div>
                        <h2 className="text-lg font-semibold text-white">Notifications</h2>
                        <p className="text-xs text-neutral-500">Manage how you receive updates (Coming Soon)</p>
                    </div>
                </div>
            </div>

            {/* Security Section (Sign Out) */}
            <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-6 hover:border-red-500/40 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                    <Shield className="h-6 w-6 text-red-400" />
                    <h2 className="text-lg font-semibold text-white">Security & Session</h2>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-300">Log out of this device</p>
                        <p className="text-xs text-neutral-500">You will need to sign in again to access your dashboard.</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
