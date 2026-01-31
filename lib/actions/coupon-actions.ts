'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function redeemCoupon(formData: FormData) {
    const code = formData.get('code') as string

    if (!code) {
        return { error: 'Please enter a coupon code' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to redeem a coupon' }
    }

    // Use Admin Client to bypass RLS for checking coupons and updating subscriptions securely
    const adminSupabase = createAdminClient()

    if (!adminSupabase) {
        return { error: 'Server configuration error' }
    }

    // 1. Fetch Coupon
    const { data: coupon, error: fetchError } = await adminSupabase
        .from('coupons')
        .select('*')
        .eq('code', code) // Case sensitive? ideally coupons are uppercase. Let's force uppercase comparison if we standardize.
        .single() // Expect unique code

    if (fetchError || !coupon) {
        return { error: 'Invalid coupon code' }
    }

    // 2. Validate Coupon
    if (!coupon.is_active) {
        return { error: 'This coupon is no longer active' }
    }

    if (coupon.uses >= coupon.max_uses) {
        return { error: 'This coupon has reached its usage limit' }
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { error: 'This coupon has expired' }
    }

    // 3. Apply Coupon (Transaction-like: Update Coupon + Update Subscription)
    // Supabase doesn't have multi-table transactions via JS client easily, but we can do sequential steps.
    // If subscription update fails, we technically "wasted" a coupon count update, but that's acceptable for MVP.

    // Increment Uses
    const { error: updateCouponError } = await adminSupabase
        .from('coupons')
        .update({ uses: coupon.uses + 1 })
        .eq('id', coupon.id)

    if (updateCouponError) {
        console.error('Coupon usage update failed:', updateCouponError)
        return { error: 'Failed to process coupon' }
    }

    // Update Subscription
    const { error: subError } = await adminSupabase
        .from('subscriptions')
        .upsert({
            user_id: user.id,
            plan: coupon.plan_id,
            status: 'active',
            payment_id: `coupon_${code}`,
            subscription_id: `coupon_${code}_${Date.now()}`, // Dummy ID for coupon subs
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

    if (subError) {
        console.error('Subscription update failed:', subError)
        // Ideally rollback coupon usage here, but keeping it simple.
        return { error: 'Failed to activate subscription' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings')

    return { success: true, plan: coupon.plan_id }
}
