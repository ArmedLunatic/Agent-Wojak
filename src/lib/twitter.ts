import { TwitterApi } from "twitter-api-v2";

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
