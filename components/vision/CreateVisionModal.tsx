'use client'


import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createVision, updateVision } from '@/lib/actions/vision-actions'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'

interface Vision {
    id: string
    title: string
    description: string
    category: string
    time_horizon: string
    status: string
}

interface CreateVisionModalProps {
    initialData?: Vision
}

export function CreateVisionModal({ initialData }: CreateVisionModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const isEditing = !!initialData

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        let result
        if (isEditing) {
            formData.append('id', initialData.id)
            result = await updateVision(formData)
        } else {
            result = await createVision(formData)
        }

        setLoading(false)

        if (result?.error) {
            alert(result.error)
            return
        }

        setIsOpen(false)
        router.refresh()
    }

    return (
        <>
            {isEditing ? (
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsOpen(true)
                    }}
                    className="rounded-full p-2 text-neutral-500 hover:bg-white/10 hover:text-brand-cyan transition-colors"
                >
                    <Pencil className="h-4 w-4" />
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="h-4 w-4" />
                    New Vision
                </button>
            )}

            {isOpen && createPortal(
                <AnimatePresence>
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsOpen(false)
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg rounded-2xl border border-white/10 bg-brand-surface shadow-2xl overflow-hidden relative z-[101]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-white/5 p-6 bg-white/5 relative z-10">
                                <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Vision' : 'Define New Vision'}</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80 mb-2">Vision Title</label>
                                    <input
                                        name="title"
                                        defaultValue={initialData?.title}
                                        required
                                        placeholder="e.g., Launch SaaS Business"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-200 placeholder-neutral-600 focus:border-brand-cyan/50 focus:bg-white/10 focus:ring-1 focus:ring-brand-cyan/50 outline-none transition"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80 mb-2">Category</label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                defaultValue={initialData?.category}
                                                className="w-full rounded-xl border border-white/10 bg-brand-surface px-4 py-3 text-neutral-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 appearance-none"
                                            >
                                                <option value="Career">Career</option>
                                                <option value="Money">Money</option>
                                                <option value="Health">Health</option>
                                                <option value="Skills">Skills</option>
                                                <option value="Personal">Personal</option>
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80 mb-2">Timeline</label>
                                        <div className="relative">
                                            <select
                                                name="time_horizon"
                                                defaultValue={initialData?.time_horizon}
                                                className="w-full rounded-xl border border-white/10 bg-brand-surface px-4 py-3 text-neutral-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 appearance-none"
                                            >
                                                <option value="6 months">6 months</option>
                                                <option value="1 year">1 year</option>
                                                <option value="3 years">3 years</option>
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80 mb-2">Why this matters?</label>
                                    <textarea
                                        name="description"
                                        defaultValue={initialData?.description}
                                        rows={3}
                                        placeholder="Describe the outcome and identifying feeling..."
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-200 placeholder-neutral-600 focus:border-brand-cyan/50 focus:bg-white/10 focus:ring-1 focus:ring-brand-cyan/50 outline-none resize-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80 mb-2">Visual Inspiration (Image URL)</label>
                                    <input
                                        name="image_url"
                                        defaultValue={(initialData as any)?.image_url}
                                        placeholder="https://example.com/motivation.jpg"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-200 placeholder-neutral-600 focus:border-brand-cyan/50 focus:bg-white/10 focus:ring-1 focus:ring-brand-cyan/50 outline-none transition"
                                    />
                                    <p className="mt-1 text-xs text-neutral-500">Paste a link to an image that motivates you.</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-accent px-6 py-2.5 text-sm font-bold text-brand-dark hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition disabled:opacity-50"
                                    >
                                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isEditing ? 'Update Vision' : 'Create Vision'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}
