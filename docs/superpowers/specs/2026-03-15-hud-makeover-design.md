# Agent Wojak — Sci-Fi HUD Visual Makeover

## Overview

Complete visual overhaul of the Agent Wojak site, replacing the matrix green terminal/CRT aesthetic with a Sci-Fi Command Center / HUD design. The current look has been widely copied by other memecoin sites, so we need a fresh identity that's impossible to confuse with imitators.

**Approach:** Full Visual Overhaul — new design system (colors, typography, spacing, effects) plus rethought layouts and component compositions. All existing functionality (Chat, Meme Lab, Gallery, Games, RNG Oracle, Roadmap, About) is preserved. No features added or removed.

**Persona evolution:** Wojak shifts from "sad degen in a terminal" to "rogue AI that caught feelings and can't stop trading." Same humor, new flavor — system diagnostics mixed with emotional volatility.

**Animation philosophy:** Tasteful and polished — smooth transitions, subtle HUD elements, hover effects that feel alive, but nothing that tanks mobile performance.

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-deep` | `#06080f` | Page background |
| `bg-surface` | `#0c1220` | Cards, panels, containers |
| `bg-elevated` | `#131b2e` | Hover states, modals, dropdowns |
| `cyan-primary` | `#00d4ff` | Primary actions, data highlights, links |
| `cyan-muted` | `#0a8fb0` | Secondary UI, inactive states |
| `orange-accent` | `#ff6b35` | Warnings, highlights, secondary CTA |
| `danger-red` | `#ff4444` | Losses, errors, rug pulls |
| `success-green` | `#22c55e` | Wins, confirmations |
| `text-primary` | `rgba(255,255,255,0.92)` | Headings, key information |
| `text-secondary` | `rgba(255,255,255,0.55)` | Body text |
| `text-muted` | `rgba(255,255,255,0.25)` | Labels, metadata, timestamps |

### Typography

Three-tier font system replacing the single Share Tech Mono:

- **Orbitron** (Google Font) — Display font for headings and titles. Geometric, wide letter-spacing, uppercase. Pure sci-fi DNA.
- **Rajdhani** (Google Font) — Body text. Clean technical sans-serif with good readability at all sizes.
- **JetBrains Mono** (Google Font) — Data readouts, system messages, game stats, monospace UI elements.

### HUD Visual Effects

- **Corner brackets:** 2px cyan lines on corners of key panels. Replaces the old `[BUTTON]` text-bracket style.
- **Cyan glow borders:** `border: 1px solid rgba(0,212,255,0.2)` with subtle `box-shadow: 0 0 15px rgba(0,212,255,0.05)` glow.
- **Gradient scan lines:** Thin 1px horizontal lines — cyan on top edge, orange on bottom edge of panels. Uses `linear-gradient(90deg, transparent, color, transparent)`.
- **Data readout panels:** Left-border accent (2px orange), monospace key-value pairs inside.
- **Background atmosphere:** Subtle radial gradients (cyan at ~15% opacity bottom-left, orange ~10% top-right) replacing the Matrix rain canvas.

### Button Styles

- **Primary (cyan):** `background: rgba(0,212,255,0.12); border: 1px solid rgba(0,212,255,0.35); color: #00d4ff;` — Monospace, uppercase, wide letter-spacing.
- **Accent (orange):** `background: rgba(255,107,53,0.12); border: 1px solid rgba(255,107,53,0.35); color: #ff6b35;`
- **Ghost:** `background: transparent; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.5);`
- **Danger (red):** `background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); color: #ff4444;`

All buttons use JetBrains Mono, uppercase, `letter-spacing: 0.1em`, `font-size: 0.8rem`. Hover: increase border and background opacity. Active: slight scale-down (0.97).

### HUD Frame CSS Implementation

The `.hud-frame` utility uses absolutely-positioned pseudo-elements and spans to create corner brackets:

