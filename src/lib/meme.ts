import { createCanvas, loadImage } from "canvas";
import path from "path";
import { MoodType } from "./llm";

const TEMPLATE_MAP: Record<MoodType, string[]> = {
  cope: ["bloomer.png", "cozy.png"],
  hype: ["chad.png", "pointing.png"],
  doom: ["doomer.png", "crying.png"],
  panic: ["pink.png"],
  smug: ["smug.png", "brain.png", "npc.png"],
};

function pickTemplate(mood: MoodType): string {
  const options = TEMPLATE_MAP[mood];
  return options[Math.floor(Math.random() * options.length)];
}

export async function generateMeme(
  mood: MoodType,
  caption: string
): Promise<Buffer> {
  const WIDTH = 600;
  const HEIGHT = 600;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Try to load template image
  const templateFile = pickTemplate(mood);
  const templatePath = path.join(process.cwd(), "public", "templates", templateFile);

  try {
    const img = await loadImage(templatePath);
    ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
  } catch {
    // Fallback: solid dark background if template not found
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#00FF41";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`[${mood.toUpperCase()} WOJAK]`, WIDTH / 2, HEIGHT / 2);
  }

  // Parse top/bottom text
  const parts = caption.split("|");
  const topText = parts[0]?.trim().toUpperCase() || "";
  const bottomText = parts[1]?.trim().toUpperCase() || "";

  // Text style
  ctx.textAlign = "center";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";

  // Top text
  if (topText) {
    ctx.font = "bold 32px monospace";
    ctx.strokeText(topText, WIDTH / 2, 50);
    ctx.fillText(topText, WIDTH / 2, 50);
  }

  // Bottom text
  if (bottomText) {
    ctx.font = "bold 32px monospace";
    ctx.strokeText(bottomText, WIDTH / 2, HEIGHT - 30);
    ctx.fillText(bottomText, WIDTH / 2, HEIGHT - 30);
  }

  // $WOJAK watermark
  ctx.font = "12px monospace";
  ctx.fillStyle = "#00FF4180";
  ctx.strokeStyle = "transparent";
  ctx.textAlign = "right";
  ctx.fillText("$WOJAK", WIDTH - 10, HEIGHT - 10);

  return canvas.toBuffer("image/png");
}
