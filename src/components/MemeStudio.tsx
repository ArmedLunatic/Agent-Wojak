"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // $WOJAK watermark
  ctx.font = "12px monospace";
  ctx.fillStyle = "#00FF4180";
  ctx.strokeStyle = "transparent";
  ctx.textAlign = "right";
  ctx.fillText("$WOJAK", WIDTH - 10, HEIGHT - 10);

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
      <div className="border border-green-900 rounded-lg p-4">
        <label className="text-xs text-green-700 block mb-2">
          {"\u27E9"} DESCRIBE YOUR MEME SCENARIO
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="me after aping into a coin with no audit..."
            className="flex-1 bg-black border border-green-900 rounded px-4 py-2 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-500"
          />
          <motion.button
            onClick={handleGenerate}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="bg-green-900/50 border border-green-700 px-6 py-2 rounded text-green-400 hover:bg-green-800/50 transition-colors disabled:opacity-50"
          >
            {loading ? "[GENERATING...]" : "[GENERATE]"}
          </motion.button>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {memeUrl && (
          <motion.div
            key={memeUrl}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="border border-green-900 rounded-lg p-4 text-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={memeUrl}
              alt="Generated Wojak meme"
              className="mx-auto max-w-md rounded border border-green-900"
            />
            <div className="mt-4 flex justify-center gap-4">
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="bg-green-900/50 border border-green-700 px-4 py-2 rounded text-green-400 hover:bg-green-800/50 transition-colors text-sm"
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
          <p className="text-xs text-green-700 mb-2">{"\u27E9"} RECENT CREATIONS</p>
          <div className="grid grid-cols-3 gap-2">
            {/* eslint-disable @next/next/no-img-element */}
            {gallery.slice(1).map((url, i) => (
              <motion.img
                key={i}
                src={url}
                alt={`Meme ${i}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded border border-green-900/50 cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => setMemeUrl(url)}
              />
            ))}
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </div>
      )}
    </div>
  );
}
