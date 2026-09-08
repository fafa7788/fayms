import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().nullable(),
  project_type: z.string().trim().max(100).optional().nullable(),
  message: z.string().trim().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill in all required fields with valid values." },
      { status: 400 }
    );
  }

  const { name, email, phone, project_type, message } = parsed.data;

  db.prepare(
    `INSERT INTO messages (name, email, phone, project_type, message)
     VALUES (?, ?, ?, ?, ?)`
  ).run(name, email, phone ?? null, project_type ?? null, message);

  return NextResponse.json({ ok: true });
}
