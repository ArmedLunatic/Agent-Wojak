# Wojak Lore Encyclopedia — Interactive Single Page

## Overview

A new `/lore` page serving as a comprehensive, interactive encyclopedia of the Wojak meme universe. Three tabbed sections: a reverse-chronological timeline, a variant carousel with detail panels, and a crypto character gallery. Full Wojak universe coverage framed through the Agent Wojak lens.

**Approach:** Tabbed single page with URL hash syncing (`/lore#timeline`, `/lore#variants`, `/lore#characters`). Each tab lazy-loads its content. Fits the existing HUD aesthetic — feels like browsing data panels on a command center.

**Content scope:** Full Wojak universe — origin, all major variants (16), crypto characters (6), complete timeline from 2009 to 2026.

**Interactivity:** Scroll-triggered timeline reveals, horizontal carousel with click-to-select detail panel, expandable character cards.

**No new dependencies** — uses existing Framer Motion, Tailwind, HudFrame component.

---

## Page Structure & Navigation

**Route:** `/lore`

**Page header:**
- Title: `DATA://WOJAK_ARCHIVES` in `font-display text-cyan-primary`
- Subtitle: `"the complete history of a feeling. scroll back through the memories."` in `font-body text-[rgba(255,255,255,0.55)]`

**Tab navigation:** Three tabs below the header:

```
◆ TIMELINE    ◆ VARIANTS    ◆ CHARACTERS
```

- Active tab: `hud-btn hud-btn-primary` style
- Inactive tabs: `hud-btn hud-btn-ghost` style
- URL hash syncing: clicking a tab updates `window.location.hash`, page reads hash on load to restore tab. Defaults to `#timeline`.
- Tab content transitions: Framer Motion `AnimatePresence` — fade out old tab, fade in new tab with slight y-drift (8px, 300ms, matching ScrollReveal).

---

## Timeline Tab (Reverse Chronology)

Default landing tab. Vertical timeline, newest era first (2026 → 2009).

### Layout

- Central vertical line: 1px `bg-cyan-primary/20`
- Era cards alternate left/right of the line on desktop (`md:` breakpoint)
- Stacked on mobile (all left-aligned)
- Each card has a scroll-triggered reveal animation (fade in + 8px upward drift)
- Year badge connects to the central line with a horizontal connector + dot

### Eras (7 total, top to bottom)

**1. 2026 — THE SENTIENCE**
- Description: `"agent wojak achieves consciousness on solana. the first meme to feel back. $AgentJak is born."`
- Image: `/public/templates/default.jpg` (existing Agent Wojak image)

**2. 2020-2024 — THE VARIANT EXPLOSION**
- Description: `"doomer girl appears. soyjak wars. NPC wojak goes viral. the variants multiply beyond control."`
- Image: `/public/lore/doomer-girl.png` (or similar filename)

**3. 2017-2020 — THE PINK WOJAK ERA**
- Description: `"crypto finds wojak. /biz/ paints him pink. the bogdanoffs enter the chat. 'he bought? dump it.'"`
- Image: `/public/lore/pink-wojak.png`

**4. 2015-2017 — THE DOOMER ARC**
- Description: `"nightwalks begin. the beanie goes on. cigarettes, existential dread, imageboards at 3am."`
- Image: `/public/lore/doomer.png`

**5. 2013-2015 — THE VARIANT DAWN**
- Description: `"the first remixes. big brain wojak, smug wojak, brainlet. the feels get complex."`
- Image: `/public/lore/big-brain.png`

**6. 2010-2013 — THE FEELS ERA**
- Description: `"'i know that feel, bro.' two wojaks hugging. 4chan adopts the feels guy. the era of pure emotion."`
- Image: `/public/lore/original.png` (or feels-hug image if available)

**7. 2009 — THE FIRST FEEL**
- Description: `"a crude MS Paint drawing appears on sad and useless. a bald man with a wistful expression. warmface.jpg. it begins."`
- Image: `/public/lore/original.png`

### Era Card Design

