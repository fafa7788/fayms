"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Login failed.");
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Logo size={30} />
        </div>

        <h1 className="font-display text-xl font-medium text-center mb-1">
          Admin sign in
        </h1>
        <p className="text-sm text-[var(--text-muted)] text-center mb-8">
          Manage projects and messages for the FAYMS website.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoFocus
              className="w-full h-11 bg-[var(--bg-elevated)] border border-[var(--border)] px-3 text-sm focus:border-[var(--accent)] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full h-11 bg-[var(--bg-elevated)] border border-[var(--border)] px-3 text-sm focus:border-[var(--accent)] outline-none transition-colors"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[var(--text)] text-[var(--bg)] text-sm font-medium clip-corner-sm hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
