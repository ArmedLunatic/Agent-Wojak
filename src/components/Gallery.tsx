"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HudFrame } from "@/components/HudFrame";

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative aspect-square bg-bg-elevated rounded-lg animate-pulse overflow-hidden border border-cyan-primary/10"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="text-[rgba(255,255,255,0.55)] text-lg">
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
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i % 8) * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 20px rgba(0,212,255,0.1)",
            }}
            className="cursor-pointer bg-bg-surface border border-cyan-primary/10 rounded"
          >
            <motion.button
              onClick={() => setSelectedImage(src)}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative aspect-square overflow-hidden rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-primary/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Wojak template ${i + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />

              {/* Bottom label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[rgba(255,255,255,0.55)] text-xs font-mono">
                  {src.split("/").pop()?.replace(/\.[^.]+$/, "").toUpperCase()}
                </span>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-bg-deep/95 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-3xl max-h-[85vh] mx-3 md:mx-4 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute -top-8 md:-top-10 right-0 font-mono text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.7)] text-sm transition-colors z-10"
              >
                [X] CLOSE
              </button>

              {/* Image container */}
              <HudFrame className="overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="Selected Wojak"
                  className="max-w-full max-h-[75vh] object-contain"
                />

                {/* Filename bar */}
                <div className="bg-bg-deep/80 border-t border-cyan-primary/15 px-4 py-2 flex items-center justify-between">
                  <span className="text-[rgba(255,255,255,0.55)] text-xs font-mono">
                    {"> "}
                    {selectedImage.split("/").pop()}
                  </span>
                  <a
                    href={selectedImage}
                    download
                    className="hud-btn hud-btn-primary text-xs px-3 py-1 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    [DOWNLOAD]
                  </a>
                </div>
              </HudFrame>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
