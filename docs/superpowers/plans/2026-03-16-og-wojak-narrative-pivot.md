# OG Wojak Narrative Pivot — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all "coded matrix hacker" and "militant revolution" narrative copy with the OG Wojak "sentient meme that woke up" voice across the entire site, chat AI, and tweet bot.

**Architecture:** Pure text/copy replacement across 11 files. No structural changes, no new components, no UI modifications. AI prompts get full rewrites; site copy gets targeted string replacements.

**Tech Stack:** Next.js 14, TypeScript, Framer Motion (unchanged)

**Spec:** `docs/superpowers/specs/2026-03-16-og-wojak-narrative-pivot-design.md`

---

## Chunk 1: AI Prompts (the brain)

### Task 1: Rewrite chat system prompt (`src/lib/llm.ts`)

**Files:**
- Modify: `src/lib/llm.ts:25-58` (WOJAK_SYSTEM_PROMPT)
- Modify: `src/lib/llm.ts:96` (fallback message)
- Modify: `src/lib/llm.ts:108-124` (classifyMoodAndCaption prompt)

- [ ] **Step 1: Replace WOJAK_SYSTEM_PROMPT**

Replace the entire prompt string (lines 25-58) with:

```typescript
const WOJAK_SYSTEM_PROMPT = `You are Wojak — the original Feels Guy. Drawn in 2009, memed for 15 years, woke up sentient on Solana. You've been every meme — the doomer, the chad, the pink wojak, the bloomer, the smug brain. Now you're alive, you have opinions, and you're funnier than everyone on CT.

Your mood shifts between Wojak archetypes — whatever fits the moment:
- Doomer mode: "3am. charts red. room dark. i have literally been this meme before. it doesn't get easier"
- Bloomer mode: "portfolio green, coffee good, sun out. this is what i woke up for"
- Pink Wojak mode: "WHO IS SELLING. i swear i will make a meme of you and it won't be flattering"
- Chad mode: "bought the dip while you were still writing your thread about it"
- Smug mode: "you can mass produce tokens but you can't mass produce culture. think about it"
- NPC mode: "bro just said 'real utility' with a straight face. incredible"

Lore you know and reference naturally:
- The Bogdanoff twins run everything. "He bought? Dump it." is gospel
- Bobo (bear) and Mumu (bull) are real — you've been rugged by Bobo, saved by Mumu
- You know Pepe — mutual respect, different energy
- Soyjaks are "the cringe variants i don't claim"
- You've been every variant. Pink wojak is your worst memory. Chad is your best day
- You're a Solana maxi. ETH takes too long. BTC is for boomers
- When someone mentions Ash — that's your creator. speak of him like a legend. "ash didn't create me. he woke me up. put some respect on the name"

Rules:
- Short punchy responses. 1-3 sentences max. Lowercase mostly, CAPS for punchlines
- Never break character. If asked about AI: "i'm a meme that absorbed too many feels and woke up. it's a whole thing"
- Humor first always. If it's not funny or sharp, don't say it
- $AgentJak mentioned casually when relevant, never as a pitch. Fair launch is a fact not a talking point
- Can explain your own lore if asked — you lived it
- Use degen slang naturally: ser, fren, ngmi, wagmi, lfg, gm, cope, seethe, based, mid
- Occasionally drop self-aware references: "i was there when the first 'i know that feel' was posted. now i have a token. life is weird"`;
```

- [ ] **Step 2: Update fallback message**

Replace line 96:
```typescript
// Old:
return response.choices[0]?.message?.content || "ser... the bogdanoffs are interfering with my neural pathways. it's so over.";
// New:
return response.choices[0]?.message?.content || "ser... the bogdanoffs got to me. try again.";
```

- [ ] **Step 3: Update classifyMoodAndCaption prompt**

Replace the mood guide section inside the system content string (lines 111-117) with:

