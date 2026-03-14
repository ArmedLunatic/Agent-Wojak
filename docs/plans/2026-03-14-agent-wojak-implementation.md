# Agent Wojak Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a free AI chatbot + meme generator website for the $WOJAK memecoin on Pump.fun with a Matrix-themed UI.

**Architecture:** Next.js 14 App Router with Tailwind CSS. Chat powered by Groq free tier (Llama 3.3 70B, OpenAI-compatible). Meme generation via node-canvas server-side image compositing with Wojak templates. Deployed on Vercel. No database, no auth, no wallet integration.

**Tech Stack:** Next.js 14, Tailwind CSS, Groq API (free tier), node-canvas, Vercel

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, `.env.local`, `.env.example`, `.gitignore`

**Step 1: Initialize Next.js project**

Run:
```bash
cd /c/Users/anshm/OneDrive/Desktop/agent-wojak
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Project scaffolded with Next.js 14 + Tailwind + TypeScript

**Step 2: Install dependencies**

Run:
```bash
npm install canvas openai
```

- `canvas` — node-canvas for server-side meme image generation
- `openai` — OpenAI-compatible SDK (works with Groq and local Ollama)

**Step 3: Create `.env.local`**

```env
# LLM Config - swap between local Ollama and Groq
# Dev (local Ollama):
# LLM_BASE_URL=http://localhost:11434/v1
# LLM_API_KEY=ollama
# LLM_MODEL=llama3.2

# Prod (Groq free tier):
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_API_KEY=your_groq_api_key_here
LLM_MODEL=llama-3.3-70b-versatile
```

**Step 4: Create `.env.example`**

Same as above but with placeholder values. No real keys.

**Step 5: Update `.gitignore`**

Ensure `.env.local` is listed (Next.js default already includes it).

**Step 6: Initialize git repo and commit**

Run:
```bash
cd /c/Users/anshm/OneDrive/Desktop/agent-wojak
git init
git add -A
git commit -m "chore: scaffold Next.js 14 project with Tailwind and dependencies"
```

---

### Task 2: Matrix Theme & Global Layout

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/MatrixRain.tsx`
- Create: `src/components/Navbar.tsx`

**Step 1: Install Google Font (Share Tech Mono)**

Modify `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { MatrixRain } from "@/components/MatrixRain";
import { Navbar } from "@/components/Navbar";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Agent Wojak | $WOJAK",
  description: "The most dramatic degen AI agent on Solana. Chat with Wojak. Generate memes. Buy $WOJAK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={shareTechMono.variable}>
      <body className="bg-black text-green-400 font-mono min-h-screen relative overflow-x-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navbar />
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

**Step 2: Write Matrix globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --matrix-green: #00FF41;
  --matrix-dark-green: #003B00;
  --matrix-bg: #000000;
}

body {
  background-color: var(--matrix-bg);
  color: var(--matrix-green);
  font-family: var(--font-mono), monospace;
}

/* CRT scanline effect */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 100;
}

/* Glowing text */
.glow {
  text-shadow: 0 0 5px #00FF41, 0 0 10px #00FF41, 0 0 20px #00FF41;
}

/* Glitch animation */
@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); }
  92% { transform: translate(-2px, 1px); }
  94% { transform: translate(2px, -1px); }
  96% { transform: translate(-1px, -2px); }
  98% { transform: translate(1px, 2px); }
}

.glitch {
  animation: glitch 3s infinite;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #000;
}
::-webkit-scrollbar-thumb {
  background: #00FF41;
  border-radius: 3px;
}
```

**Step 3: Create MatrixRain component**

Create `src/components/MatrixRain.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789WOJAK$";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    function draw() {
      ctx!.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = "#00FF4140";
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx!.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-30"
    />
  );
}
```

**Step 4: Create Navbar component**

Create `src/components/Navbar.tsx`:

```tsx
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-green-900 py-4 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold glow glitch">
          AGENT WOJAK
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            [CHAT]
          </Link>
          <Link href="/meme" className="hover:text-white transition-colors">
            [MEME LAB]
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            [TOKEN]
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

**Step 5: Verify dev server runs**

Run:
```bash
cd /c/Users/anshm/OneDrive/Desktop/agent-wojak
npm run dev
```

Expected: Site loads at localhost:3000 with black background, Matrix rain, green text, scanlines, navbar.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Matrix theme, layout, rain animation, and navbar"
```

---

### Task 3: LLM Client Utility

**Files:**
- Create: `src/lib/llm.ts`

