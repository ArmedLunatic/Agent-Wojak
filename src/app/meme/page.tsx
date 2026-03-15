import { MemeStudio } from "@/components/MemeStudio";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function MemePage() {
  return (
    <PageTransition>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-cyan-primary tracking-wider mb-2">MEME LAB</h1>
          <p className="text-[rgba(255,255,255,0.55)] font-body text-sm">
            enter a scenario. wojak will process it.
          </p>
        </div>
        <ScrollReveal>
          <MemeStudio />
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