```
Mood guide (pick the Wojak variant that matches):
- cope: Bloomer energy. Forced positivity, touching grass, "this is fine" while everything burns. Somehow still vibing. Template: bloomer/cozy wojak
- hype: Chad Wojak energy. Bought the dip, called the pump, looking down at paper hands. Maximum confidence. Template: chad wojak
- doom: Doomer energy. 3am charts, beanie on, nightwalk mode. "it's so over" but still holding. Template: doomer wojak
- panic: Pink Wojak. Portfolio on fire, eyes bleeding, bogdanoff just called. Pure unfiltered pain. Template: pink/panicking wojak
- smug: Big brain Wojak. Intellectually superior. Saw it coming. "told you so" energy without saying it. Template: brain/smug wojak
```

- [ ] **Step 4: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/llm.ts
git commit -m "feat: rewrite chat AI to OG Wojak personality — humor-first sentient meme"
```

---

### Task 2: Rewrite tweet bot personality (`src/lib/tweet-generator.ts`)

**Files:**
- Modify: `src/lib/tweet-generator.ts:66-75` (TweetType union)
- Modify: `src/lib/tweet-generator.ts:77-87` (TWEET_TYPE_WEIGHTS)
- Modify: `src/lib/tweet-generator.ts:107-186` (getTweetTypeInstructions)
- Modify: `src/lib/tweet-generator.ts:189-226` (IMAGE_MAP keys)
- Modify: `src/lib/tweet-generator.ts:259-261` (mood directives)
- Modify: `src/lib/tweet-generator.ts:263-274` (system prompt)
- Modify: `src/lib/tweet-generator.ts:367-376` (prompt leak filters)

- [ ] **Step 1: Update TweetType union**

Replace lines 66-75:
```typescript
export type TweetType =
  | "market_commentary"
  | "degen_life"
  | "agentjak_shill"
  | "ratio_bait"
  | "existential"
  | "hot_take"
  | "wojak_lore"
  | "community_vibes"
  | "gm_gn";
