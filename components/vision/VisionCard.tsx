'use client'

import React from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Trash2, ArrowRight, Target } from 'lucide-react'
import Link from 'next/link'
import { deleteVision } from '@/lib/actions/vision-actions'
import { CreateVisionModal } from './CreateVisionModal'

interface Vision {
    id: string
    title: string
    description: string
    category: 'Career' | 'Money' | 'Health' | 'Skills' | 'Personal'
    time_horizon: '6 months' | '1 year' | '3 years'
    status: string
}

interface VisionCardProps {
    vision: Vision
}

// Updated colors to match the premium dark theme
const categoryColors: Record<string, string> = {
    Career: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Money: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Health: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Skills: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    Personal: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export function VisionCard({ vision }: VisionCardProps) {
    const [isDeleting, setIsDeleting] = React.useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm('Are you sure? This will delete all milestones and tasks linked to this vision.')) return

        setIsDeleting(true)
        await deleteVision(vision.id)
        setIsDeleting(false)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-brand-surface/40 transition-all duration-300 hover:border-brand-cyan/30 hover:shadow-2xl hover:shadow-brand-cyan/5 backdrop-blur-sm overflow-hidden min-h-[320px]"
        >
            {/* Image Background Layer */}
            {(vision as any).image_url && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={(vision as any).image_url}
                        alt={vision.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                    />
                    {/* Gradient only at the bottom for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/60 to-transparent" />
                </div>
            )}

            {/* Action Buttons - Absolute positioned on top of the Link */}
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 transition group-hover:opacity-100 z-20 pointer-events-auto">
                <div onClick={(e) => e.stopPropagation()}>
                    <CreateVisionModal initialData={vision} />
                </div>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded-full p-2 text-neutral-500 hover:bg-white/10 hover:text-red-400 transition-colors backdrop-blur-sm bg-black/20"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Main Content wrapped in Link */}
            <Link
                href={`/dashboard/vision/${vision.id}`}
                className="flex flex-col h-full p-6 z-10 relative"
            >
                {/* Top Tags */}
                <div className="flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                        <span className={clsx('rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-md shadow-sm', categoryColors[vision.category] || categoryColors.Personal)}>
                            {vision.category}
                        </span>
                        <span className="text-xs text-neutral-300 font-medium bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">{vision.time_horizon}</span>
                    </div>
                </div>

                {/* Bottom Content */}
                <div className="mt-auto pt-16">
                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-brand-glow transition-colors drop-shadow-lg">
                        {vision.title}
                    </h3>

                    <p className="mt-2 text-sm text-neutral-200 line-clamp-2 leading-relaxed drop-shadow-md font-medium opacity-90">
                        {vision.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                        <div className="flex items-center text-xs text-neutral-300 font-medium drop-shadow-sm">
                            <Target className="mr-1.5 h-3.5 w-3.5 text-brand-cyan" />
                            <span>In Progress</span>
                        </div>
                        <div className="flex items-center text-xs text-brand-cyan font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
                            Manage <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
