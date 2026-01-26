'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateDailyLog(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const date = formData.get('date') as string
    const note = formData.get('reflection_note') as string

    // Upsert Daily Log
    const { error } = await supabase
        .from('daily_logs')
        .upsert({
            user_id: user.id,
            date: date,
            reflection_note: note
        }, { onConflict: 'user_id, date' })

    if (error) {
        console.error('Error updating log:', error)
        return { error: 'Failed' }
    }

    revalidatePath('/dashboard/planner')
    return { success: true }
}

export async function setTaskAsDailyPriority(taskId: string, date: string, isPriority: boolean) {
    const supabase = await createClient()

    // Logic: If setting as priority, also set planned_date to this date
    const updates: Record<string, any> = {
        is_daily_priority: isPriority,
        // If unsetting priority, do we keep the date? Yes, it's still planned for today usually.
        // But if setting priority, definitely ensure planned_date is correct.
    }
    if (isPriority) {
        updates.planned_date = date
    }

    const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)

    if (error) {
        console.error('Error setting priority:', error)
        return { error: 'Failed' }
    }

    revalidatePath('/dashboard/planner')
    return { success: true }
}

export async function assignTaskToDate(taskId: string, date: string | null) {
    const supabase = await createClient()

    // If unassigning (date is null), also remove priority status
    const updates: Record<string, any> = { planned_date: date }
    if (!date) {
        updates.is_daily_priority = false
    }

    const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)

    if (error) {
        console.error('Error assigning task:', error)
        return { error: 'Failed' }
    }

    revalidatePath('/dashboard/planner')

    return { success: true }
}

export async function createTask(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const title = formData.get('title') as string
    const date = formData.get('date') as string // Optional planned date
    const milestoneId = formData.get('milestone_id') as string // Optional milestone

    const { error } = await supabase.from('tasks').insert({
        user_id: user.id,
        milestone_id: milestoneId || null,
        title: title,
        planned_date: date || null,
        is_completed: false
    })

    if (error) {
        console.error('Error creating task:', error)
        return { error: 'Failed to create task' }
    }

    revalidatePath('/dashboard/planner')
    return { success: true }
}
