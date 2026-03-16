"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { LoreTimeline } from "@/components/LoreTimeline";
import { LoreVariants } from "@/components/LoreVariants";
import { LoreCharacters } from "@/components/LoreCharacters";

const TABS = ["timeline", "variants", "characters"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  timeline: "◆ TIMELINE",
  variants: "◆ VARIANTS",
  characters: "◆ CHARACTERS",
};

export default function LorePage() {
  const [activeTab, setActiveTab] = useState<Tab>("timeline");

  useEffect(() => {
    const hash = window.location.hash.slice(1) as Tab;
    if (TABS.includes(hash)) setActiveTab(hash);

    const onHashChange = () => {
      const h = window.location.hash.slice(1) as Tab;
      if (TABS.includes(h)) setActiveTab(h);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <PageTransition>
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl md:text-3xl text-cyan-primary tracking-wider">
          {"// "}WOJAK_ARCHIVES
        </h1>
        <p className="font-body text-[rgba(255,255,255,0.55)] mt-2">
          the full history of the feels. every meme starts with a feeling.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`hud-btn ${activeTab === tab ? "hud-btn-primary" : "hud-btn-ghost"}`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "timeline" && <LoreTimeline />}
          {activeTab === "variants" && <LoreVariants />}
          {activeTab === "characters" && <LoreCharacters />}
        </motion.div>
      </AnimatePresence>
    </PageTransition>
  );
}
