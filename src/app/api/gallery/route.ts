import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const templatesDir = path.join(process.cwd(), "public", "templates");

  try {
    const files = fs
      .readdirSync(templatesDir)
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort();

    return NextResponse.json({ images: files.map((f) => `/templates/${f}`) });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
