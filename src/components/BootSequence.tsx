"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "> INITIALIZING AGENT WOJAK v1.0...",
  "> CONNECTING TO SOLANA MAINNET...",
  "> LOADING FEELINGS MODULE... ",
  "> CALIBRATING MOOD: VOLATILE",
  "> STATUS: ONLINE",
  ">",
  "> ENTERING THE MATRIX...",
];

const PROGRESS_BAR_CHARS = "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588";
const PROGRESS_BAR_FULL = "[" + PROGRESS_BAR_CHARS + "] 100%";

export function BootSequence() {
  const [show, setShow] = useState(false);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [progressText, setProgressText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
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

  // Blinking cursor
  useEffect(() => {
    if (!show) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 400);
    return () => clearInterval(cursorInterval);
  }, [show]);

  // Animate the progress bar character by character
  const animateProgressBar = useCallback(() => {
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex <= PROGRESS_BAR_CHARS.length) {
        const filled = PROGRESS_BAR_CHARS.slice(0, charIndex);
        const empty = "\u2591".repeat(PROGRESS_BAR_CHARS.length - charIndex);
        const pct = Math.round((charIndex / PROGRESS_BAR_CHARS.length) * 100);
        setProgressText("[" + filled + empty + "] " + pct + "%");
        charIndex++;
      } else {
        clearInterval(interval);
        // Progress bar done, move to next line
        setProgressText(PROGRESS_BAR_FULL);
        setCurrentLineIndex(3);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Line-by-line reveal
  useEffect(() => {
    if (!show || isExiting) return;

    if (currentLineIndex >= BOOT_LINES.length) {
      // All lines done, begin exit
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        sessionStorage.setItem("wojak-booted", "true");
        setTimeout(() => setShow(false), 600);
      }, 400);
      return () => clearTimeout(exitTimer);
    }

    // Special handling for the progress bar line (index 2)
    if (currentLineIndex === 2) {
      setVisibleLines((prev) => [...prev, BOOT_LINES[2]]);
      const pbTimer = setTimeout(() => {
        animateProgressBar();
      }, 200);
      return () => clearTimeout(pbTimer);
    }

    const delay = currentLineIndex === 0 ? 500 : 350;
    const timer = setTimeout(() => {
      setVisibleLines((prev) => [...prev, BOOT_LINES[currentLineIndex]]);
      setCurrentLineIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [show, currentLineIndex, isExiting, animateProgressBar]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          style={{
            animation: "crt-flicker 0.15s infinite alternate",
          }}
        >
          {/* CRT scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(0,255,65,0.03) 0px, rgba(0,255,65,0.03) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* CRT vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* Terminal content */}
          <div className="relative z-10 font-mono text-sm md:text-base px-6 max-w-xl w-full">
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="mb-1"
              >
                <span
                  className="text-[#00FF41]"
                  style={{
                    textShadow: "0 0 8px rgba(0,255,65,0.6), 0 0 20px rgba(0,255,65,0.3)",
                  }}
                >
                  {/* For the progress bar line, append the animated progress */}
                  {i === 2 ? line + progressText : line}
                </span>
                {/* Blinking cursor on the last visible line */}
                {i === visibleLines.length - 1 && (
                  <span
                    className="text-[#00FF41] ml-0.5"
                    style={{
                      opacity: showCursor ? 1 : 0,
                      textShadow: "0 0 8px rgba(0,255,65,0.6)",
                    }}
                  >
                    _
                  </span>
                )}
              </motion.div>
            ))}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
