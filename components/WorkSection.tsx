"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/db";
import ProjectCard from "./ProjectCard";

export default function WorkSection() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (active) setProjects(data.projects ?? []);
      })
      .catch(() => {
        if (active) setProjects([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="work" className="border-t border-[var(--border)]">
      <div className="container-fayms py-20 md:py-28">
        <div className="max-w-xl mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            Our work
          </h2>
          <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
            A selection of projects we&apos;ve designed and built for our clients.
          </p>
        </div>

        {projects === null && (
          <div className="text-sm text-[var(--text-dim)]">Loading projects…</div>
        )}

        {projects && projects.length === 0 && (
          <div className="border border-dashed border-[var(--border-strong)] p-12 text-center text-sm text-[var(--text-muted)]">
            Projects will appear here once they&apos;re published from the admin
            dashboard.
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
