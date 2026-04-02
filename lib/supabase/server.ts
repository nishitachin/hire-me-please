import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// for server components and API routes
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: any; value: any; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll only works in middleware — if it throws here the session still updates, cookies just won't be written until the next request
          }
        },
      },
    }
  )
}
