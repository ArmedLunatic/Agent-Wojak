"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BalanceDisplayProps {
  balance: number;
}

export function BalanceDisplay({ balance }: BalanceDisplayProps) {
  const formatted = balance.toLocaleString();

  return (
    <div className="flex items-center gap-2 font-mono">
      <span className="text-[rgba(255,255,255,0.25)] font-mono text-sm">$WOJAK:</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={balance}
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-cyan-primary font-mono text-lg"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
