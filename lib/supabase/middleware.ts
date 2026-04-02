import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// runs before every request — refreshes the session and handles auth redirects
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // pull the user — also refreshes the session as a side effect
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // not logged in? send them to login
  if (!user && (pathname === '/' || pathname.startsWith('/dashboard'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // already logged in? no reason to be on the auth pages
  if (user && (pathname === '/' || pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/tracker'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