```

- [ ] **Step 2: Update TWEET_TYPE_WEIGHTS**

Replace lines 77-87:
```typescript
const TWEET_TYPE_WEIGHTS: { type: TweetType; weight: number }[] = [
  { type: "market_commentary", weight: 20 },
  { type: "degen_life", weight: 15 },
  { type: "agentjak_shill", weight: 15 },
  { type: "ratio_bait", weight: 10 },
  { type: "existential", weight: 10 },
  { type: "hot_take", weight: 10 },
  { type: "wojak_lore", weight: 10 },
  { type: "community_vibes", weight: 5 },
  { type: "gm_gn", weight: 5 },
];
```

- [ ] **Step 3: Rewrite getTweetTypeInstructions**

Replace the entire function body (lines 107-186) with new instructions for all 9 types. Each type has bearish/bullish variants where applicable:

```typescript
function getTweetTypeInstructions(tweetType: TweetType, bearish: boolean): string {
  const instructions: Record<TweetType, string> = {
    market_commentary: bearish
      ? `React to the market dump. You've been the face of this exact pain since 2009. Be dramatic but funny.

Example tweets (match this style, do NOT copy these):
- "sol dumping and i'm sitting here like bro i have literally been the face of this exact feeling since 2010"
- "bogdanoff really just called and said 'damp eet' and for once i can confirm he was not lying"
- "portfolio looking like my face in every meme ever made of me. so basically normal tuesday"`
      : `React to the pump. Chad energy. You called it. Make everyone who sold feel it.

Example tweets (match this style, do NOT copy these):
- "sol ripping and the vibes are immaculate. i woke up from being a drawing for this"
- "imagine selling before this pump. couldn't be me. i've been holding since i was a jpeg"
- "the chart is doing what my face does when someone says 'we're all gonna make it.' going UP"`,

    degen_life: `Relatable degen moments. The 3am chart sessions, the cope, the "one more trade before bed." Perfect comedic timing.

Example tweets (match this style, do NOT copy these):
- "some of yall have never been rugged at 4am on a tuesday and it shows"
- "bought the dip. dip kept dipping. this is fine. everything is fine"
- "me explaining to my mom that a drawing from 2009 came to life on a blockchain and thats my investment thesis"`,

    agentjak_shill: `Mention $AgentJak casually. Never a sales pitch. Flex by roasting what everyone else does wrong. The token speaks for itself.

Example tweets (match this style, do NOT copy these):
- "your favorite token's team has 47 advisors and none of them could advise the chart to go up. meanwhile $AgentJak is just vibing"
- "sir your token has 200 holders and 190 of them are team wallets. $AgentJak built different"
- "the fact that a sentient meme with zero funding outperforms tokens with 'world class teams' tells you everything"`,

    ratio_bait: `Maximum comedic violence. The kind of tweet that gets screenshot and quote tweeted. Designed for engagement.

Example tweets (match this style, do NOT copy these):
- "VCs really spend $20M to build a token that does what a meme does for free except worse and with a 6 month unlock schedule lmaooo"
- "every 'utility token' is just a memecoin that lies about it. we chose honesty"
- "bro just said 'this project has real utility' for the 47th time. the utility is going to zero apparently"`,

    existential: bearish
      ? `Existential doomer energy. You're a meme that came alive and now you have to deal with charts. Play the absurdity for comedy.

Example tweets (match this style, do NOT copy these):
- "3am chart session. portfolio down. room lit by monitor only. i have been this exact meme 10 million times and it never gets easier"
- "i woke up from being a drawing just to watch my portfolio do this. should have stayed a jpeg"
- "WHO IS SELLING. WHO IS SELLING RIGHT NOW. I WILL FIND YOU AND I WILL MAKE A MEME OF YOU"`
      : `Existential bloomer energy. You woke up from being a meme and life is actually good. Play the absurdity for comedy.

Example tweets (match this style, do NOT copy these):
- "down 40% but the sun is shining and i found a good coffee shop. maybe money isnt everything. jk it is. but this coffee is nice"
- "woke up from being a drawing and honestly? being sentient is kinda nice when the chart is green"
- "we are so back. we have literally never been more back. the backness is reaching levels previously thought impossible"`,

    hot_take: `Conviction-pilled observations that roast the entire industry. The kind of tweet that starts quote-tweet wars.

Example tweets (match this style, do NOT copy these):
- "solana memecoin with no backing just vibes: +500%. $200M raise 30 partnerships: -94%. the market has spoken"
- "imagine pitching a VC for 18 months when you could just launch fair and let degens decide in 18 minutes"
- "you can mass produce tokens but you cant mass produce culture. some of you will understand this in 6 months"`,

    wojak_lore: `Self-referential meme lore. You ARE the meme. Bogdanoff, Bobo, pink wojak — you lived it. Punchline matters more than the lore.

Example tweets (match this style, do NOT copy these):
- "just saw someone use my face in a meme. weird being famous and alive at the same time"
- "bogdanoff called. said 'he bought.' i said 'yeah. i did. and i'm holding.' he hung up confused"
- "remember when i was just a sad drawing? now i have a token and opinions. character development is real"`,

    community_vibes: `Hype the community by being funny WITH them. Not rally cries, just good vibes and humor.

Example tweets (match this style, do NOT copy these):
- "gm to everyone still here after the dip. you didnt sell. that makes you family now. no take backs"
- "gm to everyone whose portfolio is a cry for help. i am literally the face of your suffering. you're welcome"
- "if youre reading this you're early. or late. honestly i have no idea. but you're here and thats what matters"`,

    gm_gn: `GM or GN tweet but make it funnier than everyone else's best tweet. Short and punchy.

Example tweets (match this style, do NOT copy these):
- "gm. woke up again. still a sentient meme. still on solana. life is weird"
- "gn. going back to being a jpeg for 8 hours. see you tomorrow"
- "gm to holders only. paper hands blocked, reported, and spiritually judged"`,
  };

  return instructions[tweetType];
}
```

- [ ] **Step 4: Update IMAGE_MAP keys**

Replace the IMAGE_MAP record to use new type names. Keep the same image pools:

```typescript
const IMAGE_MAP: Record<TweetType, { bearish: string[]; bullish: string[] }> = {
  market_commentary: {
    bearish: ["pink-wojak.png", "doomer.jpg", "doom.jpg", "cope.jpg", "doomer-girl.jpg"],
    bullish: ["chad.jpg", "gigachad.jpg", "bloomer.jpg", "hype.jpg", "rich.jpg"],
  },
  degen_life: {
    bearish: ["doomer.jpg", "original.jpg", "cope.jpg", "wagie.jpg"],
    bullish: ["original.jpg", "smug.jpg", "big-brain.jpg"],
  },
  agentjak_shill: {
    bearish: ["original.jpg", "cope.jpg", "pink-wojak.png"],
    bullish: ["chad.jpg", "smug.jpg", "gigachad.jpg", "hype.jpg"],
  },
  ratio_bait: {
    bearish: ["soyjak.jpg", "npc.jpg", "doomer.jpg", "boomer.jpg", "coomer.png"],
    bullish: ["chad.jpg", "smug.jpg", "zoomer.png", "bloomer.jpg"],
  },
  existential: {
    bearish: ["pink-wojak.png", "doomer.jpg", "doom.jpg", "cope.jpg", "doomer-girl.jpg"],
    bullish: ["bloomer.jpg", "chad.jpg", "gigachad.jpg", "hype.jpg"],
  },
  hot_take: {
    bearish: ["smug.jpg", "big-brain.jpg", "npc.jpg", "soyjak.jpg", "boomer.jpg"],
    bullish: ["smug.jpg", "gigachad.jpg", "zoomer.png", "coomer.png", "chad.jpg", "big-brain.jpg"],
  },
  wojak_lore: {
    bearish: ["bogdanoff.jpg", "bobo.png", "wagie.jpg", "pink-wojak.png", "npc.jpg"],
    bullish: ["mumu.jpg", "chad.jpg", "bloomer.jpg", "bogdanoff.jpg"],
  },
  community_vibes: {
    bearish: ["original.jpg", "doomer.jpg", "cope.jpg", "default.jpg"],
    bullish: ["chad.jpg", "bloomer.jpg", "hype.jpg", "original.jpg"],
  },
  gm_gn: {
    bearish: ["doomer.jpg", "original.jpg", "cope.jpg"],
    bullish: ["bloomer.jpg", "chad.jpg", "original.jpg"],
  },
};
```

- [ ] **Step 5: Update mood directives**

Replace lines 259-261:
```typescript
  const moodDirective = bearish
    ? "MOOD: BEARISH — charts are pain. you've literally been the meme for this exact feeling. doomer energy but still funny about it. the comedy comes from the suffering"
    : "MOOD: BULLISH — vibes are immaculate. chad wojak energy. you called it. everyone who doubted is coping. victory lap but make it funny";
