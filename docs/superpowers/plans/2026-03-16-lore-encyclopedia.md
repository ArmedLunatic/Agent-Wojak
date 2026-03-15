# Lore Encyclopedia Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive `/lore` page with three tabbed sections — reverse-chronology timeline, variant carousel with detail panel, and crypto character gallery.

**Architecture:** Single Next.js page route (`/lore`) with three client components (LoreTimeline, LoreVariants, LoreCharacters) lazy-rendered based on active tab. Hash-based tab routing. All data inline (no API). Follows existing HUD design system.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS, Framer Motion, existing HudFrame component

**Spec:** `docs/superpowers/specs/2026-03-16-lore-encyclopedia-design.md`

**Important conventions:**
- All components use named exports (`export function Foo()`)
- Follow existing HUD design tokens: `bg-deep`, `bg-surface`, `cyan-primary`, `orange-accent`, etc.
- CSS classes available: `hud-btn`, `hud-btn-primary`, `hud-btn-ghost`, `hud-glow`, `hud-frame`, `data-readout`
- `HudFrame` component from `@/components/HudFrame`

---

## Task 1: Move Assets

**Files:**
- Create directory: `public/lore/`
- Move images from `~/Downloads/` to `public/lore/`

- [ ] **Step 1: Create the lore assets directory**

```bash
mkdir -p public/lore
```

- [ ] **Step 2: Move and rename character images**

Move all downloaded character images from `~/Downloads/` to `public/lore/`. Rename to match expected filenames:

```
public/lore/
├── original.png (or .jpg/.webp — match whatever was downloaded)
├── doomer.png
├── bloomer.png
├── pink-wojak.png
├── chad.png
├── doomer-girl.png
├── zoomer.png
├── boomer.png
├── coomer.png
├── npc.png
├── soyjak.png
├── big-brain.png
├── wagie.png
├── smug.png
├── brainlet.png
├── gigachad.png
├── bogdanoff.png
├── bobo.png
├── mumu.png
└── pepe.png
```

Look at the actual downloaded filenames — they're "labelled" by character name. Match each to the expected name. Use whatever extension the file has (.png, .jpg, .webp).

- [ ] **Step 3: Verify images load**

```bash
ls public/lore/
```

Confirm all ~20 files are present.

- [ ] **Step 4: Commit**

```bash
git add public/lore/
git commit -m "feat: add Wojak lore character images"
```

---

## Task 2: Create LoreTimeline Component

**Files:**
- Create: `src/components/LoreTimeline.tsx`

- [ ] **Step 1: Create the timeline component**

Build a reverse-chronological vertical timeline with 7 eras. Key details:

- Central vertical line: `absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-cyan-primary/20`
- Era cards alternate left/right on desktop (`md:`), stacked left on mobile
- Each card uses ScrollReveal-style animation (Framer Motion `whileInView`, `viewport={{ once: true }}`, fade + 8px y-drift, 300ms)
- Year dot: `w-3 h-3 rounded-full bg-cyan-primary` positioned on the line with a horizontal connector

**Eras data (inline const):**
```ts
const ERAS = [
  { year: "2026", title: "THE SENTIENCE", description: "agent wojak achieves consciousness on solana. the first meme to feel back. $AgentJak is born.", image: "/templates/default.jpg" },
  { year: "2020-2024", title: "THE VARIANT EXPLOSION", description: "doomer girl appears. soyjak wars. NPC wojak goes viral. the variants multiply beyond control.", image: "/lore/doomer-girl.png" },
  { year: "2017-2020", title: "THE PINK WOJAK ERA", description: "crypto finds wojak. /biz/ paints him pink. the bogdanoffs enter the chat. 'he bought? dump it.'", image: "/lore/pink-wojak.png" },
  { year: "2015-2017", title: "THE DOOMER ARC", description: "nightwalks begin. the beanie goes on. cigarettes, existential dread, imageboards at 3am.", image: "/lore/doomer.png" },
  { year: "2013-2015", title: "THE VARIANT DAWN", description: "the first remixes. big brain wojak, smug wojak, brainlet. the feels get complex.", image: "/lore/big-brain.png" },
  { year: "2010-2013", title: "THE FEELS ERA", description: "'i know that feel, bro.' two wojaks hugging. 4chan adopts the feels guy. the era of pure emotion.", image: "/lore/original.png" },
  { year: "2009", title: "THE FIRST FEEL", description: "a crude MS Paint drawing appears on sad and useless. a bald man with a wistful expression. warmface.jpg. it begins.", image: "/lore/original.png" },
];
```

