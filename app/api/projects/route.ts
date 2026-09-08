import { NextResponse } from "next/server";
import db, { Project } from "@/lib/db";

export async function GET() {
  const projects = db
    .prepare(
      "SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, created_at DESC"
    )
    .all() as Project[];

  return NextResponse.json({ projects });
}
