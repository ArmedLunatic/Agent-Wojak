import { Roadmap } from "@/components/Roadmap";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function RoadmapPage() {
  return (
    <PageTransition>
      <ScrollReveal>
        <Roadmap />
      </ScrollReveal>
    </PageTransition>
  );
}
