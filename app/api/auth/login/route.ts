import { NextRequest, NextResponse } from "next/server";
import db, { Admin } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }

  const { username, password } = parsed.data;

  const admin = db
    .prepare("SELECT * FROM admins WHERE username = ?")
    .get(username) as Admin | undefined;

  // Always run a hash comparison to avoid leaking account existence via timing.
  const validHash =
    admin?.password_hash ?? "$2b$12$gZSFvPix1Ui1z85ffp0hGOSqeFevSTtXewujDduWQPn8xK8FGusyW";
  const passwordOk = await verifyPassword(password, validHash);

  if (!admin || !passwordOk) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const token = await createSessionToken(admin.username);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
