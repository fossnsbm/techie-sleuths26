"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b border-[rgba(200,120,60,0.15)] bg-[rgba(18,6,2,0.72)] px-6 py-4 backdrop-blur-[10px] sm:px-10">
      <div>
        <Link
          href="/"
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
        className={`absolute left-0 right-0 top-full flex flex-col bg-[rgba(18,6,2,0.97)] sm:static sm:flex sm:flex-row sm:gap-10 sm:bg-transparent ${
          menuOpen ? "flex" : "hidden sm:flex"
        }`}
      >
        <li>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block border-b border-[rgba(200,120,60,0.08)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#d4b896] transition hover:text-[#f5e6c8] sm:border-none sm:px-0 sm:py-0"
          >
            HOME
          </Link>
        </li>
        <li>
          <Link
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="block border-b border-[rgba(200,120,60,0.08)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#d4b896] transition hover:text-[#f5e6c8] sm:border-none sm:px-0 sm:py-0"
          >
            ABOUT US
          </Link>
        </li>
        <li>
          <Link
            href="#games"
            onClick={() => setMenuOpen(false)}
            className="block border-b border-[rgba(200,120,60,0.08)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#d4b896] transition hover:text-[#f5e6c8] sm:border-none sm:px-0 sm:py-0"
          >
            GAMES
          </Link>
        </li>
      </ul>
    </nav>
  );
}
