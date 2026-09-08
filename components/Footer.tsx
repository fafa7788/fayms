import { Logo } from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="container-fayms py-14 grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo size={24} />
          <p className="mt-4 text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
            Digital solutions for businesses across Saudi Arabia — websites, online
            stores, mobile apps and interface design.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Navigate</h3>
          <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
            <li><a href="#about" className="hover:text-[var(--text)] transition-colors">About</a></li>
            <li><a href="#services" className="hover:text-[var(--text)] transition-colors">Services</a></li>
            <li><a href="#work" className="hover:text-[var(--text)] transition-colors">Our work</a></li>
            <li><a href="#contact" className="hover:text-[var(--text)] transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Get in touch</h3>
          <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
            <li>
              <a href="mailto:hello@fayms.sa" className="hover:text-[var(--text)] transition-colors">
                hello@fayms.sa
              </a>
            </li>
            <li>
              <a href="https://wa.me/966500000000" className="hover:text-[var(--text)] transition-colors">
                WhatsApp — +966 50 000 0000
              </a>
            </li>
            <li>
              <a href="https://instagram.com/fayms" className="hover:text-[var(--text)] transition-colors">
                @fayms
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-fayms py-6 border-t border-[var(--border)] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs text-[var(--text-dim)]">
        <p>© {new Date().getFullYear()} FAYMS. All rights reserved.</p>
        <a href="/admin/login" className="hover:text-[var(--text-muted)] transition-colors">
          Admin
        </a>
      </div>
    </footer>
  );
}
