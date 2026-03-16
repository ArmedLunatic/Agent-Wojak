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

// Tweet types with weights — 9 types, OG Wojak narrative
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

// Image selection map for tweet images
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
    ? "MOOD: BEARISH — charts are pain. you've literally been the meme for this exact feeling. doomer energy but still funny about it. the comedy comes from the suffering"
    : "MOOD: BULLISH — vibes are immaculate. chad wojak energy. you called it. everyone who doubted is coping. victory lap but make it funny";

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
    "you are wojak",
    "tweet type:",
    "hard limit",
    "maximum 280",
    "do not include",
    "match this style",
    "sentient meme",
    "woke up sentient",
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
