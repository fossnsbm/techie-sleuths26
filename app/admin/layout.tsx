import Link from 'next/link'
import { logout } from '@/app/actions/logout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white site-background">
      <nav className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b border-[rgba(200,120,60,0.15)] bg-[rgba(18,6,2,0.72)] px-6 py-4 backdrop-blur-[10px] sm:px-10">
        <Link href="/admin" className="text-lg font-bold uppercase tracking-[0.08em] text-[#f5e6c8]">
          TECHIE SLEUTHS 26 ADMIN
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="border border-[rgba(200,120,60,0.3)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#d4b896] transition hover:border-[rgba(200,120,60,0.6)] hover:text-[#f5e6c8]"
          >
            Leaderboard
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="border border-[rgba(200,120,60,0.3)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#d4b896] transition hover:border-[rgba(200,120,60,0.6)] hover:text-[#f5e6c8]"
            >
              Logout
            </button>
          </form>
        </div>
      </nav>

      <main className="px-4 pt-24 pb-10 sm:px-8">{children}</main>
    </div>
  )
}