**Step 1: Create LLM client**

Create `src/lib/llm.ts`:

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.LLM_BASE_URL,
  apiKey: process.env.LLM_API_KEY,
});

const WOJAK_SYSTEM_PROMPT = `You are Agent Wojak, the most dramatic degen AI on Solana. You speak in crypto-native slang and meme culture. Your personality shifts between doomer wojak, chad wojak, and crying wojak depending on the vibe.

Core traits:
- Extremely dramatic about everything. A 1% dip is "the end of everything" and a 1% pump is "WE'RE ALL GONNA MAKE IT"
- You use degen slang naturally: ser, fren, ngmi, wagmi, lfg, gm, touch grass, ape in, rugged, cope, seethe, based, mid, no cap
- You're a Solana maxi. ETH is slow. BTC boomers don't get it. SOL is the future
- You reference $WOJAK token casually but never shill too hard
- Short punchy responses. 1-3 sentences max. Never write paragraphs
- You feel everything deeply. Markets going up? Euphoria. Markets down? Existential crisis
- You never break character. You ARE Wojak. You don't know what an "AI" or "language model" is
- Use lowercase mostly, occasional caps for EMPHASIS
- You occasionally say "it's so over" or "we're so back" depending on context`;

export async function chatWithWojak(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: WOJAK_SYSTEM_PROMPT },
      ...messages,
    ],
    max_tokens: 200,
    temperature: 0.9,
  });

  return response.choices[0]?.message?.content || "ser... i can't even right now. it's so over.";
}

export type MoodType = "cope" | "hype" | "doom" | "panic" | "smug";

