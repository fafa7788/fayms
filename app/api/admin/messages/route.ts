import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const messages = await db
      .prepare("SELECT * FROM messages ORDER BY created_at DESC")
      .all();
    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ messages: [], error: error.message }, { status: 500 });
  }
}