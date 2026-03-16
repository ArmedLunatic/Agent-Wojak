"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { GameShell } from "./GameShell";
import { useGameBalance } from "./useGameBalance";
import { pickRandom } from "./utils";

const SYMBOLS = [
  { emoji: "🌙", name: "MOON", weight: 3 },
  { emoji: "💎", name: "DIAMOND", weight: 3 },
  { emoji: "🚀", name: "ROCKET", weight: 3 },
  { emoji: "📉", name: "RUG", weight: 4 },
  { emoji: "😭", name: "COPE", weight: 4 },
  { emoji: "🐸", name: "PEPE", weight: 2 },
];

const BET_PRESETS = [10, 50, 100];

const WIN_COMMENTS = [
  "escaped the grind. for now.",
  "mumu smiled upon you today, fren",
  "bloomer mode activated. we're so back",
];

const LOSE_COMMENTS = [
  "back to the charts, wagie",
  "doomer arc deepening. commencing nightwalk",
  "i know that feel, bro... i know that feel",
];

const BIG_WIN_COMMENTS = [
  "GIGACHAD ENERGY. broke free from the grind",
  "he pulled AND it paid?? bogdanoff in shambles",
  "chad wojak arc unlocked. wagmi",
];

// Build weighted pool for random selection
function buildWeightedPool() {
  const pool: (typeof SYMBOLS)[number][] = [];
  for (const sym of SYMBOLS) {
    for (let i = 0; i < sym.weight; i++) {
      pool.push(sym);
    }
  }
  return pool;
}

function weightedRandomSymbol(pool: (typeof SYMBOLS)[number][]) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function calculatePayout(
  reels: (typeof SYMBOLS)[number][],
  bet: number
): number {
  const [a, b, c] = reels.map((r) => r.name);

  // All three match
  if (a === b && b === c) {
    switch (a) {
      case "PEPE":
        return bet * 50;
      case "ROCKET":
        return bet * 20;
      case "DIAMOND":
        return bet * 15;
      case "MOON":
        return bet * 10;
      case "RUG":
        return bet * 3;
      case "COPE":
        return bet * 3;
      default:
        return 0;
    }
  }

  // Any two matching
  if (a === b || b === c || a === c) {
    return bet * 2;
  }

  // All different
  return 0;
}

// Number of symbols to show in each reel strip for the spin animation
const REEL_LENGTH = 20;
const SYMBOL_HEIGHT = 80; // px per symbol slot

