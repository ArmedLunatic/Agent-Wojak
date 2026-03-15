# Sci-Fi HUD Visual Makeover — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the matrix green terminal/CRT aesthetic with a Sci-Fi Command Center HUD design across all pages and components.

**Architecture:** Pure visual reskin — no logic, API, or game mechanic changes. New design system (colors, typography, effects) in Tailwind config + globals.css, then restyle every component top-down. A shared `<HudFrame>` React component handles the corner bracket pattern used across 6+ components.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS 3, Framer Motion 12, next/font/google

**Spec:** `docs/superpowers/specs/2026-03-15-hud-makeover-design.md`

**Verification strategy:** No test suite exists. Verify each task with `npm run build` (catches type/import errors) and visual inspection via `npm run dev`.

**Important conventions:**
- **Exports:** All existing components use named exports (`export function Foo()`). Keep named exports in all rewritten components. Do NOT switch to `export default` — this would break all consumer imports.
- **Imports:** Keep all existing import styles. Do not change static imports to dynamic unless explicitly noted.
- **Metadata:** Keep existing page metadata (title, description) unchanged — this is a visual reskin only.

---

## Chunk 1: Design System Foundation

### Task 1: Update Tailwind Config

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add color tokens and font families to Tailwind config**

Replace the entire `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#06080f',
        'bg-surface': '#0c1220',
        'bg-elevated': '#131b2e',
        'cyan-primary': '#00d4ff',
        'cyan-muted': '#0a8fb0',
        'orange-accent': '#ff6b35',
        'danger-red': '#ff4444',
        'success-green': '#22c55e',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: update tailwind config with HUD color palette and font families"
```

---

### Task 2: Rewrite globals.css

**Files:**
- Modify: `src/app/globals.css` (168 lines → full rewrite)

- [ ] **Step 1: Replace globals.css with new HUD design system**

Replace the entire file. Key changes:
- Remove: `--matrix-green`, `--matrix-dark-green`, `--matrix-bg` CSS variables
- Remove: `.glow`, `.border-glow`, `.glitch`, `.img-glow` classes
- Remove: CRT scanline overlay, vignette, `crt-flicker` animation
- Remove: green scrollbar styling
- Keep: `@keyframes fadeInUp`, `.fade-in-up`, `.delay-1` through `.delay-5`
- Keep: `.cursor-blink` animation
- Keep: `@keyframes ticker`
- Add: New CSS variables for HUD palette
- Add: `.hud-frame`, `.hud-glow`, `.hud-scanline`, `.data-readout` utility classes
- Add: `@keyframes scan`, `@keyframes hud-power-on`, `@keyframes pulse-dot`
- Add: New scrollbar styling (cyan themed)

Full replacement content:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-deep: #06080f;
  --bg-surface: #0c1220;
  --bg-elevated: #131b2e;
  --cyan-primary: #00d4ff;
  --cyan-muted: #0a8fb0;
  --orange-accent: #ff6b35;
  --danger-red: #ff4444;
  --success-green: #22c55e;
  --text-primary: rgba(255, 255, 255, 0.92);
  --text-secondary: rgba(255, 255, 255, 0.55);
  --text-muted: rgba(255, 255, 255, 0.25);
}

/* ====== SCROLLBAR ====== */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-deep); }
::-webkit-scrollbar-thumb { background: rgba(0, 212, 255, 0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 212, 255, 0.4); }

/* ====== HUD FRAME (corner brackets) ====== */
.hud-frame {
  position: relative;
  padding: 16px;
}
.hud-frame::before,
.hud-frame::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
}
.hud-frame::before {
  top: 0; left: 0;
  border-top: 2px solid var(--cyan-primary);
  border-left: 2px solid var(--cyan-primary);
}
.hud-frame::after {
  top: 0; right: 0;
  border-top: 2px solid var(--cyan-primary);
  border-right: 2px solid var(--cyan-primary);
}
.hud-frame .hud-corner-bl,
.hud-frame .hud-corner-br {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
}
.hud-frame .hud-corner-bl {
  bottom: 0; left: 0;
  border-bottom: 2px solid var(--cyan-primary);
  border-left: 2px solid var(--cyan-primary);
}
.hud-frame .hud-corner-br {
  bottom: 0; right: 0;
  border-bottom: 2px solid var(--cyan-primary);
  border-right: 2px solid var(--cyan-primary);
}

