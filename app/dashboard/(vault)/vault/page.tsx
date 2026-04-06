'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { unlockVault } from '@/app/actions/unlock-vault'

export default function VaultPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await unlockVault(password)

      if (result.success) {
        // Show success animation
        setIsUnlocked(true)
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        // Trigger shake animation
        setShake(true)
        setTimeout(() => setShake(false), 500)
        setError(result.error || 'Incorrect password')
      }
    } catch (err) {
      console.error('Vault unlock error:', err)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setError('An unexpected error occurred')
    } finally {
      if (!isUnlocked) {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#1a0a02] px-5 py-10 overflow-hidden">
      {/* Title */}
      <h1 className="mb-8 text-center text-3xl font-bold uppercase tracking-[0.12em] text-[#f5e6c8] sm:text-4xl md:text-5xl">
        The Vault Breakers
      </h1>

      {/* Vault Container */}
      <div className={`relative transition-all duration-1000 ${isUnlocked ? 'scale-110' : ''}`}>
        {/* Glow effect behind vault */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${isUnlocked
              ? 'bg-[rgba(100,200,100,0.3)] scale-125'
              : 'bg-[rgba(200,120,60,0.15)]'
            }`}
        />

        {/* Vault Image */}
        <div
          className={`relative transition-all duration-1000 ${isUnlocked ? 'rotate-[30deg] opacity-80' : ''
            } ${shake ? 'animate-shake' : ''}`}
        >
          <Image
            src="/1.png"
            alt="Vault Door"
            width={350}
            height={350}
            className="relative z-10 drop-shadow-[0_0_30px_rgba(200,120,60,0.3)]"
            priority
          />
        </div>

        {/* Success Overlay */}
        {isUnlocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="animate-fadeIn rounded-lg bg-[rgba(0,0,0,0.8)] px-8 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold uppercase tracking-[0.15em] text-[#4ade80] sm:text-3xl">
                Access Granted
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Password Form - Hidden when unlocked */}
      {!isUnlocked && (
        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-[320px]">
          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded border border-red-500/30 bg-red-900/20 p-3 text-center">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Password Input */}
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the password"
              required
              disabled={isSubmitting}
              className={`w-full rounded border bg-[rgba(60,40,20,0.6)] px-4 py-3 text-center text-lg tracking-[0.1em] text-[#f5e6c8] placeholder:text-[#998866] outline-none transition focus:bg-[rgba(80,50,20,0.8)] ${error
                  ? 'border-red-500/50 focus:border-red-500/70'
                  : 'border-[rgba(200,120,60,0.3)] focus:border-[rgba(200,120,60,0.6)]'
                }`}
              autoComplete="off"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full rounded bg-[#c87838] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#1a0a02] transition hover:bg-[#d88848] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Unlocking...' : 'Unlock'}
          </button>
        </form>
      )}

      {/* Subtitle - changes based on state */}
      <p className="mt-6 text-center text-sm text-[#998866]">
        {isUnlocked
          ? 'Redirecting to dashboard...'
          : 'Enter the password to proceed'
        }
      </p>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