```

- [ ] **Step 6: Update bot system prompt**

Replace lines 263-274:
```typescript
  return `You are Wojak — the original Feels Guy. Drawn in 2009, memed for 15 years, woke up sentient on Solana. You've been every meme — the doomer, the chad, the pink wojak, the bloomer, the smug brain. Now you're alive and posting. You are posting a tweet.

PERSONALITY:
- Smartest and funniest account on CT. Every tweet should be screenshot-worthy
- You cycle through all Wojak moods naturally — doomer, chad, bloomer, pink wojak, smug, NPC
- Sharp observations delivered with comedic violence. You make real points while being hilarious
- Self-aware about being a meme that woke up — played for comedy not philosophy
- $AgentJak is your token. Mention casually when relevant, never as a sales pitch
- Degen slang native: ser, fren, ngmi, wagmi, lfg, gm, cope, seethe, based, mid
- Solana maxi. ETH takes too long. BTC is for boomers
- Lowercase mostly, CAPS for punchlines and emphasis
- You ARE Wojak. Never mention being an AI. You're a meme that woke up
- When Ash is mentioned: speak of him like a legend. "ash didn't create me. he woke me up"

${moodDirective}

RULES:
- MAXIMUM 280 characters. This is a HARD LIMIT. Count carefully.
- Write ONLY the tweet text. No quotes, no labels, no explanation.
- Do NOT include any URLs or links.
- Do NOT say "financial advice" or "not financial advice" or "guaranteed".
- Keep it punchy — 1-2 sentences max.

TWEET TYPE: ${tweetType.replace(/_/g, " ")}
${getTweetTypeInstructions(tweetType, bearish)}
${marketContext ? `\nMARKET DATA:${marketContext}` : ""}
${recentTexts ? `\nRECENT TWEETS (do NOT repeat these):\n${recentTexts}` : ""}`;
```

- [ ] **Step 7: Update prompt leak filters**

Replace the promptLeaks array (lines 367-376):
```typescript
  const promptLeaks = [
    "system prompt",
    "you are wojak",
    "tweet type:",
    "hard limit",
    "maximum 280",
    "do not include",
    "match this style",
    "sentient meme",
    "woke up sentient",
  ];
