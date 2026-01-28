'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AuthActionResult = {
    success: boolean
    message?: string
    redirect?: string
}

export async function login(formData: FormData): Promise<AuthActionResult> {
    try {
        const supabase = await createClient()

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return { success: false, message: error.message }
        }

        revalidatePath('/', 'layout')
        const next = formData.get('next') as string
        if (next && next.startsWith('/')) {
            return { success: true, redirect: next }
        }
        return { success: true, redirect: '/dashboard' }
    } catch (error: any) {
        console.error('Login Error:', error)
        return { success: false, message: 'System Error: ' + (error.message || 'Unknown error occurred') }
    }
}

export async function signup(formData: FormData): Promise<AuthActionResult> {
    try {
        const supabase = await createClient()

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            console.error('Signup error:', error)
            return { success: false, message: error.message }
        }

        if (data.user && !data.session) {
            return { success: false, message: 'Account created! Please check your email to confirm.' } // technically success but no login yet
        }

        revalidatePath('/', 'layout')
        const next = formData.get('next') as string
        if (next && next.startsWith('/')) {
            return { success: true, redirect: next }
        }
        return { success: true, redirect: '/dashboard' }
    } catch (error: any) {
        console.error('Signup System Error:', error)
        return { success: false, message: 'System Error: ' + (error.message || 'Unknown error occurred') }
    }
}
