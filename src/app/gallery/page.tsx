import { Gallery } from "@/components/Gallery";

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold glow glitch mb-2">GALLERY</h1>
        <p className="text-green-600 text-sm">
          &#10217; the many faces of wojak
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      </div>

      {/* Gallery Grid */}
      <Gallery />
    </div>
  );
}
