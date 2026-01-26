'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // For MVP, simple query param error handling
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    const next = formData.get('next') as string
    if (next && next.startsWith('/')) {
        redirect(next)
    }
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        console.error('Signup error:', error)
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    if (data.user && !data.session) {
        return redirect('/login?message=Account created! Please check your email to confirm.')
    }

    revalidatePath('/', 'layout')
    const next = formData.get('next') as string
    if (next && next.startsWith('/')) {
        redirect(next)
    }
    redirect('/dashboard')
}
