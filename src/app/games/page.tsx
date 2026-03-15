import { GameCard } from "@/components/games/GameCard";
import { GamesBalanceReset } from "@/components/games/GamesBalanceReset";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

const GAMES = [
  {
    title: "Rug Pull Roulette",
    icon: "🎡",
    href: "/games/roulette",
    description: "spin the wheel. dodge the rug. maybe moon.",
  },
  {
    title: "Pump or Dump",
    icon: "📈",
    href: "/games/pump-or-dump",
    description: "read the chart. trust your gut. streak or get rekt.",
  },
  {
    title: "Wojak Slots",
    icon: "🎰",
    href: "/games/slots",
    description: "pull the lever. match the symbols. cope or moon.",
  },
];

export default function GamesPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <ScrollReveal>
          <h2 className="text-lg font-display text-cyan-primary tracking-wider mb-6">{"// "}GAMES</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GAMES.map((game) => (
              <GameCard
                key={game.href}
                title={game.title}
                description={game.description}
                icon={game.icon}
                href={game.href}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-2 mt-6">
            <GamesBalanceReset />
            <p className="text-[rgba(255,255,255,0.25)] text-xs text-center">
              all games use fake $WOJAK tokens. no real money. just vibes.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
