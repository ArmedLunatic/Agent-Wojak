import { TwitterApi } from "twitter-api-v2";
import { getStore } from "@netlify/blobs";

const MONTHLY_QUOTA_LIMIT = 1400;

export function createTwitterClient(): TwitterApi {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });
}

export async function postTweet(
  text: string
): Promise<{ id: string; url: string } | null> {
  try {
    const client = createTwitterClient();
    const result = await client.v2.tweet(text);
    const id = result.data.id;
    return {
      id,
      url: `https://x.com/i/status/${id}`,
    };
  } catch (err) {
    console.error("Failed to post tweet:", err);
    return null;
  }
}

interface QuotaData {
  month: string;
  count: number;
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7); // "2026-03"
}

function getQuotaStore() {
  return getStore("tweet-bot");
}

export async function getMonthlyQuota(): Promise<number> {
  try {
    const store = getQuotaStore();
    const raw = await store.get("monthly-quota", { type: "text" });
    if (!raw) return 0;
    const data: QuotaData = JSON.parse(raw);
    if (data.month !== getCurrentMonth()) return 0;
    return data.count;
  } catch {
    return 0;
  }
}

export async function incrementQuota(): Promise<void> {
  const store = getQuotaStore();
  const month = getCurrentMonth();
  let count = 0;

  try {
    const raw = await store.get("monthly-quota", { type: "text" });
    if (raw) {
      const data: QuotaData = JSON.parse(raw);
      if (data.month === month) count = data.count;
    }
  } catch {
    // start fresh
  }

  await store.set("monthly-quota", JSON.stringify({ month, count: count + 1 }));
}

export function isOverQuota(count: number): boolean {
  return count >= MONTHLY_QUOTA_LIMIT;
}

export interface TweetHistoryEntry {
  text: string;
  timestamp: string;
  tweetId: string;
  type: string;
}

export async function getRecentTweets(limit = 20): Promise<TweetHistoryEntry[]> {
  try {
    const store = getQuotaStore();
    const raw = await store.get("tweet-history", { type: "text" });
    if (!raw) return [];
    const history: TweetHistoryEntry[] = JSON.parse(raw);
    return history.slice(-limit);
  } catch {
    return [];
  }
}

export async function saveTweetToHistory(entry: TweetHistoryEntry): Promise<void> {
  const store = getQuotaStore();
  let history: TweetHistoryEntry[] = [];

  try {
    const raw = await store.get("tweet-history", { type: "text" });
    if (raw) history = JSON.parse(raw);
  } catch {
    // start fresh
  }

  history.push(entry);
  // Keep last 100
  if (history.length > 100) {
    history = history.slice(-100);
  }

  await store.set("tweet-history", JSON.stringify(history));
}