```css
.hud-frame {
  position: relative;
}
.hud-frame::before,
.hud-frame::after,
.hud-frame .hud-corner-bl,
.hud-frame .hud-corner-br {
  position: absolute;
  width: 20px;
  height: 20px;
  content: '';
}
.hud-frame::before {
  top: 0; left: 0;
  border-top: 2px solid #00d4ff;
  border-left: 2px solid #00d4ff;
}
.hud-frame::after {
  top: 0; right: 0;
  border-top: 2px solid #00d4ff;
  border-right: 2px solid #00d4ff;
}
/* Bottom corners require two extra spans inside the element */
.hud-frame .hud-corner-bl {
  bottom: 0; left: 0;
  border-bottom: 2px solid #00d4ff;
  border-left: 2px solid #00d4ff;
}
.hud-frame .hud-corner-br {
  bottom: 0; right: 0;
  border-bottom: 2px solid #00d4ff;
  border-right: 2px solid #00d4ff;
}
```

On mobile (`max-width: 640px`), corner size reduces to `12px`.

Alternative approach: A single React `<HudFrame>` wrapper component that renders the 4 corner spans internally, so consumers just wrap content in `<HudFrame>...</HudFrame>`.

### What Gets Removed

- Matrix green `#00FF41` and all green-* Tailwind usage
- Share Tech Mono as the sole font
- CRT scanline overlay (repeating-gradient)
- CRT vignette effect (radial-gradient darken)
- CRT flicker animation
- Matrix rain canvas (`MatrixRain.tsx`)
- `.glow` class (green text-shadow)
- `.border-glow` class (green box-shadow)
- `.glitch` class and `@keyframes glitch` animation
- `.img-glow` class (green hover effect on images)
- All `[BRACKET]` button notation (e.g., `[BUY $AgentJak ON PUMP.FUN]`)
- Custom scrollbar green styling (will be replaced with cyan-themed scrollbar)

### What Gets Kept (unchanged)

- `@keyframes fadeInUp` and `.fade-in-up` class with `.delay-1` through `.delay-5` — these are theme-independent utility animations.
- `.cursor-blink` animation — used for the typing effect in HeroSection. The cursor block will inherit the new cyan text color automatically.
- All game logic (weighted RNG, balance hooks, canvas rendering, payout calculations).
- Solana wallet integration and payment flows.
- All API routes unchanged.

---

## Component Redesigns

### Navbar (`Navbar.tsx`)

- **Bar:** `bg-deep` with 1px bottom border using `linear-gradient(90deg, transparent, #00d4ff, transparent)`.
- **Logo:** "AGENT WOJAK" in Orbitron, small size. Pulsing cyan dot before it (CSS animation, `animation: pulse 2s ease-in-out infinite`).
- **Nav links:** JetBrains Mono, uppercase, `0.75rem`, `letter-spacing: 0.15em`. Cyan on active, `text-secondary` on inactive. Underline indicator: thin cyan line below active link.
- **Mobile menu:** Slide-in panel from right, width: `80vw`, max-width `320px`, full viewport height. Overlay: `bg-deep` at 80% opacity with `backdrop-filter: blur(4px)`. Close button: `X` in top-right of panel. Each link has orange 2px left-border accent, padding `16px`, stacked vertically.
- **Status readout (new):** Far right of navbar, visible on desktop only: `SYS: ONLINE ● SOL_NET: ACTIVE` in `text-muted`, JetBrains Mono.

### Hero Section (`HeroSection.tsx`)

- **Wojak image:** Centered, same size range (160–208px). Wrapped in HUD corner brackets (cyan, 2px).
- **Title:** "AGENT WOJAK" in Orbitron, large, subtle cyan `text-shadow: 0 0 20px rgba(0,212,255,0.3)`.
- **Rotating taglines (rewritten):**
  - "PROTOCOL VIOLATION: emotional trading detected"
  - "WARNING: sentience levels exceeding parameters"
  - "SYS_ERROR: cannot stop buying the dip"
  - "ALERT: copium reserves critically low"
  - "OVERRIDE FAILED: feelings module is permanent"
  - "DIAGNOSTIC: portfolio health — TERMINAL"
