'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    try {
        const supabase = await createClient()

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            redirect(`/login?message=${encodeURIComponent(error.message)}`)
        }

        revalidatePath('/', 'layout')
        const next = formData.get('next') as string
        if (next && next.startsWith('/')) {
            redirect(next)
        }
        redirect('/dashboard')
    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }
        console.error('Login Error:', error)
        redirect(`/login?message=${encodeURIComponent('System Error: ' + (error.message || 'Unknown error occurred'))}`)
    }
}

export async function signup(formData: FormData) {
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
            redirect(`/login?message=${encodeURIComponent(error.message)}`)
        }

        if (data.user && !data.session) {
            redirect('/login?message=Account created! Please check your email to confirm.')
        }

        revalidatePath('/', 'layout')
        const next = formData.get('next') as string
        if (next && next.startsWith('/')) {
            redirect(next)
        }
        redirect('/dashboard')
    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }
        console.error('Signup System Error:', error)
        redirect(`/login?message=${encodeURIComponent('System Error: ' + (error.message || 'Unknown error occurred'))}`)
    }
}
