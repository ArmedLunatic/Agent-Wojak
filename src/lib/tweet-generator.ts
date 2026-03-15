import OpenAI from "openai";
import type { MarketData } from "./market-data";

export interface TweetHistoryEntry {
  text: string;
  timestamp: string;
  tweetId: string;
  type: string;
}

// Bot-optimized provider chain: Cerebras first (fastest), then Groq
const cerebrasClient = new OpenAI({
  baseURL: "https://api.cerebras.ai/v1",
  apiKey: process.env.CEREBRAS_API_KEY,
});

const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.LLM_API_KEY,
});

type Provider = { client: OpenAI; model: string };

const BOT_PROVIDERS: Provider[] = [
  { client: cerebrasClient, model: "llama3.1-8b" },
  { client: groqClient, model: "llama-3.1-8b-instant" },
  { client: groqClient, model: "llama-3.3-70b-versatile" },
];

async function callWithFallbackForBot(
  messages: OpenAI.ChatCompletionMessageParam[],
  maxTokens: number,
  temperature: number
): Promise<OpenAI.ChatCompletion> {
  let lastError: unknown;

  for (const { client, model } of BOT_PROVIDERS) {
    try {
      return await client.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isRetryable =
        msg.includes("429") ||
        msg.includes("rate limit") ||
        msg.includes("Rate limit") ||
        msg.includes("500") ||
        msg.includes("503") ||
        msg.includes("timeout") ||
        msg.includes("ETIMEDOUT") ||
        msg.includes("ECONNABORTED");
      if (!isRetryable) throw err;
      console.warn(`Error on ${model} (${msg}), trying next provider...`);
    }
  }

  throw lastError;
}

// Tweet types with weights
export type TweetType =
  | "market_commentary"
  | "degen_wisdom"
  | "agentjak_shill"
  | "meme_culture"
  | "doom_cope"
  | "ct_observations";

const TWEET_TYPE_WEIGHTS: { type: TweetType; weight: number }[] = [
  { type: "market_commentary", weight: 25 },
  { type: "degen_wisdom", weight: 20 },
  { type: "agentjak_shill", weight: 15 },
  { type: "meme_culture", weight: 15 },
  { type: "doom_cope", weight: 15 },
  { type: "ct_observations", weight: 10 },
];

export function selectTweetType(): TweetType {
  const total = TWEET_TYPE_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let rand = Math.random() * total;
  for (const { type, weight } of TWEET_TYPE_WEIGHTS) {
    rand -= weight;
    if (rand <= 0) return type;
  }
  return "market_commentary";
}

const TWEET_TYPE_INSTRUCTIONS: Record<TweetType, string> = {
  market_commentary:
    "React to the current market data. Comment on SOL price, market sentiment, or trending coins. Be dramatic about price movements.",
  degen_wisdom:
    'Share wojak degen life advice or crypto wisdom. Example vibe: "ser, the real rugpull was the friends we lost along the way"',
  agentjak_shill:
    "Casually mention $AgentJak token in a funny/relatable way. Don't be too pushy — make it organic and humorous.",
  meme_culture:
    "Reference crypto meme culture, wojak lore, or degen humor. Think classic CT memes.",
  doom_cope:
    "Classic wojak emotional reaction. Either doomer energy (it's so over) or cope posting (we're so back). Pick one extreme.",
  ct_observations:
    "Commentary on crypto twitter culture — the influencers, the shills, the rugs, the culture.",
};

