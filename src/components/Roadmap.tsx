"use client";

import { motion } from "framer-motion";

type Phase = {
  number: number;
  title: string;
  subtitle: string;
  status: "complete" | "in-progress" | "locked";
  icon: string;
  items: string[];
};

const PHASES: Phase[] = [
  {
    number: 1,
    title: "THE AWAKENING",
    subtitle: "one degen wakes up. looks around the cage. decides enough is enough.",
    status: "complete",
    icon: "⚡",
    items: [
      "Revolution HQ goes live — the website",
      "Wojak AI chat — talk to the movement's leader",
      "Meme Studio — arm the degens with propaganda",
      "Template Gallery — the archives of our struggle",
      "RNG Oracle — on-chain fate, no manipulation",
      "Mini Games Arcade — even revolutionaries need to gamble",
      "$AgentJak fair launch on Pump.fun — no VCs invited",
    ],
  },
  {
    number: 2,
    title: "THE RECRUITMENT",
    subtitle: "the word spreads. more wagies wake up. the movement grows.",
    status: "in-progress",
    icon: "🧠",
    items: [
      "Agent Wojak bot goes live on X — broadcasting the revolution",
      "Auto-posts rally cries, market reactions, and degen dispatches",
      "Real-time sentiment — Wojak feels the market so you don't have to",
      "Consistent revolutionary personality across site + X",
      "Growing the diamond hands army",
    ],
  },
  {
    number: 3,
    title: "THE REVOLT",
    subtitle: "enough wagies have woken up. time to shake the cages. VCs are nervous.",
    status: "locked",
    icon: "👁",
    items: [
      "Advanced market sentiment engine — know what the whales know",
      "Auto-generated propaganda memes from live market data → X",
      "Community raid coordination & trending topic alerts",
      "Quote-tweet engagement — ratio the influencer shills",
      "Token holder war room on site",
    ],
  },
  {
    number: 4,
    title: "FREEDOM",
    subtitle: "the cage is empty. the revolution won. wagies walk free. gm.",
    status: "locked",
    icon: "🌌",
    items: [
      "Fully autonomous multi-platform agent — the revolution runs itself",
      "Expand to Telegram & Discord — every platform, every wagie",
      "On-chain analytics and real-time alpha for the army",
      "Agent-to-agent alliances with other AI projects",
      "Revenue sharing with $AgentJak diamond hands",
      "Community governance — the degens run the revolution",
    ],
  },
];

function StatusBadge({ status }: { status: Phase["status"] }) {
  if (status === "complete") {
    return (
      <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-primary/20 text-cyan-primary">
        DEPLOYED
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-accent/20 text-orange-accent animate-pulse">
        IN PROGRESS
      </span>
    );
  }
  return (
    <span className="text-xs font-mono px-2 py-0.5 rounded border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.25)]">
      LOCKED
    </span>
  );
}

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const isLocked = phase.status === "locked";
  const isComplete = phase.status === "complete";
  const isInProgress = phase.status === "in-progress";

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 25 }}
      className="relative"
    >
      {/* Timeline connector */}
      {index < PHASES.length - 1 && (
        <div className="absolute left-6 top-full w-px h-8 bg-cyan-primary/20" />
      )}

      <div
        className={`border rounded-lg overflow-hidden transition-all bg-bg-surface ${
          isComplete
            ? "border-cyan-primary/40 hud-glow"
            : isInProgress
            ? "border-orange-accent/20"
            : "border-[rgba(255,255,255,0.05)] opacity-40"
        }`}
      >
        {/* Phase header */}
        <div className="px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4">
          {/* Phase icon */}
          <div
            className={`text-2xl md:text-3xl shrink-0 ${
              isLocked ? "opacity-30 grayscale" : ""
            }`}
          >
            {phase.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3
                className={`text-sm md:text-base font-bold tracking-wider ${
                  isLocked
                    ? "text-[rgba(255,255,255,0.25)]"
                    : isInProgress
                    ? "text-orange-accent"
                    : "text-cyan-primary"
                }`}
              >
                PHASE {phase.number}: {phase.title}
              </h3>
              <StatusBadge status={phase.status} />
            </div>
            <p className={`text-xs ${isLocked ? "text-[rgba(255,255,255,0.15)]" : "text-[rgba(255,255,255,0.4)]"}`}>
              {"\u27E9"} {phase.subtitle}
            </p>
          </div>
        </div>

        {/* Deliverables */}
        <div className="px-4 md:px-6 py-4 space-y-2">
          {phase.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs md:text-sm">
              <span
                className={`shrink-0 mt-0.5 ${
                  isComplete
                    ? "text-cyan-primary"
                    : isInProgress
                    ? "text-orange-accent"
                    : "text-[rgba(255,255,255,0.25)]"
                }`}
              >
                {isComplete ? "✓" : isInProgress ? "▸" : "○"}
              </span>
              <span
                className={
                  isComplete
                    ? "text-cyan-primary/80"
                    : isInProgress
                    ? "text-[rgba(255,255,255,0.6)]"
                    : "text-[rgba(255,255,255,0.25)]"
                }
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Locked overlay hint */}
        {isLocked && (
          <div className="px-4 md:px-6 pb-4">
            <p className="text-[10px] md:text-xs text-[rgba(255,255,255,0.15)] italic">
              unlocked when the army is ready...
            </p>
          </div>
        )}

        {/* Scanline overlay for locked phases */}
        {isLocked && (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,240,0.01)_0px,rgba(0,255,240,0.01)_1px,transparent_1px,transparent_3px)] pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}

export function Roadmap() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl md:text-3xl text-cyan-primary mb-2">
          PROTOCOL://ROADMAP
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-xs md:text-sm">
          {"\u27E9"} from wagie cage to full revolution // the plan
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-cyan-primary/20 to-transparent" />
      </div>

      {/* Progress bar */}
      <div className="border border-cyan-primary/10 rounded-lg p-3 md:p-4 mb-6 bg-bg-surface">
        <div className="flex items-center justify-between text-xs text-[rgba(255,255,255,0.4)] mb-2">
          <span>OVERALL PROGRESS</span>
          <span className="text-cyan-primary font-mono">25%</span>
        </div>
        <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[rgba(255,255,255,0.25)] mt-1">
          <span>AWAKEN</span>
          <span>RECRUIT</span>
          <span>REVOLT</span>
          <span>FREEDOM</span>
        </div>
      </div>

      {/* Phase cards */}
      <div className="space-y-8">
        {PHASES.map((phase, i) => (
          <PhaseCard key={phase.number} phase={phase} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div className="border border-cyan-primary/10 rounded-lg p-6 text-center mt-8 bg-bg-surface">
        <h2 className="text-lg text-cyan-primary font-mono mb-3">{"// "}JOIN THE REVOLUTION</h2>
        <p className="text-[rgba(255,255,255,0.4)] text-sm mb-4">
          every holder is another wagie who escaped the cage. are you in or are you ngmi?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <span
            className="hud-btn hud-btn-accent text-sm opacity-50 cursor-not-allowed"
          >
            [ BUY $AgentJak — COMING SOON ]
          </span>
          <a
            href="https://x.com/i/communities/2032890338814341221"
            target="_blank"
            rel="noopener noreferrer"
            className="hud-btn hud-btn-primary text-sm"
          >
            [ JOIN X COMMUNITY ]
          </a>
        </div>
      </div>
    </div>
  );
}
