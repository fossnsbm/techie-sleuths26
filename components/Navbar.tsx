"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/">TECHIE SLEUTHS 26&quot;</Link>
      </div>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link href="/" onClick={() => setMenuOpen(false)}>HOME</Link></li>
        <li><Link href="#about" onClick={() => setMenuOpen(false)}>ABOUT US</Link></li>
        <li><Link href="#games" onClick={() => setMenuOpen(false)}>GAMES</Link></li>
      </ul>
    </nav>
  );
}
