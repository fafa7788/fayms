"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import type { Project } from "@/lib/db";

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  message: string;
  created_at: string;
};

export default function DashboardPage() {
  const [tab, setTab] = useState<"projects" | "messages">("projects");
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadProjects = useCallback(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (tab === "messages" && messages === null) {
      fetch("/api/admin/messages")
        .then((r) => r.json())
        .then((d) => setMessages(d.messages ?? []));
    }
  }, [tab, messages]);

  async function togglePublish(p: Project) {
    setBusyId(p.id);
    await fetch(`/api/admin/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: p.published === 1 ? false : true }),
    });
    setBusyId(null);
    loadProjects();
  }

  async function deleteProject(p: Project) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    setBusyId(p.id);
    await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
    setBusyId(null);
    loadProjects();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-6 text-sm">
          <button
            onClick={() => setTab("projects")}
            className={tab === "projects" ? "font-medium" : "text-[var(--text-muted)]"}
          >
            Projects
          </button>
          <button
            onClick={() => setTab("messages")}
            className={tab === "messages" ? "font-medium" : "text-[var(--text-muted)]"}
          >
            Messages
          </button>
        </div>
        {tab === "projects" && (
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center h-10 px-5 bg-[var(--text)] text-[var(--bg)] text-sm font-medium clip-corner-sm hover:bg-[var(--accent)] transition-colors"
          >
            Add project
          </Link>
        )}
      </div>

      {tab === "projects" && (
        <>
          {projects === null && <p className="text-sm text-[var(--text-dim)]">Loading…</p>}
          {projects && projects.length === 0 && (
            <div className="border border-dashed border-[var(--border-strong)] p-12 text-center text-sm text-[var(--text-muted)]">
              No projects yet. Add your first one.
            </div>
          )}
          {projects && projects.length > 0 && (
            <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4">
                  <div className="w-16 h-16 bg-[var(--bg-elevated)] shrink-0 overflow-hidden">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{p.category}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 shrink-0 ${
                      p.published ? "text-[var(--accent)] border border-[var(--accent)]/40" : "text-[var(--text-dim)] border border-[var(--border)]"
                    }`}
                  >
                    {p.published ? "Published" : "Unpublished"}
                  </span>
                  <button
                    disabled={busyId === p.id}
                    onClick={() => togglePublish(p)}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors disabled:opacity-50 shrink-0"
                  >
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shrink-0"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={busyId === p.id}
                    onClick={() => deleteProject(p)}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "messages" && (
        <>
          {messages === null && <p className="text-sm text-[var(--text-dim)]">Loading…</p>}
          {messages && messages.length === 0 && (
            <div className="border border-dashed border-[var(--border-strong)] p-12 text-center text-sm text-[var(--text-muted)]">
              No messages yet.
            </div>
          )}
          {messages && messages.length > 0 && (
            <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
              {messages.map((m) => (
                <div key={m.id} className="p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-2">
                    {m.email}
                    {m.phone ? ` · ${m.phone}` : ""}
                    {m.project_type ? ` · ${m.project_type}` : ""}
                  </p>
                  <p className="text-sm leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
