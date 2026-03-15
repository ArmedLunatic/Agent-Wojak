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
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-cyan-primary/30 to-transparent" />

        {/* Chat Section */}
        <ScrollReveal>
          <div className="mb-4">
            <h2 className="text-lg font-display text-cyan-primary tracking-wider mb-1 text-center">
              {"// "}TERMINAL
            </h2>
            <p className="text-[rgba(255,255,255,0.55)] font-body text-xs text-center mb-4">
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
              className="hud-btn hud-btn-accent inline-block"
            >
              ESCAPE THE WAGE CAGE — BUY $AGENTJAK ON PUMP.FUN
            </a>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
