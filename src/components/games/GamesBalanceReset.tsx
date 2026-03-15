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
        className="text-green-700 hover:text-green-400 text-xs transition-colors"
      >
        [RESET]
      </button>
    </div>
  );
}
