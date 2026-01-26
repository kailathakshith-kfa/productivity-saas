'use client'

import React from 'react'
import clsx from 'clsx'
import { Check, Trash2, Calendar, Clock } from 'lucide-react'
import { toggleTaskCompletion, deleteTask } from '@/lib/actions/task-actions'
import { motion } from 'framer-motion'

interface Task {
    id: string
    title: string
    is_completed: boolean
    priority: string
    due_date: string | null
    estimated_time: number | null
}

export function TaskItem({ task }: { task: Task }) {
    const [isCompleted, setIsCompleted] = React.useState(task.is_completed)

    const handleToggle = async () => {
        // Optimistic update
        setIsCompleted(!isCompleted)
        await toggleTaskCompletion(task.id, !isCompleted)
    }

    const handleDelete = async () => {
        if (!confirm('Delete task?')) return
        await deleteTask(task.id)
    }

    return (
        <motion.div
            layout
            className={clsx(
                "group flex items-center justify-between rounded-lg border border-transparent bg-neutral-800/30 px-3 py-2 transition-all hover:bg-neutral-800/50",
                isCompleted && "opacity-50"
            )}
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={handleToggle}
                    className={clsx(
                        "flex h-4 w-4 items-center justify-center rounded border transition",
                        isCompleted
                            ? "border-indigo-500 bg-indigo-500 text-white"
                            : "border-neutral-600 hover:border-indigo-400"
                    )}
                >
                    {isCompleted && <Check className="h-3 w-3" />}
                </button>

                <span className={clsx("text-sm transition-all", isCompleted ? "text-neutral-500 line-through" : "text-neutral-200")}>
                    {task.title}
                </span>

                <div className="flex items-center gap-2">
                    {task.priority === 'High' && (
                        <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">High</span>
                    )}
                    {task.priority === 'Low' && (
                        <span className="text-[10px] text-neutral-400 bg-neutral-700/30 px-1.5 py-0.5 rounded">Low</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100">
                {task.due_date && (
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                )}
                <button onClick={handleDelete} className="hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </motion.div>
    )
}
