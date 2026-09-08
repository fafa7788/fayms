import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    try {
      await db.prepare(
        "INSERT INTO messages (name, email, phone, project_type, message) VALUES (?, ?, ?, ?, ?)"
      ).run(senderName, senderEmail, senderPhone, senderProjectType, senderMessage);
    } catch (dbErr) {
      console.error("Database insert error:", dbErr);
    }

    // إرسال عبر Web3Forms
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "0d0d8e15-7348-4051-bd39-37015f9aa3e2",
          name: senderName,
          email: senderEmail,
          subject: `New Request from FAYMS: ${senderProjectType}`,
          message: `Name: ${senderName}\nEmail: ${senderEmail}\nPhone: ${senderPhone}\nProject Type: ${senderProjectType}\n\nMessage:\n${senderMessage}`,
        }),
      });
    } catch (mailErr) {
      console.error("Web3Forms error:", mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact API runtime error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}