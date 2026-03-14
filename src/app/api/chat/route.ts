import { NextRequest, NextResponse } from "next/server";
import { chatWithWojak } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const reply = await chatWithWojak(messages);
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
