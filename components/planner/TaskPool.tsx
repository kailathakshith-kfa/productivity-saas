'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { assignTaskToDate } from '@/lib/actions/planner-actions'
import { motion, AnimatePresence } from 'framer-motion'

interface Task {
    id: string
    title: string
    milestone_title?: string
}

export function TaskPool({ tasks, currentDate }: { tasks: Task[], currentDate: string }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleAssign = async (taskId: string) => {
        await assignTaskToDate(taskId, currentDate)
        // Optimistically remove from list? revalidate handles it.
    }

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-sm font-medium text-neutral-400 hover:text-white"
            >
                <span>Backlog & Upcoming Tasks ({tasks.length})</span>
                <Plus className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-2 overflow-hidden"
                    >
                        {tasks.length === 0 && (
                            <p className="text-xs text-neutral-600">No pending tasks found.</p>
                        )}
                        {tasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between rounded-lg border border-neutral-800 p-3 bg-neutral-900/50">
                                <div className="text-sm text-neutral-300">
                                    <p>{task.title}</p>
                                    <p className="text-[10px] text-neutral-500">{task.milestone_title || 'No Milestone'}</p>
                                </div>
                                <button
                                    onClick={() => handleAssign(task.id)}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    Add to Day
                                </button>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