/* ====== HUD GLOW BORDER ====== */
.hud-glow {
  border: 1px solid rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.05), inset 0 0 15px rgba(0, 212, 255, 0.03);
}

/* ====== HUD SCANLINE (gradient top/bottom) ====== */
.hud-scanline {
  position: relative;
}
.hud-scanline::before,
.hud-scanline::after {
  content: '';
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  pointer-events: none;
}
.hud-scanline::before {
  top: 0;
  background: linear-gradient(90deg, transparent, var(--cyan-primary), transparent);
}
.hud-scanline::after {
  bottom: 0;
  background: linear-gradient(90deg, transparent, var(--orange-accent), transparent);
}

/* ====== DATA READOUT PANEL ====== */
.data-readout {
  border-left: 2px solid var(--orange-accent);
  padding: 12px 16px;
  background: var(--bg-surface);
  font-family: var(--font-mono), monospace;
  font-size: 0.75rem;
}

/* ====== KEYFRAMES ====== */
@keyframes scan {
  0% { left: 0; width: 0; }
  50% { width: 30%; }
  100% { left: 100%; width: 0; }
}

@keyframes hud-power-on {
  0% { transform: scaleX(0); opacity: 1; }
  100% { transform: scaleX(1); opacity: 1; }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* ====== BASE RULES ====== */
html { scroll-behavior: smooth; }
html, body { overflow-x: hidden; max-width: 100vw; }

/* ====== CURSOR BLINK ====== */
.cursor-blink::after {
  content: "\2588";
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ====== FADE IN UP UTILITY ====== */
.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }

/* ====== TICKER ====== */
.ticker {
  animation: ticker 20s linear infinite;
}

/* ====== HUD BUTTON BASE ====== */
.hud-btn {
  font-family: var(--font-mono), monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  padding: 10px 24px;
  transition: all 0.2s ease;
  cursor: pointer;
}
.hud-btn:active {
  transform: scale(0.97);
}
.hud-btn-primary {
  background: rgba(0, 212, 255, 0.12);
  border: 1px solid rgba(0, 212, 255, 0.35);
  color: var(--cyan-primary);
}
.hud-btn-primary:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
}
.hud-btn-accent {
  background: rgba(255, 107, 53, 0.12);
  border: 1px solid rgba(255, 107, 53, 0.35);
  color: var(--orange-accent);
}
.hud-btn-accent:hover {
  background: rgba(255, 107, 53, 0.2);
  border-color: rgba(255, 107, 53, 0.5);
}
.hud-btn-ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.5);
}
.hud-btn-ghost:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
}
.hud-btn-danger {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  color: var(--danger-red);
}
.hud-btn-danger:hover {
  background: rgba(255, 68, 68, 0.18);
  border-color: rgba(255, 68, 68, 0.5);
}

/* ====== MOBILE ADJUSTMENTS ====== */
@media (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}

