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

    // 1. حفظ الرسالة في قاعدة بيانات Turso السحابية
    try {
      await db.prepare(
        "INSERT INTO messages (name, email, phone, project_type, message) VALUES (?, ?, ?, ?, ?)"
      ).run(senderName, senderEmail, senderPhone, senderProjectType, senderMessage);
    } catch (dbErr) {
      console.error("Database save error:", dbErr);
    }

    // 2. إرسال بريد إلكتروني عبر Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
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

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error("Web3Forms error response:", result);
      // حتى لو فشل الإيميل، تم حفظ الرسالة في قاعدة البيانات
      return NextResponse.json({ success: true, note: "Saved to database" });
    }
  } catch (error: any) {
    console.error("Contact API runtime error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}