'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createTask(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const title = formData.get('title') as string
    const milestoneId = formData.get('milestone_id') as string // Can be empty text if null
    const priority = formData.get('priority') as string
    const estimatedTime = formData.get('estimated_time') as string
    const dueDate = formData.get('due_date') as string

    // Handle Path for revalidation - we might be on vision page OR planner page
    // Simple strategy: revalidate everything or specific likely paths.
    // For now, let's revalidate the dashboard root which covers most usages if layout changes, 
    // but specifically we want to refresh where the user is. 
    // Since we don't know exact path here easily without hidden input, we'll revalidate /dashboard

    const { error } = await supabase.from('tasks').insert({
        user_id: user.id,
        milestone_id: milestoneId || null,
        title,
        priority: priority || 'Medium',
        estimated_time: estimatedTime ? parseInt(estimatedTime) : null,
        due_date: dueDate || null,
        is_completed: false
    })

    if (error) {
        console.error('Error creating task:', error)
        return { error: 'Failed to create task' }
    }

    revalidatePath('/dashboard', 'layout')
    return { success: true }
}

export async function toggleTaskCompletion(taskId: string, isCompleted: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('tasks')
        .update({ is_completed: isCompleted })
        .eq('id', taskId)

    if (error) {
        console.error('Error toggling task:', error)
        return { error: 'Failed' }
    }

    // Trigger Progress Recalculation (Pseudocode implemented as logic here for MVP)
    // Ideally this is a Database Trigger or Edge Function, but we do it optimistically or via revalidate.
    // If we rely on revalidatePath, the Next.js server component will refetch the fresh calc.

    revalidatePath('/dashboard', 'layout')
    return { success: true }
}

export async function deleteTask(taskId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) return { error: 'Failed' }
    revalidatePath('/dashboard', 'layout')
    return { success: true }
}
