import { RandomGenerator } from "@/components/RandomGenerator";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function RandomPage() {
  return (
    <PageTransition>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold glow mb-2">RNG ORACLE</h1>
          <p className="text-green-600 text-sm">
            &#10217; pay the oracle. receive your number. simple as.
          </p>
        </div>
        <ScrollReveal>
          <RandomGenerator />
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