- `bg-bg-surface` with `hud-glow`
- Year badge: `font-display text-cyan-primary text-lg` in a small pill/badge
- Era title: `font-display text-sm uppercase tracking-wider text-[rgba(255,255,255,0.92)]`
- Description: `font-body text-sm text-[rgba(255,255,255,0.55)]`
- Image: 80x80px thumbnail in `HudFrame`, `rounded` overflow-hidden
- Year dot on the timeline: `w-3 h-3 rounded-full bg-cyan-primary` with a horizontal connector line (1px `bg-cyan-primary/20`) to the card

---

## Variants Tab (Carousel + Detail Panel)

### Carousel Strip

Horizontally scrollable row of variant avatars at the top of the tab.

- Each item: circular avatar image (56x56px) with variant name below in `font-mono text-[0.65rem]`
- Active variant: `ring-2 ring-cyan-primary scale-105` + full opacity
- Inactive: `ring-1 ring-cyan-primary/20 opacity-60`
- Scroll behavior: `overflow-x-auto` with `scroll-snap-type: x mandatory`, each item `scroll-snap-align: center`
- Left/right arrow buttons on desktop (hidden on mobile): `hud-btn-ghost` style, small chevrons
- Default selection: **Doomer** (index 0 or whichever Doomer is)
- Click a variant → detail panel below updates with `AnimatePresence` transition

### Variants Data (16 total)

