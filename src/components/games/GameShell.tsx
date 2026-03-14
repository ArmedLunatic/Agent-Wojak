"use client";

import { BalanceDisplay } from "./BalanceDisplay";
import { WojakReaction } from "./WojakReaction";

interface GameShellProps {
  title: string;
  children: React.ReactNode;
  balance: number;
  result?: "win" | "lose" | "neutral";
  commentary?: string;
}

export function GameShell({ title, children, balance, result, commentary }: GameShellProps) {
  return (
    <div className="border border-green-900 rounded-lg p-4 md:p-6 border-glow space-y-4">
      {/* Header */}
      <h2 className="text-lg glow mb-3">
        {"// "}
        {title}
      </h2>

      {/* Balance */}
      <BalanceDisplay balance={balance} />

      {/* Game UI */}
      <div>{children}</div>

      {/* Wojak Reaction */}
      {result && commentary && (
        <div className="pt-2 border-t border-green-900/50">
          <WojakReaction result={result} commentary={commentary} />
        </div>
      )}
    </div>
  );
}
