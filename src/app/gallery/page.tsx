import { Gallery } from "@/components/Gallery";
import { PageTransition } from "@/components/PageTransition";

export default function GalleryPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-display text-cyan-primary tracking-wider mb-2">GALLERY</h1>
          <p className="text-[rgba(255,255,255,0.55)] text-sm">
            &#10217; every variant. every phase. from the original feels guy to pink wojak. the archives remember.
          </p>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-cyan-primary/30 to-transparent" />
        </div>

        {/* Gallery Grid */}
        <Gallery />
      </div>
    </PageTransition>
  );
}
