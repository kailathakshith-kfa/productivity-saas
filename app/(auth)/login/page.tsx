'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { login, signup } from './actions'
import { ArrowRight, Loader2, Sparkles, ArrowLeft, Mail, Lock, Eye, EyeOff, Check, Shield } from 'lucide-react'
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
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/dashboard/settings')}`,
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
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand-dark text-white selection:bg-brand-cyan/30">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-brand-cyan/20 blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-brand-accent/10 blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Back to Home Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm text-neutral-400 transition-all hover:border-brand-cyan/50 hover:bg-brand-cyan/10 hover:text-white group"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
            </Link>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-6"
            >
                <div className="glass overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-accent/10 p-3 shadow-inner ring-1 ring-white/10">
                            <Sparkles className="h-6 w-6 text-brand-cyan" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
                            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
                        </h1>
                        <p className="text-sm text-neutral-400">
                            {isForgotPassword
                                ? 'Enter your email to receive recovery instructions.'
                                : (isLogin
                                    ? 'Enter your credentials to access your workspace.'
                                    : 'Join the waitlist and start building your vision.')}
                        </p>
                    </div>

                    {/* Success Message for Reset */}
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 text-center flex items-center justify-center gap-2"
                        >
                            <Sparkles className="h-4 w-4" /> {successMsg}
                        </motion.div>
                    )}

                    {/* Error Messages */}
                    {(message || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300 text-center"
                        >
                            {message || error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {next && <input type="hidden" name="next" value={next} />}

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500 group-focus-within:text-brand-cyan transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="founder@startup.com"
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 pl-11 text-neutral-200 placeholder-neutral-600 outline-none transition-all focus:border-brand-cyan/50 focus:bg-black/60 focus:ring-1 focus:ring-brand-cyan/50"
                                />
                            </div>
                        </div>

                        {!isForgotPassword && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        Password
                                    </label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMsg(null); }}
                                            className="text-xs font-medium text-brand-cyan hover:text-brand-cyan/80 transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500 group-focus-within:text-brand-cyan transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required={!isForgotPassword}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 pl-11 pr-11 text-neutral-200 placeholder-neutral-600 outline-none transition-all focus:border-brand-cyan/50 focus:bg-black/60 focus:ring-1 focus:ring-brand-cyan/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors p-1"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isForgotPassword && (
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2.5 text-sm text-neutral-400 cursor-pointer hover:text-neutral-300 transition-colors">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 checked:border-brand-cyan checked:bg-brand-cyan transition-all"
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-brand-dark opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    Remember me
                                </label>
                                {!isLogin && (
                                    <div className="flex items-center gap-1.5 text-xs text-brand-cyan/70 bg-brand-cyan/5 px-2 py-1 rounded-full border border-brand-cyan/10">
                                        <Shield className="h-3 w-3" />
                                        Secure
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand-cyan to-brand-accent p-[1px] focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="relative flex items-center justify-center gap-2 rounded-xl bg-brand-dark/0 px-4 py-3.5 font-bold text-brand-dark transition-all group-hover:bg-white/10">
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        {isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-neutral-400 text-sm">
                            {isForgotPassword ? 'Remember your password? ' : (isLogin ? "Don't have an account? " : "Already have an account? ")}
                            <button
                                onClick={() => {
                                    if (isForgotPassword) {
                                        setIsForgotPassword(false);
                                    } else {
                                        setIsLogin(!isLogin);
                                    }
                                    setError(null);
                                    setSuccessMsg(null);
                                }}
                                className="font-semibold text-brand-cyan hover:text-brand-accent hover:underline decoration-2 underline-offset-4 transition-all"
                            >
                                {isForgotPassword ? 'Sign in' : (isLogin ? 'Join now' : 'Log in')}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer simple links */}
                <div className="mt-8 flex justify-center gap-6 text-xs text-neutral-500">
                    <Link href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
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
