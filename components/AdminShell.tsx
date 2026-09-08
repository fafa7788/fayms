"use client";

import { useRouter, usePathname } from "next/navigation";
import { Logo } from "./Logo";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--border)]">
        <div className="container-fayms h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size={24} />
            <nav className="hidden sm:flex items-center gap-6 text-sm text-[var(--text-muted)]">
              <a
                href="/admin/dashboard"
                className={pathname === "/admin/dashboard" ? "text-[var(--text)]" : "hover:text-[var(--text)] transition-colors"}
              >
                Projects
              </a>
              <a href="/" target="_blank" className="hover:text-[var(--text)] transition-colors">
                View site
              </a>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="container-fayms py-10">{children}</main>
    </div>
  );
}
