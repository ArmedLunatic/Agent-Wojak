# Agent Wojak — Design Document

**Date:** 2026-03-14
**Status:** Approved

## Overview

Agent Wojak is a free AI chatbot + meme generator website for the $WOJAK memecoin on Pump.fun (Solana). The site serves as a marketing/engagement engine that drives attention and trading volume to the token. Revenue comes from creator fees (50% of PumpSwap trading fees).

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│              Next.js 14 (Vercel)                 │
│                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Chat UI  │  │ Meme Studio  │  │  Token    │  │
│  │ (Wojak    │  │ (Templates + │  │  Info /   │  │
│  │  persona) │  │  text overlay)│  │  Buy Link │  │
│  └─────┬─────┘  └──────┬───────┘  └───────────┘  │
│        │               │                         │
└────────┼───────────────┼─────────────────────────┘
         │               │
    ┌────▼───────────────▼────┐
    │     Next.js API Routes   │
    │                          │
    │  /api/chat  → LLM API    │
    │  /api/meme  → Canvas gen │
    │                          │
    └──────────────────────────┘
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Chat AI:** OllamaFreeAPI (OpenAI-compatible, free, no API key)
  - Dev fallback: local Ollama (localhost:11434)
- **Meme Generation:** node-canvas (server-side image compositing)
- **Deployment:** Vercel
- **Database:** None (stateless)
- **Wallet/Payments:** None (revenue via pump.fun creator fees)

## Revenue Model

- All content on the site is free
- Users buy $WOJAK token on pump.fun
- Creator fees = 50% of PumpSwap trading fees
- No on-site payments, no wallet connect, no Solana SDK

## Agent Personality

Agent Wojak is a dramatic degen Solana maxi with doomer/chad energy:

- Speaks in crypto-native slang ("ngmi", "it's so over", "wagmi", "ser")
- Emotionally reactive — switches between doomer, chad, crying, bloomer moods
- Never breaks character
- Short, punchy responses
- References $WOJAK token naturally without being overly promotional
- Deep knowledge of crypto/meme culture

## Pages

### 1. Home / Chat (`/`)
- Hero section with Agent Wojak character art + token name/CA
- Chat interface — talk to Wojak
- Link to buy on pump.fun

### 2. Meme Studio (`/meme`)
- User enters a prompt
- AI classifies mood → picks Wojak template → generates caption
- Text composited onto template via node-canvas
- Returns downloadable PNG with $WOJAK watermark
- Gallery of recently generated memes (client-side session only)

### 3. About / Token (`/about`)
- What is Agent Wojak
- Token info (CA, chart embed, buy link to pump.fun)
- Community links (Telegram, pump.fun page)

## UI / Theme — Matrix Aesthetic

- **Background:** Black (#000000)
- **Primary color:** Matrix green (#00FF41)
- **Fonts:** Monospace (JetBrains Mono / Share Tech Mono)
- **Effects:** Falling code rain animation, glitch/scanline effects, CRT vibes
- **Overall:** Dark, degen, "Solana trench warfare" energy

## Meme Generation Flow

```
User prompt
    → Groq/Ollama classifies mood (sad/hype/cope/panic/smug)
    → Picks matching Wojak template
    → Generates caption text in Wojak voice
    → node-canvas composites text onto template
    → Returns PNG with $WOJAK watermark
```

## Wojak Template Library (~10-15 base images)

1. Crying Wojak
2. Chad Wojak
3. Doomer Wojak
4. Bloomer Wojak
5. Pink Wojak (panic)
6. Smug Wojak
7. Brain Expansion Wojak
8. NPC Wojak
9. Cozy Wojak (comfy)
10. Pointing Wojak

## LLM Configuration

Both local Ollama and OllamaFreeAPI use OpenAI-compatible endpoints:

```
Dev:  http://localhost:11434/v1/chat/completions
Prod: OllamaFreeAPI endpoint (no API key required)
```

Swappable via environment variable — same code, different base URL.

## Constraints

- No database needed (stateless)
- No authentication
- No wallet integration on the site
- Rate limiting on chat API (respect upstream limits)
- Meme templates are static assets (no AI image generation)
- All free/zero-cost infrastructure
