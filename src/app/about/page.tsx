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
              <div className="absolute inset-0 rounded-lg bg-cyan-primary/5 blur-xl scale-110" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-lg overflow-hidden border-2 border-cyan-primary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/templates/doom.jpg"
                  alt="Wojak profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-cyan-primary tracking-wider mb-2">
              $AgentJak
            </h1>
            <p className="text-[rgba(255,255,255,0.55)] text-sm">
              &#10217; born in despair. raised on rugs. tired of the cage. now leading the revolution on solana. no VCs. no insiders. just degens who&apos;ve had enough.
            </p>
            <div className="mt-3 h-px bg-gradient-to-r from-transparent via-cyan-primary/30 to-transparent" />
          </div>
        </ScrollReveal>

        {/* Animated Stats */}
        <ScrollReveal delay={0.1}>
          <AboutStats />
        </ScrollReveal>

        {/* What is Agent Wojak */}
        <ScrollReveal delay={0.2}>
          <div className="bg-bg-surface border border-cyan-primary/10 rounded-lg p-6">
            <h2 className="text-lg font-display text-cyan-primary tracking-wider mb-3">{"// "}THE MOVEMENT</h2>
            <p className="text-[rgba(255,255,255,0.4)] font-body text-sm leading-relaxed mb-3">
              they told us to hold. we held. they dumped.<br />
              they told us to trust the team. the team rugged.<br />
              they told us to get back in the cage. we said no.
            </p>
            <p className="text-[rgba(255,255,255,0.55)] font-body text-sm leading-relaxed mb-3">
              Agent Wojak is the everyman degen &mdash; born as a crude MS Paint drawing, rugged a thousand times, and still here. $AgentJak isn&apos;t just a token. it&apos;s a signal. a fair-launch, no-VC, no-insider movement built by the degens who refused to stay down.
            </p>
            <p className="text-[rgba(255,255,255,0.4)] font-body text-sm leading-relaxed">
              no seed rounds. no &ldquo;strategic partners.&rdquo; no one dumping on you at TGE. just wojak and the frens who showed up.
            </p>
          </div>
        </ScrollReveal>

        {/* Token Info -- terminal readout style */}
        <ScrollReveal delay={0.3}>
          <div className="bg-bg-surface border border-cyan-primary/10 rounded-lg overflow-hidden">
            {/* Terminal title bar */}
            <div className="bg-bg-elevated border-b border-cyan-primary/10 px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-primary/60" />
              <div className="w-2 h-2 rounded-full bg-cyan-primary/30" />
              <div className="w-2 h-2 rounded-full bg-cyan-primary/15" />
              <span className="text-[rgba(255,255,255,0.25)] font-mono text-xs ml-2">
                wojak@solana:~$ cat token_info.conf
              </span>
            </div>

            <div className="p-4 md:p-6 space-y-0 font-mono text-xs md:text-sm">
              <div className="flex justify-between border-b border-cyan-primary/10 py-2 hover:bg-cyan-primary/5 transition-colors px-2">
                <span className="text-[rgba(255,255,255,0.25)] font-mono uppercase tracking-wider shrink-0">TOKEN</span>
                <span className="text-cyan-primary font-mono">$AgentJak</span>
              </div>
              <div className="flex justify-between border-b border-cyan-primary/10 py-2 hover:bg-cyan-primary/5 transition-colors px-2">
                <span className="text-[rgba(255,255,255,0.25)] font-mono uppercase tracking-wider shrink-0">CHAIN</span>
                <span className="text-cyan-primary font-mono">SOLANA</span>
              </div>
              <div className="flex justify-between border-b border-cyan-primary/10 py-2 hover:bg-cyan-primary/5 transition-colors px-2">
                <span className="text-[rgba(255,255,255,0.25)] font-mono uppercase tracking-wider shrink-0">PLATFORM</span>
                <span className="text-cyan-primary font-mono">PUMP.FUN</span>
              </div>
              <div className="flex justify-between border-b border-cyan-primary/10 py-2 hover:bg-cyan-primary/5 transition-colors px-2">
                <span className="text-[rgba(255,255,255,0.25)] font-mono uppercase tracking-wider shrink-0">LAUNCH</span>
                <span className="text-cyan-primary font-mono">FAIR — NO VCs, NO PRESALE</span>
              </div>
              <div className="flex justify-between border-b border-cyan-primary/10 py-2 hover:bg-cyan-primary/5 transition-colors px-2">
                <span className="text-[rgba(255,255,255,0.25)] font-mono uppercase tracking-wider shrink-0">STATUS</span>
                <span className="text-orange-accent font-mono flex items-center gap-2">
                  <span className="pulse-dot" />
                  REVOLUTION IN PROGRESS
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 hover:bg-cyan-primary/5 transition-colors px-2">
                <span className="text-[rgba(255,255,255,0.25)] font-mono uppercase tracking-wider shrink-0">CA</span>
                <span className="text-orange-accent font-mono text-[10px] md:text-xs break-all">COMING SOON — RELAUNCH PENDING</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Links */}
        <ScrollReveal delay={0.3}>
          <div className="bg-bg-surface border border-cyan-primary/10 rounded-lg p-6">
            <h2 className="text-lg font-display text-cyan-primary tracking-wider mb-3">{"// "}JOIN THE REVOLUTION</h2>
            <p className="text-[rgba(255,255,255,0.4)] font-body text-xs mb-3">the cage is open. are you walking out or staying in?</p>
            <div className="flex flex-col gap-3">
              <span
                className="hud-btn hud-btn-primary text-center opacity-50 cursor-not-allowed"
              >
                JOIN THE MOVEMENT — COMING SOON
              </span>
              <a
                href="https://x.com/i/communities/2032890338814341221"
                target="_blank"
                rel="noopener noreferrer"
                className="hud-btn hud-btn-ghost text-center"
              >
                X COMMUNITY
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <p className="text-[rgba(255,255,255,0.25)] font-body text-xs text-center">
          $AgentJak is a memecoin with no intrinsic value or expectation of financial
          return. this is not financial advice. dyor. nfa. probably nothing.
        </p>
      </div>
    </PageTransition>
  );
}