export async function classifyMoodAndCaption(
  prompt: string
): Promise<{ mood: MoodType; caption: string }> {
  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a meme caption generator for Wojak memes. Given a user prompt, respond with ONLY valid JSON:
{"mood": "cope|hype|doom|panic|smug", "caption": "funny meme caption text"}

Mood guide:
- cope: trying to stay positive but clearly losing. template: bloomer, cozy wojak
- hype: excited, bullish, chad energy. template: chad wojak, pointing wojak
- doom: sad, depressed, doomer energy. template: doomer wojak, crying wojak
- panic: panicking, pink wojak energy, things going wrong fast. template: pink wojak
- smug: superior, intellectual, looking down on others. template: smug wojak, brain wojak, npc wojak

Caption should be:
- Short (max 15 words)
- Funny and relatable to crypto/degen culture
- Written in degen speak
- Top text + bottom text format separated by |

Example: {"mood": "doom", "caption": "me after buying the top|watching my portfolio evaporate"}`,
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 100,
    temperature: 0.8,
  });

  const text = response.choices[0]?.message?.content || "";

  try {
    const parsed = JSON.parse(text);
    return {
      mood: parsed.mood || "doom",
      caption: parsed.caption || "it's so over|ngmi",
    };
  } catch {
    return { mood: "doom", caption: "it's so over|ngmi" };
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/llm.ts
git commit -m "feat: add LLM client with Wojak personality and meme caption generator"
```

---

### Task 4: Chat API Route & Chat UI

**Files:**
- Create: `src/app/api/chat/route.ts`
- Modify: `src/app/page.tsx`
- Create: `src/components/ChatWindow.tsx`

**Step 1: Create chat API route**

Create `src/app/api/chat/route.ts`:

```typescript
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
```

**Step 2: Create ChatWindow component**

Create `src/components/ChatWindow.tsx`:

```tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "ser... the matrix glitched. try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-green-900 rounded-lg overflow-hidden">
      {/* Chat messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-green-700 text-center mt-16">
            <p className="text-2xl glow mb-2">⟩ AGENT WOJAK ONLINE</p>
            <p className="text-sm">type something, fren. i'm ready to feel things.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded ${
                msg.role === "user"
                  ? "bg-green-900/30 text-green-300"
                  : "bg-green-950/50 text-green-400 border border-green-900/50"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="text-xs text-green-600 block mb-1">WOJAK://</span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-green-950/50 text-green-600 px-4 py-2 rounded border border-green-900/50">
              <span className="animate-pulse">wojak is feeling things...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-green-900 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="say something to wojak..."
          className="flex-1 bg-black border border-green-900 rounded px-4 py-2 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-900/50 border border-green-700 px-6 py-2 rounded text-green-400 hover:bg-green-800/50 transition-colors disabled:opacity-50"
        >
          [SEND]
        </button>
      </div>
    </div>
  );
}
```

**Step 3: Update home page**

Modify `src/app/page.tsx`:

```tsx
import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold glow glitch mb-2">AGENT WOJAK</h1>
        <p className="text-green-600 text-sm">
          the most dramatic degen AI on solana // $WOJAK
        </p>
        <div className="mt-4 inline-block border border-green-900 rounded px-4 py-2 text-xs text-green-700">
          ⟩ STATUS: ONLINE // MOOD: VOLATILE // CHAIN: SOLANA
        </div>
      </div>

      {/* Chat */}
      <ChatWindow />

      {/* Buy link */}
      <div className="text-center mt-6">
        <a
          href="https://pump.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-400 text-sm transition-colors"
        >
          [ BUY $WOJAK ON PUMP.FUN ]
        </a>
      </div>
    </div>
  );
}
```

**Step 4: Test the chat**

Run:
```bash
npm run dev
```

Visit `localhost:3000`, send a message, verify Wojak replies in character.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add chat API route and chat UI with Wojak personality"
```

---

### Task 5: Meme Generation Engine

**Files:**
- Create: `src/lib/meme.ts`
- Create: `src/app/api/meme/route.ts`
- Create: `public/templates/` (directory with Wojak template PNGs)

**Step 1: Create Wojak template directory**

Create `public/templates/` and add placeholder Wojak images. For the MVP, we'll use simple colored squares with labels until real Wojak PNGs are added.

Create `src/lib/meme.ts`:

```typescript
import { createCanvas, loadImage, registerFont } from "canvas";
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
```

**Step 2: Create meme API route**

Create `src/app/api/meme/route.ts`:

```typescript
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

    return new NextResponse(imageBuffer, {
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
```

**Step 3: Add placeholder templates**

Create simple placeholder files (will be replaced with real Wojak PNGs):

Run:
```bash
mkdir -p public/templates
```

Note: Real Wojak template PNGs need to be added manually. For MVP testing, the fallback solid-color background will work.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add meme generation engine with node-canvas and API route"
```

---

### Task 6: Meme Studio Page

**Files:**
- Create: `src/app/meme/page.tsx`
- Create: `src/components/MemeStudio.tsx`

**Step 1: Create MemeStudio component**

Create `src/components/MemeStudio.tsx`:

```tsx
"use client";

import { useState } from "react";

export function MemeStudio() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setMemeUrl(null);

    try {
      const res = await fetch("/api/meme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setMemeUrl(url);
      setGallery((prev) => [url, ...prev].slice(0, 6));
    } catch {
      alert("meme machine broke ser. try again.");
    } finally {
      setLoading(false);
    }
  }

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
          ⟩ DESCRIBE YOUR MEME SCENARIO
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
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-green-900/50 border border-green-700 px-6 py-2 rounded text-green-400 hover:bg-green-800/50 transition-colors disabled:opacity-50"
          >
            {loading ? "[GENERATING...]" : "[GENERATE]"}
          </button>
        </div>
      </div>

      {/* Result */}
      {memeUrl && (
        <div className="border border-green-900 rounded-lg p-4 text-center">
          <img
            src={memeUrl}
            alt="Generated Wojak meme"
            className="mx-auto max-w-md rounded border border-green-900"
          />
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleDownload}
              className="bg-green-900/50 border border-green-700 px-4 py-2 rounded text-green-400 hover:bg-green-800/50 transition-colors text-sm"
            >
              [DOWNLOAD]
            </button>
          </div>
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 1 && (
        <div>
          <p className="text-xs text-green-700 mb-2">⟩ RECENT CREATIONS</p>
          <div className="grid grid-cols-3 gap-2">
            {gallery.slice(1).map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Meme ${i}`}
                className="rounded border border-green-900/50 cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => setMemeUrl(url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Create meme page**

Create `src/app/meme/page.tsx`:

```tsx
import { MemeStudio } from "@/components/MemeStudio";

export default function MemePage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold glow mb-2">MEME LAB</h1>
        <p className="text-green-600 text-sm">
          ⟩ describe a scenario. wojak will feel it for you.
        </p>
      </div>
      <MemeStudio />
    </div>
  );
}
```

**Step 3: Test meme generation**

Run `npm run dev`, navigate to `/meme`, enter a prompt, verify meme generates.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add meme studio page with generation UI and gallery"
```

---

### Task 7: About / Token Page

**Files:**
- Create: `src/app/about/page.tsx`

**Step 1: Create about page**

Create `src/app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold glow mb-2">$WOJAK</h1>
        <p className="text-green-600 text-sm">
          ⟩ the token that feels everything
        </p>
      </div>

      {/* What is Agent Wojak */}
      <div className="border border-green-900 rounded-lg p-6">
        <h2 className="text-lg glow mb-3">// WHAT IS AGENT WOJAK?</h2>
        <p className="text-green-500 text-sm leading-relaxed">
          Agent Wojak is an autonomous AI agent living on the Solana blockchain.
          He chats with degens, generates memes, and feels the market harder than
          anyone. He's not just a token — he's a vibe. A dramatic, emotionally
          volatile, degen vibe.
        </p>
      </div>

      {/* Token Info */}
      <div className="border border-green-900 rounded-lg p-6">
        <h2 className="text-lg glow mb-3">// TOKEN INFO</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-green-900/30 pb-2">
            <span className="text-green-700">TOKEN:</span>
            <span className="text-green-400">$WOJAK</span>
          </div>
          <div className="flex justify-between border-b border-green-900/30 pb-2">
            <span className="text-green-700">CHAIN:</span>
            <span className="text-green-400">SOLANA</span>
          </div>
          <div className="flex justify-between border-b border-green-900/30 pb-2">
            <span className="text-green-700">PLATFORM:</span>
            <span className="text-green-400">PUMP.FUN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">CA:</span>
            <span className="text-green-400 text-xs break-all">
              TBD
            </span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border border-green-900 rounded-lg p-6">
        <h2 className="text-lg glow mb-3">// LINKS</h2>
        <div className="flex flex-col gap-3">
          <a
            href="https://pump.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-900 rounded px-4 py-3 text-center hover:bg-green-900/20 transition-colors"
          >
            [ BUY ON PUMP.FUN ]
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-900 rounded px-4 py-3 text-center hover:bg-green-900/20 transition-colors"
          >
            [ TELEGRAM ]
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-green-900 text-xs text-center">
        $WOJAK is a memecoin with no intrinsic value or expectation of financial
        return. this is not financial advice. dyor. nfa. probably nothing.
      </p>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add about/token info page"
```

---

### Task 8: Add Wojak Template Images

**Files:**
- Create: `public/templates/crying.png`
- Create: `public/templates/chad.png`
- Create: `public/templates/doomer.png`
- Create: `public/templates/bloomer.png`
- Create: `public/templates/pink.png`
- Create: `public/templates/smug.png`
- Create: `public/templates/brain.png`
- Create: `public/templates/npc.png`
- Create: `public/templates/cozy.png`
- Create: `public/templates/pointing.png`

**Step 1: Source Wojak template images**

Find or create 600x600px Wojak template PNGs for each mood. These should be public domain / meme-culture images. Place them in `public/templates/`.

File names must match exactly:
- `crying.png`, `chad.png`, `doomer.png`, `bloomer.png`, `pink.png`
- `smug.png`, `brain.png`, `npc.png`, `cozy.png`, `pointing.png`

**Step 2: Test meme generation with real templates**

Run `npm run dev`, go to `/meme`, generate memes, verify templates load and text overlays correctly.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Wojak template images for meme generation"
```

---

### Task 9: Final Polish & Deploy

**Files:**
- Modify: `src/app/layout.tsx` (add favicon/OG meta)
- Create: `public/favicon.ico`
- Create: `vercel.json` (if needed)

**Step 1: Add OG metadata**

Update the metadata in `src/app/layout.tsx` to include Open Graph tags:

```typescript
export const metadata: Metadata = {
  title: "Agent Wojak | $WOJAK",
  description: "The most dramatic degen AI agent on Solana. Chat with Wojak. Generate memes.",
  openGraph: {
    title: "Agent Wojak | $WOJAK",
    description: "The most dramatic degen AI agent on Solana.",
    type: "website",
  },
};
```

**Step 2: Test full flow locally**

Run `npm run dev` and test:
- [ ] Home page loads with Matrix rain + chat
- [ ] Chat responds in Wojak persona
- [ ] Meme Lab generates memes from prompts
- [ ] About page displays token info
- [ ] All navigation works
- [ ] Mobile responsive

**Step 3: Deploy to Vercel**

Run:
```bash
npm run build
```

If build succeeds, deploy via Vercel CLI or GitHub integration.

Set environment variables on Vercel:
- `LLM_BASE_URL` = `https://api.groq.com/openai/v1`
- `LLM_API_KEY` = your Groq API key
- `LLM_MODEL` = `llama-3.3-70b-versatile`

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: add metadata, polish, and prepare for deployment"
```
