'use client'

import React, { useState } from 'react'
import { Check, X, Star } from 'lucide-react'
import { setTaskAsDailyPriority, assignTaskToDate } from '@/lib/actions/planner-actions'
import { toggleTaskCompletion } from '@/lib/actions/task-actions'
import clsx from 'clsx'

interface Task {
    id: string
    title: string
    is_completed: boolean
    is_daily_priority: boolean
    priority: string
}

export function DailyTaskItem({ task, date, isTopPriority = false }: { task: Task, date: string, isTopPriority?: boolean }) {
    const [completed, setCompleted] = useState(task.is_completed)

    const handleToggle = async () => {
        setCompleted(!completed)
        await toggleTaskCompletion(task.id, !completed)
    }

    const handlePriorityToggle = async () => {
        // If currently priority, remove it. If not, add it.
        await setTaskAsDailyPriority(task.id, date, !task.is_daily_priority)
    }

    const handleRemoveFromDay = async () => {
        // Remove from 'Planned for Date' entirely
        if (confirm('Remove this task from today?')) {
            await assignTaskToDate(task.id, null)
        }
    }

    return (
        <div className={clsx(
            "group flex items-center justify-between rounded-xl border p-4 transition-all duration-300",
            isTopPriority
                ? "border-brand-accent/30 bg-gradient-to-r from-brand-accent/10 to-brand-cyan/5 shadow-[0_0_20px_rgba(56,189,248,0.05)] hover:border-brand-accent/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.1)]"
                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-cyan/20 hover:scale-[1.01]",
            completed && "opacity-60 saturate-0"
        )}>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleToggle}
                    className={clsx(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300",
                        completed
                            ? "border-emerald-500 bg-emerald-500 text-brand-dark shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                            : "border-neutral-600 bg-transparent hover:border-brand-cyan hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    )}
                >
                    {completed && <Check className="h-3.5 w-3.5" />}
                </button>
                <span className={clsx("font-medium", completed ? "text-neutral-500 line-through" : "text-white")}>
                    {task.title}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handlePriorityToggle}
                    title={task.is_daily_priority ? "Remove from Top 3" : "Promote to Top 3"}
                    className={clsx("p-1.5 rounded-full transition", task.is_daily_priority ? "text-amber-400 bg-amber-400/10" : "text-neutral-600 hover:text-amber-400")}
                >
                    <Star className="h-4 w-4" fill={task.is_daily_priority ? "currentColor" : "none"} />
                </button>

                <button
                    onClick={handleRemoveFromDay}
                    className="p-1.5 text-neutral-600 hover:text-red-400 transition"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
