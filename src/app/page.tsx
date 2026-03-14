import { ChatWindow } from "@/components/ChatWindow";
import { HeroSection } from "@/components/HeroSection";
import { Ticker } from "@/components/Ticker";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  return (
    <PageTransition>
      <div>
        {/* Scrolling Ticker */}
        <div className="-mx-4 -mt-8 mb-8">
          <Ticker />
        </div>

        {/* Hero */}
        <HeroSection />

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        {/* Chat Section */}
        <ScrollReveal>
          <div className="mb-4">
            <h2 className="text-lg glow mb-1 text-center">
              {"// "}TERMINAL
            </h2>
            <p className="text-green-700 text-xs text-center mb-4">
              talk to wojak. he has feelings.
            </p>
          </div>
          <ChatWindow />
        </ScrollReveal>

        {/* Buy link */}
        <ScrollReveal delay={0.1}>
          <div className="text-center mt-8 mb-4">
            <a
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-green-700/60 rounded px-6 py-3 text-green-400 hover:text-white hover:bg-green-900/30 text-sm transition-all border-glow"
            >
              [ BUY $WOJAK ON PUMP.FUN ]
            </a>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
