"use client";

import { useState } from "react";
import type { Project } from "@/lib/db";

function parseImages(val?: string | null): string[] {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [val];
  } catch {
    return [val];
  }
}

export default function ProjectCard({ project }: { project: Project }) {
  const images = parseImages(project.image_url);
  const [currentIndex, setCurrentIndex] = useState(0);

  function prevImage(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function nextImage(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="group border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors flex flex-col">
      <div className="relative aspect-[4/3] bg-[var(--bg-elevated)] overflow-hidden">
        {images.length > 0 ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex]}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />

            {images.length > 1 && (
              <>
                {/* أسهم التنقل بين الصور */}
                <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={prevImage}
                    className="w-7 h-7 flex items-center justify-center bg-black/60 hover:bg-black text-white text-sm rounded-full backdrop-blur transition-colors"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="w-7 h-7 flex items-center justify-center bg-black/60 hover:bg-black text-white text-sm rounded-full backdrop-blur transition-colors"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>

                {/* مؤشرات أسفل الصورة */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-dim)] text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <p className="text-xs text-[var(--accent)] mb-2">{project.category}</p>
        <h3 className="font-display text-lg font-medium mb-2">{project.name}</h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-grow">
          {project.description}
        </p>
        {project.project_url && (
          <div>
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium border-b border-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              View project
            </a>
          </div>
        )}
      </div>
    </div>
  );
}