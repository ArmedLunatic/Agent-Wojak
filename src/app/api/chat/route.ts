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
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "ser... something broke. it's so over." },
      { status: 500 }
    );
  }
}
