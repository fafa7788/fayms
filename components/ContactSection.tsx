"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="border-t border-[var(--border)]">
      <div className="container-fayms py-20 md:py-28 grid gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            Start your project
          </h2>
          <p className="mt-4 text-[var(--text-muted)] leading-relaxed max-w-sm">
            Tell us about your idea and we&apos;ll get back to you shortly. You
            can also reach us directly:
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            <li>
              <span className="text-[var(--text-dim)] mr-2">Email</span>
              <a href="mailto:fayms026@gmail.com" className="hover:text-[var(--accent)] transition-colors">
                fayms026@gmail.com
              </a>
            </li>
            <li>
              <span className="text-[var(--text-dim)] mr-2">WhatsApp</span>
              <a href="https://wa.me/966500000000" className="hover:text-[var(--accent)] transition-colors">
                +966 50 000 0000
              </a>
            </li>
            <li>
              <span className="text-[var(--text-dim)] mr-2">Instagram</span>
              <a href="https://instagram.com/fayms.sa" className="hover:text-[var(--accent)] transition-colors">
                @fayms.sa
              </a>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Phone / WhatsApp" name="phone" />
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor="project_type">
                Project type
              </label>
              <select
                id="project_type"
                name="project_type"
                className="w-full h-11 bg-[var(--bg-elevated)] border border-[var(--border)] px-3 text-sm focus:border-[var(--accent)] outline-none transition-colors"
              >
                <option value="Website">Website</option>
                <option value="E-Commerce">E-commerce</option>
                <option value="Mobile App">Mobile app</option>
                <option value="UI/UX Design">UI/UX design</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--accent)] outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center h-12 px-7 bg-[var(--text)] text-[var(--bg)] text-sm font-medium clip-corner hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>

          {status === "success" && (
            <p className="text-sm text-[var(--accent)]">
              Thanks — your message has been sent. We&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full h-11 bg-[var(--bg-elevated)] border border-[var(--border)] px-3 text-sm focus:border-[var(--accent)] outline-none transition-colors"
      />
    </div>
  );
}