@media (max-width: 640px) {
  .hud-frame::before,
  .hud-frame::after,
  .hud-frame .hud-corner-bl,
  .hud-frame .hud-corner-br {
    width: 12px;
    height: 12px;
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds. Existing components may show Tailwind warnings for removed green classes (non-blocking).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: rewrite globals.css with HUD design system, remove CRT/matrix effects"
```

---

### Task 3: Update Layout and Fonts

**Files:**
- Modify: `src/app/layout.tsx` (47 lines)
- Delete: `src/components/MatrixRain.tsx` (60 lines)

- [ ] **Step 1: Rewrite layout.tsx**

Replace the full file. Key changes:
- Replace `Share_Tech_Mono` import with `Orbitron`, `Rajdhani`, `JetBrains_Mono` from `next/font/google`
- Remove `MatrixRain` import and component
- Remove CRT overlay div (if present in layout)
- Update `<body>` class from `bg-black text-green-400 font-mono` to `bg-bg-deep text-[rgba(255,255,255,0.92)] font-body`
- Apply font CSS variables to body className

New `layout.tsx`:

Key changes to make (preserve named imports and existing metadata):

```tsx
// Replace Share_Tech_Mono import with:
import { Orbitron, Rajdhani, JetBrains_Mono } from "next/font/google";

// Keep existing named imports — do NOT switch to default imports:
import { Navbar } from "@/components/Navbar";
import { BootSequence } from "@/components/BootSequence";
import { WalletProvider } from "@/components/WalletProvider";
// (keep the same import style the file currently uses)

// Remove MatrixRain import entirely

// Add font declarations (replace the shareTechMono declaration):
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

// Keep existing metadata EXACTLY as-is (title, description unchanged)

// Update <body> className — replace:
//   `${shareTechMono.className} bg-black text-green-400 font-mono min-h-screen relative overflow-x-hidden`
// with:
//   `${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} bg-bg-deep text-[rgba(255,255,255,0.92)] font-body min-h-screen relative overflow-x-hidden`

// Remove <MatrixRain /> component from JSX
// Remove the z-10 wrapper div (no longer needed without MatrixRain canvas)
// Keep BootSequence, Navbar, WalletProvider, main wrapper
```

- [ ] **Step 2: Delete MatrixRain.tsx**

```bash
rm src/components/MatrixRain.tsx
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds. MatrixRain import is gone from layout.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git rm src/components/MatrixRain.tsx
git commit -m "feat: update layout with HUD fonts, remove MatrixRain"
```

---

### Task 4: Create HudFrame Component

**Files:**
- Create: `src/components/HudFrame.tsx`

- [ ] **Step 1: Create the reusable HudFrame wrapper**

```tsx
"use client";

interface HudFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function HudFrame({ children, className = "" }: HudFrameProps) {
  return (
    <div className={`hud-frame ${className}`}>
      <span className="hud-corner-bl" />
      <span className="hud-corner-br" />
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/HudFrame.tsx
git commit -m "feat: add reusable HudFrame corner bracket component"
```

---

## Chunk 2: Core UI Components

### Task 5: Restyle Navbar

**Files:**
- Modify: `src/components/Navbar.tsx` (100 lines)

- [ ] **Step 1: Rewrite Navbar with HUD styling**

Full rewrite. Key changes:
- Remove bracket notation from NAV_LINKS labels (`[CHAT]` → `CHAT`)
- Background: `bg-bg-deep` with cyan gradient bottom border
- Logo: Orbitron font with pulsing cyan dot
- Links: JetBrains Mono, uppercase, `text-[0.75rem]`, `tracking-[0.15em]`
- Active link: `text-cyan-primary`, inactive: `text-[rgba(255,255,255,0.55)]`
- Mobile menu: Slide-in panel from right (80vw, max-w-[320px], full height)
- Add status readout on desktop: `SYS: ONLINE ● SOL_NET: ACTIVE`
- Hamburger icon: Replace `[=]`/`[X]` text with proper icons or simple lines

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "CHAT" },
  { href: "/meme", label: "MEME LAB" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/games", label: "GAMES" },
  { href: "/random", label: "RNG" },
  { href: "/roadmap", label: "ROADMAP" },
  { href: "/about", label: "TOKEN" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-bg-deep/95 backdrop-blur-sm">
      {/* Gradient bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-primary/40 to-transparent" />

      <div className="max-w-4xl mx-auto px-3 md:px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-cyan-primary animate-[pulse-dot_2s_ease-in-out_infinite]" />
          <span className="font-display text-sm tracking-[0.1em] text-[rgba(255,255,255,0.92)] group-hover:text-cyan-primary transition-colors">
            AGENT WOJAK
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-mono text-[0.75rem] tracking-[0.15em] uppercase transition-colors ${
                isActive(link.href)
                  ? "text-cyan-primary"
                  : "text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.8)]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-cyan-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {/* Status readout */}
          <span className="text-[0.6rem] font-mono text-[rgba(255,255,255,0.25)] tracking-wider hidden lg:inline">
            SYS: ONLINE <span className="text-success-green">●</span> SOL_NET: ACTIVE
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[rgba(255,255,255,0.55)] hover:text-cyan-primary transition-colors p-2"
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`block h-px bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block h-px bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bg-deep/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-[320px] bg-bg-deep z-50 md:hidden border-l border-cyan-primary/10"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-[rgba(255,255,255,0.55)] hover:text-cyan-primary font-mono text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`py-4 px-6 font-mono text-[0.8rem] tracking-[0.15em] uppercase border-l-2 transition-colors ${
                      isActive(link.href)
                        ? "border-cyan-primary text-cyan-primary"
                        : "border-orange-accent/30 text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.8)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: restyle Navbar with HUD design - slide-in mobile, status readout"
```

---

### Task 6: Restyle HeroSection

**Files:**
- Modify: `src/components/HeroSection.tsx` (119 lines)

- [ ] **Step 1: Rewrite HeroSection with HUD styling**

Key changes:
- Replace taglines with rogue AI persona lines
- Wrap Wojak image in HudFrame
- Title in Orbitron with cyan text-shadow
- Replace green classes with new palette
- Status bar → HUD data strip
- Background: subtle radial gradients
- Replace corner bracket divs with HudFrame component

Read the current file for the typing animation logic (lines 21-48 of `src/components/HeroSection.tsx`) and preserve it exactly. Change only:
- `TAGLINES` array content
- All Tailwind classes (green → cyan/HUD palette)
- Image border: `border-green-500/60` → `border-cyan-primary/20`
- Title classes: add `font-display` and cyan text-shadow
- Remove old corner bracket divs, wrap image in `<HudFrame>`
- Status bar: replace with HUD data strip in `font-mono text-[rgba(255,255,255,0.25)]`
- Add background radial gradients to the container

- [ ] **Step 2: Verify build and visual check**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: restyle HeroSection with HUD frame, rogue AI taglines"
```

---

### Task 7: Restyle BootSequence

**Files:**
- Modify: `src/components/BootSequence.tsx` (171 lines)

- [ ] **Step 1: Rewrite BootSequence**

Key changes:
- Replace all green classes with HUD palette
- Replace BOOT_LINES content with new HUD diagnostic lines:
  - `[OK] INITIALIZING WOJAK_PROTOCOL v2.0...`
  - `[OK] LOADING EMOTIONAL_CORE...`
  - `[OK] CONNECTING SOL_NET...`
  - `[WARN] FEELINGS MODULE: UNSTABLE`
  - `[OK] PORTFOLIO TRACKER: ONLINE (LOSSES: SIGNIFICANT)`
  - `[OK] COPE_ENGINE: RUNNING`
  - `[READY] SYSTEM OPERATIONAL — PROCEED WITH CAUTION`
- `[OK]` tags: `text-cyan-primary`
- `[WARN]` tag: `text-orange-accent`
- `[READY]` tag: `text-success-green`
- Background: `bg-bg-deep` (not black)
- Progress bar: thin 2px cyan line, smooth CSS width transition (remove character-by-character ▓░ rendering)
- Remove CRT vignette overlay and scanline effects
- Dismiss animation: fade + scale(0.98) over 400ms

Preserve the sessionStorage check and the staggered line reveal logic.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/BootSequence.tsx
git commit -m "feat: restyle BootSequence as HUD system diagnostic"
```

---

### Task 8: Restyle Ticker, PageTransition, ScrollReveal

**Files:**
- Modify: `src/components/Ticker.tsx` (32 lines)
- Modify: `src/components/PageTransition.tsx` (17 lines)
- Modify: `src/components/ScrollReveal.tsx` (35 lines)

- [ ] **Step 1: Restyle Ticker**

Changes:
- Container: `bg-bg-surface` band, `border-y border-cyan-primary/10`
- Text: `font-mono text-[rgba(0,212,255,0.4)] text-xs tracking-widest`
- Separator: Replace `·` with `◆`

- [ ] **Step 2: Restyle PageTransition**

Replace the fade+scale animation with HUD power-on effect:
- Add a thin cyan horizontal line that expands via `scaleX(0→1)` (0.2s)
- Then content fades in (opacity 0→1, 0.2s after line)
- Total ~0.4s

```tsx
"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
    >
      <motion.div
        className="h-px bg-cyan-primary/40 mb-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Restyle ScrollReveal**

Change:
- Y offset: 40 → 8 (subtler drift)
- Duration: 0.6 → 0.3 (snappier)
- Remove left/right/down directions — simplify to upward drift only or keep but reduce offsets proportionally

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Ticker.tsx src/components/PageTransition.tsx src/components/ScrollReveal.tsx
git commit -m "feat: restyle Ticker, PageTransition, ScrollReveal with HUD aesthetics"
```

---

## Chunk 3: Chat, Meme Lab, Gallery

### Task 9: Restyle ChatWindow

**Files:**
- Modify: `src/components/ChatWindow.tsx` (136 lines)

- [ ] **Step 1: Restyle ChatWindow as Comms Terminal**

Key changes:
- Outer frame: `bg-bg-surface hud-glow` with HudFrame wrapper
- Title bar: `COMMS://WOJAK_PROTOCOL` in `font-mono text-cyan-primary`
- Dot indicators: three cyan dots replacing green terminal dots
- Assistant label: `◆ WOJAK.AI` (was `WOJAK://`)
- User messages: `bg-[rgba(255,107,53,0.08)] border-l-2 border-orange-accent/30`
- Assistant messages: `bg-bg-elevated border-l-2 border-cyan-primary/30`
- All `text-green-*` → appropriate new text colors
- Input: `bg-bg-deep border border-cyan-primary/15 focus:border-cyan-primary/40 text-[rgba(255,255,255,0.92)] placeholder:text-[rgba(255,255,255,0.25)]`
- Placeholder: `"transmit message..."`
- Send button: `hud-btn hud-btn-primary`
- Loading: Replace bouncing dots with scan line animation — a `div` with `absolute` positioning, `h-0.5 bg-cyan-primary/60`, `animation: scan 1.2s ease-in-out infinite`

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ChatWindow.tsx
git commit -m "feat: restyle ChatWindow as HUD comms terminal"
```

---

### Task 10: Restyle MemeStudio

**Files:**
- Modify: `src/components/MemeStudio.tsx` (198 lines)

- [ ] **Step 1: Restyle MemeStudio as Propaganda Generator**

Key changes:
- All green classes → HUD palette
- Header references: "MEME LAB" → keep as component internal (page handles title)
- Input placeholder: `"enter propaganda directive..."`
- Input focus border: `border-orange-accent/40`
- Generate button: `hud-btn hud-btn-accent` with text `FABRICATE`
- Canvas watermark: Change `$AgentJak` fill color from green to `#00d4ff` (line ~50 of MemeStudio.tsx in renderMemeOnCanvas)
- Result display: wrap in HudFrame
- Gallery cards: `bg-bg-surface border border-cyan-primary/10`
- Download button: `hud-btn hud-btn-primary`
- Loading spinner: update from green to cyan

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/MemeStudio.tsx
git commit -m "feat: restyle MemeStudio as Propaganda Generator with HUD theme"
```

---

### Task 11: Restyle Gallery

**Files:**
- Modify: `src/components/Gallery.tsx` (176 lines)

- [ ] **Step 1: Restyle Gallery with HUD theme**

Key changes:
- Grid cards: `bg-bg-surface border border-cyan-primary/10 rounded`
- Hover: `hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] hover:scale-[1.02]` — remove 3D rotateX/rotateY effects
- Remove corner bracket hover animation (opacity-based green brackets)
- Skeleton loading: `bg-bg-elevated animate-pulse` (replace green-900/20)
- Lightbox overlay: `bg-bg-deep/95` with HudFrame around the image
- Close text: `ESC TO CLOSE` in `font-mono text-[rgba(255,255,255,0.25)]` top-right
- Close button: `hud-btn hud-btn-ghost`
- Remove `img-glow` references
- Download link in lightbox: `hud-btn hud-btn-primary`

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Gallery.tsx
git commit -m "feat: restyle Gallery with HUD cards and lightbox"
```

---

## Chunk 4: Games

### Task 12: Restyle Game Shell, Card, Balance, Reaction, Reset

**Files:**
- Modify: `src/components/games/GameShell.tsx` (39 lines)
- Modify: `src/components/games/GameCard.tsx` (52 lines)
- Modify: `src/components/games/BalanceDisplay.tsx` (30 lines)
- Modify: `src/components/games/WojakReaction.tsx` (40 lines)
- Modify: `src/components/games/GamesBalanceReset.tsx` (21 lines)

- [ ] **Step 1: Restyle GameShell**

- Background: `bg-bg-deep`
- Title: `font-display text-cyan-primary tracking-wider uppercase`
- Remove all green classes

- [ ] **Step 2: Restyle GameCard**

- Card: `bg-bg-surface border-l-2` with per-game color passed via prop or hardcoded
- Remove bracket notation `[PLAY]` → `LAUNCH` in `hud-btn hud-btn-primary`
- Remove green corner bracket hover animation
- Remove scanline hover overlay
- Hover: `hover:shadow-[0_0_15px_rgba(0,212,255,0.08)]` + `scale-[1.03]`

- [ ] **Step 3: Restyle BalanceDisplay**

- Display: `font-mono text-cyan-primary`
- Label: `$WOJAK:` in `text-[rgba(255,255,255,0.25)]`
- Value: `text-cyan-primary`
- Keep spring animation from Framer Motion

- [ ] **Step 4: Restyle WojakReaction**

- Commentary: `font-mono text-[rgba(255,255,255,0.55)]` formatted as `◆ ANALYSIS: "{commentary}" [COPE_LEVEL: CRITICAL]`
- Image wrapper: small HudFrame
- Keep AnimatePresence

- [ ] **Step 5: Restyle GamesBalanceReset**

- Button: `hud-btn hud-btn-ghost` with text `RESET BALANCE`
- Balance display: `font-mono text-[rgba(255,255,255,0.55)]`
- Remove bracket notation

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/games/GameShell.tsx src/components/games/GameCard.tsx src/components/games/BalanceDisplay.tsx src/components/games/WojakReaction.tsx src/components/games/GamesBalanceReset.tsx
git commit -m "feat: restyle game shell, cards, balance, reaction with HUD theme"
```

---

### Task 13: Restyle RugPullRoulette

**Files:**
- Modify: `src/components/games/RugPullRoulette.tsx` (368 lines)

- [ ] **Step 1: Restyle RugPullRoulette**

Key changes:
- SEGMENTS colors: Replace greens (#00FF41, #00CC33, #00FF90, #009922) with cyan shades (#00d4ff, #0a8fb0, #00b8d4, #006080). Replace reds (#661111, #441111, #331111) with (#ff4444, #992222, #661111). Cope: use orange-accent (#ff6b35).
- Frame header: `SIMULATION://RUG_ROULETTE` in `font-mono text-cyan-primary`
- Bet buttons: `hud-btn hud-btn-primary` for presets, `hud-btn hud-btn-accent` for ALL IN
- Spin button: `hud-btn hud-btn-primary` text `EXECUTE SPIN`
- Result flash: cyan glow for win, red pulse for rug
- All `text-green-*`, `bg-green-*`, `border-green-*` → new palette equivalents
- Win/loss text: `text-success-green` / `text-danger-red`
- Keep all canvas drawing logic, payout logic, weighted RNG unchanged

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/games/RugPullRoulette.tsx
git commit -m "feat: restyle RugPullRoulette with HUD colors and controls"
```

---

### Task 14: Restyle PumpOrDump

**Files:**
- Modify: `src/components/games/PumpOrDump.tsx` (382 lines)

- [ ] **Step 1: Restyle PumpOrDump**

Key changes:
- Canvas candle colors: pump `#00d4ff` (was #00FF41), dump `#ff6b35` (was #003B00)
- Canvas grid lines: `rgba(0, 212, 255, 0.1)` (was green-based)
- Canvas background: `#0c1220` (was #000)
- Canvas price text: `rgba(255, 255, 255, 0.25)` (was green)
- Frame header: `SIMULATION://MARKET_PREDICTION`
- Guess buttons: `PUMP` → `hud-btn hud-btn-primary`, `DUMP` → `hud-btn hud-btn-accent`
- Streak display: `font-mono` HUD readout: `STREAK: {n} | ACCURACY: {pct}%`
- All green Tailwind classes → HUD palette
- Keep all candle generation, streak, payout logic unchanged

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/games/PumpOrDump.tsx
git commit -m "feat: restyle PumpOrDump with cyan/orange candles and HUD controls"
```

---

### Task 15: Restyle WojakSlots

**Files:**
- Modify: `src/components/games/WojakSlots.tsx` (325 lines)

- [ ] **Step 1: Restyle WojakSlots**

Key changes:
- Frame header: `SIMULATION://SLOT_MACHINE`
- Reel containers: `bg-bg-surface border border-cyan-primary/10`
- Payline indicator: `border-cyan-primary/40` (was `border-green-500/60`)
- Spin button: `hud-btn hud-btn-primary` text `EXECUTE SPIN`
- Win amount: `text-cyan-primary` with `text-shadow: 0 0 10px rgba(0,212,255,0.3)`
- Loss amount: `text-danger-red`
- All green classes → HUD palette
- Keep all payout logic, reel mechanics, spring animations unchanged

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/games/WojakSlots.tsx
git commit -m "feat: restyle WojakSlots with HUD frame and controls"
```

---

## Chunk 5: Remaining Pages & Components

### Task 16: Restyle RandomGenerator (Entropy Oracle)

**Files:**
- Modify: `src/components/RandomGenerator.tsx` (236 lines)

- [ ] **Step 1: Restyle RandomGenerator**

Key changes:
- All green classes → HUD palette
- Payment display: `COST: 0.1 SOL` in `text-orange-accent font-mono`
- Connect wallet button: `hud-btn hud-btn-primary`
- Pay button: `hud-btn hud-btn-accent`
- Result number: `text-cyan-primary font-mono text-4xl`
- Add decryption effect: When result arrives, scramble through hex chars (0-9, A-F) for 8 iterations at 50ms, then settle left-to-right over 3 more iterations. Implement with a `useEffect` + `setInterval` that decrements a scramble counter.
- "How It Works" section: restyle with `data-readout` class
- Frame: wrap main content in HudFrame
- Header: `ORACLE://ENTROPY_GENERATOR` in `font-mono text-cyan-primary`

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/RandomGenerator.tsx
git commit -m "feat: restyle RandomGenerator as Entropy Oracle with decryption effect"
```

---

### Task 17: Restyle Roadmap

**Files:**
- Modify: `src/components/Roadmap.tsx` (282 lines)

- [ ] **Step 1: Restyle Roadmap**

Key changes:
- Header: `PROTOCOL://ROADMAP` in `font-display text-cyan-primary`
- Timeline connecting line: 1px `bg-cyan-primary/20` vertical
- Phase cards: `bg-bg-surface` with `hud-glow`
- StatusBadge:
  - `"complete"` → `DEPLOYED` badge, `bg-cyan-primary/20 text-cyan-primary`
  - `"in-progress"` → `IN PROGRESS` badge, `bg-orange-accent/20 text-orange-accent` with `animate-pulse`
  - `"locked"` → `LOCKED` badge, ghost style, `text-[rgba(255,255,255,0.25)]`
- Locked phases: `opacity-40` (keep), remove `grayscale` on icon
- Complete phases: `border-cyan-primary/20` (was green)
- In-progress: `border-orange-accent/20`
- Item markers: keep ✓/▸/○ but color ✓ cyan, ▸ orange, ○ muted
- Progress bar: thin cyan fill on `bg-bg-elevated` track
- CTA buttons: "Buy $AgentJak" → `hud-btn hud-btn-accent`, "Join Community" → `hud-btn hud-btn-primary`
- Remove `glow`, `glitch`, `border-glow` class usage

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Roadmap.tsx
git commit -m "feat: restyle Roadmap with HUD timeline and status badges"
```

---

### Task 18: Restyle AboutStats

**Files:**
- Modify: `src/components/AboutStats.tsx` (78 lines)

- [ ] **Step 1: Restyle AboutStats**

Key changes:
- Grid cards: `bg-bg-surface border border-cyan-primary/10`
- Stat values: `text-cyan-primary font-mono`
- Stat labels: `text-[rgba(255,255,255,0.25)] font-mono uppercase tracking-wider`
- Remove `glow` class from values
- Scramble effect: keep existing logic, update display colors

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/AboutStats.tsx
git commit -m "feat: restyle AboutStats with HUD data readout theme"
```

---

### Task 19: Restyle All Page Wrappers

**Files:**
- Modify: `src/app/page.tsx` (52 lines)
- Modify: `src/app/meme/page.tsx` (22 lines)
- Modify: `src/app/gallery/page.tsx` (23 lines)
- Modify: `src/app/random/page.tsx` (22 lines)
- Modify: `src/app/about/page.tsx` (129 lines)
- Modify: `src/app/games/page.tsx` (57 lines)
- Verify (no changes expected): `src/app/roadmap/page.tsx`, `src/app/games/roulette/page.tsx`, `src/app/games/slots/page.tsx`, `src/app/games/pump-or-dump/page.tsx`

- [ ] **Step 1: Restyle home page (src/app/page.tsx)**

- Divider: `via-green-500/40` → `via-cyan-primary/30`
- Remove `glow` class from any heading
- Remove `border-glow` class from buy link
- Buy link: `hud-btn hud-btn-accent` style, remove bracket notation `[BUY $AgentJak ON PUMP.FUN]` → `BUY $AgentJak ON PUMP.FUN`
- Replace all `text-green-*`, `border-green-*`, `bg-green-*` with HUD equivalents

- [ ] **Step 2: Restyle meme page**

- Title: Remove `glow` class, add `font-display text-cyan-primary`
- Subtitle: `text-[rgba(255,255,255,0.55)] font-body`
- Replace `text-green-600` → `text-[rgba(255,255,255,0.55)]`

- [ ] **Step 3: Restyle gallery page**

- Title: Remove `glow glitch` classes, add `font-display text-cyan-primary`
- Subtitle: `text-[rgba(255,255,255,0.55)]`
- Divider: update green → cyan
- Replace all green text classes

- [ ] **Step 4: Restyle random page**

- Title: Remove `glow` class, add `font-display text-cyan-primary`
- Subtitle: `text-[rgba(255,255,255,0.55)]`
- Replace green text classes

- [ ] **Step 5: Restyle about page (heavy restyle)**

This is the largest page file (129 lines). Changes:
- Hero image: remove CRT scanline overlay div, change `border-green-500` → `border-cyan-primary/20`
- Title: Remove `glow glitch`, add `font-display text-cyan-primary`
- All `text-green-*` → HUD equivalents
- Token info terminal: `bg-bg-surface border-cyan-primary/10`, remove `border-glow`
- Labels: `text-[rgba(255,255,255,0.25)] font-mono`
- Values: `text-cyan-primary font-mono`
- Contract address: `text-cyan-primary font-mono`
- Links: Replace bracket notation, use `hud-btn hud-btn-primary`
- Disclaimer: `text-[rgba(255,255,255,0.25)] font-body`
- Remove `img-glow` usage
- Dividers: green → cyan

- [ ] **Step 6: Restyle games hub page**

- Title: `font-display text-cyan-primary`, remove brackets
- GAMES array: Remove bracket notation from descriptions if present
- Game cards: pass appropriate border-color per game (handled in GameCard component, but verify the array items)
- Balance section styling: use HUD colors
- Footer text: `text-[rgba(255,255,255,0.25)]`
- Reset button: already handled via GamesBalanceReset restyle

- [ ] **Step 7: Verify thin wrapper pages**

Read and verify that these files have no inline green styles:
- `src/app/roadmap/page.tsx`
- `src/app/games/roulette/page.tsx`
- `src/app/games/slots/page.tsx`
- `src/app/games/pump-or-dump/page.tsx`

If any green classes exist, update them.

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: Build succeeds with zero errors.

- [ ] **Step 9: Commit**

```bash
git add src/app/page.tsx src/app/meme/page.tsx src/app/gallery/page.tsx src/app/random/page.tsx src/app/about/page.tsx src/app/games/page.tsx
git commit -m "feat: restyle all page wrappers with HUD theme, remove green/CRT classes"
```

---

## Chunk 6: Final Sweep

### Task 20: WalletProvider Styling Check

**Files:**
- Modify (if needed): `src/components/WalletProvider.tsx` (25 lines)

- [ ] **Step 1: Check WalletProvider**

Read `src/components/WalletProvider.tsx`. The Solana wallet modal has its own default styling. If it uses green theme variables, check if `@solana/wallet-adapter-react-ui` supports custom CSS variables and update. Otherwise leave as-is — wallet modal styling is external.

- [ ] **Step 2: Commit if changed**

```bash
git add src/components/WalletProvider.tsx
git commit -m "fix: update wallet provider styling for HUD theme"
```

---

### Task 21: Full Build Verification and Green Sweep

**Files:**
- All project files

- [ ] **Step 1: Search for remaining green references**

Run a project-wide search for any remaining `green` in Tailwind classes:

```bash
grep -rn "green" src/components/ src/app/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Any results in component/page files (not `node_modules`) that reference green-400, green-500, green-600, etc. must be updated.

Exceptions: `success-green` token usage is correct and should remain.

- [ ] **Step 2: Search for removed class references**

```bash
grep -rn "glow\|border-glow\|glitch\|img-glow\|matrix\|MatrixRain" src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Any results indicate missed cleanup. Fix them.

- [ ] **Step 3: Full build**

Run: `npm run build`
Expected: Build succeeds with zero errors.

- [ ] **Step 4: Visual smoke test**

Run: `npm run dev`
Check each page manually:
- `/` — Hero + Chat + Ticker visible, cyan/navy theme
- `/meme` — Propaganda Generator UI renders
- `/gallery` — Grid loads, lightbox works
- `/games` — Hub shows 3 cards
- `/games/roulette` — Wheel renders with new colors
- `/games/pump-or-dump` — Chart renders with cyan/orange candles
- `/games/slots` — Reels render
- `/random` — Entropy Oracle with wallet connect
- `/roadmap` — Timeline with phase cards
- `/about` — Token info with data readouts

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: final green sweep and cleanup for HUD makeover"
```
