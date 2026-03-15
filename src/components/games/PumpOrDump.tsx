"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./GameShell";
import { useGameBalance } from "./useGameBalance";
import { pickRandom } from "./utils";

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
  direction: "pump" | "dump";
};

const CORRECT_COMMENTS = [
  "called it ser... maybe we're not ngmi after all",
  "PUMP AND DUMP MASTER right here",
  "the chart whispers to me...",
];

const WRONG_COMMENTS = [
  "ser... the chart lied to me...",
  "my technical analysis was copium all along",
  "WHO DUMPED ON ME",
];

const STREAK_COMMENTS = [
  "ser we might actually be a trading genius",
  "10 in a row? we're literally satoshi",
  "nobody can stop us... right?",
];

function generateCandle(prevClose: number, volatility: number): Candle {
  const direction = Math.random() > 0.5 ? "pump" : "dump";
  const bodySize = (Math.random() * volatility * 0.5 + 0.1) * prevClose;
  const wickExtra = Math.random() * bodySize * 0.5;

  if (direction === "pump") {
    const open = prevClose;
    const close = prevClose + bodySize;
    return {
      open,
      close,
      high: close + wickExtra,
      low: open - wickExtra * 0.3,
      direction,
    };
  } else {
    const open = prevClose;
    const close = prevClose - bodySize;
    return {
      open,
      close,
      high: open + wickExtra * 0.3,
      low: close - wickExtra,
      direction,
    };
  }
}

function generateInitialCandles(): Candle[] {
  const candles: Candle[] = [];
  let price = 100;
  for (let i = 0; i < 6; i++) {
    const candle = generateCandle(price, 0.05);
    candles.push(candle);
    price = candle.close;
  }
  return candles;
}

function drawChart(
  canvas: HTMLCanvasElement,
  candles: Candle[],
  displayWidth: number,
  displayHeight: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = "#0c1220";
  ctx.fillRect(0, 0, displayWidth, displayHeight);

  if (candles.length === 0) return;

  const priceAxisWidth = 50;
  const chartWidth = displayWidth - priceAxisWidth;
  const padding = 20;

  // Find price range
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  for (const c of candles) {
    if (c.low < minPrice) minPrice = c.low;
    if (c.high > maxPrice) maxPrice = c.high;
  }
  const priceRange = maxPrice - minPrice || 1;
  const pricePadding = priceRange * 0.1;
  minPrice -= pricePadding;
  maxPrice += pricePadding;
  const totalRange = maxPrice - minPrice;

  const toY = (price: number) =>
    padding + ((maxPrice - price) / totalRange) * (displayHeight - padding * 2);

  // Grid lines
  ctx.strokeStyle = "rgba(0, 212, 255, 0.1)";
  ctx.lineWidth = 1;
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding + (i / gridLines) * (displayHeight - padding * 2);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(chartWidth, y);
    ctx.stroke();
  }
  // Vertical grid
  for (let i = 0; i < candles.length; i++) {
    const x =
      (i + 0.5) * (chartWidth / candles.length);
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, displayHeight - padding);
    ctx.stroke();
  }

  // Price axis
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.font = "10px monospace";
  ctx.textAlign = "right";
  for (let i = 0; i <= gridLines; i++) {
    const price = maxPrice - (i / gridLines) * totalRange;
    const y = padding + (i / gridLines) * (displayHeight - padding * 2);
    ctx.fillText(price.toFixed(1), displayWidth - 4, y + 3);
  }

  // Separator line between chart and axis
  ctx.strokeStyle = "rgba(0, 212, 255, 0.2)";
  ctx.beginPath();
  ctx.moveTo(chartWidth, padding);
  ctx.lineTo(chartWidth, displayHeight - padding);
  ctx.stroke();

  // Draw candles
  const candleWidth = chartWidth / candles.length;
  const bodyWidth = candleWidth * 0.6;

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const x = i * candleWidth + candleWidth / 2;

    const isPump = c.direction === "pump";
    const bodyColor = isPump ? "#00d4ff" : "#ff6b35";
    const wickColor = isPump ? "#00d4ff" : "#ff6b35";

    // Wick
    ctx.strokeStyle = wickColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, toY(c.high));
    ctx.lineTo(x, toY(c.low));
    ctx.stroke();

    // Body
    const bodyTop = toY(Math.max(c.open, c.close));
    const bodyBottom = toY(Math.min(c.open, c.close));
    const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

    ctx.fillStyle = bodyColor;
    ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);

    // Body border for pump candles
    if (isPump) {
      ctx.strokeStyle = "rgba(0, 212, 255, 0.5)";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
    }
  }
}