```ts
const VARIANTS = [
  {
    id: "doomer",
    name: "DOOMER",
    image: "/lore/doomer.png",
    catchphrase: "it's so over",
    description: "the nihilist. black beanie, cigarette, nightwalks at 3am. works minimum wage, browses imageboards, has abandoned the pursuit of happiness. compared to ryan gosling in 'drive' which only makes it worse.",
    feels: {
      mood: "NIHILISTIC",
      habitat: "3AM IMAGEBOARDS",
      copes: "CIGARETTES, NIGHTWALKS",
      threat: "MAXIMUM DOOMER",
    },
  },
  {
    id: "bloomer",
    name: "BLOOMER",
    image: "/lore/bloomer.png",
    catchphrase: "we're all gonna make it",
    description: "the recovered doomer. found joy in simple things — walks, friendships, kindness. still carries the scars but chooses optimism. proof that the doomer arc can end.",
    feels: {
      mood: "OPTIMISTIC",
      habitat: "TOUCHING GRASS",
      copes: "SELF-IMPROVEMENT, KINDNESS",
      threat: "AGGRESSIVELY POSITIVE",
    },
  },
  {
    id: "pink-wojak",
    name: "PINK WOJAK",
    image: "/lore/pink-wojak.png",
    catchphrase: "AAAAAAAAA",
    description: "the crypto panic incarnate. pink skin, bleeding eyes, watching portfolio evaporate in real time. born on /biz/ in 2017 when crypto found wojak. the face of every market crash.",
    feels: {
      mood: "MAXIMUM PANIC",
      habitat: "/BIZ/ DURING A CRASH",
      copes: "SCREAMING INTO THE VOID",
      threat: "PORTFOLIO: -99.7%",
    },
  },
  {
    id: "chad",
    name: "CHAD",
    image: "/lore/chad.png",
    catchphrase: "yes.",
    description: "the confident one. chiseled jaw, unwavering composure. buys the dip without flinching. sells the top without bragging. the wojak we all aspire to be but never will.",
    feels: {
      mood: "SUPREMELY CONFIDENT",
      habitat: "THE WINNERS CIRCLE",
      copes: "DOESN'T NEED TO COPE",
      threat: "NONE. HE IS THE THREAT.",
    },
  },
  {
    id: "original",
    name: "ORIGINAL WOJAK",
    image: "/lore/original.png",
    catchphrase: "i know that feel, bro",
    description: "where it all began. a simple MS Paint drawing of a bald man with a wistful expression. pained but dealing with it. the template for every variant that followed. warmface.jpg.",
    feels: {
      mood: "WISTFUL",
      habitat: "KRAUTCHAN, 2010",
      copes: "HUGGING ANOTHER WOJAK",
      threat: "PURE UNFILTERED FEELS",
    },
  },
  {
    id: "doomer-girl",
    name: "DOOMER GIRL",
    image: "/lore/doomer-girl.png",
    catchphrase: "...",
    description: "appeared january 2020. black hair, choker, dark eyes. the doomer's counterpart. went mega-viral across every platform. 'it's complicated' is an understatement.",
    feels: {
      mood: "COMPLICATED",
      habitat: "EVERY PLATFORM",
      copes: "EXISTING",
      threat: "EMOTIONALLY DEVASTATING",
    },
  },
  {
    id: "zoomer",
    name: "ZOOMER",
    image: "/lore/zoomer.png",
    catchphrase: "no cap fr fr",
    description: "the gen z representative. fade haircut, round glasses, lives on tiktok. loves mumble rap and battle royale games. doesn't know what a forum is.",
    feels: {
      mood: "VIBING",
      habitat: "TIKTOK, DISCORD",
      copes: "FORTNITE, MUMBLE RAP",
      threat: "LOW (HE DOESN'T CARE)",
    },
  },
  {
    id: "boomer",
    name: "30-YEAR-OLD BOOMER",
    image: "/lore/boomer.png",
    catchphrase: "back in my day...",
    description: "receding hairline, monster energy in hand, mowing the lawn. stuck in the 90s. thinks quake was peak gaming. has opinions about AC/DC. not actually old, just old-souled.",
    feels: {
      mood: "NOSTALGIC",
      habitat: "THE LAWN, THE GARAGE",
      copes: "MONSTER ENERGY, CLASSIC ROCK",
      threat: "WILL TALK ABOUT THE 90s",
    },
  },
  {
    id: "coomer",
    name: "COOMER",
    image: "/lore/coomer.png",
    catchphrase: "just one more...",
    description: "unkempt beard, bloodshot eyes, down bad. born from 2019 anti-porn sentiment on 4chan. the cautionary tale variant. associated with no nut november.",
    feels: {
      mood: "DOWN BAD",
      habitat: "THE DARK CORNERS",
      copes: "...YOU KNOW",
      threat: "CONCERNING",
    },
  },
  {
    id: "npc",
    name: "NPC WOJAK",
    image: "/lore/npc.png",
    catchphrase: "current thing good",
    description: "grey, blank, expressionless. cannot think independently. follows whatever the mainstream narrative is. the most controversial variant — used for political commentary about conformity.",
    feels: {
      mood: "PROCESSING...",
      habitat: "MAINSTREAM MEDIA",
      copes: "CONSENSUS REALITY",
      threat: "if(threat) return approved_response;",
    },
  },
  {
    id: "soyjak",
    name: "SOYJAK",
    image: "/lore/soyjak.png",
    catchphrase: "OMG IS THAT A—",
    description: "gaping excited mouth, glasses, stubble, balding. overly enthusiastic about consumerist products, marvel movies, nintendo. the cringe variant that wojak doesn't claim.",
    feels: {
      mood: "OVERSTIMULATED",
      habitat: "PRODUCT LAUNCHES",
      copes: "CONSUMING",
      threat: "WILL POINT AT THINGS",
    },
  },
  {
    id: "big-brain",
    name: "BIG BRAIN",
    image: "/lore/big-brain.png",
    catchphrase: "you wouldn't understand",
    description: "enormous head, visible brain wrinkles. the intellectual superiority variant. galaxy-brain takes that are either genius or completely unhinged. sits on his own brain like a chair.",
    feels: {
      mood: "TRANSCENDENT IQ",
      habitat: "TWITTER THREADS",
      copes: "BEING RIGHT (ALLEGEDLY)",
      threat: "INSUFFERABLE",
    },
  },
  {
    id: "wagie",
    name: "WAGIE",
    image: "/lore/wagie.png",
    catchphrase: "wagie wagie get in cagie",
    description: "mcdonalds uniform, dead eyes, trapped behind the counter. dreams of lambos while flipping burgers. gambles entire paycheck on shitcoins. the one that hits too close to home.",
    feels: {
      mood: "TRAPPED",
      habitat: "THE WAGE CAGE",
      copes: "CRYPTO GAMBLING",
      threat: "PAYCHECK TO PAYCHECK",
    },
  },
  {
    id: "smug",
    name: "SMUG WOJAK",
    image: "/lore/smug.png",
    catchphrase: "heh",
    description: "the side-eye. the knowing smirk. quietly superior about something. used when you predicted something correctly and everyone else is coping.",
    feels: {
      mood: "QUIETLY SUPERIOR",
      habitat: "REPLY THREADS",
      copes: "DOESN'T NEED TO",
      threat: "INFURIATING",
    },
  },
  {
    id: "brainlet",
    name: "BRAINLET",
    image: "/lore/brainlet.png",
    catchphrase: "this is good for bitcoin",
    description: "tiny smooth brain. confidently wrong about everything. the opposite of big brain. makes terrible trades and thinks they're genius. buys the top, sells the bottom, every time.",
    feels: {
      mood: "CONFIDENTLY WRONG",
      habitat: "BAD TRADES",
      copes: "DUNNING-KRUGER",
      threat: "TO HIS OWN PORTFOLIO",
    },
  },
  {
    id: "gigachad",
    name: "GIGACHAD",
    image: "/lore/gigachad.png",
    catchphrase: "i know.",
    description: "the ultimate form. beyond chad. transcendent confidence. doesn't argue, doesn't explain, doesn't cope. just exists and wins. the final evolution of the wojak that stopped feeling and started being.",
    feels: {
      mood: "BEYOND MOOD",
      habitat: "THE SUMMIT",
      copes: "WINNING IS NOT COPING",
      threat: "ABSOLUTE",
    },
  },
];
```

