# Agent Wojak X Bot — Phase 1: Autonomous Tweet Agent

## Context

Agent Wojak's site and games are live but competitors have copied the style and taken attention away. To reclaim mindshare, we're building an autonomous X (Twitter) agent that posts as Agent Wojak — starting with free-tier auto-posting (Phase 1), then scaling to mention replies and keyword hunting in later phases.

**Goal:** Fully autonomous tweet agent posting 15-20 tweets/day with wojak personality, market-aware content, at $0/month cost.

## Architecture

```
Netlify Scheduled Function (cron, every 60 min + random skip for ~75 min avg)
    │
    ├─→ Kill switch check (TWEET_BOT_ENABLED env var or Blob flag)
    │
    ├─→ Monthly quota check (hard stop at 1,400 posts)
    │
    ├─→ Market Data Service (CoinGecko Demo API + Fear & Greed Index)
    │       → SOL price, 24h change, trending coins, market sentiment
    │
    ├─→ Tweet Generator (Groq/Cerebras LLM, existing fallback chain)
    │       → Wojak-personality tweet, market-aware, <280 chars
    │
    ├─→ Content safety filter (blocklist + validation)
    │
    ├─→ Tweet History (Netlify Blobs)
    │       → Last ~100 tweets to prevent repetition
    │
    └─→ X API Client (free tier, X API v2, OAuth 1.0a)
            → POST /2/tweets (no retry on failure — preserve quota)
```

## Components

### 1. Market Data Service — `src/lib/market-data.ts`

Fetches real-time market context so tweets feel current.

**Data sources (all free):**
- **CoinGecko Demo API** `/api/v3/simple/price` — SOL price + 24h % change (free demo key required, use `x-cg-demo-api-key` header)
- **CoinGecko Demo API** `/api/v3/search/trending` — trending coins
- **alternative.me** `/api/crypto/fng/` — Fear & Greed Index (0-100 scale)

**Returns:** `{ solPrice, sol24hChange, trendingCoins, fearGreedIndex, fearGreedLabel }`

**Error handling:** Each API call has a 3-second timeout. If any API fails, the tweet generator still works — it just produces non-market-specific content. No retries (preserve function execution time).

### 2. Tweet Generator — `src/lib/tweet-generator.ts`

Generates wojak-personality tweets. Reuses the existing Groq/Cerebras provider chain from `src/lib/llm.ts`.

**LLM fallback improvement:** Extend the existing fallback chain to also catch 500/503/timeout errors (not just 429 rate limits). Use a separate `callWithFallbackForBot()` function to avoid changing existing chat/meme behavior.

**System prompt spec:**
- Character: Agent Wojak — emotional degen, lowercase only, dramatic about markets
- Hard limit: 280 characters
- Must reference market data when available
- Rotate tweet types to keep feed varied

**Tweet types (rotated):**
1. **Market Commentary** — react to SOL price / Fear & Greed
2. **Degen Wisdom** — wojak life advice ("ser, the real rugpull was the friends we lost along the way")
3. **$AgentJak Shill** — subtle/funny mentions of the token
4. **Meme Culture** — crypto meme references, wojak lore
5. **Doom/Cope Posts** — classic wojak emotional reactions
6. **CT Observations** — commentary on crypto twitter culture

**Inputs:**
- Market data (from service above)
- Recent tweet history (last 20 tweets, to avoid repetition)
- Selected tweet type (rotated or random-weighted)

### 3. Content Safety Filter — in `src/lib/tweet-generator.ts`

Validates generated tweets before posting.

**Checks:**
- Length < 280 chars
- Not empty/whitespace-only
- Not a duplicate of recent tweets
- No blocklisted terms (slurs, "financial advice", "guaranteed returns", "not financial advice", etc.)
- No URLs (LLM might hallucinate links)
- No leaked system prompt / meta-instructions
- If validation fails, regenerate once. If second attempt also fails, skip this interval.

### 4. X API Client — `src/lib/twitter.ts`

Handles OAuth 1.0a signing and posting via X API v2.

**Dependencies:** `twitter-api-v2` npm package (lightweight, well-maintained)
**API endpoint:** `POST /2/tweets` (v2, confirmed available on free tier)

**Functions:**
- `postTweet(text: string): Promise<TweetResult>` — posts a tweet, returns ID + URL
- Monthly quota tracking via Netlify Blobs (increment on each successful post)
- **No retries on POST failure** — if it fails, log and move on. Each retry burns quota.
- Hard stop at 1,400 posts/month (leaves 100 buffer from 1,500 limit)

**Auth:** OAuth 1.0a User Context (required for free tier write access)

### 5. Tweet Scheduler — `netlify/functions/tweet-scheduler.ts`