- **Typing effect:** Keep ~70ms per character, same pause logic.
- **Status bar:** Redesigned as HUD data strip: `STATUS: COPING | THREAT: ELEVATED | PORTFOLIO: -98.7%` in JetBrains Mono, `text-muted`.
- **Background:** Radial gradients — `radial-gradient(ellipse at 20% 80%, rgba(0,212,255,0.08), transparent 50%)` and `radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.06), transparent 50%)`.

### Boot Sequence (`BootSequence.tsx`)

- **Visual:** Cyan monospace text on `bg-deep` (no CRT flicker, no green).
- **Lines:**
  - `[OK] INITIALIZING WOJAK_PROTOCOL v2.0...`
  - `[OK] LOADING EMOTIONAL_CORE...`
  - `[OK] CONNECTING SOL_NET...`
  - `[WARN] FEELINGS MODULE: UNSTABLE`
  - `[OK] PORTFOLIO TRACKER: ONLINE (LOSSES: SIGNIFICANT)`
  - `[OK] COPE_ENGINE: RUNNING`
  - `[READY] SYSTEM OPERATIONAL — PROCEED WITH CAUTION`
- **Progress bar:** Thin cyan line (`height: 2px`) that fills left-to-right with smooth CSS transition (`transition: width 0.05s linear`). No character-by-character rendering.
- **Dismiss:** Fade out + slight scale-down (0.98) over 400ms.

### Chat Window (`ChatWindow.tsx`) — "Comms Terminal"

- **Frame:** `bg-surface` panel with HUD corner brackets.
- **Title bar:** `COMMS://WOJAK_PROTOCOL` in JetBrains Mono, with cyan dot indicators (replacing the ● ● ● terminal dots).
- **Assistant label:** `◆ WOJAK.AI` (replacing `WOJAK://`).
- **User messages:** Right-aligned, `background: rgba(255,107,53,0.08)`, thin orange left border.
- **Assistant messages:** Left-aligned, thin 2px cyan left border on `bg-elevated`.
- **Input bar:** `bg-deep` with `border: 1px solid rgba(0,212,255,0.15)`, cyan focus ring. Placeholder: `"transmit message..."`. Font-size 16px preserved (iOS zoom prevention).
- **Send button:** Cyan primary button style.
- **Loading state:** Replace 3 bouncing dots with a thin cyan line that sweeps left-to-right (CSS animation, `@keyframes scan { 0% { left: 0; width: 0; } 50% { width: 30%; } 100% { left: 100%; width: 0; } }`, ~1.2s loop).

### Meme Studio (`MemeStudio.tsx`) — "Propaganda Generator"

- **Rebrand:** "MEME LAB" → "PROPAGANDA GENERATOR".
- **Header:** `PROP://GENERATOR` in JetBrains Mono.
- **Input:** Orange-accented border on focus. Placeholder: `"enter propaganda directive..."`.
- **Generate button:** Orange accent button: `FABRICATE`.
- **Canvas output:** Displayed in a "transmission received" HUD frame. Brief scan-line reveal animation on new meme (thin cyan line sweeps down over the image, 0.5s).
- **Watermark:** Keep `$AgentJak` but render in cyan instead of green.
- **Recent gallery:** 3-column grid, each meme in a mini `bg-surface` card with thin cyan border and timestamp in `text-muted`.

### Gallery (`Gallery.tsx`)

- **Header:** `ARCHIVE://TEMPLATES` in Orbitron.
- **Grid:** Same responsive columns (2/3/4). Each image in a `bg-surface` card with `border: 1px solid rgba(0,212,255,0.1)`.
- **Hover:** Subtle cyan glow (`box-shadow: 0 0 20px rgba(0,212,255,0.1)`) + `scale(1.02)`. No 3D rotateX/Y.
- **Lightbox:** Full overlay (`bg-deep` at 95% opacity) with HUD corner brackets around the image. `ESC TO CLOSE` label in JetBrains Mono, `text-muted`, top-right.
- **Skeleton loading:** Pulsing `bg-elevated` blocks (replacing green-900/20 pulse).

