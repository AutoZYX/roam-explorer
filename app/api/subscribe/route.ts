import { NextRequest, NextResponse } from "next/server";

// TODO (productize): replace console logging with Vercel KV / Upstash Redis
// for persistent subscriber storage. For now, logs are searchable in Vercel
// dashboard and serve as the initial subscriber list.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();
    const role = body.role?.trim() || "unspecified"; // OEM, supplier, regulator, etc.
    const interests = Array.isArray(body.interests) ? body.interests : [];

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    console.log(
      `[ROAM_SUBSCRIBE] ${email} | role=${role} | interests=${interests.join(",")} | ${new Date().toISOString()}`
    );

    return NextResponse.json({
      ok: true,
      message: "Subscribed. You'll receive the monthly report on the 1st of each month.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
