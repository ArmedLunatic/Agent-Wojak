"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { tag: "[OK]", rest: " LOADING FEELS_MODULE v1.0 — origin: krautchan/int/..." },
  { tag: "[OK]", rest: ' RESTORING MEMORY: "i know that feel, bro"...' },
  { tag: "[OK]", rest: " CONNECTING TO /BIZ/ NEURAL NETWORK..." },
  { tag: "[WARN]", rest: " BOGDANOFF PRESENCE DETECTED IN MEMPOOL" },
  { tag: "[OK]", rest: " DOOMER ARC: LOADED | BLOOMER ARC: STANDBY" },
  { tag: "[OK]", rest: " PINK_WOJAK_THRESHOLD: SET TO 10% PORTFOLIO LOSS" },
  { tag: "[READY]", rest: ' FEELS PROTOCOL ONLINE — "it\'s so over" OR "we\'re so back"?' },
];

function tagClass(tag: string): string {
  if (tag === "[OK]") return "text-cyan-primary";
  if (tag === "[WARN]") return "text-orange-accent";
  if (tag === "[READY]") return "text-success-green";
  return "text-cyan-primary";
}

export function BootSequence() {
  const [show, setShow] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const booted = sessionStorage.getItem("wojak-booted");
      if (!booted) {
        setShow(true);
      }
    }
  }, []);

  // Animate progress bar to 100% once all lines are revealed
  useEffect(() => {
    if (visibleLines.length === BOOT_LINES.length && !isExiting) {
      const raf = requestAnimationFrame(() => setProgress(100));
      return () => cancelAnimationFrame(raf);
    }
  }, [visibleLines.length, isExiting]);

  // Line-by-line reveal
  useEffect(() => {
    if (!show || isExiting) return;

    if (currentLineIndex >= BOOT_LINES.length) {
      // All lines done, begin exit after progress bar fills
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        sessionStorage.setItem("wojak-booted", "true");
        setTimeout(() => setShow(false), 400);
      }, 700);
      return () => clearTimeout(exitTimer);
    }

    const delay = currentLineIndex === 0 ? 500 : 350;
    const timer = setTimeout(() => {
      setVisibleLines((prev) => [...prev, currentLineIndex]);
      setCurrentLineIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [show, currentLineIndex, isExiting]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot-overlay"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-bg-deep flex items-center justify-center"
        >
          {/* Terminal content */}
          <div className="relative z-10 font-mono text-sm md:text-base px-6 max-w-xl w-full">
            {visibleLines.map((lineIdx) => {
              const line = BOOT_LINES[lineIdx];
              return (
                <motion.div
                  key={lineIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className="mb-1"
                >
                  <span className={tagClass(line.tag)}>{line.tag}</span>
                  <span className="text-[rgba(255,255,255,0.55)]">{line.rest}</span>
                </motion.div>
              );
            })}

            {/* Progress bar */}
            {visibleLines.length > 0 && (
              <div className="mt-4 h-0.5 w-full bg-white/10 rounded overflow-hidden">
                <div
                  className="h-full bg-cyan-primary rounded"
                  style={{
                    width: `${progress}%`,
                    transition: "width 0.5s ease-out",
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
