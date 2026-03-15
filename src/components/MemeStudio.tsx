"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HudFrame } from "@/components/HudFrame";

async function renderMemeOnCanvas(
  templateUrl: string,
  caption: string
): Promise<string> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = templateUrl;
  });

  const WIDTH = img.width > 800 ? 800 : img.width;
  const HEIGHT = Math.round((WIDTH / img.width) * img.height);

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);

  const parts = caption.split("|");
  const topText = parts[0]?.trim().toUpperCase() || "";
  const bottomText = parts[1]?.trim().toUpperCase() || "";

  ctx.textAlign = "center";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";

  if (topText) {
    ctx.font = "bold 32px monospace";
    ctx.strokeText(topText, WIDTH / 2, 50);
    ctx.fillText(topText, WIDTH / 2, 50);
  }

  if (bottomText) {
    ctx.font = "bold 32px monospace";
    ctx.strokeText(bottomText, WIDTH / 2, HEIGHT - 30);
    ctx.fillText(bottomText, WIDTH / 2, HEIGHT - 30);
  }

  // $AgentJak watermark
  ctx.font = "12px monospace";
  ctx.fillStyle = "#00d4ff80";
  ctx.strokeStyle = "transparent";
  ctx.textAlign = "right";
  ctx.fillText("$AgentJak", WIDTH - 10, HEIGHT - 10);

  return canvas.toDataURL("image/png");
}

export function MemeStudio() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setMemeUrl(null);

    try {
      const res = await fetch("/api/meme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Generation failed");
      }

      const { caption, template } = await res.json();
      const dataUrl = await renderMemeOnCanvas(template, caption);
      setMemeUrl(dataUrl);
      setGallery((prev) => [dataUrl, ...prev].slice(0, 6));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "meme machine broke ser.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading]);

  function handleDownload() {
    if (!memeUrl) return;
    const a = document.createElement("a");
    a.href = memeUrl;
    a.download = "agent-wojak-meme.png";
    a.click();
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="border border-cyan-primary/15 rounded-lg p-4 bg-bg-surface">
        <label className="text-xs text-[rgba(255,255,255,0.55)] block mb-2">
          {"\u27E9"} DESCRIBE YOUR MEME SCENARIO
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="enter propaganda directive..."
            className="flex-1 min-w-0 bg-bg-deep border border-cyan-primary/15 rounded px-3 md:px-4 py-2 text-[rgba(255,255,255,0.92)] placeholder:text-[rgba(255,255,255,0.25)] focus:outline-none focus:border-orange-accent/40 text-sm md:text-base"
          />
          <motion.button
            onClick={handleGenerate}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="hud-btn hud-btn-accent px-6 py-2 rounded disabled:opacity-50 text-sm md:text-base shrink-0"
          >
            {loading ? "[GENERATING...]" : "FABRICATE"}
          </motion.button>
        </div>
      </div>

      {/* Skeleton loading placeholder */}
      {loading && !memeUrl && (
        <div className="border border-cyan-primary/15 rounded-lg p-4 bg-bg-surface">
          <div className="relative w-full max-w-md mx-auto h-[300px] bg-bg-elevated rounded-lg animate-pulse overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,212,255,0.03)_0px,rgba(0,212,255,0.03)_1px,transparent_1px,transparent_3px)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[rgba(255,255,255,0.55)] text-sm font-mono">RENDERING MEME...</span>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {memeUrl && (
          <motion.div
            key={memeUrl}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <HudFrame className="inline-block p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={memeUrl}
                alt="Generated Wojak meme"
                className="mx-auto max-w-md rounded border border-cyan-primary/20"
              />
            </HudFrame>
            <div className="mt-4 flex justify-center gap-4">
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="hud-btn hud-btn-primary px-4 py-2 rounded text-sm"
              >
                [DOWNLOAD]
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery */}
      {gallery.length > 1 && (
        <div>
          <p className="text-xs text-[rgba(255,255,255,0.55)] mb-2">{"\u27E9"} RECENT CREATIONS</p>
          <div className="grid grid-cols-3 gap-2">
            {/* eslint-disable @next/next/no-img-element */}
            {gallery.slice(1).map((url, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-bg-surface border border-cyan-primary/10 rounded cursor-pointer hover:border-cyan-primary/30 transition-colors overflow-hidden"
                onClick={() => setMemeUrl(url)}
              >
                <img
                  src={url}
                  alt={`Meme ${i}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </div>
      )}
    </div>
  );
}
