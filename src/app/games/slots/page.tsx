import { WojakSlots } from "@/components/games/WojakSlots";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function SlotsPage() {
  return (
    <PageTransition>
      <ScrollReveal>
        <WojakSlots />
      </ScrollReveal>
    </PageTransition>
  );
}