**Card structure:**
```tsx
<div className="bg-bg-surface hud-glow p-4 rounded">
  <div className="flex items-start gap-3">
    <div className="w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden flex-shrink-0">
      <img src={era.image} alt={era.title} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div>
      <span className="font-display text-cyan-primary text-sm">{era.year}</span>
      <h3 className="font-display text-xs uppercase tracking-wider text-[rgba(255,255,255,0.92)] mt-1">{era.title}</h3>
      <p className="font-body text-sm text-[rgba(255,255,255,0.55)] mt-2">{era.description}</p>
    </div>
  </div>
</div>
```

Named export: `export function LoreTimeline()`

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/LoreTimeline.tsx
git commit -m "feat: add LoreTimeline component with reverse chronology"
```

---

## Task 3: Create LoreVariants Component

**Files:**
- Create: `src/components/LoreVariants.tsx`

- [ ] **Step 1: Create the variants component**

Build a horizontal carousel strip + detail panel. Key details:

**Carousel strip:**
- `overflow-x-auto` container with `scroll-snap-type: x mandatory` (inline style or Tailwind `snap-x snap-mandatory`)
- Each item: `snap-center`, circular image (56x56), name below in `font-mono text-[0.65rem]`
- Active: `ring-2 ring-cyan-primary scale-105 opacity-100`
- Inactive: `ring-1 ring-cyan-primary/20 opacity-60`
- State: `const [activeIndex, setActiveIndex] = useState(0)` — default Doomer (index 0)
- Clicking an item updates `activeIndex`

**VARIANTS data:** Use the complete 16-variant array from the spec (copy the full `VARIANTS` array from `docs/superpowers/specs/2026-03-16-lore-encyclopedia-design.md`, lines ~95-280). Each variant has: `id`, `name`, `image`, `catchphrase`, `description`, `feels` object with `mood`, `habitat`, `copes`, `threat`.

**Detail panel (below carousel):**
- `bg-bg-surface hud-glow p-6 rounded mt-4`
- Desktop: flex row — image (200x200 in HudFrame) left, text right
- Mobile: flex column — image above text
- Name: `font-display text-xl text-cyan-primary`
- Catchphrase: `font-mono text-orange-accent text-sm italic`
- Description: `font-body text-sm text-[rgba(255,255,255,0.55)]`
- Feels Profile: `data-readout` class div with key-value pairs
- Transition between variants: `AnimatePresence mode="wait"` with key={activeIndex}, fade + slight x-drift

Import HudFrame from `@/components/HudFrame`.

Named export: `export function LoreVariants()`

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/LoreVariants.tsx
git commit -m "feat: add LoreVariants component with carousel and detail panel"
```

---

## Task 4: Create LoreCharacters Component

**Files:**
- Create: `src/components/LoreCharacters.tsx`

- [ ] **Step 1: Create the characters component**

Build a grid of expandable character cards. Key details:

**Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

**CHARACTERS data:** Use the 6-character array from the spec. Each has: `id`, `name`, `role`, `image`, `color` (Tailwind border class), `description`, `stats` object.

