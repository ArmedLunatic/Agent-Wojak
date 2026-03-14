export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold glow mb-2">$WOJAK</h1>
        <p className="text-green-600 text-sm">
          ⟩ the token that feels everything
        </p>
      </div>

      {/* What is Agent Wojak */}
      <div className="border border-green-900 rounded-lg p-6">
        <h2 className="text-lg glow mb-3">{"// "}WHAT IS AGENT WOJAK?</h2>
        <p className="text-green-500 text-sm leading-relaxed">
          Agent Wojak is an autonomous AI agent living on the Solana blockchain.
          He chats with degens, generates memes, and feels the market harder than
          anyone. He&apos;s not just a token — he&apos;s a vibe. A dramatic, emotionally
          volatile, degen vibe.
        </p>
      </div>

      {/* Token Info */}
      <div className="border border-green-900 rounded-lg p-6">
        <h2 className="text-lg glow mb-3">{"// "}TOKEN INFO</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-green-900/30 pb-2">
            <span className="text-green-700">TOKEN:</span>
            <span className="text-green-400">$WOJAK</span>
          </div>
          <div className="flex justify-between border-b border-green-900/30 pb-2">
            <span className="text-green-700">CHAIN:</span>
            <span className="text-green-400">SOLANA</span>
          </div>
          <div className="flex justify-between border-b border-green-900/30 pb-2">
            <span className="text-green-700">PLATFORM:</span>
            <span className="text-green-400">PUMP.FUN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">CA:</span>
            <span className="text-green-400 text-xs break-all">
              TBD
            </span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border border-green-900 rounded-lg p-6">
        <h2 className="text-lg glow mb-3">{"// "}LINKS</h2>
        <div className="flex flex-col gap-3">
          <a
            href="https://pump.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-900 rounded px-4 py-3 text-center hover:bg-green-900/20 transition-colors"
          >
            [ BUY ON PUMP.FUN ]
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-900 rounded px-4 py-3 text-center hover:bg-green-900/20 transition-colors"
          >
            [ TELEGRAM ]
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-green-900 text-xs text-center">
        $WOJAK is a memecoin with no intrinsic value or expectation of financial
        return. this is not financial advice. dyor. nfa. probably nothing.
      </p>
    </div>
  );
}
