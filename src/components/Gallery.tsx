"use client";

import { useState, useEffect, useCallback } from "react";

export function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    if (selectedImage) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [selectedImage, closeModal]);

  if (!loaded) {
    return (
      <div className="text-center py-20">
        <span className="text-green-600 animate-pulse text-lg">
          {">"} LOADING ARCHIVES...
        </span>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="text-green-700 text-lg">
          {">"} NO IMAGES FOUND IN /templates/
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setSelectedImage(src)}
            className={`fade-in-up delay-${(i % 5) + 1} group relative aspect-square overflow-hidden rounded-lg border border-green-900/50 bg-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {/* Scanline overlay on card */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.03)_0px,rgba(0,255,65,0.03)_1px,transparent_1px,transparent_3px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Wojak template ${i + 1}`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 img-glow"
            />

            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-green-400 text-xs font-mono">
                {src.split("/").pop()?.replace(/\.[^.]+$/, "").toUpperCase()}
              </span>
            </div>

            {/* Corner brackets */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* CRT overlay on modal */}
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.02)_0px,rgba(0,255,65,0.02)_1px,transparent_1px,transparent_2px)]" />

          <div
            className="relative max-w-3xl max-h-[85vh] mx-4 fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-green-400 hover:text-white text-sm transition-colors z-10"
            >
              [X] CLOSE
            </button>

            {/* Image container */}
            <div className="relative rounded-lg border-2 border-green-500/60 overflow-hidden border-glow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Selected Wojak"
                className="max-w-full max-h-[75vh] object-contain"
              />

              {/* Filename bar */}
              <div className="bg-black/80 border-t border-green-900 px-4 py-2 flex items-center justify-between">
                <span className="text-green-500 text-xs">
                  {"> "}
                  {selectedImage.split("/").pop()}
                </span>
                <a
                  href={selectedImage}
                  download
                  className="text-green-400 hover:text-white text-xs border border-green-700 px-3 py-1 rounded hover:bg-green-900/30 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  [DOWNLOAD]
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