export function WojakSlots() {
  const { balance, addBalance, subtractBalance } = useGameBalance();
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | "neutral" | undefined>(
    undefined
  );
  const [commentary, setCommentary] = useState<string | undefined>(undefined);
  const [lastPayout, setLastPayout] = useState<number | null>(null);

  const weightedPool = useMemo(() => buildWeightedPool(), []);

  // Each reel has a strip of symbols and a target Y position
  const [reelStrips, setReelStrips] = useState<(typeof SYMBOLS)[number][][]>(
    () => {
      return [0, 1, 2].map(() => {
        return Array.from({ length: REEL_LENGTH }, () =>
          weightedRandomSymbol(weightedPool)
        );
      });
    }
  );

  // The final index in each strip where the reel should land
  const [targetIndices, setTargetIndices] = useState([
    REEL_LENGTH - 2,
    REEL_LENGTH - 2,
    REEL_LENGTH - 2,
  ]);

  // Track which reels have stopped (for staggered animation)
  const [reelsStopped, setReelsStopped] = useState([true, true, true]);

  const spin = useCallback(() => {
    if (isSpinning || balance < betAmount) return;

    // Deduct bet
    subtractBalance(betAmount);
    setIsSpinning(true);
    setResult(undefined);
    setCommentary(undefined);
    setLastPayout(null);
    setReelsStopped([false, false, false]);

    // Pre-determine outcome
    const outcomes = [
      weightedRandomSymbol(weightedPool),
      weightedRandomSymbol(weightedPool),
      weightedRandomSymbol(weightedPool),
    ];

    // Build new reel strips with the target symbol placed near the end
    const landingIndex = REEL_LENGTH - 2;
    const newStrips = [0, 1, 2].map((i) => {
      const strip = Array.from({ length: REEL_LENGTH }, () =>
        weightedRandomSymbol(weightedPool)
      );
      // Place the determined outcome at the landing position
      strip[landingIndex] = outcomes[i];
      return strip;
    });

    setReelStrips(newStrips);
    setTargetIndices([landingIndex, landingIndex, landingIndex]);

    // Staggered stops
    const delays = [1000, 1800, 2500];
    delays.forEach((delay, i) => {
      setTimeout(() => {
        setReelsStopped((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, delay);
    });

    // After all reels stop, calculate result
    setTimeout(() => {
      const payout = calculatePayout(outcomes, betAmount);
      setLastPayout(payout);

      if (payout > 0) {
        addBalance(payout);
        if (payout >= betAmount * 10) {
          setResult("win");
          setCommentary(pickRandom(BIG_WIN_COMMENTS));
        } else {
          setResult("win");
          setCommentary(pickRandom(WIN_COMMENTS));
        }
      } else {
        setResult("lose");
        setCommentary(pickRandom(LOSE_COMMENTS));
      }

      setIsSpinning(false);
    }, 2700);
  }, [isSpinning, balance, betAmount, subtractBalance, addBalance, weightedPool]);

  return (
    <GameShell title="WOJAK SLOTS" result={result} commentary={commentary}>
      {/* Frame header */}
      <div className="font-mono text-sm text-cyan-primary tracking-wider mb-3">
        SIMULATION://SPIN_THE_COPE
      </div>

      {/* Terminal window frame */}
      <div className="border border-cyan-primary/20 rounded-lg overflow-hidden">
        {/* Title bar */}
        <div className="bg-bg-surface border-b border-cyan-primary/20 px-3 py-2 flex items-center gap-2">
          <span className="text-cyan-primary/40 text-xs">● ● ●</span>
          <span className="text-cyan-primary/40 text-xs">wojak@slots:~$</span>
        </div>

        {/* Slot machine area */}
        <div className="p-4 md:p-6">
          {/* Reels container */}
          <div className="relative flex justify-center gap-3 md:gap-4">
            {/* Pay line indicator */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t border-dashed border-cyan-primary/40 z-10 pointer-events-none" />

            {[0, 1, 2].map((reelIndex) => (
              <div
                key={reelIndex}
                className="bg-bg-surface border border-cyan-primary/10 rounded overflow-hidden"
                style={{
                  width: 90,
                  height: SYMBOL_HEIGHT,
                }}
              >
                <motion.div
                  animate={{
                    y: reelsStopped[reelIndex]
                      ? -(targetIndices[reelIndex] * SYMBOL_HEIGHT)
                      : -(REEL_LENGTH * SYMBOL_HEIGHT),
                  }}
                  transition={
                    reelsStopped[reelIndex]
                      ? {
                          type: "spring",
                          stiffness: 300 + reelIndex * 50,
                          damping: 20 + reelIndex * 2,
                        }
                      : {
                          duration: 0.3,
                          repeat: Infinity,
                          ease: "linear",
                        }
                  }
                  style={{ willChange: "transform" }}
                >
                  {reelStrips[reelIndex].map((symbol, symIndex) => (
                    <div
                      key={symIndex}
                      className="flex items-center justify-center text-4xl md:text-5xl"
                      style={{ height: SYMBOL_HEIGHT }}
                    >
                      {symbol.emoji}
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Result display */}
          {lastPayout !== null && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-4"
            >
              {lastPayout > 0 ? (
                <span
                  className="text-cyan-primary text-lg font-bold"
                  style={{ textShadow: "0 0 10px rgba(0,212,255,0.3)" }}
                >
                  +{lastPayout} $WOJAK
                </span>
              ) : (
                <span className="text-danger-red text-lg">-{betAmount} $WOJAK</span>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bet controls */}
      <div className="mt-4 space-y-3">
        {/* Bet presets */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-cyan-primary/40 text-xs mr-2 font-mono">BET:</span>
          {BET_PRESETS.map((preset) => (
            <motion.button
              key={preset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !isSpinning && setBetAmount(preset)}
              className={`hud-btn hud-btn-primary${betAmount === preset ? " hud-glow" : ""}`}
              disabled={isSpinning}
            >
              [{preset}]
            </motion.button>
          ))}
        </div>

        {/* Spin button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={
              !isSpinning && balance >= betAmount ? { scale: 1.05 } : {}
            }
            whileTap={
              !isSpinning && balance >= betAmount ? { scale: 0.95 } : {}
            }
            onClick={spin}
            disabled={isSpinning || balance < betAmount}
            className={`hud-btn hud-btn-primary px-8 py-3 ${
              isSpinning || balance < betAmount ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            {isSpinning ? "[ SPINNING... ]" : "EXECUTE SPIN"}
          </motion.button>
        </div>

        {balance < betAmount && !isSpinning && (
          <p className="text-danger-red/70 text-xs text-center">
            insufficient funds ser... lower your bet or reset balance
          </p>
        )}
      </div>
    </GameShell>
  );
}
