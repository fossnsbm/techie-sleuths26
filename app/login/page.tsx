'use client'

import { useState, Suspense } from 'react'
import { login } from '@/app/actions/login'
import { toast } from 'sonner'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      const data = {
        email: formData.get('email')?.toString() || '',
        password: formData.get('password')?.toString() || '',
        rememberMe: formData.get('rememberMe') === 'on'
      }

      // Call login server action (it will redirect on success)
      const result = await login(data, redirectTo || undefined)

      // If we get here, login failed (redirect would prevent this)
      if (!result.success) {
        setError(result.error || 'Login failed')
        toast.error('Login failed', {
          description: result.error || 'Invalid credentials'
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
      toast.error('Login failed', {
        description: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBaseClass =
    "w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8] placeholder:text-[#998866] outline-none transition focus:border-[rgba(200,120,60,0.6)] focus:bg-[rgba(80,50,20,0.8)]"

  return (
    <form
      className="rounded-lg border-2 border-[#c87838] bg-[rgba(18,6,2,0.8)] px-6 py-8 sm:px-8"
      onSubmit={handleSubmit}
    >
      {/* Error Display */}
      {error && (
        <div className="mb-5 rounded border border-red-500/30 bg-red-900/20 p-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
          TEAM EMAIL
        </label>
        <input
          type="email"
          name="email"
          placeholder="student@students.nsbm.ac.lk"
          required
          disabled={isSubmitting}
          className={inputBaseClass}
          autoComplete="email"
        />
      </div>

      {/* Password Field */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
          PASSWORD
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          required
          disabled={isSubmitting}
          className={inputBaseClass}
          autoComplete="current-password"
        />
      </div>

      {/* Remember Me Checkbox */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          name="rememberMe"
          id="rememberMe"
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] text-[#c87838] focus:ring-[rgba(200,120,60,0.6)] focus:ring-offset-0"
        />
        <label
          htmlFor="rememberMe"
          className="ml-2 text-sm text-[#998866] cursor-pointer"
        >
          Remember me
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-[#c87838] px-4 py-3 text-sm font-bold tracking-[0.08em] text-[#1a0a02] transition hover:bg-[#d88848] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
      </button>

      {/* Footer Links */}
      <div className="mt-6 text-center">
        <p className="text-sm text-[#998866]">
          Don&apos;t have an account?{' '}
          <Link
            href="/#register"
            className="font-semibold text-[#c87838] hover:text-[#d88848] transition"
          >
            Register here
          </Link>
        </p>
      </div>
    </form>
  )
}

function LoginFormFallback() {
  const inputBaseClass =
    "w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8] placeholder:text-[#998866] outline-none"

  return (
    <div className="rounded-lg border-2 border-[#c87838] bg-[rgba(18,6,2,0.8)] px-6 py-8 sm:px-8 animate-pulse">
      <div className="mb-5">
        <div className="mb-2 h-3 w-24 bg-[rgba(200,120,60,0.2)] rounded" />
        <div className={`${inputBaseClass} h-10`} />
      </div>
      <div className="mb-5">
        <div className="mb-2 h-3 w-20 bg-[rgba(200,120,60,0.2)] rounded" />
        <div className={`${inputBaseClass} h-10`} />
      </div>
      <div className="mb-6 flex items-center">
        <div className="h-4 w-4 bg-[rgba(200,120,60,0.2)] rounded" />
        <div className="ml-2 h-4 w-24 bg-[rgba(200,120,60,0.2)] rounded" />
      </div>
      <div className="w-full h-11 bg-[#c87838]/50 rounded" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#1a0a02] px-5 py-10">
      <div className="w-full max-w-[500px]">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-[0.12em] text-[#f5e6c8] md:text-5xl">
            LOGIN
          </h1>
          <p className="text-sm text-[#998866]">
            Welcome back, detective. Enter your credentials to access the investigation.
          </p>
        </div>

        {/* Login Form with Suspense for useSearchParams */}
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#998866] hover:text-[#c87838] transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
