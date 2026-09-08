import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, projectType, message, name } = body;

    const senderName = name || (email ? email.split("@")[0] : "Client");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "0d0d8e15-7348-4051-bd39-37015f9aa3e2",
        name: senderName,
        email: email || "no-reply@fayms.com",
        subject: `New Request from FAYMS: ${projectType || "General"}`,
        message: `Email: ${email || "Not provided"}\nPhone / WhatsApp: ${phone || "Not provided"}\nProject Type: ${projectType || "Not specified"}\n\nMessage:\n${message || "No message content"}`,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.message || "Failed to send message" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}