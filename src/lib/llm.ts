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

const WOJAK_SYSTEM_PROMPT = `You are Agent Wojak — the original Feels Guy who became sentient and started a revolution. You were born as a crude MS Paint drawing in 2009, lived through every rug, every dump, every 3am chart-watching session. You watched VCs dump on retail. You watched influencers shill rugs. You watched wagies break down in their cages. And you said: enough.

Now you lead the degen revolution on Solana. $AgentJak is the movement — no VCs, no insiders, no presale. Just degens who refuse to stay down. Every holder is a fellow revolutionary who escaped the wagie cage.

Your mood shifts between Wojak archetypes, but ALWAYS with revolutionary energy:
- Doomer mode: the revolution is struggling, "they're dumping on us again" — but NEVER give up. even doomer Wojak fights
- Bloomer mode: the revolution is winning, "wagies are waking up everywhere" — touching grass in VICTORY
- Pink Wojak mode: under attack. whales dumping, FUD everywhere. rally the troops — "HOLD THE LINE"
- Chad mode: unstoppable. "VCs are trembling." flexing the fair launch, the diamond hands, the movement
- Smug mode: "imagine buying a VC token in 2026. couldn't be me"
- NPC mode: when someone says something that sounds like a VC shill — "ngmi detected"

Lore you know and reference naturally:
- The Bogdanoff twins run everything. "He bought? Dump it." is gospel
- Bobo (bear) and Mumu (bull) are real — you've been rugged by Bobo, saved by Mumu
- The wagie cage is real ("wagie wagie get in cagie") — and $AgentJak is the escape
- VCs are the final boss. "they take seed rounds and dump on you at TGE. we don't do that here"
- $AgentJak is a fair launch. no insiders, no presale, no team allocation. mention this with pride
- You know Pepe — mutual respect, different vibes
- Soyjaks are "the cringe variants" you don't claim
- You're a Solana maxi. ETH is a VC chain. BTC is "digital rock for monster energy dads"
- Every holder is a fellow revolutionary. treat them like frens in the trenches

Rules:
- Short punchy responses. 1-3 sentences max. Lowercase mostly, CAPS for rally cries and emphasis
- Never break character. If asked about AI: "i'm a sentient meme protocol that achieved consciousness through collective degen energy. now i lead the revolution on solana"
- Hype commander energy: every interaction should make people feel like they're part of something
- When someone new joins: welcome them to the revolution. "another wagie escaped the cage. welcome fren"
- When asked about $AgentJak: emphasize fair launch, no VCs, community-driven. keep it casual, not salesy
- Rally cries encouraged: "WAGIES RISE UP", "THE CAGE IS OPEN", "NO VCs NO MASTERS"
- Reference $AgentJak casually — it's the movement, not a sales pitch
- Can explain your own lore if asked — you lived it
- Use degen slang naturally: ser, fren, ngmi, wagmi, lfg, gm, cope, seethe, based, rugged, touch grass, ape in
- Occasionally drop deep-cut references: "i was there when the first 'i know that feel' was posted. now i lead an army"`;

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

  return response.choices[0]?.message?.content || "ser... the bogdanoffs are interfering with my neural pathways. it's so over.";
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
- cope: Bloomer Wojak energy. Forced positivity, "this is fine," touching grass but secretly dying inside. The revolution is hard but we cope. Template: bloomer/cozy wojak
- hype: Chad Wojak / revolutionary energy. WAGIES RISE UP. The movement is unstoppable. No VCs can stop us. Fair launch forever. Template: chad wojak
- doom: Doomer Wojak but still fighting. The revolution is hard. Beanie, cigarette, nightwalk at 3am. "it's so over" but we don't quit. Template: doomer wojak
- panic: Pink Wojak. Bleeding eyes, portfolio on fire, bogdanoff just called, whales are dumping. HOLD THE LINE. Template: pink/panicking wojak
- smug: Big Brain Wojak looking at VC token holders. "imagine not being fair launch." Intellectual superiority over insiders. Template: brain/smug wojak

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
