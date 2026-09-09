"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/db";

const categories = ["Website", "E-Commerce", "Mobile App", "UI/UX Design"];

function parseInitialImages(val?: string | null): string[] {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [val];
  } catch {
    return [val];
  }
}

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(project);

  const [images, setImages] = useState<string[]>(() => parseInitialImages(project?.image_url));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed for ${file.name}`);
        }
        const body = await res.json();
        uploadedUrls.push(body.url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(indexToRemove: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      description: String(fd.get("description") || ""),
      category: String(fd.get("category") || ""),
      project_url: String(fd.get("project_url") || "") || null,
      image_url: images.length > 0 ? JSON.stringify(images) : null,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/projects/${project!.id}` : "/api/admin/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not save project.");
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor="name">
          Project name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={project?.name}
          required
          className="w-full h-11 bg-[var(--bg-elevated)] border border-[var(--border)] px-3 text-sm focus:border-[var(--accent)] outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={project?.category ?? categories[0]}
          className="w-full h-11 bg-[var(--bg-elevated)] border border-[var(--border)] px-3 text-sm focus:border-[var(--accent)] outline-none transition-colors"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={project?.description}
          required
          rows={4}
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2.5 text-sm focus:border-[var(--accent)] outline-none transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-2" htmlFor="project_url">
          Project URL (optional)
        </label>
        <input
          id="project_url"
          name="project_url"
          type="url"
          defaultValue={project?.project_url ?? ""}
          placeholder="https://"
          className="w-full h-11 bg-[var(--bg-elevated)] border border-[var(--border)] px-3 text-sm focus:border-[var(--accent)] outline-none transition-colors"
        />
      </div>

      <div>
        <span className="block text-sm text-[var(--text-muted)] mb-2">
          Project images ({images.length})
        </span>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group border border-[var(--border)] aspect-video bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center text-xs rounded transition-colors"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--text-muted)] text-sm cursor-pointer transition-colors">
          <span>+ Add image</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {uploading && <p className="text-xs text-[var(--text-dim)] mt-2">Uploading image…</p>}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center h-11 px-6 bg-[var(--text)] text-[var(--bg)] text-sm font-medium clip-corner-sm hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="inline-flex items-center h-11 px-6 border border-[var(--border-strong)] text-sm font-medium hover:border-[var(--text-muted)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}