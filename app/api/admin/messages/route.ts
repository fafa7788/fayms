import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const messages = db
    .prepare("SELECT * FROM messages ORDER BY created_at DESC")
    .all();
  return NextResponse.json({ messages });
}