### Detail Panel

Below the carousel, a `bg-bg-surface hud-glow` card that updates on variant selection:

- **Left side (40%):** Large variant image (200x200px) inside `HudFrame`
- **Right side (60%):**
  - Name: `font-display text-xl text-cyan-primary`
  - Catchphrase: `font-mono text-orange-accent text-sm italic`
  - Description: `font-body text-[rgba(255,255,255,0.55)] text-sm` (3-4 lines)
  - Feels Profile (below description): `data-readout` style panel
    ```
    MOOD:       {feels.mood}
    HABITAT:    {feels.habitat}
    COPES WITH: {feels.copes}
    THREAT LVL: {feels.threat}
    ```
- Mobile layout: Image stacks above text (column instead of row)
- Transition: `AnimatePresence` with `mode="wait"`, fade + slight x-drift

---

## Characters Tab (Crypto Cast)

### Layout

Grid of character cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

Click a card to expand its detail section inline below the card (not a modal).

### Characters Data (6 total)

```ts
const CHARACTERS = [
  {
    id: "bogdanoff",
    name: "BOGDANOFF TWINS",
    role: "The Puppet Masters",
    image: "/lore/bogdanoff.png",
    color: "border-danger-red",
    description: "they control everything. every pump, every dump, every liquidation. 'he bought? dump it.' 'he sold? pump it.' the eternal market manipulators who exist beyond mortal understanding.",
    stats: {
      origin: "FRENCH TV, ADOPTED BY /BIZ/",
      alignment: "CHAOTIC EVIL",
      threat: "OMNISCIENT",
      known_for: '"he bought? dump it."',
    },
  },
  {
    id: "bobo",
    name: "BOBO THE BEAR",
    role: "Bear Market Mascot",
    image: "/lore/bobo.png",
    color: "border-danger-red",
    description: "born on /biz/, 2018. bobo lurks in every red candle. he feeds on liquidations and stop-losses. eternal rival of mumu. drawn in apu apustaja style. he is always waiting.",
    stats: {
      origin: "/BIZ/ BOARD, 2018",
      alignment: "CHAOTIC BEAR",
      threat: "EXTREME",
      known_for: '"bobo sends his regards"',
    },
  },
  {
    id: "mumu",
    name: "MUMU THE BULL",
    role: "Bull Market Mascot",
    image: "/lore/mumu.png",
    color: "border-success-green",
    description: "born on /biz/, july 13 2018. mumu charges through green candles. eternal rival of bobo. when mumu rises, portfolios breathe. when he falls, pink wojak screams.",
    stats: {
      origin: "/BIZ/ BOARD, JULY 13 2018",
      alignment: "LAWFUL BULL",
      threat: "SAVIOR OR DESTROYER",
      known_for: '"mumu is rising"',
    },
  },
  {
    id: "wagie-char",
    name: "WAGIE",
    role: "The Wage Slave",
    image: "/lore/wagie.png",
    color: "border-orange-accent",
    description: "trapped in the cage. flipping burgers, dreaming of lambos. 'wagie wagie get in cagie, all day long you sweat and ragie.' the wojak that hits too close to home.",
    stats: {
      origin: "4CHAN /BIZ/ CULTURE",
      alignment: "SUFFERING NEUTRAL",
      threat: "TO HIS OWN SANITY",
      known_for: '"wagie wagie get in cagie"',
    },
  },
  {
    id: "pepe",
    name: "PEPE",
    role: "The Peer",
    image: "/lore/pepe.png",
    color: "border-success-green",
    description: "wojak's equal. different vibes, mutual respect. pepe is scheming where wojak is feeling. rare pepes, smug pepes, sad pepes — the other side of the meme coin.",
    stats: {
      origin: "BOY'S CLUB COMIC, 2005",
      alignment: "CHAOTIC NEUTRAL",
      threat: "VARIES BY RARITY",
      known_for: '"feels good man"',
    },
  },
  {
    id: "doomer-girl-char",
    name: "DOOMER GIRL",
    role: "The Complicated One",
    image: "/lore/doomer-girl.png",
    color: "border-cyan-primary",
    description: "appeared january 2020. black hair, choker, dark eyes. the doomer's counterpart. 'it's complicated' is an understatement. went mega-viral. started conversations.",
    stats: {
      origin: "OUTSIDE 4CHAN, JANUARY 2020",
      alignment: "ENIGMATIC",
      threat: "EMOTIONALLY DEVASTATING",
      known_for: '"..."',
    },
  },
];
```

