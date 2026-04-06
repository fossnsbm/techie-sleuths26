import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase-auth'

export async function proxy(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // Refresh session if it exists
  const { data: { session } } = await supabase.auth.getSession()

  // Check if the route is protected (dashboard routes)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If no session, redirect to login with the intended destination
    if (!session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (request.nextUrl.pathname === '/login' && session) {
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
