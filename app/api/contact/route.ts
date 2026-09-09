import { NextResponse } from "next/server";
import database from "@/lib/db";

const db = (database as any)?.db || database;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, projectType, message, name } = body;

    const senderName = name || (email ? email.split("@")[0] : "Client");
    const senderEmail = email || "no-reply@fayms.com";
    const senderPhone = phone || "";
    const senderProjectType = projectType || "General";
    const senderMessage = message || "";

    // حفظ الرسالة في Turso
    await db
      .prepare(
        "INSERT INTO messages (name, email, phone, project_type, message) VALUES (?, ?, ?, ?, ?)"
      )
      .run(senderName, senderEmail, senderPhone, senderProjectType, senderMessage);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact API runtime error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}