export function PumpOrDump() {
  const { balance, addBalance, subtractBalance } = useGameBalance();
  const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles());
  const [streak, setStreak] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | "neutral" | undefined>(
    undefined
  );
  const [commentary, setCommentary] = useState<string | undefined>(undefined);
  const [resultText, setResultText] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Draw/redraw chart whenever candles change or on resize
  const redrawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const displayWidth = container.clientWidth;
    const displayHeight = window.innerWidth < 768 ? 200 : 300;
    drawChart(canvas, candles, displayWidth, displayHeight);
  }, [candles]);

  useEffect(() => {
    redrawChart();

    const handleResize = () => redrawChart();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [redrawChart]);

  const handleGuess = useCallback(
    (guess: "pump" | "dump") => {
      if (isRevealing || balance < 10) return;

      // Deduct cost
      subtractBalance(10);
      setIsRevealing(true);
      setResult(undefined);
      setCommentary(undefined);
      setResultText(null);

      // Generate next candle
      const lastCandle = candles[candles.length - 1];
      const volatility = 0.05 + streak * 0.02;
      const newCandle = generateCandle(lastCandle.close, volatility);

      // Show the new candle after a brief delay
      setTimeout(() => {
        const updatedCandles = [...candles, newCandle];
        setCandles(updatedCandles);

        // Check result after candle is drawn
        setTimeout(() => {
          const correct = guess === newCandle.direction;

          if (correct) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            const payout =
              newStreak >= 10 ? 50 : newStreak >= 5 ? 30 : 20;
            addBalance(payout);
            setResult("win");
            setResultText(`+${payout} $WOJAK`);
            if (newStreak >= 5) {
              setCommentary(pickRandom(STREAK_COMMENTS));
            } else {
              setCommentary(pickRandom(CORRECT_COMMENTS));
            }
          } else {
            setStreak(0);
            setResult("lose");
            setResultText("-10 $WOJAK");
            setCommentary(pickRandom(WRONG_COMMENTS));
          }

          // Shift candles: drop oldest, keep last 6
          setTimeout(() => {
            setCandles((prev) => prev.slice(-6));
            setIsRevealing(false);
          }, 800);
        }, 300);
      }, 200);
    },
    [isRevealing, balance, candles, streak, subtractBalance, addBalance]
  );

  const streakDisplay =
    streak > 0
      ? `STREAK: ${"|".repeat(Math.min(streak, 20))} (${streak})`
      : "STREAK: 0 // ngmi";

  const volatility = 0.05 + streak * 0.02;

  return (
    <GameShell title="PUMP OR DUMP" result={result} commentary={commentary}>
      {/* Frame header */}
      <div className="font-mono text-sm text-cyan-primary tracking-wider mb-3">
        SIMULATION://MARKET_PREDICTION
      </div>

      <div className="border rounded-lg overflow-hidden border-cyan-primary/20">
        {/* Title bar */}
        <div className="bg-bg-surface border-b border-cyan-primary/20 px-3 py-2 flex items-center gap-2">
          <span className="text-cyan-primary/40 text-xs">{"\u25CF"} {"\u25CF"} {"\u25CF"}</span>
          <span className="text-cyan-primary/40 text-xs">wojak@chart:~$</span>
        </div>

        {/* Chart area */}
        <div ref={containerRef} className="w-full bg-bg-surface">
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{ height: "auto", aspectRatio: "auto" }}
          />
        </div>
      </div>

      {/* Streak display */}
      <div className="mt-3 text-center font-mono text-sm">
        <span className="font-mono text-[rgba(255,255,255,0.55)]">
          {streakDisplay}
        </span>
        {streak > 0 && (
          <span className="text-[rgba(255,255,255,0.35)] text-xs ml-2">
            [volatility: {(volatility * 100).toFixed(0)}%]
          </span>
        )}
      </div>

      {/* Result display */}
      <AnimatePresence mode="wait">
        {resultText && !isRevealing && (
          <motion.div
            key={resultText + Date.now()}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-2 text-center"
          >
            <span
              className={`text-lg font-bold ${
                result === "win"
                  ? "text-success-green"
                  : "text-danger-red"
              }`}
            >
              {resultText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guess buttons */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleGuess("pump")}
          disabled={isRevealing || balance < 10}
          className={`hud-btn hud-btn-primary px-6 py-3 ${
            isRevealing || balance < 10 ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          [ PUMP ]
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleGuess("dump")}
          disabled={isRevealing || balance < 10}
          className={`hud-btn hud-btn-accent px-6 py-3 ${
            isRevealing || balance < 10 ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          [ DUMP ]
        </motion.button>
      </div>

      {balance < 10 && !isRevealing && (
        <p className="text-danger-red/70 text-xs text-center mt-2">
          insufficient funds ser... need at least 10 $WOJAK to play
        </p>
      )}

      <p className="text-[rgba(255,255,255,0.35)] text-xs text-center mt-2 font-mono">
        cost: 10 $WOJAK per guess // win: +{streak >= 10 ? 50 : streak >= 5 ? 30 : 20} $WOJAK
      </p>
    </GameShell>
  );
}