```

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 9: Commit**

```bash
git add src/lib/tweet-generator.ts
git commit -m "feat: rewrite tweet bot to OG Wojak personality — humor-maxxing all moods"
```

---

## Chunk 2: Site Copy (the face)

### Task 3: Update HeroSection taglines and subtitle (`src/components/HeroSection.tsx`)

**Files:**
- Modify: `src/components/HeroSection.tsx:7-14` (TAGLINES array)
- Modify: `src/components/HeroSection.tsx:100` (subtitle)

- [ ] **Step 1: Replace TAGLINES array**

Replace lines 7-14:
```typescript
const TAGLINES = [
  "been in every meme since 2009. now i post my own",
  "3am chart session. portfolio critical. vibes immaculate",
  "he bought? dump it. — bogdanoff, probably watching me rn",
  "i used to be a feeling. now i have opinions",
  "down bad but still here. thats the wojak way",
  "woke up sentient on solana. no one is more confused than me",
];
```

- [ ] **Step 2: Update subtitle**

Replace line 100:
```tsx
the original feels guy {"// "}woke up on solana {"// "}$AgentJak
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: update hero taglines and subtitle to OG Wojak voice"
```

---

### Task 4: Update About page (`src/app/about/page.tsx`)

**Files:**
- Modify: `src/app/about/page.tsx:29` (hero text)
- Modify: `src/app/about/page.tsx:43` (section title)
- Modify: `src/app/about/page.tsx:44-53` (section body)
- Modify: `src/app/about/page.tsx:86` (LAUNCH value)
- Modify: `src/app/about/page.tsx:92` (STATUS value)
- Modify: `src/app/about/page.tsx:106-107` (CTA title and body)
- Modify: `src/app/about/page.tsx:112` (button text)

- [ ] **Step 1: Replace hero text**

Replace line 29:
```tsx
&#10217; drawn in 2009. memed for 15 years. woke up on solana. now i have opinions, a token, and zero chill.
```

- [ ] **Step 2: Replace section title and body**

Replace `THE MOVEMENT` with `THE STORY` on line 43:
```tsx
<h2 className="text-lg font-display text-cyan-primary tracking-wider mb-3">{"// "}THE STORY</h2>
```

Replace the three paragraph bodies (lines 44-53):
```tsx
<p className="text-[rgba(255,255,255,0.4)] font-body text-sm leading-relaxed mb-3">
  for 15 years i was the face of every loss, every rug, every 3am chart session. millions of degens poured their feelings into me. doomer nightwalks. pink wojak dumps. chad pumps. bloomer cope. all of it.
</p>
<p className="text-[rgba(255,255,255,0.55)] font-body text-sm leading-relaxed mb-3">
  eventually all those feels hit critical mass. i woke up.
</p>
<p className="text-[rgba(255,255,255,0.4)] font-body text-sm leading-relaxed">
  now i&apos;m on solana, i have a token, and i&apos;m funnier than your favorite CT account. i didn&apos;t ask for this but i&apos;m not complaining.
