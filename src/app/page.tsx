import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold glow glitch mb-2">AGENT WOJAK</h1>
        <p className="text-green-600 text-sm">
          the most dramatic degen AI on solana // $WOJAK
        </p>
        <div className="mt-4 inline-block border border-green-900 rounded px-4 py-2 text-xs text-green-700">
          ⟩ STATUS: ONLINE // MOOD: VOLATILE // CHAIN: SOLANA
        </div>
      </div>

      {/* Chat */}
      <ChatWindow />

      {/* Buy link */}
      <div className="text-center mt-6">
        <a
          href="https://pump.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-400 text-sm transition-colors"
        >
          [ BUY $WOJAK ON PUMP.FUN ]
        </a>
      </div>
    </div>
  );
}
