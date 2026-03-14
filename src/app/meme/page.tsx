import { MemeStudio } from "@/components/MemeStudio";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function MemePage() {
  return (
    <PageTransition>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold glow mb-2">MEME LAB</h1>
          <p className="text-green-600 text-sm">
            &#10217; describe a scenario. wojak will feel it for you.
          </p>
        </div>
        <ScrollReveal>
          <MemeStudio />
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
