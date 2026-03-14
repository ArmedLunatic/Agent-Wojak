import { RugPullRoulette } from "@/components/games/RugPullRoulette";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function RoulettePage() {
  return (
    <PageTransition>
      <ScrollReveal>
        <RugPullRoulette />
      </ScrollReveal>
    </PageTransition>
  );
}
