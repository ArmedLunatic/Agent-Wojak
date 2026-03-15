"use client";

import { AnimatePresence, motion } from "framer-motion";

interface WojakReactionProps {
  result: "win" | "lose" | "neutral";
  commentary: string;
}

const imageMap: Record<WojakReactionProps["result"], string> = {
  win: "/templates/hype.jpg",
  lose: "/templates/cope.jpg",
  neutral: "/templates/default.jpg",
};

const feelsMap: Record<WojakReactionProps["result"], string> = {
  win: "BLOOMER",
  lose: "DOOMER",
  neutral: "COPING",
};

export function WojakReaction({ result, commentary }: WojakReactionProps) {
  return (
    <div className="flex items-start gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="border border-cyan-primary/30 rounded flex-shrink-0">
        <img
          src={imageMap[result]}
          alt={`Wojak ${result}`}
          className="w-16 h-16 rounded object-cover"
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={commentary}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="font-mono text-[rgba(255,255,255,0.55)] text-sm pt-1"
        >
          {`◆ ANALYSIS: "${commentary}" [FEELS: ${feelsMap[result]}]`}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
