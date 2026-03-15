"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./GameShell";
import { useGameBalance } from "./useGameBalance";
import { pickRandom } from "./utils";

const SEGMENTS = [
  { label: "2x MOON", multiplier: 2, color: "#00d4ff" },
  { label: "RUGGED!", multiplier: 0, color: "#661111" },
  { label: "3x PUMP", multiplier: 3, color: "#0a8fb0" },
  { label: "RUG PULL", multiplier: 0, color: "#992222" },
  { label: "DIAMOND 5x", multiplier: 5, color: "#00b8d4" },
  { label: "LIQUIDATED", multiplier: 0, color: "#ff4444" },
  { label: "1.5x", multiplier: 1.5, color: "#006080" },
  { label: "COPE 0.5x", multiplier: 0.5, color: "#ff6b35" },
];

const BET_PRESETS = [10, 50, 100];

const WIN_COMMENTS = [
  "bloomer mode activated. we're so back",
  "mumu smiled upon you today, fren",
  "i know that feel... and it's euphoria",
];

const RUG_COMMENTS = [
  "he bought? dumped. bogdanoff sends his regards",
  "pink wojak phase activated. eyes bleeding",
  "it's so over. the bogdanoffs got us again",
];

const SMALL_WIN_COMMENTS = [
  "coping. seething. but still here",
  "not great not terrible. the eternal cope",
  "this is fine. everything is fine. (it's not fine)",
];

