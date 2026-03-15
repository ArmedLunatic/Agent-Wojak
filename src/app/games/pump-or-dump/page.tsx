import { PumpOrDump } from "@/components/games/PumpOrDump";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function PumpOrDumpPage() {
  return (
    <PageTransition>
      <ScrollReveal>
        <PumpOrDump />
      </ScrollReveal>
    </PageTransition>
  );
}
