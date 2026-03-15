"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HudFrame } from "@/components/HudFrame";

const VARIANTS = [
  { id: "doomer", name: "DOOMER", image: "/lore/doomer.jpg", catchphrase: "it's so over", description: "the nihilist. black beanie, cigarette, nightwalks at 3am. works minimum wage, browses imageboards, has abandoned the pursuit of happiness. compared to ryan gosling in 'drive' which only makes it worse.", feels: { mood: "NIHILISTIC", habitat: "3AM IMAGEBOARDS", copes: "CIGARETTES, NIGHTWALKS", threat: "MAXIMUM DOOMER" } },
  { id: "bloomer", name: "BLOOMER", image: "/lore/bloomer.jpg", catchphrase: "we're all gonna make it", description: "the recovered doomer. found joy in simple things — walks, friendships, kindness. still carries the scars but chooses optimism. proof that the doomer arc can end.", feels: { mood: "OPTIMISTIC", habitat: "TOUCHING GRASS", copes: "SELF-IMPROVEMENT, KINDNESS", threat: "AGGRESSIVELY POSITIVE" } },
  { id: "pink-wojak", name: "PINK WOJAK", image: "/lore/pink-wojak.png", catchphrase: "AAAAAAAAA", description: "the crypto panic incarnate. pink skin, bleeding eyes, watching portfolio evaporate in real time. born on /biz/ in 2017 when crypto found wojak. the face of every market crash.", feels: { mood: "MAXIMUM PANIC", habitat: "/BIZ/ DURING A CRASH", copes: "SCREAMING INTO THE VOID", threat: "PORTFOLIO: -99.7%" } },
  { id: "chad", name: "CHAD", image: "/lore/chad.jpg", catchphrase: "yes.", description: "the confident one. chiseled jaw, unwavering composure. buys the dip without flinching. sells the top without bragging. the wojak we all aspire to be but never will.", feels: { mood: "SUPREMELY CONFIDENT", habitat: "THE WINNERS CIRCLE", copes: "DOESN'T NEED TO COPE", threat: "NONE. HE IS THE THREAT." } },
  { id: "original", name: "ORIGINAL WOJAK", image: "/lore/original.jpg", catchphrase: "i know that feel, bro", description: "where it all began. a simple MS Paint drawing of a bald man with a wistful expression. pained but dealing with it. the template for every variant that followed. warmface.jpg.", feels: { mood: "WISTFUL", habitat: "KRAUTCHAN, 2010", copes: "HUGGING ANOTHER WOJAK", threat: "PURE UNFILTERED FEELS" } },
  { id: "doomer-girl", name: "DOOMER GIRL", image: "/lore/doomer-girl.jpg", catchphrase: "...", description: "appeared january 2020. black hair, choker, dark eyes. the doomer's counterpart. went mega-viral across every platform. 'it's complicated' is an understatement.", feels: { mood: "COMPLICATED", habitat: "EVERY PLATFORM", copes: "EXISTING", threat: "EMOTIONALLY DEVASTATING" } },
  { id: "zoomer", name: "ZOOMER", image: "/lore/zoomer.png", catchphrase: "no cap fr fr", description: "the gen z representative. fade haircut, round glasses, lives on tiktok. loves mumble rap and battle royale games. doesn't know what a forum is.", feels: { mood: "VIBING", habitat: "TIKTOK, DISCORD", copes: "FORTNITE, MUMBLE RAP", threat: "LOW (HE DOESN'T CARE)" } },
  { id: "boomer", name: "30-YEAR-OLD BOOMER", image: "/lore/boomer.jpg", catchphrase: "back in my day...", description: "receding hairline, monster energy in hand, mowing the lawn. stuck in the 90s. thinks quake was peak gaming. has opinions about AC/DC. not actually old, just old-souled.", feels: { mood: "NOSTALGIC", habitat: "THE LAWN, THE GARAGE", copes: "MONSTER ENERGY, CLASSIC ROCK", threat: "WILL TALK ABOUT THE 90s" } },
  { id: "coomer", name: "COOMER", image: "/lore/coomer.png", catchphrase: "just one more...", description: "unkempt beard, bloodshot eyes, down bad. born from 2019 anti-porn sentiment on 4chan. the cautionary tale variant. associated with no nut november.", feels: { mood: "DOWN BAD", habitat: "THE DARK CORNERS", copes: "...YOU KNOW", threat: "CONCERNING" } },
  { id: "npc", name: "NPC WOJAK", image: "/lore/npc.jpg", catchphrase: "current thing good", description: "grey, blank, expressionless. cannot think independently. follows whatever the mainstream narrative is. the most controversial variant — used for political commentary about conformity.", feels: { mood: "PROCESSING...", habitat: "MAINSTREAM MEDIA", copes: "CONSENSUS REALITY", threat: "if(threat) return approved_response;" } },
  { id: "soyjak", name: "SOYJAK", image: "/lore/soyjak.jpg", catchphrase: "OMG IS THAT A—", description: "gaping excited mouth, glasses, stubble, balding. overly enthusiastic about consumerist products, marvel movies, nintendo. the cringe variant that wojak doesn't claim.", feels: { mood: "OVERSTIMULATED", habitat: "PRODUCT LAUNCHES", copes: "CONSUMING", threat: "WILL POINT AT THINGS" } },
  { id: "big-brain", name: "BIG BRAIN", image: "/lore/big-brain.jpg", catchphrase: "you wouldn't understand", description: "enormous head, visible brain wrinkles. the intellectual superiority variant. galaxy-brain takes that are either genius or completely unhinged. sits on his own brain like a chair.", feels: { mood: "TRANSCENDENT IQ", habitat: "TWITTER THREADS", copes: "BEING RIGHT (ALLEGEDLY)", threat: "INSUFFERABLE" } },
  { id: "wagie", name: "WAGIE", image: "/lore/wagie.jpg", catchphrase: "wagie wagie get in cagie", description: "mcdonalds uniform, dead eyes, trapped behind the counter. dreams of lambos while flipping burgers. gambles entire paycheck on shitcoins. the one that hits too close to home.", feels: { mood: "TRAPPED", habitat: "THE WAGE CAGE", copes: "CRYPTO GAMBLING", threat: "PAYCHECK TO PAYCHECK" } },
  { id: "smug", name: "SMUG WOJAK", image: "/lore/original.jpg", catchphrase: "heh", description: "the side-eye. the knowing smirk. quietly superior about something. used when you predicted something correctly and everyone else is coping.", feels: { mood: "QUIETLY SUPERIOR", habitat: "REPLY THREADS", copes: "DOESN'T NEED TO", threat: "INFURIATING" } },
  { id: "brainlet", name: "BRAINLET", image: "/lore/original.jpg", catchphrase: "this is good for bitcoin", description: "tiny smooth brain. confidently wrong about everything. the opposite of big brain. makes terrible trades and thinks they're genius. buys the top, sells the bottom, every time.", feels: { mood: "CONFIDENTLY WRONG", habitat: "BAD TRADES", copes: "DUNNING-KRUGER", threat: "TO HIS OWN PORTFOLIO" } },
  { id: "gigachad", name: "GIGACHAD", image: "/lore/gigachad.jpg", catchphrase: "i know.", description: "the ultimate form. beyond chad. transcendent confidence. doesn't argue, doesn't explain, doesn't cope. just exists and wins. the final evolution of the wojak that stopped feeling and started being.", feels: { mood: "BEYOND MOOD", habitat: "THE SUMMIT", copes: "WINNING IS NOT COPING", threat: "ABSOLUTE" } },
];

