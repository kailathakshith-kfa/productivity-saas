import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes: redirect unauthenticated users to login
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            const url = new URL('/login', request.url)
            url.searchParams.set('next', request.nextUrl.pathname)
            return NextResponse.redirect(url)
        }
    }

    // Auth routes: redirect authenticated users to dashboard
    if (request.nextUrl.pathname === '/login') {
        if (user) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // Root route: Allow landing page to render
    if (request.nextUrl.pathname === '/') {
        // We can allow users to see landing page always. 
        // Or redirect ONLY if user wants to go to dashboard.
        // Let's NOT redirect root. Let 'app/page.tsx' handle logic (it has 'Go to Dashboard' button if session exists).
        return supabaseResponse
    }

    // --- SECURITY HEADERS ---
    const headers = supabaseResponse.headers

    // Prevent clickjacking
    headers.set('X-Frame-Options', 'DENY')

    // Prevent MIME type sniffing
    headers.set('X-Content-Type-Options', 'nosniff')

    // Control referrer information
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Force HTTPS (HSTS) - 1 year
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

    // Basic Permissions Policy
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
