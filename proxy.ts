import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase-auth'
import { getGameAccessState } from '@/lib/game-access'

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

  const getGameProgress = async () => {
    if (!user) {
      return { trailQuestionsCompleted: 0, noExitChallengesCompleted: 0 }
    }

    const { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!team) {
      return { trailQuestionsCompleted: 0, noExitChallengesCompleted: 0 }
    }

    const [{ count: trailCount }, { count: noExitCount }] = await Promise.all([
      supabase
        .from('trail_of_shadows_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', team.id)
        .eq('is_correct', true),
      supabase
        .from('no_exit_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', team.id)
        .eq('is_correct', true)
    ])

    return {
      trailQuestionsCompleted: trailCount || 0,
      noExitChallengesCompleted: noExitCount || 0
    }
  }

  const isAdminUser = async () => {
    if (!user) return false

    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    return Boolean(admin)
  }

  // Protected route: /admin/* (requires admin user)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (!user) {
        return response
      }

      const isAdmin = await isAdminUser()
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      return response
    }

    if (!user) {
      const redirectUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
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
    if (pathname === '/dashboard/games/no-exit' || pathname === '/dashboard/games/ai-interrogation') {
      const { trailQuestionsCompleted, noExitChallengesCompleted } = await getGameProgress()
      const access = getGameAccessState(trailQuestionsCompleted, noExitChallengesCompleted)

      if (pathname === '/dashboard/games/no-exit' && !access.canAccessNoExit) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      if (pathname === '/dashboard/games/ai-interrogation' && !access.canAccessAIInterrogation) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

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
