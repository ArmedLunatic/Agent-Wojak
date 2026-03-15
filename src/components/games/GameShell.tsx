"use client";

import { BalanceDisplay } from "./BalanceDisplay";
import { WojakReaction } from "./WojakReaction";
import { useGameBalance } from "./useGameBalance";

interface GameShellProps {
  title: string;
  children: React.ReactNode;
  result?: "win" | "lose" | "neutral";
  commentary?: string;
}

export function GameShell({ title, children, result, commentary }: GameShellProps) {
  const { balance } = useGameBalance();
  return (
    <div className="bg-bg-deep border border-cyan-primary/20 rounded-lg p-4 md:p-6 space-y-4">
      {/* Header */}
      <h2 className="font-display text-cyan-primary tracking-wider uppercase text-lg mb-3">
        {title}
      </h2>

      {/* Balance */}
      <BalanceDisplay balance={balance} />

      {/* Game UI */}
      <div>{children}</div>

      {/* Wojak Reaction */}
      {result && commentary && (
        <div className="pt-2 border-t border-cyan-primary/20">
          <WojakReaction result={result} commentary={commentary} />
        </div>
      )}
    </div>
  );
}
