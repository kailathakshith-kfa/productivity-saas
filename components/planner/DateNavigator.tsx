'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays, subDays, startOfWeek, isSameDay, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import clsx from 'clsx'
import { motion } from 'framer-motion'

interface DateNavigatorProps {
    date: string
}

export function DateNavigator({ date }: DateNavigatorProps) {
    const router = useRouter()
    const currentDate = parseISO(date)
    const today = new Date()

    // Generate a stable week view (Mon-Sun) containing the current date
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // 1 = Monday
    const dates = Array.from({ length: 7 }).map((_, i) => {
        return addDays(startDate, i)
    })

    const navigateToDate = (d: Date) => {
        const dateString = format(d, 'yyyy-MM-dd')
        router.push(`/dashboard/planner?date=${dateString}`)
    }

    return (
        <div className="flex flex-col gap-4 mb-8">
            {/* Header / Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white capitalize">
                        {format(currentDate, 'EEEE, MMM do')}
                    </h2>
                    {isSameDay(currentDate, today) && (
                        <span className="rounded-full bg-brand-cyan/10 px-2 py-0.5 text-xs font-medium text-brand-cyan border border-brand-cyan/20">
                            Today
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateToDate(subDays(currentDate, 7))} // Go back 1 week
                        className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => navigateToDate(today)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm font-medium hover:bg-white/10 transition flex items-center gap-2"
                    >
                        <CalendarIcon className="h-4 w-4" />
                        Today
                    </button>

                    <button
                        onClick={() => navigateToDate(addDays(currentDate, 7))} // Go forward 1 week
                        className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Date Strip */}
            <div className="grid grid-cols-7 gap-2">
                {dates.map((d, i) => {
                    const isSelected = isSameDay(d, currentDate)
                    const isToday = isSameDay(d, today)

                    return (
                        <button
                            key={i}
                            onClick={() => navigateToDate(d)}
                            className={clsx(
                                'flex flex-col items-center justify-center rounded-xl py-3 border transition-all relative overflow-hidden',
                                isSelected
                                    ? 'bg-gradient-to-br from-indigo-500/20 to-brand-cyan/20 border-brand-cyan/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                    : 'bg-brand-surface/50 border-white/5 text-neutral-400 hover:bg-white/5 hover:border-white/10',
                                isToday && !isSelected && 'border-brand-cyan/30 text-brand-cyan/80'
                            )}
                        >
                            <span className="text-xs font-medium uppercase opacity-60 mb-1">
                                {format(d, 'EEE')}
                            </span>
                            <span className={clsx("text-lg font-bold", isSelected ? 'text-white' : '')}>
                                {format(d, 'd')}
                            </span>
                            {isSelected && (
                                <motion.div
                                    layoutId="activeDay"
                                    className="absolute bottom-0 h-0.5 w-8 bg-brand-cyan"
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