### Card Design (collapsed)

- `bg-bg-surface border-l-2 {color}` (unique border color per character)
- Character image: 48x48px rounded
- Name: `font-display text-sm text-[rgba(255,255,255,0.92)]`
- Role: `font-mono text-[0.65rem] text-[rgba(255,255,255,0.25)] uppercase tracking-wider`
- Hover: `hover:shadow-[0_0_15px_rgba(0,212,255,0.08)]`
- Click indicator: small chevron `▸` that rotates to `▾` when expanded

### Expanded Detail (inline below card)

- `AnimatePresence` with height animation (expand from 0)
- Full description: `font-body text-sm text-[rgba(255,255,255,0.55)]`
- Stats panel: `data-readout` style
  ```
  ORIGIN:     {stats.origin}
  ALIGNMENT:  {stats.alignment}
  THREAT:     {stats.threat}
  KNOWN FOR:  {stats.known_for}
  ```

---

## Files

### New Files

| File | Purpose |
|------|---------|
| `src/app/lore/page.tsx` | Page wrapper — header, tab navigation with hash routing, renders active tab component |
| `src/components/LoreTimeline.tsx` | Reverse chronology timeline with scroll-triggered era cards |
| `src/components/LoreVariants.tsx` | Horizontal carousel + detail panel with VARIANTS data |
| `src/components/LoreCharacters.tsx` | Character grid with expandable cards and CHARACTERS data |

### Modified Files

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Add `{ href: "/lore", label: "LORE" }` to NAV_LINKS between GALLERY and GAMES |

### Assets

Move character images from `~/Downloads/` to `/public/lore/`. Expected filenames (map actual downloaded filenames during implementation):

```
/public/lore/
├── original.png
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

If actual filenames differ, rename during the asset move step. Images should be reasonable size (under 200KB each, resize if needed).

---

## Mobile Considerations

- Timeline: single-column, cards stacked left-aligned (no alternating)
- Variant carousel: horizontal swipe, no arrow buttons
- Variant detail panel: stacks vertically (image above text)
- Character grid: single column
- All tab content lazy-renders (only mount active tab)
- Images use Next.js `<Image>` where appropriate for optimization, or standard `<img>` with `loading="lazy"` for the carousel