/** Pick a segment index with weighting — bad outcomes are slightly more likely */
function pickWeightedSegment(): number {
  const weights = SEGMENTS.map((s) => {
    if (s.multiplier <= 0) return 3; // rug / liquidated
    if (s.multiplier < 1) return 2; // cope 0.5x
    if (s.multiplier >= 5) return 1; // diamond 5x — rare
    return 2; // normal wins
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

const SEGMENT_COUNT = SEGMENTS.length;
const ARC = (2 * Math.PI) / SEGMENT_COUNT;

function drawWheel(canvas: HTMLCanvasElement, displaySize: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = displaySize;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#0c1220";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < SEGMENT_COUNT; i++) {
    const startAngle = i * ARC - Math.PI / 2;
    const endAngle = startAngle + ARC;
    const seg = SEGMENTS[i];

    // Draw segment
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = "#00d4ff30";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + ARC / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(size / 22)}px monospace`;
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 4;
    ctx.fillText(seg.label, radius - 12, 5);
    ctx.restore();
  }

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.12, 0, 2 * Math.PI);
  ctx.fillStyle = "#0c1220";
  ctx.fill();
  ctx.strokeStyle = "#00d4ff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function RugPullRoulette() {
  const { balance, addBalance, subtractBalance } = useGameBalance();
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | "neutral" | undefined>(
    undefined
  );
  const [commentary, setCommentary] = useState<string | undefined>(undefined);
  const [resultText, setResultText] = useState<string | null>(null);
  const [rugFlash, setRugFlash] = useState(false);
  const [bigWinGlow, setBigWinGlow] = useState(false);
  const [rotation, setRotation] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasDrawn = useRef(false);

  // Draw wheel once on mount and when canvas ref is set
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasDrawn.current) return;

    // Set high-res canvas for crisp rendering
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const displaySize = canvas.clientWidth;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    drawWheel(canvas, displaySize);
    canvasDrawn.current = true;
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || balance < betAmount) return;

    // Deduct bet
    subtractBalance(betAmount);
    setIsSpinning(true);
    setResult(undefined);
    setCommentary(undefined);
    setResultText(null);
    setRugFlash(false);
    setBigWinGlow(false);

    // Pre-determine outcome
    const segmentIndex = pickWeightedSegment();
    const seg = SEGMENTS[segmentIndex];

    // Calculate target rotation:
    // The pointer is at the top (12 o'clock position = -90 degrees = -PI/2).
    // Segment i spans from i*ARC to (i+1)*ARC starting from -PI/2.
    // We want the middle of segment i to be at the top.
    // Since CSS rotation goes clockwise and our segments start at -PI/2 (top),
    // we need to rotate so the segment center aligns with the top.
    // Segment center angle (from top, clockwise) = segmentIndex * ARC + ARC/2
    // We need to rotate the wheel so that center ends up at top = 360 - center_degrees
    const segCenterDeg = ((segmentIndex * ARC + ARC / 2) * 180) / Math.PI;
    const targetOffset = 360 - segCenterDeg;
    const fullSpins = (3 + Math.floor(Math.random() * 3)) * 360; // 3-5 full rotations
    // Always add enough to guarantee forward spin
    const finalRotation = rotation + fullSpins + (targetOffset - ((rotation + fullSpins) % 360) + 360) % 360;

    setRotation(finalRotation);

    // After animation completes (4s duration)
    setTimeout(() => {
      const multiplier = seg.multiplier;
      let payout = 0;
      let payoutText = "";

      if (multiplier <= 0) {
        // Lose entire bet (already subtracted)
        payoutText = `${seg.label}! -${betAmount} $WOJAK`;
        setResult("lose");
        setCommentary(pickRandom(RUG_COMMENTS));
        setRugFlash(true);
        setTimeout(() => setRugFlash(false), 500);
      } else if (multiplier < 1) {
        // Get back partial
        payout = Math.floor(betAmount * multiplier);
        addBalance(payout);
        payoutText = `${seg.label}! -${betAmount - payout} $WOJAK`;
        setResult("neutral");
        setCommentary(pickRandom(SMALL_WIN_COMMENTS));
      } else if (multiplier === 1.5) {
        payout = Math.floor(betAmount * multiplier);
        addBalance(payout);
        payoutText = `${seg.label}! +${payout - betAmount} $WOJAK`;
        setResult("neutral");
        setCommentary(pickRandom(SMALL_WIN_COMMENTS));
      } else {
        // Win
        payout = Math.floor(betAmount * multiplier);
        addBalance(payout);
        payoutText = `${seg.label}! +${payout - betAmount} $WOJAK`;
        setResult("win");
        setCommentary(pickRandom(WIN_COMMENTS));
        if (multiplier >= 5) {
          setBigWinGlow(true);
          setTimeout(() => setBigWinGlow(false), 1500);
        }
      }

      setResultText(payoutText);
      setIsSpinning(false);
    }, 4200);
  }, [isSpinning, balance, betAmount, subtractBalance, addBalance, rotation]);

  const allIn = useCallback(() => {
    if (!isSpinning) setBetAmount(balance);
  }, [isSpinning, balance]);

  return (
    <GameShell title="RUG PULL ROULETTE" result={result} commentary={commentary}>
      {/* Frame header */}
      <div className="font-mono text-sm text-cyan-primary tracking-wider mb-3">
        SIMULATION://BOGDANOFF_WHEEL
      </div>

      <div
        className={`border rounded-lg overflow-hidden transition-colors duration-300 ${
          rugFlash
            ? "border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            : bigWinGlow
            ? "border-cyan-primary shadow-[0_0_30px_rgba(0,212,255,0.5)]"
            : "border-cyan-primary/20"
        }`}
      >
        {/* Title bar */}
        <div className="bg-bg-surface border-b border-cyan-primary/20 px-3 py-2 flex items-center gap-2">
          <span className="text-cyan-primary/40 text-xs">{"\u25CF"} {"\u25CF"} {"\u25CF"}</span>
          <span className="text-cyan-primary/40 text-xs">wojak@roulette:~$</span>
        </div>

        {/* Wheel area */}
        <div className="p-4 md:p-6 flex flex-col items-center">
          {/* Pointer indicator */}
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Fixed pointer at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "20px solid #00d4ff",
                  filter: "drop-shadow(0 0 6px #00d4ff)",
                }}
              />
            </div>

            {/* Spinning wheel container */}
            <motion.div
              className="w-full h-full"
              animate={{ rotate: rotation }}
              transition={
                isSpinning
                  ? { duration: 4, ease: [0.15, 0.85, 0.35, 1] }
                  : { duration: 0 }
              }
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-full"
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>
          </div>

          {/* Result display */}
          <AnimatePresence mode="wait">
            {resultText && !isSpinning && (
              <motion.div
                key={resultText}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-4 text-center"
              >
                <span
                  className={`text-lg font-bold ${
                    result === "win"
                      ? "text-success-green"
                      : result === "lose"
                      ? "text-danger-red"
                      : "text-orange-accent"
                  }`}
                >
                  {resultText}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bet controls */}
      <div className="mt-4 space-y-3">
        {/* Bet presets */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={allIn}
            className="hud-btn hud-btn-accent"
            disabled={isSpinning}
          >
            [ALL IN]
          </motion.button>
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
