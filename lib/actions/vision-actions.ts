'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'


export async function createVision(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const timeHorizon = formData.get('time_horizon') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('image_url') as string

    // --- PLAN LIMIT CHECK ---
    // 1. Get current plan
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single()

    // Default to free if no subscription record found
    const plan = subscription?.plan || 'free'
    const isPro = plan === 'elite' || plan === 'ai_ultimate'

    // 2. Check existing count if Free
    if (!isPro) {
        const { count, error: countError } = await supabase
            .from('visions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        if (countError) {
            console.error('Error checking limits:', countError)
            return { error: 'Failed to validate plan limits' }
        }

        if (count !== null && count >= 1) {
            return { error: 'Free Plan Limit Reached (Max 1 Vision). Please Upgrade.' }
        }
    }
    // ------------------------

    const { error } = await supabase.from('visions').insert({
        user_id: user.id,
        title,
        category,
        time_horizon: timeHorizon,
        description,
        image_url: imageUrl || null,
        status: 'In Progress'
    })

    if (error) {
        console.error('Error creating vision:', error)
        return { error: 'Failed to create vision' }
    }

    revalidatePath('/dashboard/vision')
    return { success: true }
}

export async function deleteVision(id: string) {
    const supabase = await createClient()

    // RLS handles auth check but good ensure user
    const { error } = await supabase.from('visions').delete().eq('id', id)

    if (error) {
        console.error('Error deleting vision:', error)
        return { error: 'Failed to delete vision' }
    }

    revalidatePath('/dashboard/vision')
    return { success: true }
}

export async function updateVision(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const timeHorizon = formData.get('time_horizon') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('image_url') as string

    const { error } = await supabase
        .from('visions')
        .update({
            title,
            category,
            time_horizon: timeHorizon,
            description,
            image_url: imageUrl || null,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating vision:', error)
        return { error: 'Failed to update vision' }
    }

    revalidatePath('/dashboard/vision')
    revalidatePath(`/dashboard/vision/${id}`)
    return { success: true }
}