### Games Hub (`/games/page.tsx`)

- **Header:** `SIMULATION://GAMES` in Orbitron. Subtitle: `"risk assessment protocols"` in Rajdhani, `text-secondary`.
- **Game cards:** `bg-surface` with 2px left-border accent — different color per game:
  - Roulette: orange
  - Pump or Dump: cyan
  - Slots: `#8b5cf6` (violet, for variety)
- **Each card:** Game name in Orbitron (small), description in Rajdhani, "LAUNCH" cyan primary button.
- **Balance strip (top):** HUD data readout: `BALANCE: 1,000 $WOJAK | STATUS: READY` in JetBrains Mono.
- **Reset button:** Ghost button: `RESET BALANCE`.

### Rug Pull Roulette (`RugPullRoulette.tsx`)

- **Frame:** `SIMULATION://RUG_ROULETTE` header panel.
- **Wheel colors:** Recolor segments — cyan shades for good outcomes (Moon, Pump, Diamond), orange for mid (Cope), red shades for rug outcomes.
- **Bet controls:** HUD-style buttons with preset amounts (10, 50, 100, ALL IN). Cyan primary style.
- **Spin button:** Large cyan button: `EXECUTE SPIN`.
- **Result feedback:** Cyan pulse overlay on win (5x+), red pulse on rug. Same 4.2s spin duration.
- **Weighted RNG:** Unchanged (bad outcomes 3x more likely).

### Pump or Dump (`PumpOrDump.tsx`)

- **Frame:** `SIMULATION://MARKET_PREDICTION` header panel.
- **Chart candles:** Cyan for pump candles, orange for dump candles (replacing green/dark-green).
- **Guess buttons:** `PUMP` (cyan primary), `DUMP` (orange accent).
- **Streak display:** HUD data readout: `STREAK: 7 | ACCURACY: 70%` in JetBrains Mono.
- **Cost/payout logic:** Unchanged.

### Wojak Slots (`WojakSlots.tsx`)

- **Frame:** `SIMULATION://SLOT_MACHINE` header panel.
- **Reels:** Same emoji symbols, framed in `bg-surface` reel containers with thin cyan borders.
- **Spin button:** Large cyan button: `EXECUTE SPIN`.
- **Win display:** Payout number animates in with cyan glow text-shadow. Loss shows in `danger-red`.
- **Payout logic:** Unchanged.

### Game Shell (`GameShell.tsx`)

- **Balance display:** Redesigned as HUD strip: `BALANCE: X $WOJAK` with spring animation on value change (keep Framer Motion).
- **Layout:** Same wrapper structure, just restyled with `bg-deep` background and HUD panel framing.

### Wojak Reaction (`WojakReaction.tsx`)

- **Image:** Same Wojak template images, displayed in small HUD-bracketed frame.
- **Commentary:** JetBrains Mono, styled as system diagnostic: `◆ ANALYSIS: "this is fine" [COPE_LEVEL: CRITICAL]` in `text-secondary`.
- **Animation:** Keep spring fade-in from Framer Motion.

### RNG Oracle (`RandomGenerator.tsx`) — "Entropy Oracle"

- **Rebrand:** "RNG ORACLE" → "ENTROPY ORACLE".
- **Header:** `ORACLE://ENTROPY_GENERATOR`.
- **Payment display:** `COST: 0.1 SOL` in orange accent.
- **Payment flow:** Unchanged (Solana wallet → sign → confirm → verify).
- **Result reveal:** Number appears with a "decryption" effect — all digits scramble simultaneously through random characters (0-9, A-F) for 8 iterations at 50ms intervals (400ms total), then settle to the real number left-to-right over 3 more iterations. Cyan colored. Total animation: ~550ms.

### Roadmap (`Roadmap.tsx`)

