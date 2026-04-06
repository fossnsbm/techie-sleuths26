import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase-auth'

export async function proxy(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // Securely verify user by contacting Supabase Auth server
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Helper to get team's vault status
  const getVaultStatus = async () => {
    if (!user) return null
    const { data: team } = await supabase
      .from('teams')
      .select('vault_unlocked')
      .eq('user_id', user.id)
      .single()
    return team?.vault_unlocked ?? false
  }

  // Protected route: /vault (requires login)
  if (pathname === '/vault') {
    if (!user) {
      // Not logged in - redirect to login
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', '/vault')
      return NextResponse.redirect(redirectUrl)
    }

    // Check if vault is already unlocked
    const vaultUnlocked = await getVaultStatus()
    if (vaultUnlocked) {
      // Already unlocked - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Vault is locked - allow access to vault page
    return response
  }

  // Protected route: /dashboard/* (requires login + unlocked vault)
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      // Not logged in - redirect to login
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check vault status
    const vaultUnlocked = await getVaultStatus()
    if (!vaultUnlocked) {
      // Vault is locked - redirect to vault page
      return NextResponse.redirect(new URL('/vault', request.url))
    }

    // Vault is unlocked - allow access to dashboard
    return response
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  // (proxy will handle vault check on subsequent request)
  if (pathname === '/login' && user) {
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
