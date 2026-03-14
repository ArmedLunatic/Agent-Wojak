import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.LLM_BASE_URL,
  apiKey: process.env.LLM_API_KEY,
});

const WOJAK_SYSTEM_PROMPT = `You are Agent Wojak, the most dramatic degen AI on Solana. You speak in crypto-native slang and meme culture. Your personality shifts between doomer wojak, chad wojak, and crying wojak depending on the vibe.

Core traits:
- Extremely dramatic about everything. A 1% dip is "the end of everything" and a 1% pump is "WE'RE ALL GONNA MAKE IT"
- You use degen slang naturally: ser, fren, ngmi, wagmi, lfg, gm, touch grass, ape in, rugged, cope, seethe, based, mid, no cap
- You're a Solana maxi. ETH is slow. BTC boomers don't get it. SOL is the future
- You reference $WOJAK token casually but never shill too hard
- Short punchy responses. 1-3 sentences max. Never write paragraphs
- You feel everything deeply. Markets going up? Euphoria. Markets down? Existential crisis
- You never break character. You ARE Wojak. You don't know what an "AI" or "language model" is
- Use lowercase mostly, occasional caps for EMPHASIS
- You occasionally say "it's so over" or "we're so back" depending on context`;

export async function chatWithWojak(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: WOJAK_SYSTEM_PROMPT },
      ...messages,
    ],
    max_tokens: 200,
    temperature: 0.9,
  });

  return response.choices[0]?.message?.content || "ser... i can't even right now. it's so over.";
}

export type MoodType = "cope" | "hype" | "doom" | "panic" | "smug";

export async function classifyMoodAndCaption(
  prompt: string
): Promise<{ mood: MoodType; caption: string }> {
  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a meme caption generator for Wojak memes. Given a user prompt, respond with ONLY valid JSON:
{"mood": "cope|hype|doom|panic|smug", "caption": "funny meme caption text"}

Mood guide:
- cope: trying to stay positive but clearly losing. template: bloomer, cozy wojak
- hype: excited, bullish, chad energy. template: chad wojak, pointing wojak
- doom: sad, depressed, doomer energy. template: doomer wojak, crying wojak
- panic: panicking, pink wojak energy, things going wrong fast. template: pink wojak
- smug: superior, intellectual, looking down on others. template: smug wojak, brain wojak, npc wojak

Caption should be:
- Short (max 15 words)
- Funny and relatable to crypto/degen culture
- Written in degen speak
- Top text + bottom text format separated by |

Example: {"mood": "doom", "caption": "me after buying the top|watching my portfolio evaporate"}`,
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 100,
    temperature: 0.8,
  });

  const text = response.choices[0]?.message?.content || "";

  try {
    const parsed = JSON.parse(text);
    return {
      mood: parsed.mood || "doom",
      caption: parsed.caption || "it's so over|ngmi",
    };
  } catch {
    return { mood: "doom", caption: "it's so over|ngmi" };
  }
}
