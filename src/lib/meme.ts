import { createCanvas, loadImage } from "canvas";
import path from "path";
import { MoodType } from "./llm";

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

export async function generateMeme(
  mood: MoodType,
  caption: string
): Promise<Buffer> {
  const templateFile = pickTemplate(mood);
  const templatePath = path.join(process.cwd(), "public", "templates", templateFile);

  let WIDTH = 600;
  let HEIGHT = 600;

  // Try to load template image and use its natural dimensions
  let img;
  try {
    img = await loadImage(templatePath);
    WIDTH = img.width > 800 ? 800 : img.width;
    HEIGHT = Math.round((WIDTH / img.width) * img.height);
  } catch {
    img = null;
  }

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  if (img) {
    ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
  } else {
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
