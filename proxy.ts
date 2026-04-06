import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase-auth'

export async function proxy(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // Securely verify user by contacting Supabase Auth server
  const { data: { user } } = await supabase.auth.getUser()

  // Check if the route is protected (dashboard routes)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If no user, redirect to login with the intended destination
    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check vault status (except for /dashboard/vault itself to avoid redirect loop)
    if (request.nextUrl.pathname !== '/dashboard/vault') {
      const { data: team } = await supabase
        .from('teams')
        .select('vault_unlocked')
        .eq('user_id', user.id)
        .single()

      // If vault is not unlocked, redirect to vault page
      if (!team?.vault_unlocked) {
        return NextResponse.redirect(new URL('/dashboard/vault', request.url))
      }
    }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
