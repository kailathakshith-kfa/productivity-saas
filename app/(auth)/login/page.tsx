'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { login, signup } from './actions'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const next = searchParams.get('next')
    const mode = searchParams.get('mode')

    const [isLogin, setIsLogin] = useState(mode !== 'signup')
    const [isForgotPassword, setIsForgotPassword] = useState(false) // New State
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [successMsg, setSuccessMsg] = useState<string | null>(null) // Local success msg for reset

    const [error, setError] = useState<string | null>(null)

    const disposableDomains = [
        'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'temp-mail.org',
        '10minutemail.com', 'trashmail.com', 'sharklasers.com', 'tempmail.com',
        'getnada.com', 'dispostable.com', 'grr.la', 'maildrop.cc'
    ]

    const isDisposableEmail = (email: string) => {
        const domain = email.split('@')[1]
        return disposableDomains.includes(domain)
    }

    const router = useRouter()
    const supabase = createClient() // Initialize client

    const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMsg(null) // Clear previous

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
            })

            if (error) {
                setError(error.message)
            } else {
                setSuccessMsg('Check your email for the password reset link.')
                // Optional: switch back to login after delay or keep showing success
            }
        } catch (err: any) {
            setError("Failed to send reset email.")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (isForgotPassword) {
            await handleResetPassword(event)
            return
        }

        // ... (existing login/signup logic)
        event.preventDefault()
        setError(null)
        setLoading(true)
        setSuccessMsg(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string

        // ... Check disposable email logic ... (keep it)
        if (isDisposableEmail(email)) {
            setError("Temporary/Disposable emails are not allowed. Please use a valid work or personal email.")
            setLoading(false)
            return
        }

        try {
            let result
            if (isLogin) {
                result = await login(formData)
            } else {
                result = await signup(formData)
            }

            if (result.success && result.redirect) {
                router.push(result.redirect)
            } else if (result.message) {
                setError(result.message)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (err: any) {
            console.error("Submission Error:", err)
            setError("Connection failed. Please check your internet or try again.")
            setLoading(false)
        }
    }

    // ...

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand-dark text-white">
            {/* ... (backgrounds/Link remain) ... */}

            {/* COPY PREVIOUS CONTENT BUT UPDATE FORM */}

            {/* Replace existing JSX return within specific blocks */}

            {/* ... Inside Glass Card ... */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-3xl p-8"
            >
                {/* Success Message for Reset */}
                {successMsg && (
                    <div className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 text-center flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" /> {successMsg}
                    </div>
                )}

                {/* Error Messages */}
                {(message || error) && (
                    <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                        {message || error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {next && <input type="hidden" name="next" value={next} />}
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="founder@startup.com"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-200 placeholder-neutral-600 outline-none transition focus:border-brand-cyan/50 focus:bg-white/10 focus:ring-1 focus:ring-brand-cyan/50"
                        />
                    </div>

                    {!isForgotPassword && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80">
                                    Password
                                </label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMsg(null); }}
                                        className="text-xs text-neutral-400 hover:text-brand-cyan transition"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                {/* Password Input Code - Same as before */}
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required={!isForgotPassword}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-200 placeholder-neutral-600 outline-none transition focus:border-brand-cyan/50 focus:bg-white/10 focus:ring-1 focus:ring-brand-cyan/50 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09" /><path d="m2 2 20 20" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {!isForgotPassword && (
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer hover:text-neutral-300">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded border-white/10 bg-white/5 p-1 text-brand-cyan focus:ring-brand-cyan/50"
                                />
                                Remember me
                            </label>
                            {!isLogin && (
                                <span className="text-xs text-brand-cyan/70">Secure session</span>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-accent px-4 py-3 font-bold text-brand-dark transition hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />

                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                {isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Enter System' : 'Initialize Account')}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    {isForgotPassword ? (
                        <button
                            onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMsg(null); }}
                            className="text-sm font-medium text-neutral-400 hover:text-brand-cyan transition"
                        >
                            Back to Sign In
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-medium text-neutral-400 hover:text-brand-cyan transition"
                        >
                            {isLogin ? "No account? Join the beta" : 'Already have access? Sign in'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <Loader2 className="h-8 w-8 text-brand-cyan animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
