import { AboutStats } from "@/components/AboutStats";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Hero header with image */}
      <div className="text-center fade-in-up">
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

        <h1 className="text-4xl md:text-5xl font-bold glow glitch mb-2">
          $WOJAK
        </h1>
        <p className="text-green-600 text-sm">
          &#10217; the token that feels everything
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      </div>

      {/* Animated Stats */}
      <AboutStats />

      {/* What is Agent Wojak */}
      <div className="border border-green-900 rounded-lg p-6 fade-in-up delay-2 border-glow">
        <h2 className="text-lg glow mb-3">{"// "}WHAT IS AGENT WOJAK?</h2>
        <p className="text-green-500 text-sm leading-relaxed">
          Agent Wojak is an autonomous AI agent living on the Solana blockchain.
          He chats with degens, generates memes, and feels the market harder than
          anyone. He&apos;s not just a token &mdash; he&apos;s a vibe. A dramatic,
          emotionally volatile, degen vibe.
        </p>
      </div>

      {/* Token Info — terminal readout style */}
      <div className="border border-green-900 rounded-lg overflow-hidden fade-in-up delay-3 border-glow">
        {/* Terminal title bar */}
        <div className="bg-green-900/20 border-b border-green-900 px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/30" />
          <div className="w-2 h-2 rounded-full bg-green-500/15" />
          <span className="text-green-600 text-xs ml-2">
            wojak@solana:~$ cat token_info.conf
          </span>
        </div>

        <div className="p-6 space-y-0 font-mono text-sm">
          <div className="flex justify-between border-b border-green-900/20 py-2 hover:bg-green-900/10 transition-colors px-2">
            <span className="text-green-700">TOKEN</span>
            <span className="text-green-400">$WOJAK</span>
          </div>
          <div className="flex justify-between border-b border-green-900/20 py-2 hover:bg-green-900/10 transition-colors px-2">
            <span className="text-green-700">CHAIN</span>
            <span className="text-green-400">SOLANA</span>
          </div>
          <div className="flex justify-between border-b border-green-900/20 py-2 hover:bg-green-900/10 transition-colors px-2">
            <span className="text-green-700">PLATFORM</span>
            <span className="text-green-400">PUMP.FUN</span>
          </div>
          <div className="flex justify-between border-b border-green-900/20 py-2 hover:bg-green-900/10 transition-colors px-2">
            <span className="text-green-700">STATUS</span>
            <span className="text-green-400 flex items-center gap-2">
              <span className="pulse-dot" />
              ONLINE
            </span>
          </div>
          <div className="flex justify-between py-2 hover:bg-green-900/10 transition-colors px-2">
            <span className="text-green-700">CA</span>
            <span className="text-green-400 text-xs break-all">TBD</span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border border-green-900 rounded-lg p-6 fade-in-up delay-4 border-glow">
        <h2 className="text-lg glow mb-3">{"// "}LINKS</h2>
        <div className="flex flex-col gap-3">
          <a
            href="https://pump.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-700/60 rounded px-4 py-3 text-center hover:bg-green-900/20 hover:text-white transition-all img-glow"
          >
            [ BUY ON PUMP.FUN ]
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-700/60 rounded px-4 py-3 text-center hover:bg-green-900/20 hover:text-white transition-all img-glow"
          >
            [ TELEGRAM ]
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-green-900 text-xs text-center fade-in-up delay-5">
        $WOJAK is a memecoin with no intrinsic value or expectation of financial
        return. this is not financial advice. dyor. nfa. probably nothing.
      </p>
    </div>
  );
}
