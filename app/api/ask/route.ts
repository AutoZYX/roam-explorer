import Anthropic from "@anthropic-ai/sdk";
import { buildSystemContext } from "@/lib/context";
import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

let cachedContext: string | null = null;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  // Multi-turn payload:
  //   { messages: Array<{ role: "user" | "assistant", content: string }> }
  //
  // The last message must be role="user" (the new question). We cap the
  // history at 20 messages (~10 turns) to keep tokens bounded — the system
  // prompt carries all the dataset facts so dropping old chit-chat doesn't
  // lose grounding.
  //
  // Legacy single-question payload (`{ question: string }`) is still
  // accepted so older clients don't break during the rollout.
  const body = await request.json();
  type Msg = { role: "user" | "assistant"; content: string };

  let messages: Msg[];
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    messages = body.messages
      .filter((m: unknown): m is Msg =>
        typeof m === "object" &&
        m !== null &&
        (((m as Msg).role === "user") || ((m as Msg).role === "assistant")) &&
        typeof (m as Msg).content === "string"
      )
      .map((m: Msg) => ({ role: m.role, content: m.content.trim() }))
      .filter((m: Msg) => m.content.length > 0);
  } else if (typeof body.question === "string") {
    messages = [{ role: "user", content: body.question.trim() }];
  } else {
    return NextResponse.json(
      { error: "`messages` array or `question` string is required" },
      { status: 400 }
    );
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "No valid messages" }, { status: 400 });
  }
  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    return NextResponse.json(
      { error: "Last message must be role=user" },
      { status: 400 }
    );
  }
  if (last.content.length > 500) {
    return NextResponse.json(
      { error: "Question too long (max 500 chars)" },
      { status: 400 }
    );
  }

  // Cap history to last 20 messages.
  const capped = messages.slice(-20);

  if (!cachedContext) {
    cachedContext = buildSystemContext();
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: cachedContext,
      messages: capped,
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ answer: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Claude API error:", message);
    return NextResponse.json(
      { error: `AI error: ${message}` },
      { status: 500 }
    );
  }
}
