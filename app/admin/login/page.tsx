'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { adminLogin } from '@/app/actions/admin-login'

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  )
}

export default function AdminLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await adminLogin({
        email: String(formData.get('email') || ''),
        password: String(formData.get('password') || '')
      })

      if (!result.success) {
        setError(result.error || 'Login failed')
        toast.error('Admin login failed', {
          description: result.error || 'Invalid credentials'
        })
      }
    } catch (err) {
      if (isRedirectError(err)) {
        throw err
      }
      setError('An unexpected error occurred')
      toast.error('Admin login failed', {
        description: 'An unexpected error occurred'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-[#1a0a02] ">
      <div className="w-full max-w-[500px]">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-[0.12em] text-[#f5e6c8] md:text-5xl">
            ADMIN LOGIN
          </h1>
          <p className="text-sm text-[#998866]">
            Restricted area. Authorized administrators only.
          </p>
        </div>

        <form
          className="rounded-lg border-2 border-[#c87838] bg-[rgba(18,6,2,0.8)] px-6 py-8 sm:px-8"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="mb-5 rounded border border-red-500/30 bg-red-900/20 p-4">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              name="email"
              required
              disabled={isSubmitting}
              className="w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8] placeholder:text-[#998866] outline-none transition focus:border-[rgba(200,120,60,0.6)]"
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#f5e6c8]">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              required
              disabled={isSubmitting}
              className="w-full rounded border border-[rgba(200,120,60,0.3)] bg-[rgba(60,40,20,0.6)] px-3 py-2.5 text-sm text-[#f5e6c8] placeholder:text-[#998866] outline-none transition focus:border-[rgba(200,120,60,0.6)]"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-[#c87838] px-4 py-3 text-sm font-bold tracking-[0.08em] text-[#1a0a02] transition hover:bg-[#d88848] disabled:opacity-50"
          >
            {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#998866] hover:text-[#c87838] transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