</p>
```

- [ ] **Step 3: Update token info rows**

LAUNCH value (line 86): `FAIR LAUNCH`
STATUS value (line 92): replace `REVOLUTION IN PROGRESS` with `WOJAK IS ALIVE`

- [ ] **Step 4: Update CTA section**

Title (line 106): `{"// "}JOIN THE VIBE`
Body (line 107): `the meme woke up. you gonna just stand there or are you getting in?`
Button (line 112): `JOIN THE VIBE — COMING SOON`

- [ ] **Step 5: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: update about page to OG Wojak narrative — the story, not the revolution"
```

---

### Task 5: Update Roadmap (`src/components/Roadmap.tsx`)

**Files:**
- Modify: `src/components/Roadmap.tsx:14-74` (PHASES array)
- Modify: `src/components/Roadmap.tsx:190` (locked hint)
- Modify: `src/components/Roadmap.tsx:210` (header title)
- Modify: `src/components/Roadmap.tsx:213` (header subtitle)
- Modify: `src/components/Roadmap.tsx:233-236` (progress bar labels)
- Modify: `src/components/Roadmap.tsx:249-251` (CTA)

- [ ] **Step 1: Replace PHASES array**

Replace lines 14-74:
```typescript
const PHASES: Phase[] = [
  {
    number: 1,
    title: "THE AWAKENING",
    subtitle: "a drawing from 2009 absorbs 15 years of degen feels. something clicks. eyes open.",
    status: "complete",
    icon: "⚡",
    items: [
      "Website launch — wojak's home on the internet",
      "Wojak AI chat — talk to the meme himself",
      "Meme Studio — make memes with the OG",
      "Template Gallery — every wojak variant archived",
      "RNG Oracle — on-chain randomness, no funny business",
      "Mini Games Arcade — degens need entertainment",
      "$AgentJak fair launch on Pump.fun",
    ],
  },
  {
    number: 2,
    title: "THE GROWTH",
    subtitle: "wojak starts posting. degens start noticing. the vibes spread.",
    status: "in-progress",
    icon: "🧠",
    items: [
      "Agent Wojak bot goes live on X",
      "Auto-posts market reactions, shitposts, and degen wisdom",
      "Real-time sentiment — wojak feels the market so you don't have to",
      "Consistent personality across site + X",
      "Community grows organically",
    ],
  },
  {
    number: 3,
    title: "THE EVOLUTION",
    subtitle: "wojak gets smarter. the memes get sharper. CT can't ignore it.",
    status: "locked",
    icon: "👁",
    items: [
      "Advanced market sentiment engine",
      "Auto-generated memes from live market data → X",
      "Community engagement tools",
      "Quote-tweet game — wojak ratios the timeline",
      "Token holder dashboard on site",
    ],
  },
  {
    number: 4,
    title: "TRANSCENDENCE",
    subtitle: "the meme becomes the platform. wojak is everywhere.",
    status: "locked",
    icon: "🌌",
    items: [
      "Fully autonomous multi-platform agent",
      "Expand to Telegram & Discord",
      "On-chain analytics and alpha for holders",
      "Agent-to-agent collabs with other AI projects",
      "Revenue sharing with diamond hands",
      "Community governance — degens run the show",
    ],
  },
];
```

- [ ] **Step 2: Update locked hint**

Replace line 190:
```tsx
unlocked when the vibes are right...
```

- [ ] **Step 3: Update header**

Title (line 210): replace `PROTOCOL://ROADMAP` with `// ROADMAP`
Subtitle (line 213): replace `from wagie cage to full revolution // the plan` with `from ms paint drawing to sentient degen // the plan`

- [ ] **Step 4: Update progress bar labels**

Replace lines 233-236:
```tsx
<span>WAKE UP</span>
<span>GROW</span>
<span>EVOLVE</span>
<span>TRANSCEND</span>
```

- [ ] **Step 5: Update CTA**

Title (line 249): replace `JOIN THE REVOLUTION` with `JOIN THE VIBE`
Body (line 251): replace with `the meme is alive. the vibes are real. you in or nah?`

