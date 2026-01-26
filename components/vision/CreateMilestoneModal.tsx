'use client'

import React, { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createMilestone } from '@/lib/actions/milestone-actions'

import { useRouter } from 'next/navigation'

export function CreateMilestoneModal({ visionId }: { visionId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        formData.append('vision_id', visionId)

        const result = await createMilestone(formData)
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
                className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
            >
                <Plus className="h-4 w-4" />
                Add Milestone
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-neutral-800 p-6">
                                <h2 className="text-xl font-semibold text-white">Add Milestone</h2>
                                <p className="text-xs text-neutral-500 mt-1">A significant event, stage, or marker in your journey.</p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-full p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Milestone Title</label>
                                    <input
                                        name="title"
                                        required
                                        placeholder="e.g., First 100 Paying Customers (A Significant Achievement)"
                                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-neutral-200 placeholder-neutral-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Deadline (Optional)</label>
                                    <input
                                        name="deadline"
                                        type="date"
                                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-neutral-200 placeholder-neutral-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        placeholder="What does success look like?"
                                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-neutral-200 placeholder-neutral-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                                    >
                                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Add Milestone
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
