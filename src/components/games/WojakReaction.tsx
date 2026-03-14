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

export function WojakReaction({ result, commentary }: WojakReactionProps) {
  return (
    <div className="flex items-start gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageMap[result]}
        alt={`Wojak ${result}`}
        className="w-16 h-16 rounded border border-green-900 object-cover flex-shrink-0"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={commentary}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="text-green-400 text-sm italic pt-1"
        >
          {commentary}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
