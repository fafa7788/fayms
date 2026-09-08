"use client";

import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Our work" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur">
      <nav className="container-fayms flex h-16 items-center justify-between">
        <a href="#top" className="shrink-0">
          <Logo size={26} />
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-[var(--text-muted)]">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-[var(--text)] transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center h-10 px-5 bg-[var(--text)] text-[var(--bg)] text-sm font-medium clip-corner-sm hover:bg-[var(--accent)] transition-colors"
        >
          Start your project
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden inline-flex flex-col justify-center gap-1.5 w-9 h-9"
        >
          <span
            className={`block h-px bg-[var(--text)] transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px bg-[var(--text)] transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]">
          <ul className="container-fayms py-4 flex flex-col gap-4 text-sm text-[var(--text-muted)]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-1">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center h-10 px-5 bg-[var(--text)] text-[var(--bg)] text-sm font-medium clip-corner-sm"
              >
                Start your project
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