Netlify Scheduled Function triggered by cron.

**Schedule:** Every 60 minutes (`0 * * * *`). Uses random skip (~20% of invocations skipped) to create organic spacing — effective average ~75 min between tweets, ~16-19 tweets/day.

**Timeout handling:** Netlify free tier has 10-second function timeout. Pipeline is optimized:
- Use Cerebras (fastest) as primary LLM for bot, Groq as fallback
- 3-second timeouts on all external HTTP calls
- Total pipeline target: <8 seconds

**Pipeline:**
1. Check kill switch (`TWEET_BOT_ENABLED` env var) — exit if disabled
2. Random skip check (~20% probability to skip for organic spacing)
3. Check monthly quota from Blobs — exit if ≥ 1,400
4. Fetch market data (parallel calls, 3s timeout each)
5. Load recent tweet history from Netlify Blobs
6. Select tweet type (weighted random rotation)
7. Generate tweet via LLM (Cerebras first, Groq fallback)
8. Run content safety filter — regenerate once if failed
9. Post to X (no retry on failure)
10. Save tweet + increment monthly counter in Blobs
11. Log result

### 6. Tweet History Store — Netlify Blobs

**Storage:** Netlify Blobs (`@netlify/blobs` package)
- `tweet-history` — JSON array of last 100 tweets `{ text, timestamp, tweetId, type }`
- `monthly-quota` — `{ month: "2026-03", count: 142 }` (resets each month)
- `bot-status` — optional kill switch flag (alternative to env var)

**Purpose:**
- Feed last 20 tweets to LLM to prevent repetitive content
- Track monthly post quota
- Analytics (what types perform — future use)

### 7. Kill Switch

**Two options (both supported):**
- `TWEET_BOT_ENABLED=false` env var in Netlify dashboard (requires ~1 min to propagate)
- `bot-status` Blob flag (can be toggled from an admin API endpoint on the site for instant control)

## Environment Variables

```env
# X/Twitter API (Free Tier - v2)
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_TOKEN_SECRET=...

# CoinGecko (free demo key)
COINGECKO_API_KEY=...

# Bot control
TWEET_BOT_ENABLED=true

# Already existing but needed for bot LLM fallback
CEREBRAS_API_KEY=...
```

Added to existing `.env.local` and `.env.example`.

## File Structure (new files)

```
src/lib/
  market-data.ts          — Market data fetcher (CoinGecko, Fear & Greed)
  tweet-generator.ts      — LLM-powered tweet generation + safety filter
  twitter.ts              — X API v2 client (post tweets, quota tracking)

netlify/functions/
  tweet-scheduler.ts      — Scheduled function (cron trigger)
```

## Dependencies (new)

```
twitter-api-v2            — X API client with OAuth 1.0a support
@netlify/blobs            — Netlify Blobs KV store
```

## Cost Breakdown

| Service | Cost |
|---------|------|
| X API Free Tier | $0 (1,500 tweets/mo, we use ~500-600) |
| Groq LLM (free tier) | $0 |
| Cerebras LLM (primary for bot) | $0 |
| CoinGecko Demo API | $0 (free demo key) |
| Fear & Greed API | $0 |
| Netlify Scheduled Functions | $0 (included in free tier) |
| Netlify Blobs | $0 (included in free tier) |
| **Total** | **$0/month** |

## Setup Steps (one-time)

1. Create X account for Agent Wojak (if not exists)
2. Apply for X Developer Account (free tier) at developer.twitter.com
3. Create an X App in the developer portal
4. Generate OAuth 1.0a keys (API Key, API Secret, Access Token, Access Token Secret)
5. Register for CoinGecko Demo API key (free) at coingecko.com
6. Set all environment variables in Netlify dashboard
7. Deploy

## Verification

- [ ] Market data service returns valid SOL price and Fear & Greed data
- [ ] Tweet generator produces <280 char tweets in wojak voice
- [ ] Content safety filter catches blocklisted terms and URLs
- [ ] Tweet generator avoids repeating recent tweets
- [ ] X API client successfully posts a test tweet via v2 endpoint
- [ ] Monthly quota tracking increments correctly
- [ ] Kill switch stops posting when disabled
- [ ] Scheduled function completes full pipeline within 10 seconds
- [ ] Random skip mechanism produces ~16-19 tweets/day over 24 hours
- [ ] Netlify Blobs stores and retrieves tweet history
- [ ] Run for 24 hours and verify varied content posted at organic intervals

## Future Phases (not in scope)

- **Phase 2:** Upgrade to X Basic ($100/mo), add mention reply system
- **Phase 3:** Keyword monitoring, jump into trending crypto conversations
