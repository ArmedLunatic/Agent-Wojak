import { NextRequest, NextResponse } from "next/server";
import { classifyMoodAndCaption, MoodType } from "@/lib/llm";

const TEMPLATE_MAP: Record<MoodType, string[]> = {
  cope: ["cope.jpg", "default.jpg"],
  hype: ["hype.jpg", "rich.jpg", "chad.jpg"],
  doom: ["doom.jpg", "default.jpg"],
  panic: ["doom.jpg", "cope.jpg"],
  smug: ["smug.jpg", "chad.jpg", "default.jpg"],
};

function pickTemplate(mood: MoodType): string {
  const options = TEMPLATE_MAP[mood];
  return options[Math.floor(Math.random() * options.length)];
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.length > 500) {
      return NextResponse.json({ error: "prompt required (max 500 chars)" }, { status: 400 });
    }

    const { mood, caption } = await classifyMoodAndCaption(prompt);
    const template = pickTemplate(mood);

    return NextResponse.json({
      mood,
      caption,
      template: `/templates/${template}`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Meme generation error:", msg);
    const isRateLimit = msg.includes("429") || msg.includes("rate limit");
    return NextResponse.json(
      { error: isRateLimit ? "meme generation overloaded ser. the bogdanoffs are jamming the transmission." : "meme machine broke. bogdanoff intercepted the propaganda. ngmi." },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
