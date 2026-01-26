'use client'

import React, { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createTask } from '@/lib/actions/planner-actions'
import { useRouter } from 'next/navigation'

export function CreateTaskModal({ currentDate, milestoneId }: { currentDate?: string, milestoneId?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        if (currentDate) {
            formData.append('date', currentDate)
        }
        if (milestoneId) {
            formData.append('milestone_id', milestoneId)
        }

        const result = await createTask(formData)
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
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
            >
                <Plus className="h-4 w-4" />
                Add Task
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-surface shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 p-6 bg-white/5">
                                <h2 className="text-xl font-bold text-white">Add New Task</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80 mb-2">Task Title</label>
                                    <input
                                        name="title"
                                        required
                                        autoFocus
                                        placeholder="e.g., Email key clients"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-200 placeholder-neutral-600 focus:border-brand-cyan/50 focus:bg-white/10 focus:ring-1 focus:ring-brand-cyan/50 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-cyan/80 mb-2">Planned For</label>
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-neutral-400">
                                        {currentDate ? `Selected Day (${currentDate})` : 'Backlog (No Date)'}
                                    </div>
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
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