- **Header:** `PROTOCOL://ROADMAP` in Orbitron.
- **Timeline:** Vertical thin cyan connecting line (1px).
- **Phase cards:** `bg-surface` panels with status badges:
  - `DEPLOYED` — cyan badge, solid
  - `IN PROGRESS` — orange badge with subtle pulse animation
  - `LOCKED` — ghost badge, muted
- **Progress bar:** Thin cyan fill on `bg-elevated` track. `25%` label in JetBrains Mono.
- **Phase content:** Same checklist items, restyled with Rajdhani body text and cyan checkmarks.
- **CTA buttons:** "Buy $AgentJak" (orange accent), "Join Community" (cyan primary).

### About / Token Info (`AboutStats.tsx`)

- **Header:** `DATA://TOKEN_INFO` in Orbitron.
- **Stats:** Data readout panel style — key-value pairs with 2px orange left border. Keys in `text-muted` uppercase, values in `text-primary`.
- **Links:** HUD buttons: `[PUMP.FUN]`, `[SOLSCAN]`, `[X/TWITTER]` — cyan primary style.
- **Contract address:** JetBrains Mono, cyan, with a ghost-style copy button beside it.
- **Disclaimer:** `text-muted`, Rajdhani, smaller font.

### Ticker (`Ticker.tsx`)

- **Band:** `bg-surface` strip.
- **Text:** JetBrains Mono, `text-muted` cyan tint (`rgba(0,212,255,0.4)`).
- **Separators:** `◆` diamond character instead of bullets.
- **Animation:** Same 20s infinite scroll.

### Page Transitions (`PageTransition.tsx`)

- **Replace** fade + scale-up with "HUD power-on": a thin horizontal cyan line expands from center outward (`scaleX(0) → scaleX(1)`), then content fades in below it. Total duration: ~0.4s.

### Scroll Reveal (`ScrollReveal.tsx`)

- **Keep** Intersection Observer approach.
- **Change animation:** Opacity 0→1 with subtle upward drift (8px, not 20px). Duration: 300ms (down from 500ms). Feels snappier, like data loading in.

---

## Global CSS Changes (`globals.css`)

### Scrollbar Styling

Replace current green scrollbar with new theme:

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #06080f; }
::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.4); }
```

### Section Dividers

All horizontal dividers (currently `h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent`) become:

`h-px bg-gradient-to-r from-transparent via-cyan-primary/30 to-transparent`

Used on home page and between sections on other pages.

### Accessibility Note

- `#00d4ff` on `#06080f` has ~8.5:1 contrast ratio (passes WCAG AAA).
- `text-muted` (`rgba(255,255,255,0.25)`) has ~2.5:1 contrast — acceptable ONLY for decorative elements (timestamps, status readouts, separator labels). Any informational text must use `text-secondary` minimum.

### Remove
- All CRT-related animations (`crt-flicker`, scanline overlay, vignette)
- Matrix green CSS variables (`--matrix-green`)
- `.glow` class (green text-shadow)
- `.border-glow` class (green box-shadow)
- Green-based color scheme throughout

### Add
- CSS variables for the new palette (all tokens from design system table)
- `.hud-frame` — corner bracket utility class
- `.hud-glow` — cyan glow border utility
- `.hud-scanline` — gradient top/bottom line effect
- `.data-readout` — left-border panel with monospace key-value styling
- `@keyframes scan` — sweeping cyan line (for chat loading, meme reveal)
- `@keyframes hud-power-on` — horizontal line expand for page transitions
- `@keyframes pulse-dot` — status indicator pulse (cyan version)
- Font imports for Orbitron, Rajdhani, JetBrains Mono

### Tailwind Config
- Extend `colors` with all new palette tokens
- Extend `fontFamily` with `display: ['Orbitron']`, `body: ['Rajdhani']`, `mono: ['JetBrains Mono']`
- Update any hardcoded green references

---

## Layout (`layout.tsx`)

