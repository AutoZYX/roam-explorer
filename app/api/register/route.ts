import { NextRequest, NextResponse } from "next/server";

// Lead capture for /ask. Visitors submit work email + organization before
// asking questions.
//
// Primary channel: Formsubmit.co relay to yuxinzhang@jlu.edu.cn. Before
// this endpoint can actually deliver, the target inbox must confirm the
// relay once (the first POST triggers a verification email with a link
// to click). Until that's done, submissions are silently dropped by
// Formsubmit — the structured console.log below is our backup so no
// lead is lost during the activation window.
//
// Secondary channel: Vercel Functions logs. Grep `ROAM_REGISTER` in
// Vercel's log explorer to export leads as JSON lines.
const LEAD_EMAIL = "yuxinzhang@jlu.edu.cn";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${LEAD_EMAIL}`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email: string = (body.email || "").trim().toLowerCase();
    const company: string = (body.company || "").trim();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (!company) {
      return NextResponse.json({ error: "Company required" }, { status: 400 });
    }

    const ts = new Date().toISOString();
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Structured backup log — one JSON per line for easy jq export.
    console.log(
      `[ROAM_REGISTER] ${JSON.stringify({ email, company, ts, ip, source: "roam-explorer /ask" })}`
    );

    // Fire-and-forget relay. Dev escape hatch: setting ROAM_LEAD_DRY_RUN
    // skips the real POST so local testing doesn't spam the inbox.
    if (!process.env.ROAM_LEAD_DRY_RUN) {
      // `void` — we deliberately don't await; if Formsubmit is slow, we
      // still return ok to the client promptly.
      fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          company,
          _subject: `[ROAM Explorer] 新 lead — ${company}`,
          _template: "table",
          _captcha: "false",
          source: "roam-explorer /ask",
          timestamp: ts,
          ip,
        }),
      }).catch((e) => {
        console.log(`[ROAM_REGISTER_ERROR] formsubmit failed: ${String(e)}`);
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