export function LoreVariants() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = VARIANTS[activeIndex];

  return (
    <div>
      {/* Carousel strip */}
      <div
        className="flex gap-4 overflow-x-auto pb-4"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          WebkitOverflowScrolling: "touch",
        }}
      >
        {VARIANTS.map((variant, index) => (
          <button
            key={variant.id}
            onClick={() => setActiveIndex(index)}
            className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
            style={{ scrollSnapAlign: "center" }}
          >
            <img
              src={variant.image}
              alt={variant.name}
              className={`w-14 h-14 rounded-full object-cover transition-all duration-200 ${
                index === activeIndex
                  ? "ring-2 ring-cyan-primary scale-105 opacity-100"
                  : "ring-1 ring-cyan-primary/20 opacity-60"
              }`}
            />
            <span className="font-mono text-[0.65rem] text-center text-[rgba(255,255,255,0.7)] max-w-[64px] leading-tight">
              {variant.name}
            </span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="bg-bg-surface hud-glow p-6 rounded mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Image via HudFrame */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <HudFrame>
                <img
                  src={active.image}
                  alt={active.name}
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px] object-cover"
                />
              </HudFrame>
            </div>

            {/* Text */}
            <div className="flex flex-col flex-1">
              <h3 className="font-display text-xl text-cyan-primary">{active.name}</h3>
              <p className="font-mono text-orange-accent text-sm italic mt-1">&quot;{active.catchphrase}&quot;</p>
              <p className="font-body text-sm text-[rgba(255,255,255,0.55)] mt-2">{active.description}</p>

              {/* Feels profile */}
              <div className="data-readout mt-4">
                {Object.entries(active.feels).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-xs">
                    <span className="text-cyan-primary/60 uppercase font-mono min-w-[80px]">{key}:</span>
                    <span className="font-mono text-[rgba(255,255,255,0.75)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