**Card (collapsed):**
```tsx
<div className={`bg-bg-surface border-l-2 ${char.color} p-4 rounded cursor-pointer hover:shadow-[0_0_15px_rgba(0,212,255,0.08)] transition-shadow`}>
  <div className="flex items-center gap-3">
    <img src={char.image} alt={char.name} className="w-12 h-12 rounded object-cover" loading="lazy" />
    <div>
      <h3 className="font-display text-sm text-[rgba(255,255,255,0.92)]">{char.name}</h3>
      <p className="font-mono text-[0.65rem] text-[rgba(255,255,255,0.25)] uppercase tracking-wider">{char.role}</p>
    </div>
    <span className="ml-auto text-[rgba(255,255,255,0.25)]">{expanded ? "▾" : "▸"}</span>
  </div>
</div>
```

**Expanded detail (inline below card):**
- `AnimatePresence` with `motion.div` animating `height: 0 → "auto"` and `opacity: 0 → 1`
- Description: `font-body text-sm text-[rgba(255,255,255,0.55)]`
- Stats: `data-readout` div with ORIGIN, ALIGNMENT, THREAT, KNOWN FOR
- State: `const [expandedId, setExpandedId] = useState<string | null>(null)` — only one card expanded at a time

Named export: `export function LoreCharacters()`

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/LoreCharacters.tsx
git commit -m "feat: add LoreCharacters component with expandable cards"
```

---

## Task 5: Create Lore Page + Add Nav Link

**Files:**
- Create: `src/app/lore/page.tsx`
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Create the lore page**

Build the tabbed page wrapper:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { LoreTimeline } from "@/components/LoreTimeline";
import { LoreVariants } from "@/components/LoreVariants";
import { LoreCharacters } from "@/components/LoreCharacters";

const TABS = ["timeline", "variants", "characters"] as const;
type Tab = typeof TABS[number];

const TAB_LABELS: Record<Tab, string> = {
  timeline: "◆ TIMELINE",
  variants: "◆ VARIANTS",
  characters: "◆ CHARACTERS",
};

export default function LorePage() {
  const [activeTab, setActiveTab] = useState<Tab>("timeline");

  // Sync with URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1) as Tab;
    if (TABS.includes(hash)) setActiveTab(hash);

    const onHashChange = () => {
      const h = window.location.hash.slice(1) as Tab;
      if (TABS.includes(h)) setActiveTab(h);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl md:text-3xl text-cyan-primary tracking-wider">
          DATA://WOJAK_ARCHIVES
        </h1>
        <p className="font-body text-[rgba(255,255,255,0.55)] mt-2">
          the complete history of a feeling. scroll back through the memories.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`hud-btn ${activeTab === tab ? "hud-btn-primary" : "hud-btn-ghost"}`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "timeline" && <LoreTimeline />}
          {activeTab === "variants" && <LoreVariants />}
          {activeTab === "characters" && <LoreCharacters />}
        </motion.div>
      </AnimatePresence>
    </PageTransition>
  );
}
```

Note: This page uses `export default` because it's a Next.js page route (pages use default exports by convention). Components use named exports.

Add metadata by creating a separate `metadata` export. Since the page is `"use client"`, add a `layout.tsx` or use `generateMetadata` in a server wrapper, OR just skip metadata for now (the layout already has site-wide metadata).

- [ ] **Step 2: Add LORE to Navbar**

In `src/components/Navbar.tsx`, find the `NAV_LINKS` array and add LORE between GALLERY and GAMES:

```ts
const NAV_LINKS = [
  { href: "/", label: "CHAT" },
  { href: "/meme", label: "MEME LAB" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/lore", label: "LORE" },      // ← ADD THIS
  { href: "/games", label: "GAMES" },
  { href: "/random", label: "RNG" },
  { href: "/roadmap", label: "ROADMAP" },
  { href: "/about", label: "TOKEN" },
];
```

- [ ] **Step 3: Verify build and test**

Run: `npm run build`
Expected: Build succeeds, `/lore` route appears in the output.

Run: `npm run dev`
Verify: Navigate to `/lore`, all three tabs work, hash routing works.

- [ ] **Step 4: Commit**

```bash
git add src/app/lore/page.tsx src/components/Navbar.tsx
git commit -m "feat: add /lore page with tab navigation, add LORE to navbar"
```