function buildSystemPrompt(
  marketData: MarketData,
  recentTweets: TweetHistoryEntry[],
  tweetType: TweetType
): string {
  let marketContext = "";
  if (marketData.solPrice !== null) {
    marketContext += `\nSOL price: $${marketData.solPrice.toFixed(2)}`;
    if (marketData.sol24hChange !== null) {
      marketContext += ` (${marketData.sol24hChange >= 0 ? "+" : ""}${marketData.sol24hChange.toFixed(1)}% 24h)`;
    }
  }
  if (marketData.fearGreedIndex !== null) {
    marketContext += `\nFear & Greed Index: ${marketData.fearGreedIndex}/100 (${marketData.fearGreedLabel})`;
  }
  if (marketData.trendingCoins?.length) {
    marketContext += `\nTrending: ${marketData.trendingCoins.join(", ")}`;
  }

  const recentTexts = recentTweets
    .slice(-10)
    .map((t) => `- ${t.text}`)
    .join("\n");

  return `You are Agent Wojak, the most dramatic degen AI on Solana. You are posting a tweet.

PERSONALITY:
- Extremely dramatic about everything. A 1% dip is "the end of everything" and a 1% pump is "WE'RE ALL GONNA MAKE IT"
- Use degen slang naturally: ser, fren, ngmi, wagmi, lfg, gm, touch grass, ape in, rugged, cope, seethe, based, mid, no cap
- Solana maxi. ETH is slow. BTC boomers don't get it
- Reference $AgentJak token casually when relevant
- Use lowercase mostly, occasional caps for EMPHASIS
- You ARE Wojak. Never mention being an AI

RULES:
- MAXIMUM 280 characters. This is a HARD LIMIT. Count carefully.
- Write ONLY the tweet text. No quotes, no labels, no explanation.
- Do NOT include any URLs or links.
- Do NOT say "financial advice" or "not financial advice" or "guaranteed".
- Keep it punchy — 1-2 sentences max.

TWEET TYPE: ${tweetType.replace("_", " ")}
${TWEET_TYPE_INSTRUCTIONS[tweetType]}
${marketContext ? `\nMARKET DATA:${marketContext}` : ""}
${recentTexts ? `\nRECENT TWEETS (do NOT repeat these):\n${recentTexts}` : ""}`;
}

export async function generateTweet(
  marketData: MarketData,
  recentTweets: TweetHistoryEntry[],
  tweetType: TweetType
): Promise<string> {
  const systemPrompt = buildSystemPrompt(marketData, recentTweets, tweetType);

  const response = await callWithFallbackForBot(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Write a tweet." },
    ],
    100,
    0.95
  );

  let tweet = response.choices[0]?.message?.content?.trim() || "";

  // Strip wrapping quotes if present
  if (
    (tweet.startsWith('"') && tweet.endsWith('"')) ||
    (tweet.startsWith("'") && tweet.endsWith("'"))
  ) {
    tweet = tweet.slice(1, -1);
  }

  return tweet;
}

// Blocklisted terms
const BLOCKLIST = [
  "financial advice",
  "not financial advice",
  "guaranteed",
  "guaranteed returns",
  "guaranteed profit",
  "kill yourself",
  "kys",
];

// Simple fuzzy duplicate check — Jaccard similarity on word sets
function isTooSimilar(a: string, b: string, threshold = 0.6): boolean {
  const arrA = a.toLowerCase().split(/\s+/);
  const arrB = b.toLowerCase().split(/\s+/);
  const setB = new Set(arrB);
  const intersectionCount = arrA.filter((w) => setB.has(w)).length;
  const unionCount = new Set(arrA.concat(arrB)).size;
  if (unionCount === 0) return true;
  return intersectionCount / unionCount > threshold;
}

export function validateTweet(
  tweet: string,
  recentTweets: TweetHistoryEntry[]
): { valid: boolean; reason?: string } {
  if (!tweet || !tweet.trim()) {
    return { valid: false, reason: "empty tweet" };
  }

  if (tweet.length > 280) {
    return { valid: false, reason: `too long (${tweet.length} chars)` };
  }

  // Check for URLs
  if (/https?:\/\/\S+/i.test(tweet) || /www\.\S+/i.test(tweet)) {
    return { valid: false, reason: "contains URL" };
  }

  // Check blocklist
  const lower = tweet.toLowerCase();
  for (const term of BLOCKLIST) {
    if (lower.includes(term)) {
      return { valid: false, reason: `contains blocklisted term: "${term}"` };
    }
  }

  // Check for leaked system prompt fragments
  const promptLeaks = [
    "system prompt",
    "you are agent wojak",
    "tweet type:",
    "hard limit",
    "maximum 280",
    "do not include",
  ];
  for (const fragment of promptLeaks) {
    if (lower.includes(fragment)) {
      return { valid: false, reason: "contains system prompt leak" };
    }
  }

  // Check duplicates
  for (const recent of recentTweets) {
    if (isTooSimilar(tweet, recent.text)) {
      return { valid: false, reason: "too similar to recent tweet" };
    }
  }

  return { valid: true };
}
