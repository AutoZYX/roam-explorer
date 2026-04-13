import { NextRequest, NextResponse } from "next/server";

// In-memory store for this serverless instance + console log for persistence
// TODO: Replace with Vercel KV or database for proper persistence
const registeredEmails = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    registeredEmails.add(email);

    // Log for Vercel logs — searchable and exportable
    console.log(`[ROAM_REGISTER] ${email} | ${new Date().toISOString()} | ${request.headers.get("x-forwarded-for") || "unknown"}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
