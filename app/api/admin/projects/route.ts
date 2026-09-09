import { NextRequest, NextResponse } from "next/server";
import db, { Project } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  category: z.string().trim().min(1).max(100),
  // إزالة الحد الأقصى (max 2000) ليسمح ببيانات صور Base64 الطويلة
  image_url: z.string().trim().optional().nullable(),
  project_url: z.string().trim().max(2000).optional().nullable(),
  published: z.boolean().optional(),
});

export async function GET() {
  try {
    const projects = (await db
      .prepare("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC")
      .all()) as Project[];
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Fetch projects error:", error);
    return NextResponse.json({ projects: [], error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the project fields and try again." },
        { status: 400 }
      );
    }

    const { name, description, category, image_url, project_url, published } = parsed.data;

    const result = await db
      .prepare(
        `INSERT INTO projects (name, description, category, image_url, project_url, published, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
      )
      .run(
        name,
        description,
        category,
        image_url ?? null,
        project_url || null,
        published === false ? 0 : 1
      );

    const project = (await db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(result.lastInsertRowid)) as Project;

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project." },
      { status: 500 }
    );
  }
}