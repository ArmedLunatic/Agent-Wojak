import OpenAI from "openai";

// Primary: Groq (3 models = 300k TPD)
const groqClient = new OpenAI({
  baseURL: process.env.LLM_BASE_URL,
  apiKey: process.env.LLM_API_KEY,
});

// Fallback: Cerebras (blazing fast)
const cerebrasClient = new OpenAI({
  baseURL: "https://api.cerebras.ai/v1",
  apiKey: process.env.CEREBRAS_API_KEY,
});

type Provider = { client: OpenAI; model: string };

const PROVIDERS: Provider[] = [
  { client: groqClient, model: process.env.LLM_MODEL || "llama-3.3-70b-versatile" },
  { client: groqClient, model: "meta-llama/llama-4-scout-17b-16e-instruct" },
  { client: groqClient, model: "llama-3.1-8b-instant" },
  { client: cerebrasClient, model: "qwen-3-235b-a22b-instruct-2507" },
  { client: cerebrasClient, model: "llama3.1-8b" },
];

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

async function callWithFallback(
  messages: OpenAI.ChatCompletionMessageParam[],
  maxTokens: number,
  temperature: number
): Promise<OpenAI.ChatCompletion> {
  let lastError: unknown;

  for (const { client, model } of PROVIDERS) {
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
      const isRateLimit = msg.includes("429") || msg.includes("rate limit") || msg.includes("Rate limit");
      if (!isRateLimit) throw err;
      console.warn(`Rate limited on ${model}, trying next...`);
    }
  }

  throw lastError;
}

export async function chatWithWojak(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const response = await callWithFallback(
    [{ role: "system", content: WOJAK_SYSTEM_PROMPT }, ...messages],
    200,
    0.9
  );

  return response.choices[0]?.message?.content || "ser... the bogdanoffs got to me. try again.";
}

export type MoodType = "cope" | "hype" | "doom" | "panic" | "smug";

export async function classifyMoodAndCaption(
  prompt: string
): Promise<{ mood: MoodType; caption: string }> {
  const response = await callWithFallback(
    [
      {
        role: "system",
        content: `You are a meme caption generator for Wojak memes. Given a user prompt, respond with ONLY valid JSON:
{"mood": "cope|hype|doom|panic|smug", "caption": "funny meme caption text"}

Mood guide (pick the Wojak variant that matches):
- cope: Bloomer energy. Forced positivity, touching grass, "this is fine" while everything burns. Somehow still vibing. Template: bloomer/cozy wojak
- hype: Chad Wojak energy. Bought the dip, called the pump, looking down at paper hands. Maximum confidence. Template: chad wojak
- doom: Doomer energy. 3am charts, beanie on, nightwalk mode. "it's so over" but still holding. Template: doomer wojak
- panic: Pink Wojak. Portfolio on fire, eyes bleeding, bogdanoff just called. Pure unfiltered pain. Template: pink/panicking wojak
- smug: Big brain Wojak. Intellectually superior. Saw it coming. "told you so" energy without saying it. Template: brain/smug wojak

Caption rules:
- Reference specific Wojak lore when it fits (bogdanoff, bobo, mumu, wagie, etc.)
- Written in authentic degen speak
- Short (max 15 words)
- Top text + bottom text format separated by |

Example: {"mood": "doom", "caption": "me after buying the top|watching my portfolio evaporate"}`,
      },
      { role: "user", content: prompt },
    ],
    100,
    0.8
  );

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
