"use client";

import { useGameBalance } from "./useGameBalance";
import { BalanceDisplay } from "./BalanceDisplay";

export function GamesBalanceReset() {
  const { balance, resetBalance } = useGameBalance();

  return (
    <div className="flex items-center gap-4">
      <BalanceDisplay balance={balance} />
      <button
        onClick={resetBalance}
        className="hud-btn hud-btn-ghost text-xs font-mono text-[rgba(255,255,255,0.55)]"
      >
        RESET BALANCE
      </button>
    </div>
  );
}
