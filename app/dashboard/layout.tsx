'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Target,
    Map as MapIcon,
    CheckSquare as CheckIcon,
    Calendar as CalendarIcon,
    BarChart2 as ChartIcon,
    LogOut,
    Menu,
    X,
    Sparkles,
    BrainCircuit,
    Settings as Cog
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
    { name: 'Vision Board', href: '/dashboard/vision', icon: Target },
    { name: 'Milestones', href: '/dashboard/milestones', icon: MapIcon },
    { name: 'Daily Planner', href: '/dashboard/planner', icon: CalendarIcon },
    { name: 'Progress', href: '/dashboard/progress', icon: ChartIcon },
    { name: 'AI Coach', href: '/dashboard/coach', icon: BrainCircuit },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="flex min-h-screen bg-[#050b14] text-neutral-200 selection:bg-brand-cyan/20 selection:text-brand-cyan overflow-hidden">
            {/* Ambient Background Gradients (Matching Home Page) */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none -z-10 opacity-30" />

            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 flex-col border-r border-white/5 bg-[#050b14]/60 backdrop-blur-xl md:flex z-10">
                <div className="flex h-20 items-center px-6 border-b border-white/5 gap-3">
                    <img
                        src="/logo-icon.png"
                        alt="Kinetic Flow AI"
                        className="h-8 w-auto object-contain mix-blend-screen"
                    />
                    <span className="text-lg font-bold tracking-tight text-white">Kinetic<span className="text-brand-cyan">Flow</span> AI</span>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-6">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    'group relative flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300',
                                    isActive ? 'text-brand-cyan' : 'text-neutral-400 hover:text-white'
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                                <Icon className={clsx('relative z-10 mr-3 h-5 w-5 transition-colors', isActive ? 'text-brand-cyan' : 'text-neutral-500 group-hover:text-white')} />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex flex-1 flex-col z-10">
                <div className="md:hidden flex h-16 items-center justify-between border-b border-white/5 px-4 bg-brand-surface/80 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo-icon.png"
                            alt="Kinetic Flow AI"
                            className="h-7 w-auto object-contain mix-blend-screen"
                        />
                        <span className="text-lg font-bold tracking-tight text-white">Kinetic<span className="text-brand-cyan">Flow</span> AI</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-b border-white/5 bg-brand-surface overflow-hidden"
                        >
                            <nav className="flex flex-col p-4 space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={clsx(
                                            'flex items-center rounded-lg px-3 py-3 text-sm font-medium',
                                            pathname.startsWith(item.href)
                                                ? 'bg-brand-cyan/10 text-brand-cyan'
                                                : 'text-neutral-400'
                                        )}
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                                <button
                                    onClick={handleSignOut}
                                    className="flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium text-red-400"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Sign Out
                                </button>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            key={pathname} // Re-animate on route change
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}
