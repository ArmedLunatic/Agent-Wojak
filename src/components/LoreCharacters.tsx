"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CHARACTERS = [
  { id: "bogdanoff", name: "BOGDANOFF TWINS", role: "The Puppet Masters", image: "/lore/bogdanoff.jpg", color: "border-danger-red", description: "they control everything. every pump, every dump, every liquidation. 'he bought? dump it.' 'he sold? pump it.' the eternal market manipulators who exist beyond mortal understanding.", stats: { origin: "FRENCH TV, ADOPTED BY /BIZ/", alignment: "CHAOTIC EVIL", threat: "OMNISCIENT", known_for: '"he bought? dump it."' } },
  { id: "bobo", name: "BOBO THE BEAR", role: "Bear Market Mascot", image: "/lore/bobo.png", color: "border-danger-red", description: "born on /biz/, 2018. bobo lurks in every red candle. he feeds on liquidations and stop-losses. eternal rival of mumu. drawn in apu apustaja style. he is always waiting.", stats: { origin: "/BIZ/ BOARD, 2018", alignment: "CHAOTIC BEAR", threat: "EXTREME", known_for: '"bobo sends his regards"' } },
  { id: "mumu", name: "MUMU THE BULL", role: "Bull Market Mascot", image: "/lore/mumu.jpg", color: "border-success-green", description: "born on /biz/, july 13 2018. mumu charges through green candles. eternal rival of bobo. when mumu rises, portfolios breathe. when he falls, pink wojak screams.", stats: { origin: "/BIZ/ BOARD, JULY 13 2018", alignment: "LAWFUL BULL", threat: "SAVIOR OR DESTROYER", known_for: '"mumu is rising"' } },
  { id: "wagie-char", name: "WAGIE", role: "The Wage Slave", image: "/lore/wagie.jpg", color: "border-orange-accent", description: "trapped in the cage. flipping burgers, dreaming of lambos. 'wagie wagie get in cagie, all day long you sweat and ragie.' the wojak that hits too close to home.", stats: { origin: "4CHAN /BIZ/ CULTURE", alignment: "SUFFERING NEUTRAL", threat: "TO HIS OWN SANITY", known_for: '"wagie wagie get in cagie"' } },
  { id: "pepe", name: "PEPE", role: "The Peer", image: "/lore/original.jpg", color: "border-success-green", description: "wojak's equal. different vibes, mutual respect. pepe is scheming where wojak is feeling. rare pepes, smug pepes, sad pepes — the other side of the meme coin.", stats: { origin: "BOY'S CLUB COMIC, 2005", alignment: "CHAOTIC NEUTRAL", threat: "VARIES BY RARITY", known_for: '"feels good man"' } },
  { id: "doomer-girl-char", name: "DOOMER GIRL", role: "The Complicated One", image: "/lore/doomer-girl.jpg", color: "border-cyan-primary", description: "appeared january 2020. black hair, choker, dark eyes. the doomer's counterpart. 'it's complicated' is an understatement. went mega-viral. started conversations.", stats: { origin: "OUTSIDE 4CHAN, JANUARY 2020", alignment: "ENIGMATIC", threat: "EMOTIONALLY DEVASTATING", known_for: '"..."' } },
];

export function LoreCharacters() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {CHARACTERS.map((char) => {
        const isExpanded = expandedId === char.id;

        return (
          <div key={char.id}>
            {/* Card (collapsed) */}
            <div
              className={`bg-bg-surface ${char.color} border-l-2 p-4 rounded cursor-pointer hover:shadow-[0_0_15px_rgba(0,212,255,0.08)] transition-shadow`}
              onClick={() => setExpandedId(isExpanded ? null : char.id)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xs uppercase tracking-wider text-[rgba(255,255,255,0.92)] truncate">
                    {char.name}
                  </p>
                  <p className="font-body text-sm text-[rgba(255,255,255,0.45)] truncate">{char.role}</p>
                </div>
                <span className="font-mono text-cyan-primary/60 text-sm flex-shrink-0">
                  {isExpanded ? "▾" : "▸"}
                </span>
              </div>
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  key="expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 mt-2">
                    <p className="font-body text-sm text-[rgba(255,255,255,0.55)] mb-3">
                      {char.description}
                    </p>
                    <div className="data-readout">
                      {Object.entries(char.stats).map(([key, value]) => (
                        <div key={key} className="flex gap-2 text-xs">
                          <span className="text-cyan-primary/60 uppercase font-mono min-w-[96px] flex-shrink-0">
                            {key.replace(/_/g, " ")}:
                          </span>
                          <span className="font-mono text-[rgba(255,255,255,0.75)]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