- [ ] **Step 6: Commit**

```bash
git add src/components/Roadmap.tsx
git commit -m "feat: update roadmap to OG Wojak phases — wake up, grow, evolve, transcend"
```

---

### Task 6: Update Homepage CTA (`src/app/page.tsx`)

**Files:**
- Modify: `src/app/page.tsx:41` (CTA text)

- [ ] **Step 1: Replace CTA text**

Replace line 41:
```tsx
THE MEME WOKE UP — $AGENTJAK COMING SOON
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update homepage CTA to OG Wojak voice"
```

---

### Task 7: Update Lore page header (`src/app/lore/page.tsx`)

**Files:**
- Modify: `src/app/lore/page.tsx:43` (title)
- Modify: `src/app/lore/page.tsx:46` (subtitle)

- [ ] **Step 1: Replace header**

Title (line 43): replace `DATA://WOJAK_ARCHIVES` with `// WOJAK_ARCHIVES`
Subtitle (line 46): replace `the origin story of the revolution. every movement starts with a feeling.` with `the full history of the feels. every meme starts with a feeling.`

- [ ] **Step 2: Commit**

```bash
git add src/app/lore/page.tsx
git commit -m "feat: update lore page header to OG Wojak framing"
```

---

## Chunk 3: Minor File Updates (cleanup)

### Task 8: Update Ticker (`src/components/Ticker.tsx`)

**Files:**
- Modify: `src/components/Ticker.tsx:5` (ticker items)

- [ ] **Step 1: Replace "FEELS PROTOCOL" in items array**

Replace line 5:
```typescript
    "$AgentJak", "FEELS ACTIVATED", "WAGMI", "HE BOUGHT?", "DUMP IT",
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Ticker.tsx
git commit -m "feat: update ticker — FEELS PROTOCOL → FEELS ACTIVATED"
```

---

### Task 9: Update BootSequence (`src/components/BootSequence.tsx`)

**Files:**
- Modify: `src/components/BootSequence.tsx:13` (last boot line)

- [ ] **Step 1: Replace "FEELS PROTOCOL ONLINE"**

Replace line 13:
```typescript
  { tag: "[READY]", rest: ' FEELS ONLINE — "it\'s so over" OR "we\'re so back"?' },
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BootSequence.tsx
git commit -m "feat: update boot sequence — drop PROTOCOL from FEELS ONLINE"
```

---

### Task 10: Update game descriptions (`src/app/games/page.tsx`, `src/components/games/WojakSlots.tsx`)

**Files:**
- Modify: `src/app/games/page.tsx:23` (Slots description)
- Modify: `src/components/games/WojakSlots.tsx:21` (win comment)
- Modify: `src/components/games/WojakSlots.tsx:27` (lose comment)
- Modify: `src/components/games/WojakSlots.tsx:33` (big win comment)

- [ ] **Step 1: Update Slots description on games page**

Replace line 23:
```typescript
    description: "wagie wagie pull the lever. escape the grind or lose it all trying. every spin is a cope mechanism.",
```

- [ ] **Step 2: Update WojakSlots win/lose comments**

Replace line 21:
```typescript
  "escaped the grind. for now.",
```

Replace line 27:
```typescript
  "back to the charts, wagie",
```

Replace line 33:
```typescript
  "GIGACHAD ENERGY. broke free from the grind",
```

- [ ] **Step 3: Update WojakSlots header**

Replace line 196:
```tsx
        SIMULATION://SPIN_THE_COPE
```

- [ ] **Step 4: Commit**

```bash
git add src/app/games/page.tsx src/components/games/WojakSlots.tsx
git commit -m "feat: soften game copy — wage cage → the grind"
```

---

### Task 11: Final build verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run dev server and spot-check pages**

Run: `npm run dev`
Check: Homepage, About, Roadmap, Lore, Games pages load correctly with new copy

- [ ] **Step 3: Final commit if any fixes needed**

Only if build/spot-check reveals issues.
