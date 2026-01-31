'use server'

import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createRazorpaySubscription(plan: 'elite' | 'ai_ultimate') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Please login to subscribe' }
    }

    const planId = plan === 'elite'
        ? process.env.NEXT_PUBLIC_RAZORPAY_ELITE_PLAN_ID
        : process.env.NEXT_PUBLIC_RAZORPAY_ULTIMATE_PLAN_ID

    if (!planId) {
        return { error: 'Subscription plan not configured' }
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
        console.error('Razorpay Keys Missing!', { keyId: !!keyId, keySecret: !!keySecret })
        return { error: 'Payment gateway configuration missing' }
    }

    const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    })

    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: 60, // 5 years monthly
            quantity: 1,
            customer_notify: 1,
            notes: {
                userId: user.id,
                planType: plan
            }
        })

        return {
            subscriptionId: subscription.id,
            keyId: keyId,
            // Subscriptions don't need amount passed to checkout, it's in the plan
        }
    } catch (error: any) {
        console.error('Razorpay Subscription Error:', JSON.stringify(error, null, 2))
        return { error: `Failed to create subscription: ${error.error?.description || error.message}` }
    }
}

export async function verifyPayment(response: any, planId: string) {
    const crypto = require('crypto')
    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = response

    const body = razorpay_payment_id + "|" + razorpay_subscription_id
    const secret = process.env.RAZORPAY_KEY_SECRET?.trim()
    if (!secret) throw new Error('Razorpay Secret Missing')

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature === razorpay_signature) {
        // Payment valid
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { error: 'User not found' }

        const adminSupabase = createAdminClient()
        let error;

        if (adminSupabase) {
            // Secure Admin Write
            const { error: upsertError } = await adminSupabase
                .from('subscriptions')
                .upsert({
                    user_id: user.id,
                    plan: planId,
                    payment_id: razorpay_payment_id,
                    subscription_id: razorpay_subscription_id, // Store sub ID
                    status: 'active',
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' })
            error = upsertError
        } else {
            console.warn("Using RPC fallback for subscription.")
            const { error: rpcError } = await supabase.rpc('upsert_subscription', {
                p_plan: planId,
                p_payment_id: razorpay_payment_id
            })
            error = rpcError
        }

        if (error) {
            console.error('Subscription update failed:', error)
            return { error: 'Failed to update subscription in DB' }
        }

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/settings')
        return { success: true }
    } else {
        console.error('Signature Mismatch!')
        return { error: 'Invalid signature' }
    }
}

export async function forceVerifyPayment(paymentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'User not found' }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim()

    if (!keyId || !keySecret) return { error: 'Configuration missing' }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

    try {
        const payment = await razorpay.payments.fetch(paymentId)

        if (payment.status === 'captured') {
            // Success! Force update DB
            const plan = payment.notes?.plan as string || 'elite' // Default to elite if note missing

            const adminSupabase = createAdminClient()
            let err;

            if (adminSupabase) {
                const { error } = await adminSupabase
                    .from('subscriptions')
                    .upsert({
                        user_id: user.id,
                        plan: plan,
                        payment_id: payment.id,
                        status: 'active',
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' })
                err = error
            } else {
                const { error } = await supabase.rpc('upsert_subscription', {
                    p_plan: plan,
                    p_payment_id: payment.id
                })
                err = error
            }

            if (err) throw err

            revalidatePath('/dashboard')
            revalidatePath('/dashboard/settings')
            return { success: true, plan }
        } else {
            return { error: `Payment status is ${payment.status}, not captured.` }
        }
    } catch (error: any) {
        console.error('Force Verify Error:', error)
        return { error: error.message || 'Failed to fetch payment' }
    }
}
