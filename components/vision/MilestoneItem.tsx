'use client'

import React from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Trash2, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react'
import { deleteMilestone, toggleMilestoneStatus } from '@/lib/actions/milestone-actions'
import { TaskList } from '@/components/tasks/TaskList'

interface Milestone {
    id: string
    vision_id: string
    title: string
    description: string
    deadline: string
    status: string
}

// Ensure tasks are passed in
interface Props {
    milestone: Milestone
    tasks?: any[]
}

export function MilestoneItem({ milestone, tasks = [] }: Props) {
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [isExpanded, setIsExpanded] = React.useState(false) // Default collapsed? or expanded if active?

    const handleDelete = async () => {
        if (!confirm('Delete this milestone?')) return
        setIsDeleting(true)
        await deleteMilestone(milestone.vision_id, milestone.id)
        setIsDeleting(false)
    }

    const handleStatusToggle = async () => {
        await toggleMilestoneStatus(milestone.vision_id, milestone.id, milestone.status)
    }

    const isCompleted = milestone.status === 'Completed'

    return (
        <div className="space-y-2">
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                    "group flex items-start justify-between rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 transition hover:bg-neutral-900/60",
                    isCompleted && "opacity-60"
                )}
            >
                <div className="flex items-start gap-4 flex-1">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 text-neutral-500 hover:text-white transition"
                    >
                        {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>

                    <button
                        onClick={handleStatusToggle}
                        className={clsx(
                            "mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition shrink-0",
                            isCompleted
                                ? "border-indigo-500 bg-indigo-500 text-white"
                                : "border-neutral-600 text-transparent hover:border-indigo-400"
                        )}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="space-y-1 flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                        <h4 className={clsx(
                            "font-medium transition-all",
                            isCompleted ? "text-neutral-500 line-through decoration-neutral-700" : "text-neutral-200"
                        )}>
                            {milestone.title}
                        </h4>
                        {milestone.description && (
                            <p className="text-sm text-neutral-500">{milestone.description}</p>
                        )}
                        {milestone.deadline && (
                            <div className="flex items-center text-xs text-neutral-500">
                                <Calendar className="mr-1.5 h-3 w-3" />
                                <span>Due: {new Date(milestone.deadline).toLocaleDateString()}</span>
                            </div>
                        )}
                        {/* Task Summary */}
                        {!isExpanded && tasks.length > 0 && (
                            <div className="text-xs text-neutral-500 pt-1">
                                {tasks.filter(t => t.is_completed).length}/{tasks.length} tasks completed
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="opacity-0 transition group-hover:opacity-100 text-neutral-600 hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <TaskList tasks={tasks} milestoneId={milestone.id} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
