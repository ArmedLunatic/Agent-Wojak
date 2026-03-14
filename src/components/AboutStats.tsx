"use client";

import { useState, useEffect } from "react";

interface StatConfig {
  label: string;
  finalValue: string;
  scrambleDuration: number;
}

const STATS: StatConfig[] = [
  { label: "MEMES GENERATED", finalValue: "???", scrambleDuration: 1500 },
  { label: "FEELINGS FELT", finalValue: "\u221E", scrambleDuration: 2000 },
  { label: "RUGS SURVIVED", finalValue: "42", scrambleDuration: 1200 },
  { label: "DIPS BOUGHT", finalValue: "999", scrambleDuration: 1800 },
];

function useScramble(finalValue: string, duration: number, delay: number) {
  const [display, setDisplay] = useState("---");
  const chars = "0123456789!@#$%&?";

  useEffect(() => {
    const startTime = Date.now() + delay;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) return;

      if (elapsed > duration) {
        setDisplay(finalValue);
        clearInterval(interval);
        return;
      }

      // Generate random characters
      let scrambled = "";
      for (let i = 0; i < Math.max(finalValue.length, 3); i++) {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(scrambled);
    }, 50);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return display;
}

function StatCard({
  stat,
  index,
}: {
  stat: StatConfig;
  index: number;
}) {
  const value = useScramble(stat.finalValue, stat.scrambleDuration, index * 300);

  return (
    <div className={`border border-green-900/60 rounded-lg p-4 text-center bg-black/40 fade-in-up delay-${index + 1} hover:border-green-500/50 transition-all border-glow`}>
      <div className="text-2xl md:text-3xl font-bold text-green-400 glow mb-1">
        {value}
      </div>
      <div className="text-green-700 text-xs tracking-wider">{stat.label}</div>
    </div>
  );
}

export function AboutStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {STATS.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} index={i} />
      ))}
    </div>
  );
}
