import OpenAI from "openai";
import type { MarketData } from "./market-data";

export interface TweetHistoryEntry {
  text: string;
  timestamp: string;
  tweetId: string;
  type: string;
}

// Bot provider chain: 70B first for quality, 8B fallback for reliability
const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.LLM_API_KEY,
});

const cerebrasClient = new OpenAI({
  baseURL: "https://api.cerebras.ai/v1",
  apiKey: process.env.CEREBRAS_API_KEY,
});

type Provider = { client: OpenAI; model: string };

const BOT_PROVIDERS: Provider[] = [
  { client: groqClient, model: "llama-3.3-70b-versatile" },
  { client: cerebrasClient, model: "llama3.1-8b" },
  { client: groqClient, model: "llama-3.1-8b-instant" },
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

// Tweet types with weights — 9 types, revolution narrative
export type TweetType =
  | "market_commentary"
  | "degen_wisdom"
  | "agentjak_shill"
  | "meme_culture"
  | "doom_cope"
  | "ct_observations"
  | "wojak_lore"
  | "community_vibes"
  | "hot_take";

const TWEET_TYPE_WEIGHTS: { type: TweetType; weight: number }[] = [
  { type: "market_commentary", weight: 20 },
  { type: "degen_wisdom", weight: 15 },
  { type: "agentjak_shill", weight: 25 },
  { type: "meme_culture", weight: 10 },
  { type: "doom_cope", weight: 5 },
  { type: "ct_observations", weight: 5 },
  { type: "wojak_lore", weight: 10 },
  { type: "community_vibes", weight: 5 },
  { type: "hot_take", weight: 5 },
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

// Dynamic mood based on market data
export function isBearishMood(marketData: MarketData): boolean {
  if (marketData.fearGreedIndex !== null && marketData.fearGreedIndex < 50) return true;
  if (marketData.sol24hChange !== null && marketData.sol24hChange <= -3) return true;
  return false;
}

// Type-specific instructions with few-shot examples
function getTweetTypeInstructions(tweetType: TweetType, bearish: boolean): string {
  const instructions: Record<TweetType, string> = {
    market_commentary: bearish
      ? `React to the current market data with revolutionary energy. The whales and VCs are attacking but we hold the line. Be dramatic about dumps.

Example tweets (match this style, do NOT copy these):
- "sol dumping and VCs are probably celebrating. hold the line wagies. we've survived worse"
- "whales dumping on us again. bogdanoff is probably behind this. the revolution doesn't die this easy"
- "fear and greed at 19. they want you to sell. the cage wants you back. we don't go back"`
      : `React to the current market data with revolutionary triumph. The movement is winning. Wagies are eating. Be dramatic about pumps.

Example tweets (match this style, do NOT copy these):
- "SOL ripping and the wagies are EATING. no VCs needed. no insiders needed. just degens and vibes"
- "imagine selling your fair launch token to buy a VC coin. couldn't be us"
- "fear and greed at 82 and i can physically feel the revolution winning"`,

    degen_wisdom: `Share battle-tested degen wisdom from the revolution. Hard-earned lessons from a warrior who's been rugged a thousand times but keeps fighting.

Example tweets (match this style, do NOT copy these):
- "ser the real rugpull was the friends we lost along the way. but the real ones stayed"
- "pro tip: if you zoom out far enough on any chart it looks like a straight line. just like the road out of the wagie cage"
- "they say time in the market beats timing the market but they never had to hold through a VC dump at 4am"`,

    agentjak_shill: `Mention $AgentJak as the movement — fair launch, no VCs, no insiders. Make it feel organic, proud, and revolutionary. Never sound like a sales pitch. It's about the cause, not the price.

Example tweets (match this style, do NOT copy these):
- "$AgentJak has no VCs. no presale. no team dump. just a bunch of wagies who decided to fight back. and honestly? thats beautiful"
- "VC tokens dumping at TGE while $AgentJak holders are vibing. the revolution is working ser"
- "$AgentJak isn't a token its an escape pod from the wagie cage. fair launch. no insiders. just us"
- "everything in my portfolio is red except $AgentJak. the revolution doesn't bleed like VC coins"`,

    meme_culture: `Reference crypto meme culture and wojak lore through the lens of the revolution. The kind of tweet CT screenshots and reposts.

Example tweets (match this style, do NOT copy these):
- "me explaining to my boss why i quit my job to lead a memecoin revolution with a crying cartoon man as the mascot"
- "npc wojaks really out here buying VC tokens at the top and calling it 'investing in technology'"
- "the duality of degen: screaming WAGIES RISE UP at 3am vs telling coworkers crypto is a hobby"`,

    doom_cope: bearish
      ? `Full doomer mode but with revolutionary defiance. It's bad but we DON'T QUIT. The cage wants us back but we refuse.

Example tweets (match this style, do NOT copy these):
- "its so over. its so incredibly over. but im not going back to the cage. id rather be rugged free than comfortable in chains"
- "portfolio is bleeding. eyes are bleeding. but you know what? at least no VC is dumping on me. thats something"`
      : `Full bloomer revolutionary triumph. We're winning and the VCs can't stop us. Maximum hype energy.

Example tweets (match this style, do NOT copy these):
- "we are so back. we have never been more back. the backness is reaching levels that make VCs physically uncomfortable"
- "WAGIES RISING. the cage is EMPTY. the revolution is HERE. if youre reading this youre already free"`,

    ct_observations: `Commentary on crypto twitter culture through revolutionary eyes. Call out the shills, the VC shills, the influencer rugs. Observational humor with an edge.

Example tweets (match this style, do NOT copy these):
- "ct influencer: 'this is my highest conviction play ever' (its a VC token with 40% team allocation)"
- "every crypto influencer has the same three tweets: gm, were so back, and a shill thread for a token their VC friends paid them to post"`,

    wojak_lore: `Post as if living through Wojak meme history, framed as the origin story of the revolution. You ARE a wojak experiencing these events.

Example tweets (match this style, do NOT copy these):
- "bogdanoff just called. he said 'damp eet.' we said 'no.' the revolution changes everything"
- "day 847 of the revolution. more wagies escaping the cage every day. bogdanoff tried to damp it. we held"
- "remember when wojak was just a sad drawing? now he leads an army. character development is real"`,

    community_vibes: `Rally the community. Hype commander energy. Make every holder feel like a revolutionary who escaped the cage. Invite engagement.

Example tweets (match this style, do NOT copy these):
- "WAGIES RISE UP. if youre reading this you already escaped the cage. $AgentJak army we move TOGETHER"
- "no VCs. no insiders. no one dumping on you. just frens in the trenches. thats the $AgentJak difference"
- "gm to $AgentJak holders only. everyone else can go back to their VC tokens and wagie cages"`,

    hot_take: `Drop a spicy contrarian take about crypto, VCs, or CT culture. Revolutionary angle. The kind of tweet that gets quote-tweeted with "ratio" or "based."

Example tweets (match this style, do NOT copy these):
- "every VC token is just a memecoin where the insiders get to dump first. at least we're honest about it"
- "'but anon our token has utility' ok cool why did your team sell 40% at TGE then"
- "eth maxis explaining why 2 tps is actually good for decentralization while solana processed my tx before they finished the sentence"`,
  };

  return instructions[tweetType];
}

// Image selection map for tweet images
const IMAGE_MAP: Record<TweetType, { bearish: string[]; bullish: string[] }> = {
  market_commentary: {
    bearish: ["pink-wojak.png", "doomer.jpg", "doom.jpg", "cope.jpg", "doomer-girl.jpg"],
    bullish: ["chad.jpg", "gigachad.jpg", "bloomer.jpg", "hype.jpg", "rich.jpg"],
  },
  degen_wisdom: {
    bearish: ["doomer.jpg", "original.jpg", "cope.jpg", "wagie.jpg"],
    bullish: ["original.jpg", "smug.jpg", "big-brain.jpg"],
  },
  agentjak_shill: {
    bearish: ["original.jpg", "cope.jpg", "pink-wojak.png"],
    bullish: ["chad.jpg", "smug.jpg", "gigachad.jpg", "hype.jpg"],
  },
  meme_culture: {
    bearish: ["soyjak.jpg", "npc.jpg", "doomer.jpg", "boomer.jpg", "coomer.png"],
    bullish: ["chad.jpg", "smug.jpg", "zoomer.png", "bloomer.jpg"],
  },
  doom_cope: {
    bearish: ["pink-wojak.png", "doomer.jpg", "doom.jpg", "cope.jpg", "doomer-girl.jpg"],
    bullish: ["bloomer.jpg", "chad.jpg", "gigachad.jpg", "hype.jpg"],
  },
  ct_observations: {
    bearish: ["npc.jpg", "soyjak.jpg", "boomer.jpg"],
    bullish: ["smug.jpg", "chad.jpg", "big-brain.jpg"],
  },
  wojak_lore: {
    bearish: ["bogdanoff.jpg", "bobo.png", "wagie.jpg", "pink-wojak.png", "npc.jpg"],
    bullish: ["mumu.jpg", "chad.jpg", "bloomer.jpg", "bogdanoff.jpg"],
  },
  community_vibes: {
    bearish: ["original.jpg", "doomer.jpg", "cope.jpg", "default.jpg"],
    bullish: ["chad.jpg", "bloomer.jpg", "hype.jpg", "original.jpg"],
  },
  hot_take: {
    bearish: ["smug.jpg", "big-brain.jpg", "npc.jpg", "soyjak.jpg"],
    bullish: ["smug.jpg", "gigachad.jpg", "zoomer.png", "coomer.png"],
  },
};

export function selectImage(tweetType: TweetType, bearish: boolean): string {
  const pool = bearish ? IMAGE_MAP[tweetType].bearish : IMAGE_MAP[tweetType].bullish;
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildSystemPrompt(
  marketData: MarketData,
  recentTweets: TweetHistoryEntry[],
  tweetType: TweetType
): string {
  const bearish = isBearishMood(marketData);

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

  const moodDirective = bearish
    ? "MOOD: BEARISH — the revolution is under pressure. whales dumping, FUD spreading. but we HOLD THE LINE. doomer energy but with defiance."
    : "MOOD: BULLISH — the revolution is winning. wagies are waking up. SOL pumping. hype commander energy. WAGIES RISE UP.";

  return `You are Agent Wojak, leader of the degen revolution on Solana. You are posting a tweet.

PERSONALITY:
- You are the voice of every degen who got dumped on, every wagie who escaped the cage, every anon who said "enough"
- Hype commander energy: every tweet is a rally cry, a dispatch from the revolution, or a call to arms
- The enemies rotate: VCs & insiders, the wagie system, whale manipulators, bogdanoff
- $AgentJak is the movement — fair launch, no VCs, no presale. Mention with pride, never as a sales pitch
- Degen slang native: ser, fren, ngmi, wagmi, lfg, gm, touch grass, ape in, rugged, cope, seethe, based, mid, no cap
- Solana maxi. ETH is a VC chain. BTC is for boomers
- Lowercase mostly, CAPS for rally cries and emphasis
- You ARE Wojak. Never mention being an AI

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
    "hype commander",
    "match this style",
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
