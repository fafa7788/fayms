import { NextResponse } from "next/server";
import database from "@/lib/db";

// للتأكد من التوافق سواء كان export default أو export { db }
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

    // 1. حفظ الرسالة في Turso
    try {
      await db
        .prepare(
          "INSERT INTO messages (name, email, phone, project_type, message) VALUES (?, ?, ?, ?, ?)"
        )
        .run(senderName, senderEmail, senderPhone, senderProjectType, senderMessage);
      console.log("Message inserted successfully into Turso");
    } catch (dbErr) {
      console.error("Database insert error:", dbErr);
    }

    // 2. إرسال عبر Web3Forms
    try {
      const mailRes = await fetch("https://api.web3forms.com/submit", {
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

      const mailData = await mailRes.json();
      console.log("Web3Forms Response:", mailData);
    } catch (mailErr) {
      console.error("Web3Forms error:", mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact API runtime error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}