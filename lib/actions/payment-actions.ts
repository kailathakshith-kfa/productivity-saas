'use server'

import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createRazorpayOrder(plan: 'elite' | 'ai_ultimate') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Please login to subscribe' }
    }

    const plans = {
        'elite': 19900, // ₹199
        'ai_ultimate': 29900 // ₹299
    }

    const amount = plans[plan]
    if (!amount) throw new Error('Invalid plan')

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

    const options = {
        amount: amount, // ₹199.00 in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}_${user.id.slice(0, 5)}`,
        notes: {
            plan: plan
        }
    }

    try {
        console.log('Creating Razorpay Order:', options)
        const order = await razorpay.orders.create(options)
        console.log('Order created:', order.id)
        return { orderId: order.id, amount: order.amount, currency: order.currency, keyId: keyId }
    } catch (error: any) {
        console.error('Razorpay Error Details:', JSON.stringify(error, null, 2))
        return { error: `Failed to create order: ${error.error?.description || error.message || 'Unknown error'}` }
    }
}

export async function verifyPayment(response: any, planId: string) {
    const crypto = require('crypto')
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const secret = process.env.RAZORPAY_KEY_SECRET?.trim()
    if (!secret) throw new Error('Razorpay Secret Missing')

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex")

    /* Debug logs removed for production */

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
                    status: 'active',
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' })
            error = upsertError
        } else {
            // Fallback to RPC (Less Secure)
            console.warn("Using RPC fallback for subscription. Add SUPABASE_SERVICE_ROLE_KEY for better security.")
            const { error: rpcError } = await supabase.rpc('upsert_subscription', {
                p_plan: planId,
                p_payment_id: razorpay_payment_id
            })
            error = rpcError
        }

        if (error) {
            console.error('Subscription update failed:', error)
            return { error: 'Failed to update subscription' }
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
