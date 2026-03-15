import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function RandomPage() {
  return (
    <PageTransition>
      <ScrollReveal>
        <div className="text-center py-16">
          <h1 className="font-display text-2xl md:text-3xl text-cyan-primary tracking-wider mb-4">
            ORACLE://ENTROPY_GENERATOR
          </h1>
          <p className="font-body text-[rgba(255,255,255,0.55)] mb-8">
            the bogdanoffs know your number. this module is being recalibrated.
          </p>
          <div className="data-readout inline-block text-left">
            <div className="flex justify-between gap-8">
              <span className="text-[rgba(255,255,255,0.25)]">STATUS:</span>
              <span className="text-orange-accent">RECALIBRATING</span>
            </div>
            <div className="flex justify-between gap-8 mt-1">
              <span className="text-[rgba(255,255,255,0.25)]">ETA:</span>
              <span className="text-cyan-primary">SOON™</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </PageTransition>
  );
}
