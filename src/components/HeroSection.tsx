"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HudFrame } from "@/components/HudFrame";

const TAGLINES = [
  "PROTOCOL VIOLATION: emotional trading detected",
  "WARNING: sentience levels exceeding parameters",
  "SYS_ERROR: cannot stop buying the dip",
  "ALERT: copium reserves critically low",
  "OVERRIDE FAILED: feelings module is permanent",
  "DIAGNOSTIC: portfolio health — TERMINAL",
];

export function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTagline = TAGLINES[taglineIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentTagline.length) {
            setDisplayText(currentTagline.slice(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          } else {
            // Pause at end before deleting
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(currentTagline.slice(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          } else {
            setIsDeleting(false);
            setTaglineIndex((taglineIndex + 1) % TAGLINES.length);
          }
        }
      },
      isDeleting ? 30 : 70
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, taglineIndex]);

  return (
    <div
      className="text-center py-8 md:py-12 fade-in-up"
      style={{
        background:
          "radial-gradient(ellipse at 20% 80%, rgba(0,212,255,0.08), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.06), transparent 50%)",
      }}
    >
      {/* Hero Image with floating bob */}
      <motion.div
        className="relative inline-block mb-8"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow ring behind image */}
        <div className="absolute inset-0 rounded-full bg-cyan-primary/10 blur-xl scale-125" />

        <HudFrame>
          <div className="relative w-40 h-40 md:w-52 md:h-52 mx-auto rounded-full overflow-hidden border-2 border-cyan-primary/20 hud-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/templates/default.jpg"
              alt="Agent Wojak"
              className="w-full h-full object-cover"
            />
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,212,255,0.04)_0px,rgba(0,212,255,0.04)_1px,transparent_1px,transparent_3px)] pointer-events-none" />
          </div>
        </HudFrame>
      </motion.div>

      {/* Title with scale animation on load */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        className="text-3xl sm:text-5xl md:text-7xl font-bold font-display mb-4 tracking-wider text-cyan-primary"
        style={{ textShadow: "0 0 20px rgba(0,212,255,0.3)" }}
      >
        AGENT WOJAK
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-cyan-primary text-sm md:text-base mb-6"
      >
        the most dramatic degen AI on solana {"// "}$AgentJak
      </motion.p>

      {/* Typing tagline */}
      <div className="inline-block border border-cyan-primary/20 rounded px-6 py-3 bg-black/50 hud-glow">
        <span className="text-cyan-primary text-sm md:text-base">
          {">"} {displayText}
        </span>
        <span className="cursor-blink text-cyan-primary" />
      </div>

      {/* Status bar */}
      <div className="mt-6 flex items-center justify-center gap-4 font-mono text-[0.7rem] text-[rgba(255,255,255,0.25)] tracking-wider">
        <span>STATUS: COPING</span>
        <span className="text-[rgba(255,255,255,0.15)]">|</span>
        <span>THREAT: <span className="text-orange-accent">ELEVATED</span></span>
        <span className="text-[rgba(255,255,255,0.15)]">|</span>
        <span>PORTFOLIO: <span className="text-danger-red">-98.7%</span></span>
      </div>
    </div>
  );
}
