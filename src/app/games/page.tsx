import { GameCard } from "@/components/games/GameCard";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

const GAMES = [
  {
    title: "Rug Pull Roulette",
    icon: "🎰",
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
          <h2 className="text-lg glow mb-6">{"// "}GAMES</h2>

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

          <p className="text-green-700 text-xs text-center mt-6">
            all games use fake $WOJAK tokens. no real money. just vibes.
          </p>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
