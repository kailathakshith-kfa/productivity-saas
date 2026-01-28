'use client'

import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight, Play, CheckCircle, BarChart3, TrendingUp, Sparkles, Brain, Target, Calendar, XCircle, CheckCircle2, Layers, BarChart, BrainCircuit } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'
import { RazorpayButton } from '@/components/checkout/RazorpayButton'

// Dynamically load 3D background to avoid SSR/Build issues with WebGL
const KineticBackground = dynamic(
    () => import('@/components/3d/KineticBackground').then((mod) => mod.KineticBackground),
    { ssr: false }
)

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050b14] text-white selection:bg-indigo-500/30 overflow-x-hidden">

            {/* --------------------------------------------------------------------------------
         NAVBAR
         -------------------------------------------------------------------------------- */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050b14]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo-icon.png"
                            alt="Kinetic Flow AI"
                            className="h-9 w-auto object-contain mix-blend-screen"
                        />
                        <span className="text-xl font-bold tracking-tight">Kinetic<span className="text-cyan-400">Flow</span> AI</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition">
                            Sign In
                        </Link>
                        <Link
                            href="/login?mode=signup"
                            className="hidden md:block rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* --------------------------------------------------------------------------------
           1️⃣ HERO SECTION — CLARITY PROMISE
           -------------------------------------------------------------------------------- */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
                    {/* 3D Background */}
                    {/* <KineticBackground /> */}

                    {/* Background Gradients (Fallback/Overlay) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10 opacity-30" />

                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            The Execution Operating System
                        </motion.div>

                        <motion.h1
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
                        >
                            Turn Vision Into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                                Daily Execution
                            </span>
                        </motion.h1>

                        <motion.p
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            Most people plan. Few execute consistently. <br className="hidden md:block" />
                            Connect your 3-year vision directly to your daily top 3 priorities.
                        </motion.p>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                href="/login?mode=signup"
                                className="h-14 px-8 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all text-base"
                            >
                                Start Execution
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <button className="h-14 px-8 rounded-full border border-white/10 bg-white/5 text-white font-medium flex items-center gap-2 hover:bg-white/10 transition backdrop-blur-sm">
                                <Play className="h-4 w-4 fill-current" />
                                See How It Works
                            </button>
                        </motion.div>
                    </div>

                    {/* UI Mockup - Real Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, rotateX: 10 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-20 max-w-6xl mx-auto relative z-10 perspective-1000"
                    >
                        <TiltCard className="relative rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] to-transparent z-10 opacity-20 pointer-events-none" />
                            <img
                                src="/dashboard-preview.png"
                                alt="Kinetic Flow Dashboard"
                                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            />
                        </TiltCard>
                        {/* Glow behind mockup */}
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] -z-10 rounded-full" />
                    </motion.div>
                </section>

                {/* --------------------------------------------------------------------------------
           2️⃣ PROBLEM SECTION — PAIN VISUALIZATION
           -------------------------------------------------------------------------------- */}
                <section className="py-24 bg-[#080c14]">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-6"
                        >
                            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">
                                The "Busy But Stuck" Trap
                            </motion.h2>
                            <motion.p variants={fadeInUp} className="text-neutral-400 text-lg leading-relaxed">
                                You have big ambition, but your day-to-day feels disconnected.
                                Scattered notes, endless to-do lists, and overwhelming dashboards lead to motion, not progress.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="space-y-4 pt-4">
                                <div className="flex items-center gap-4 text-neutral-500">
                                    <XCircle className="h-6 w-6 text-red-500/50" />
                                    <span>Action disconnected from vision</span>
                                </div>
                                <div className="flex items-center gap-4 text-neutral-500">
                                    <XCircle className="h-6 w-6 text-red-500/50" />
                                    <span>Overwhelmed by busy work</span>
                                </div>
                                <div className="flex items-center gap-4 text-neutral-500">
                                    <XCircle className="h-6 w-6 text-red-500/50" />
                                    <span>Unclear next steps</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <div className="relative">
                            <div className="relative h-[400px] w-full rounded-2xl bg-neutral-900 border border-white/5 overflow-hidden group">
                                {/* Generated Image */}
                                <img
                                    src="/focused-founder.png"
                                    alt="Focused Founder Execution"
                                    className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition duration-700 pointer-events-none grayscale-[0.2]"
                                />

                                {/* Solution Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent flex items-end justify-start p-8">
                                    <div className="p-4 bg-[#050b14]/80 backdrop-blur-md border border-indigo-500/30 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.15)] flex items-center gap-4">
                                        <CheckCircle2 className="h-8 w-8 text-indigo-400" />
                                        <div>
                                            <p className="text-white font-semibold">Clarity Restored</p>
                                            <p className="text-xs text-neutral-400">Execution Mode: Active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------------------------------
           3️⃣ HOW IT WORKS — EXECUTION FLOW
           -------------------------------------------------------------------------------- */}
                <section className="py-32 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Execution Flow</h2>
                            <p className="text-neutral-400 max-w-2xl mx-auto">A systematic approach to turn 3-year goals into 24-hour wins.</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6 relative z-10">
                            {[
                                { icon: Target, title: "Define Vision", desc: "Set clear 1-3 year outcomes." },
                                { icon: Layers, title: "Break Down", desc: "Convert vision into key milestones." },
                                { icon: Calendar, title: "Daily Plan", desc: "Execute Top 3 priority tasks." },
                                { icon: BarChart, title: "Track Progress", desc: "Visualize momentum instantly." }
                            ].map((step, i) => (
                                <div key={i} className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all backdrop-blur-md">
                                    <div className="absolute -top-6 left-8 h-12 w-12 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <step.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-8 text-xl font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-neutral-400">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------------------------------
           4️⃣ PRODUCT PREVIEW — DAILY PLANNER
           -------------------------------------------------------------------------------- */}
                <section className="py-32 bg-gradient-to-b from-[#050b14] to-indigo-950/20 px-6">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <TiltCard className="rounded-2xl border border-indigo-500/20 bg-[#0a0a0a] shadow-2xl overflow-hidden">
                                <img
                                    src="/hero-focus-card.png"
                                    alt="Today's Focus Daily Planner"
                                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                                />
                            </TiltCard>
                        </motion.div>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold">Win the Day. Every Day.</h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The Daily Planner is the core of Kinetic Flow. It forces you to choose only 3 priorities that move the needle on your Vision.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">1</div>
                                    <div>
                                        <h4 className="font-semibold text-white">Ruthless Prioritization</h4>
                                        <p className="text-sm text-neutral-500">Limits you to 3 main tasks. No clutter.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">2</div>
                                    <div>
                                        <h4 className="font-semibold text-white">Context, Not Chaos</h4>
                                        <p className="text-sm text-neutral-500">See which big Milestone this task serves.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------------------------------
           6️⃣ AI COACH
           -------------------------------------------------------------------------------- */}
                <section className="py-24 text-center px-6">
                    <div className="max-w-4xl mx-auto">
                        <BrainCircuit className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
                        <h2 className="text-4xl font-bold mb-4">Your Private Execution Strategist</h2>
                        <p className="text-neutral-400 mb-12">
                            Not just a chatbot. The AI analyzes your velocity, suggests breakdown of complex goals,
                            and nudges you when you lose momentum.
                        </p>
                        <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-indigo-500/50 to-cyan-400/50">
                            <div className="bg-[#050b14] rounded-xl px-8 py-4 text-sm font-mono text-cyan-200">
                                "Based on your recent velocity, you should break 'Component Architecture' into 3 smaller tasks."
                            </div>
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------------------------------
           7️⃣ FINAL CTA — CONTROL & MOMENTUM (PRICING INTEGRATED)
           -------------------------------------------------------------------------------- */}
                <section id="pricing" className="py-32 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Clarity. Focus. Momentum.</h2>
                        <p className="text-xl text-neutral-400 mb-16">Join the top 1% of executors.</p>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">

                            {/* Card 1: Starter */}
                            <div className="relative p-8 rounded-3xl bg-[#080c14] border border-white/5 hover:border-white/10 transition group h-full">
                                <div className="text-left mb-8">
                                    <h3 className="text-lg font-medium text-neutral-400">Starter</h3>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-5xl font-bold text-white">Free</span>
                                    </div>
                                    <p className="text-sm text-neutral-500 mt-2">Basic execution system.</p>
                                </div>
                                <div className="space-y-4 mb-8 text-left">
                                    {["1 Vision Board", "Basic Daily Planner", "Manual Progress Tracking"].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-neutral-600" />
                                            <span className="text-neutral-400 text-sm">{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/login?mode=signup"
                                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center hover:bg-white/10 transition"
                                >
                                    Start Free
                                </Link>
                            </div>

                            {/* Card 2: Elite (Highlighted) */}
                            <div className="relative group transform md:-translate-y-4">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative p-8 rounded-3xl bg-[#080c14] border border-white/10 shadow-2xl h-full">
                                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                                    <div className="text-left mb-8">
                                        <h3 className="text-lg font-medium text-indigo-400">Elite</h3>
                                        <div className="flex items-baseline gap-1 mt-2">
                                            <span className="text-5xl font-bold text-white">₹199</span>
                                            <span className="text-neutral-500">/mo</span>
                                        </div>
                                        <p className="text-sm text-neutral-500 mt-2">For serious founders.</p>
                                    </div>
                                    <div className="space-y-4 mb-8 text-left">
                                        {["Unlimited Vision Boards", "Unlimited Milestones", "Advanced Analytics", "Priority Support"].map((f, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                                                <span className="text-neutral-300 text-sm">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <RazorpayButton planId="elite" buttonText="Join Elite" />
                                </div>
                            </div>

                            {/* Card 3: AI Ultimate */}
                            <div className="relative p-8 rounded-3xl bg-[#080c14] border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition group h-full">
                                <div className="text-left mb-8">
                                    <h3 className="text-lg font-medium text-fuchsia-400">AI Ultimate</h3>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-5xl font-bold text-white">₹299</span>
                                        <span className="text-neutral-500">/mo</span>
                                    </div>
                                    <p className="text-sm text-neutral-500 mt-2">With personal AI Coach.</p>
                                </div>
                                <div className="space-y-4 mb-8 text-left">
                                    {["Everything in Elite", "Private AI Strategy Coach", "Smart Task Breakdown", "Velocity Predictions"].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-fuchsia-500" />
                                            <span className="text-neutral-300 text-sm">{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <RazorpayButton
                                    planId="ai_ultimate"
                                    buttonText="Get AI Ultimate"
                                    className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white"
                                />
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 py-12 bg-[#050b14] text-center">
                <p className="text-neutral-600 text-sm mb-2">© 2026 Kinetic Flow AI. Built for Executors.</p>
                <a href="mailto:info@kineticflowai.com" className="text-neutral-500 text-sm hover:text-brand-cyan transition-colors">
                    Contact: info@kineticflowai.com
                </a>
            </footer>
        </div >
    )
}
