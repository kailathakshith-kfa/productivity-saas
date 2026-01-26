'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createMilestone(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const visionId = formData.get('vision_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const deadline = formData.get('deadline') as string

    const { error } = await supabase.from('milestones').insert({
        user_id: user.id,
        vision_id: visionId,
        title,
        description,
        deadline: deadline || null, // Handle empty date
        status: 'Not Started'
    })

    if (error) {
        console.error('Error creating milestone:', error)
        return { error: `Failed to create milestone: ${error.message}` }
    }

    revalidatePath(`/dashboard/vision/${visionId}`)
    revalidatePath('/dashboard/milestones')
    return { success: true }
}

export async function deleteMilestone(visionId: string, milestoneId: string) {
    const supabase = await createClient()

    // RLS handles auth check
    const { error } = await supabase.from('milestones').delete().eq('id', milestoneId)

    if (error) {
        console.error('Error deleting milestone:', error)
        return { error: 'Failed to delete milestone' }
    }

    revalidatePath(`/dashboard/vision/${visionId}`)
    return { success: true }
}

export async function toggleMilestoneStatus(visionId: string, milestoneId: string, currentStatus: string) {
    const supabase = await createClient()

    // Simple toggle logic for MVP: Not Started -> In Progress -> Completed -> Not Started
    let nextStatus = 'Not Started'
    if (currentStatus === 'Not Started') nextStatus = 'In Progress'
    else if (currentStatus === 'In Progress') nextStatus = 'Completed'
    else if (currentStatus === 'Completed') nextStatus = 'Not Started'

    const { error } = await supabase
        .from('milestones')
        .update({ status: nextStatus })
        .eq('id', milestoneId)

    if (error) {
        console.error('Error updating milestone:', error)
        return { error: 'Failed to update milestone' }
    }

    revalidatePath(`/dashboard/vision/${visionId}`)
    return { success: true }
}
