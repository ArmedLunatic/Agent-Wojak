"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TAGLINES = [
  "i feel the blockchain...",
  "ser... the candles speak to me...",
  "another day, another rug...",
  "we are all gonna make it... right?",
  "the charts... they haunt my dreams...",
  "i bought the dip but it kept dipping...",
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
    <div className="text-center py-8 md:py-12 fade-in-up">
      {/* Hero Image with floating bob */}
      <motion.div
        className="relative inline-block mb-8"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow ring behind image */}
        <div className="absolute inset-0 rounded-full bg-green-500/10 blur-xl scale-125" />

        <div className="relative w-40 h-40 md:w-52 md:h-52 mx-auto rounded-full overflow-hidden border-2 border-green-500/60 border-glow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/templates/default.jpg"
            alt="Agent Wojak"
            className="w-full h-full object-cover"
          />
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.04)_0px,rgba(0,255,65,0.04)_1px,transparent_1px,transparent_3px)] pointer-events-none" />
        </div>

        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-green-500/60" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-green-500/60" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-green-500/60" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-green-500/60" />
      </motion.div>

      {/* Title with scale animation on load */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        className="text-3xl sm:text-5xl md:text-7xl font-bold glow glitch mb-4 tracking-wider"
      >
        AGENT WOJAK
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-green-500 text-sm md:text-base mb-6"
      >
        the most dramatic degen AI on solana {"// "}$AgentJak
      </motion.p>

      {/* Typing tagline */}
      <div className="inline-block border border-green-900/60 rounded px-6 py-3 bg-black/50 border-glow">
        <span className="text-green-400 text-sm md:text-base">
          {">"} {displayText}
        </span>
        <span className="cursor-blink text-green-400" />
      </div>

      {/* Status bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] md:text-xs text-green-700">
        <span className="pulse-dot" />
        <span>STATUS: ONLINE</span>
        <span className="text-green-900">{"///"}</span>
        <span>MOOD: VOLATILE</span>
        <span className="text-green-900">{"///"}</span>
        <span>CHAIN: SOLANA</span>
      </div>
    </div>
  );
}
