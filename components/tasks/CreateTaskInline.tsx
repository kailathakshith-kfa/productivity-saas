'use client'

import React, { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { createTask } from '@/lib/actions/task-actions'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function CreateTaskInline({ milestoneId }: { milestoneId: string }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        formData.append('milestone_id', milestoneId)

        await createTask(formData)
        setLoading(false)
        setIsExpanded(false)
        router.refresh() // <--- Force refresh
    }

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 text-xs text-neutral-500 hover:text-indigo-400 mt-2 ml-9 transition-colors"
            >
                <Plus className="h-3 w-3" />
                Add Task
            </button>
        )
    }

    return (
        <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 ml-9 space-y-2"
            onSubmit={handleSubmit}
        >
            <input
                name="title"
                autoFocus
                required
                placeholder="Task title..."
                className="w-full max-w-sm rounded border border-neutral-800 bg-neutral-950/50 px-3 py-1.5 text-sm text-neutral-200 focus:border-indigo-500 focus:outline-none"
            />

            <div className="flex items-center gap-2">
                <select
                    name="priority"
                    className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400 focus:border-indigo-500 outline-none"
                >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                </select>

                <input
                    name="due_date"
                    type="date"
                    className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400 focus:border-indigo-500 outline-none [color-scheme:dark]"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
                >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-xs text-neutral-500 hover:text-white"
                >
                    Cancel
                </button>
            </div>
        </motion.form>
    )
}
