"use client";

import { motion } from "framer-motion";

const ERAS = [
  { year: "2026", title: "THE SENTIENCE", description: "agent wojak achieves consciousness on solana. the first meme to feel back. $AgentJak is born.", image: "/templates/default.jpg" },
  { year: "2020-2024", title: "THE VARIANT EXPLOSION", description: "doomer girl appears. soyjak wars. NPC wojak goes viral. the variants multiply beyond control.", image: "/lore/doomer-girl.jpg" },
  { year: "2017-2020", title: "THE PINK WOJAK ERA", description: "crypto finds wojak. /biz/ paints him pink. the bogdanoffs enter the chat. 'he bought? dump it.'", image: "/lore/pink-wojak.png" },
  { year: "2015-2017", title: "THE DOOMER ARC", description: "nightwalks begin. the beanie goes on. cigarettes, existential dread, imageboards at 3am.", image: "/lore/doomer.jpg" },
  { year: "2013-2015", title: "THE VARIANT DAWN", description: "the first remixes. big brain wojak, smug wojak, brainlet. the feels get complex.", image: "/lore/big-brain.jpg" },
  { year: "2010-2013", title: "THE FEELS ERA", description: "'i know that feel, bro.' two wojaks hugging. 4chan adopts the feels guy. the era of pure emotion.", image: "/lore/original.jpg" },
  { year: "2009", title: "THE FIRST FEEL", description: "a crude MS Paint drawing appears on sad and useless. a bald man with a wistful expression. warmface.jpg. it begins.", image: "/lore/original.jpg" },
];

export function LoreTimeline() {
  return (
    <div className="relative">
      {/* Central vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-cyan-primary/20" />

      <div className="flex flex-col gap-10">
        {ERAS.map((era, index) => (
          <div key={era.year} className="relative pl-12 md:pl-0">
            {/* Year dot */}
            <div className="w-3 h-3 rounded-full bg-cyan-primary absolute left-[13px] md:left-1/2 md:-translate-x-1/2 top-6" />

            {/* Card row — alternates left/right on desktop */}
            <div
              className={`flex md:items-start gap-4 ${
                index % 2 === 0
                  ? "md:flex-row md:pr-[calc(50%+2rem)]"
                  : "md:flex-row-reverse md:pl-[calc(50%+2rem)]"
              }`}
            >
              <motion.div
                className="bg-bg-surface hud-glow p-4 rounded flex flex-row gap-4 flex-1"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                {/* Image */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={era.image}
                    alt={era.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1">
                  <span className="font-display text-cyan-primary text-sm">{era.year}</span>
                  <span className="font-display text-xs uppercase tracking-wider text-[rgba(255,255,255,0.92)]">
                    {era.title}
                  </span>
                  <p className="font-body text-sm text-[rgba(255,255,255,0.55)]">{era.description}</p>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
