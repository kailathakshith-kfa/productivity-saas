import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to insecure client or failing.')
        return null
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
