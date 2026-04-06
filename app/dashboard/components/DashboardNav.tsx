"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/logout";

export default function DashboardNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const getLinkClasses = (href: string) => {
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
    
    const baseClasses = "block px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] transition";
    const mobileClasses = "border-b border-[rgba(200,120,60,0.08)] sm:border-none sm:px-0 sm:py-0";
    
    if (isActive) {
      return `${baseClasses} ${mobileClasses} text-[#f5e6c8] sm:border-b-2 sm:border-[#d4b896] sm:pb-1`;
    }
    
    return `${baseClasses} ${mobileClasses} text-[#d4b896] hover:text-[#f5e6c8]`;
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b border-[rgba(200,120,60,0.15)] bg-[rgba(18,6,2,0.72)] px-6 py-4 backdrop-blur-[10px] sm:px-10">
      <div>
        <Link
          href="/dashboard"
          className="text-lg font-bold uppercase tracking-[0.08em] text-[#f5e6c8]"
        >
          TECHIE SLEUTHS 26
        </Link>
      </div>
      
      <button
        className="flex flex-col gap-[5px] bg-transparent p-1 sm:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="block h-[2px] w-6 rounded bg-[#d4b896]" />
        <span className="block h-[2px] w-6 rounded bg-[#d4b896]" />
        <span className="block h-[2px] w-6 rounded bg-[#d4b896]" />
      </button>

      <ul
        className={`absolute left-0 right-0 top-full flex flex-col bg-[rgba(18,6,2,0.97)] sm:static sm:flex sm:flex-row sm:items-center sm:gap-8 sm:bg-transparent ${
          menuOpen ? "flex" : "hidden sm:flex"
        }`}
      >
        <li>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={getLinkClasses('/dashboard')}
          >
            DASHBOARD
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/team"
            onClick={() => setMenuOpen(false)}
            className={getLinkClasses('/dashboard/team')}
          >
            <span className="inline-flex items-center gap-1.5">
              <span aria-label="Team" role="img">👥</span>
              <span>TEAM</span>
            </span>
          </Link>
        </li>
        <li>
          <form
            action={async () => {
              setIsLoggingOut(true);
              setMenuOpen(false);
              await logout();
            }}
          >
            <button
              type="submit"
              disabled={isLoggingOut}
              className="block w-full border-b border-[rgba(200,120,60,0.08)] px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#d4b896] transition hover:text-[#f5e6c8] disabled:opacity-50 sm:w-auto sm:border sm:border-[rgba(200,120,60,0.3)] sm:px-4 sm:py-2 sm:text-center sm:hover:border-[rgba(200,120,60,0.6)]"
            >
              {isLoggingOut ? 'LOGGING OUT...' : 'LOGOUT'}
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
