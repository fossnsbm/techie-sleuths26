const links = [
  { href: "#home", label: "HOME" },
  { href: "#registrations", label: "REGISTRATIONS" },
  { href: "#about-us", label: "ABOUT US" },
  { href: "#games", label: "GAMES" },
  { href: "#faq", label: "FAQ" },
];

export default function MainNav() {
  return (
    <header className="top-nav">
      <p className="brand">TECHIE SLEUTHS 26</p>
      <nav className="menu" aria-label="Primary">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
