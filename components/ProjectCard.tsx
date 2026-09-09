"use client";

import { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  function prevImage(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function nextImage(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  // دعم التنقل والإغلاق بأزرار الكيبورد عند تكبير الصورة
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  return (
    <>
      <div className="group border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors flex flex-col">
        {/* صندوق الصورة في الكرت */}
        <div
          onClick={() => images.length > 0 && setIsOpen(true)}
          className={`relative aspect-[4/3] bg-[var(--bg-elevated)] overflow-hidden ${
            images.length > 0 ? "cursor-zoom-in" : ""
          }`}
          title={images.length > 0 ? "اضغط للتكبير" : ""}
        >
          {images.length > 0 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[currentIndex]}
                alt={project.name}
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />

              {images.length > 1 && (
                <>
                  {/* أزرار الأسهم المصغرة على الكرت */}
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

                  {/* نقاط الترقيم */}
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

        {/* تفاصيل المشروع */}
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

      {/* نافذة التكبير ملء الشاشة (Lightbox Modal) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 select-none"
        >
          {/* زر الإغلاق */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl font-light z-50 p-2 leading-none transition-colors"
            title="إغلاق (Esc)"
          >
            ×
          </button>

          {/* حاوية الصورة المكبرة */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex]}
              alt={project.name}
              className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
            />

            {/* أزرار التقليب والشاشة كبيرة */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-[-20px] sm:left-[-50px] w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white text-2xl rounded-full transition-colors"
                  title="السابق"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-[-20px] sm:right-[-50px] w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white text-2xl rounded-full transition-colors"
                  title="التالي"
                >
                  ›
                </button>

                {/* مؤشر ترقيم الصور في الأسفل مثل: 1 / 3 */}
                <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-white/70 font-mono">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}