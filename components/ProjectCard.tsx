import type { Project } from "@/lib/db";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors">
      <div className="aspect-[4/3] bg-[var(--bg-elevated)] overflow-hidden">
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-dim)] text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-xs text-[var(--accent)] mb-2">{project.category}</p>
        <h3 className="font-display text-lg font-medium mb-2">{project.name}</h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
          {project.description}
        </p>
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium border-b border-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            View project
          </a>
        )}
      </div>
    </div>
  );
}
