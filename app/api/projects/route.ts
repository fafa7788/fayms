import { NextResponse } from "next/server";
import db, { Project } from "@/lib/db";

// منع الكاش لضمان ظهور أي مشروع جديد فوراً للزوار
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = (await db
      .prepare(
        "SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, created_at DESC"
      )
      .all()) as Project[];

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Public projects GET error:", error);
    return NextResponse.json({ projects: [], error: error.message }, { status: 500 });
  }
}