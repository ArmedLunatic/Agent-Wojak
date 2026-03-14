import { NextRequest, NextResponse } from "next/server";
import { classifyMoodAndCaption } from "@/lib/llm";
import { generateMeme } from "@/lib/meme";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const { mood, caption } = await classifyMoodAndCaption(prompt);
    const imageBuffer = await generateMeme(mood, caption);

    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "inline; filename=wojak-meme.png",
      },
    });
  } catch (error) {
    console.error("Meme generation error:", error);
    return NextResponse.json(
      { error: "meme machine broke. ngmi." },
      { status: 500 }
    );
  }
}
