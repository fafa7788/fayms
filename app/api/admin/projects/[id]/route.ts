import { NextRequest, NextResponse } from "next/server";
import db, { Project } from "@/lib/db";
import { z } from "zod";
import fs from "fs";
import path from "path";

const schema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  image_url: z.string().trim().max(2000).optional().nullable(),
  project_url: z.string().trim().max(2000).optional().nullable(),
  published: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

function getProject(id: number) {
  return db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as Project | undefined;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
  }

  const existing = getProject(id);
  if (!existing) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the project fields and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const merged = {
    name: data.name ?? existing.name,
    description: data.description ?? existing.description,
    category: data.category ?? existing.category,
    image_url: data.image_url !== undefined ? data.image_url : existing.image_url,
    project_url: data.project_url !== undefined ? data.project_url : existing.project_url,
    published: data.published !== undefined ? (data.published ? 1 : 0) : existing.published,
    sort_order: data.sort_order !== undefined ? data.sort_order : existing.sort_order,
  };

  db.prepare(
    `UPDATE projects
     SET name = ?, description = ?, category = ?, image_url = ?, project_url = ?, published = ?, sort_order = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    merged.name,
    merged.description,
    merged.category,
    merged.image_url,
    merged.project_url,
    merged.published,
    merged.sort_order,
    id
  );

  const project = getProject(id);
  return NextResponse.json({ project });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
  }

  const existing = getProject(id);
  if (!existing) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  db.prepare("DELETE FROM projects WHERE id = ?").run(id);

  // Best-effort cleanup of a locally-uploaded image (skip external URLs).
  if (existing.image_url && existing.image_url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", existing.image_url);
    fs.promises.unlink(filePath).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
