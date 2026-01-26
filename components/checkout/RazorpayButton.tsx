'use client'

import React, { useState } from 'react'
import { createRazorpayOrder, verifyPayment } from '@/lib/actions/payment-actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Load Razorpay Script manually or assumes it's loaded in layout/head?
// Better to load dynamically.
function loadScript(src: string) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export function RazorpayButton({
    planId = 'elite',
    buttonText = 'Get Started Now',
    className = ''
}: {
    planId?: 'elite' | 'ai_ultimate',
    buttonText?: string,
    className?: string
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handlePayment = async () => {
        setLoading(true)

        // 1. Load SDK
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if (!res) {
            alert('Razorpay SDK failed to load')
            setLoading(false)
            return
        }

        // 2. Create Order
        const result = await createRazorpayOrder(planId)
        if (result.error) {
            // Check for authentication error
            if (result.error.toLowerCase().includes('login') || result.error.includes('unauthorized')) {
                router.push('/login?mode=signup')
                return
            }

            alert(result.error)
            setLoading(false)
            return
        }

        // 3. Open Checkout
        const { orderId, amount, currency, keyId } = result

        const options = {
            key: keyId,
            amount: amount,
            currency: currency,
            name: "Kinetic Flow AI",
            description: `${planId === 'elite' ? 'Elite' : 'AI Ultimate'} Subscription`,
            order_id: orderId,
            handler: async function (response: any) {
                // Try standard signature verification
                let verifyRes = await verifyPayment(response, planId)

                // Fallback: Check status directly with Razorpay if signature fails
                if (!verifyRes.success) {
                    // Import dynamically if needed or just assume it's available in scope if I import it at top
                    // Assuming forceVerifyPayment is exported from same file
                    const { forceVerifyPayment } = await import('@/lib/actions/payment-actions')
                    verifyRes = await forceVerifyPayment(response.razorpay_payment_id)
                }

                if (verifyRes.success) {
                    alert(`Payment Successful! Welcome to ${planId === 'elite' ? 'Elite' : 'Ultimate'}.`)
                    router.push('/dashboard')
                } else {
                    alert('Payment Verification Failed: ' + (verifyRes.error || 'Unknown Error'))
                }
            },
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            theme: {
                color: "#06b6d4"
            }
        }

        const paymentObject = new (window as any).Razorpay(options)
        paymentObject.open()
        setLoading(false)
    }

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={`rounded-xl bg-brand-cyan text-brand-dark font-bold flex items-center justify-center hover:bg-brand-glow transition relative z-10 px-6 py-3 ${className}`}
        >
            {loading ? <Loader2 className="animate-spin" /> : buttonText}
        </button>
    )
}
