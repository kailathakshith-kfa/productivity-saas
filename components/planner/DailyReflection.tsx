'use client'

import React, { useRef, useState, useEffect } from 'react'
import { updateDailyLog } from '@/lib/actions/planner-actions'

export function DailyReflection({ initialNote, date }: { initialNote: string, date: string }) {
    const [note, setNote] = useState(initialNote)
    const [saving, setSaving] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Reset local state if prop changes (e.g. navigating to different day)
    useEffect(() => {
        setNote(initialNote)
    }, [initialNote, date])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setNote(newValue)
        setSaving(true)

        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(async () => {
            const formData = new FormData()
            formData.append('date', date)
            formData.append('reflection_note', newValue)
            await updateDailyLog(formData)
            setSaving(false)
        }, 1000) // Auto-save after 1s debounce
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Daily Reflection</h3>
                <span className="text-xs text-neutral-500">{saving ? 'Saving...' : 'Saved'}</span>
            </div>
            <textarea
                value={note}
                onChange={handleChange}
                placeholder="What went well? What did I learn? Focus for tomorrow..."
                className="w-full h-32 rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 text-sm text-neutral-200 placeholder-neutral-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition"
            />
        </div>
    )
}
