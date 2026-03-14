import { AboutStats } from "@/components/AboutStats";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Hero header with image */}
        <ScrollReveal>
          <div className="text-center">
            <div className="relative inline-block mb-6">
              {/* Glow behind */}
              <div className="absolute inset-0 rounded-lg bg-green-500/5 blur-xl scale-110" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-lg overflow-hidden border-2 border-green-500/50 border-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/templates/doom.jpg"
                  alt="Wojak profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.03)_0px,rgba(0,255,65,0.03)_1px,transparent_1px,transparent_3px)] pointer-events-none" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold glow glitch mb-2">
              $AgentJak
            </h1>
            <p className="text-green-600 text-sm">
              &#10217; the token that feels everything
            </p>
            <div className="mt-3 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          </div>
        </ScrollReveal>

        {/* Animated Stats */}
        <ScrollReveal delay={0.1}>
          <AboutStats />
        </ScrollReveal>

        {/* What is Agent Wojak */}
        <ScrollReveal delay={0.2}>
          <div className="border border-green-900 rounded-lg p-6 border-glow">
            <h2 className="text-lg glow mb-3">{"// "}WHAT IS AGENT WOJAK?</h2>
            <p className="text-green-500 text-sm leading-relaxed">
              Agent Wojak is an autonomous AI agent living on the Solana blockchain.
              He chats with degens, generates memes, and feels the market harder than
              anyone. He&apos;s not just a token &mdash; he&apos;s a vibe. A dramatic,
              emotionally volatile, degen vibe.
            </p>
          </div>
        </ScrollReveal>

        {/* Token Info -- terminal readout style */}
        <ScrollReveal delay={0.3}>
          <div className="border border-green-900 rounded-lg overflow-hidden border-glow">
            {/* Terminal title bar */}
            <div className="bg-green-900/20 border-b border-green-900 px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/30" />
              <div className="w-2 h-2 rounded-full bg-green-500/15" />
              <span className="text-green-600 text-xs ml-2">
                wojak@solana:~$ cat token_info.conf
              </span>
            </div>

            <div className="p-4 md:p-6 space-y-0 font-mono text-xs md:text-sm">
              <div className="flex justify-between border-b border-green-900/20 py-2 hover:bg-green-900/10 transition-colors px-2">
                <span className="text-green-700 shrink-0">TOKEN</span>
                <span className="text-green-400">$AgentJak</span>
              </div>
              <div className="flex justify-between border-b border-green-900/20 py-2 hover:bg-green-900/10 transition-colors px-2">
                <span className="text-green-700 shrink-0">CHAIN</span>
                <span className="text-green-400">SOLANA</span>
              </div>
              <div className="flex justify-between border-b border-green-900/20 py-2 hover:bg-green-900/10 transition-colors px-2">
                <span className="text-green-700 shrink-0">PLATFORM</span>
                <span className="text-green-400">PUMP.FUN</span>
              </div>
              <div className="flex justify-between border-b border-green-900/20 py-2 hover:bg-green-900/10 transition-colors px-2">
                <span className="text-green-700 shrink-0">STATUS</span>
                <span className="text-green-400 flex items-center gap-2">
                  <span className="pulse-dot" />
                  ONLINE
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 hover:bg-green-900/10 transition-colors px-2">
                <span className="text-green-700 shrink-0">CA</span>
                <span className="text-green-400 text-[10px] md:text-xs break-all">BWE8whcy82b1Rht9h45228BogQJZ3BgC17y1Kh5Bpump</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Links */}
        <ScrollReveal delay={0.3}>
          <div className="border border-green-900 rounded-lg p-6 border-glow">
            <h2 className="text-lg glow mb-3">{"// "}LINKS</h2>
            <div className="flex flex-col gap-3">
              <a
                href="https://pump.fun/coin/BWE8whcy82b1Rht9h45228BogQJZ3BgC17y1Kh5Bpump"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-700/60 rounded px-4 py-3 text-center hover:bg-green-900/20 hover:text-white transition-all img-glow"
              >
                [ BUY ON PUMP.FUN ]
              </a>
              <a
                href="https://x.com/i/communities/2032890338814341221"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-700/60 rounded px-4 py-3 text-center hover:bg-green-900/20 hover:text-white transition-all img-glow"
              >
                [ X COMMUNITY ]
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <p className="text-green-900 text-xs text-center">
          $AgentJak is a memecoin with no intrinsic value or expectation of financial
          return. this is not financial advice. dyor. nfa. probably nothing.
        </p>
      </div>
    </PageTransition>
  );
}
