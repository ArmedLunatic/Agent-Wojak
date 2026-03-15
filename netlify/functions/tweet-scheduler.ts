import type { Config } from "@netlify/functions";
import { getMarketData } from "../../src/lib/market-data";
import {
  generateTweet,
  selectTweetType,
  validateTweet,
} from "../../src/lib/tweet-generator";
import {
  postTweet,
  getMonthlyQuota,
  incrementQuota,
  isOverQuota,
  getRecentTweets,
  saveTweetToHistory,
} from "../../src/lib/twitter";

export default async function handler() {
  console.log("[tweet-bot] Scheduler triggered");

  // 1. Kill switch
  if (process.env.TWEET_BOT_ENABLED === "false") {
    console.log("[tweet-bot] Bot disabled via TWEET_BOT_ENABLED");
    return new Response("Bot disabled", { status: 200 });
  }

  // 2. Random skip for organic spacing (~20% skip rate)
  if (Math.random() < 0.2) {
    console.log("[tweet-bot] Random skip for organic spacing");
    return new Response("Skipped", { status: 200 });
  }

  // 3. Monthly quota check
  const quota = await getMonthlyQuota();
  if (isOverQuota(quota)) {
    console.log(`[tweet-bot] Monthly quota reached (${quota})`);
    return new Response("Quota reached", { status: 200 });
  }

  // 4. Fetch market data
  const marketData = await getMarketData();
  console.log("[tweet-bot] Market data:", JSON.stringify(marketData));

  // 5. Load recent tweets
  const recentTweets = await getRecentTweets(20);

  // 6. Select tweet type
  const tweetType = selectTweetType();
  console.log(`[tweet-bot] Tweet type: ${tweetType}`);

  // 7-8. Generate and validate tweet (with one retry)
  let tweet: string | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const generated = await generateTweet(marketData, recentTweets, tweetType);
      const validation = validateTweet(generated, recentTweets);

      if (validation.valid) {
        tweet = generated;
        break;
      }

      console.warn(
        `[tweet-bot] Validation failed (attempt ${attempt + 1}): ${validation.reason}`
      );
    } catch (err) {
      console.error(`[tweet-bot] Generation failed (attempt ${attempt + 1}):`, err);
    }
  }

  if (!tweet) {
    console.log("[tweet-bot] Failed to generate valid tweet after 2 attempts");
    return new Response("Generation failed", { status: 200 });
  }

  console.log(`[tweet-bot] Posting: "${tweet}"`);

  // 9. Post to X
  const result = await postTweet(tweet);
  if (!result) {
    console.error("[tweet-bot] Failed to post tweet");
    return new Response("Post failed", { status: 200 });
  }

  // 10. Save to history and increment quota
  await Promise.all([
    saveTweetToHistory({
      text: tweet,
      timestamp: new Date().toISOString(),
      tweetId: result.id,
      type: tweetType,
    }),
    incrementQuota(),
  ]);

  console.log(`[tweet-bot] Success! Tweet ${result.id}: ${result.url}`);
  return new Response(`Posted: ${result.url}`, { status: 200 });
}

export const config: Config = {
  schedule: "0 * * * *",
};
