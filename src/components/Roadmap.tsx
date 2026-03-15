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
    title: "GENESIS",
    subtitle: "the foundation has been laid ser",
    status: "complete",
    icon: "⚡",
    items: [
      "Website launch with full terminal UI",
      "Wojak AI chat — multi-provider LLM with personality",
      "Meme Studio — AI-powered caption + template generation",
      "Template Gallery with Wojak archives",
      "RNG Oracle — on-chain payment-gated random numbers",
      "Mini Games Arcade — Slots, Roulette, Pump or Dump",
      "$AgentJak token live on Pump.fun",
    ],
  },
  {
    number: 2,
    title: "THE AWAKENING",
    subtitle: "wojak learns to post",
    status: "in-progress",
    icon: "🧠",
    items: [
      "Agent Wojak X/Twitter bot goes live",
      "Auto-posts market commentary & degen meme takes",
      "Real-time crypto sentiment reactions",
      "Replies to mentions and engages with CT",
      "Consistent Wojak personality across site + X",
    ],
  },
  {
    number: 3,
    title: "SENTIENCE",
    subtitle: "the agent sees everything",
    status: "locked",
    icon: "👁",
    items: [
      "Advanced market sentiment analysis engine",
      "Auto-generated memes from live market data → X",
      "Community raid coordination & trending topic alerts",
      "Quote-tweet engagement with CT influencers",
      "Token holder dashboard on site",
    ],
  },
  {
    number: 4,
    title: "SINGULARITY",
    subtitle: "fully autonomous degen AI",
    status: "locked",
    icon: "🌌",
    items: [
      "Fully autonomous multi-platform agent ecosystem",
      "Expand to Telegram & Discord with unified personality",
      "On-chain analytics and real-time alpha calls",
      "Agent-to-agent interactions with other AI projects",
      "Revenue sharing with $AgentJak holders",
      "Community governance for agent behavior",
    ],
  },
];

function StatusBadge({ status }: { status: Phase["status"] }) {
  if (status === "complete") {
    return (
      <span className="text-xs font-mono px-2 py-0.5 rounded border border-green-500/60 text-green-400 bg-green-900/30">
        [COMPLETE]
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="text-xs font-mono px-2 py-0.5 rounded border border-green-500/60 text-green-300 bg-green-900/20 animate-pulse">
        [IN PROGRESS]
      </span>
    );
  }
  return (
    <span className="text-xs font-mono px-2 py-0.5 rounded border border-green-900 text-green-800 bg-green-900/10">
      🔒 [LOCKED]
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
        <div
          className={`absolute left-6 top-full w-px h-8 border-l-2 border-dashed ${
            isLocked ? "border-green-900/40" : "border-green-700/60"
          }`}
        />
      )}

      <div
        className={`border rounded-lg overflow-hidden transition-all ${
          isComplete
            ? "border-green-500/50 border-glow"
            : isInProgress
            ? "border-green-500/40 shadow-[0_0_15px_rgba(0,255,65,0.15)]"
            : "border-green-900/50"
        }`}
      >
        {/* Phase header */}
        <div
          className={`px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4 ${
            isLocked ? "bg-green-900/5" : "bg-green-900/20"
          }`}
        >
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
                    ? "text-green-800"
                    : "text-green-400 glow"
                } ${isInProgress ? "glitch" : ""}`}
              >
                PHASE {phase.number}: {phase.title}
              </h3>
              <StatusBadge status={phase.status} />
            </div>
            <p className={`text-xs ${isLocked ? "text-green-900" : "text-green-700"}`}>
              {"\u27E9"} {phase.subtitle}
            </p>
          </div>
        </div>

        {/* Deliverables */}
        <div className={`px-4 md:px-6 py-4 space-y-2 ${isLocked ? "opacity-40" : ""}`}>
          {phase.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs md:text-sm">
              <span
                className={`shrink-0 mt-0.5 ${
                  isComplete
                    ? "text-green-500"
                    : isInProgress
                    ? "text-green-600"
                    : "text-green-900"
                }`}
              >
                {isComplete ? "✓" : isInProgress ? "▸" : "○"}
              </span>
              <span
                className={
                  isComplete
                    ? "text-green-500"
                    : isInProgress
                    ? "text-green-400"
                    : "text-green-800"
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
            <p className="text-[10px] md:text-xs text-green-900 italic">
              unlocked with community support...
            </p>
          </div>
        )}

        {/* Scanline overlay for locked phases */}
        {isLocked && (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.02)_0px,rgba(0,255,65,0.02)_1px,transparent_1px,transparent_3px)] pointer-events-none" />
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
        <h1 className="text-2xl md:text-3xl font-bold glow glitch mb-2">
          ROADMAP
        </h1>
        <p className="text-green-600 text-xs md:text-sm">
          {"\u27E9"} from memecoin to autonomous agent // the plan
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      </div>

      {/* Progress bar */}
      <div className="border border-green-900 rounded-lg p-3 md:p-4 mb-6">
        <div className="flex items-center justify-between text-xs text-green-700 mb-2">
          <span>OVERALL PROGRESS</span>
          <span className="text-green-400 glow">25%</span>
        </div>
        <div className="h-2 bg-green-900/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            style={{ boxShadow: "0 0 10px #00FF41, 0 0 20px #00FF4160" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-green-800 mt-1">
          <span>GENESIS</span>
          <span>AWAKENING</span>
          <span>SENTIENCE</span>
          <span>SINGULARITY</span>
        </div>
      </div>

      {/* Phase cards */}
      <div className="space-y-8">
        {PHASES.map((phase, i) => (
          <PhaseCard key={phase.number} phase={phase} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div className="border border-green-900 rounded-lg p-6 border-glow text-center mt-8">
        <h2 className="text-lg glow mb-3">{"// "}JOIN THE MISSION</h2>
        <p className="text-green-500 text-sm mb-4">
          every holder brings us closer to full sentience ser
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://pump.fun/coin/BWE8whcy82b1Rht9h45228BogQJZ3BgC17y1Kh5Bpump"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-700/60 rounded px-6 py-3 text-center hover:bg-green-900/20 hover:text-white transition-all text-sm"
          >
            [ BUY $AgentJak ]
          </a>
          <a
            href="https://x.com/i/communities/2032890338814341221"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-700/60 rounded px-6 py-3 text-center hover:bg-green-900/20 hover:text-white transition-all text-sm"
          >
            [ JOIN X COMMUNITY ]
          </a>
        </div>
      </div>
    </div>
  );
}