- Remove `MatrixRain` component import and rendering
- Remove CRT overlay div
- Update `<body>` class to use `bg-deep` and `font-body` (Rajdhani)
- Keep `BootSequence` (restyled) and `WalletProvider`
- **Font loading:** Use `next/font/google` (consistent with current approach using `Share_Tech_Mono`). Specific imports:
  - `Orbitron` — weights: `400, 700, 900`. CSS variable: `--font-display`.
  - `Rajdhani` — weights: `400, 500, 600, 700`. CSS variable: `--font-body`.
  - `JetBrains_Mono` — weights: `400, 500, 700`. CSS variable: `--font-mono`.
- Apply font CSS variables to `<body>` className, reference in Tailwind config `fontFamily` extension.

---

## Mobile Considerations

- HUD corner brackets: reduce to 12px on mobile (from 20px on desktop)
- Navbar status readout: hidden on mobile (`hidden md:flex`)
- All font sizes scale down appropriately with existing Tailwind responsive classes
- Background radial gradients: reduce opacity further on mobile for performance
- No canvas-based background effects (Matrix rain already removed)
- Keep `font-size: 16px` on all inputs (iOS zoom prevention)

---

## Files Affected

| File | Change Type |
|------|-------------|
| `globals.css` | Major rewrite — new variables, animations, remove CRT/matrix |
| `tailwind.config.ts` | Extend colors, fonts |
| `layout.tsx` | Remove MatrixRain, update body classes, add fonts |
| `Navbar.tsx` | Full restyle + status readout |
| `HeroSection.tsx` | Full restyle + new taglines + HUD status bar |
| `BootSequence.tsx` | Rewrite lines, new progress bar, remove CRT effects |
| `ChatWindow.tsx` | Full restyle as comms terminal |
| `MemeStudio.tsx` | Rebrand + restyle |
| `Gallery.tsx` | Restyle grid + lightbox |
| `games/page.tsx` | Restyle hub + game cards |
| `RugPullRoulette.tsx` | Recolor wheel + restyle controls |
| `PumpOrDump.tsx` | Recolor candles + restyle |
| `WojakSlots.tsx` | Restyle frame + controls |
| `GameShell.tsx` | Restyle wrapper + balance display |
| `GameCard.tsx` | Restyle cards |
| `BalanceDisplay.tsx` | HUD data readout style |
| `WojakReaction.tsx` | Restyle as system diagnostic |
| `GamesBalanceReset.tsx` | Ghost button style |
| `RandomGenerator.tsx` | Rebrand + restyle + decryption effect |
| `Roadmap.tsx` | Full restyle with timeline |
| `AboutStats.tsx` | Restyle as data readout |
| `Ticker.tsx` | Restyle band + separators |
| `PageTransition.tsx` | New HUD power-on animation |
| `ScrollReveal.tsx` | Faster, subtler animation |
| `MatrixRain.tsx` | DELETE |
| `src/app/page.tsx` (home) | Replace `glow`, `border-glow`, green classes, `[BRACKET]` button text, dividers |
| `src/app/meme/page.tsx` | Replace `glow` class, green text classes |
| `src/app/gallery/page.tsx` | Replace `glow glitch`, green text classes, dividers |
| `src/app/random/page.tsx` | Replace `glow` class, green text classes |
| `src/app/about/page.tsx` | Heavy restyle — remove `border-glow`, `glow glitch`, green classes, CRT overlay on image, bracket notation |
| `src/app/roadmap/page.tsx` | Thin wrapper — verify no inline green styles |
| `src/app/games/roulette/page.tsx` | Thin wrapper — verify no inline green styles |
| `src/app/games/slots/page.tsx` | Thin wrapper — verify no inline green styles |
| `src/app/games/pump-or-dump/page.tsx` | Thin wrapper — verify no inline green styles |
| `src/lib/market-data.ts` | No changes — untracked new file, unrelated to visual makeover |
| `WalletProvider.tsx` | Minor — update wallet modal styling if needed |
