import { NextRequest, NextResponse } from "next/server";
import { chatWithWojak } from "@/lib/llm";

const MAX_MESSAGES = 30;
const MAX_CONTENT_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    // Limit conversation size
    const trimmed = messages.slice(-MAX_MESSAGES);

    // Validate and sanitize messages
    const sanitized = trimmed
      .filter((m: { role?: string; content?: string }) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0
      )
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content.slice(0, MAX_CONTENT_LENGTH),
      }));

    if (sanitized.length === 0) {
      return NextResponse.json({ error: "at least one valid message required" }, { status: 400 });
    }

    const reply = await chatWithWojak(sanitized);
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat error:", msg);
    const isRateLimit = msg.includes("429") || msg.includes("rate limit");
    return NextResponse.json(
      { error: isRateLimit ? "ser... the ai brain is overloaded. try again in a minute." : "ser... something broke. it's so over." },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
