"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "CHAT" },
  { href: "/meme", label: "MEME LAB" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/lore", label: "LORE" },
  { href: "/games", label: "GAMES" },
{ href: "/roadmap", label: "ROADMAP" },
  { href: "/about", label: "TOKEN" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className="sticky top-0 z-50 bg-bg-deep/95 backdrop-blur-sm">
        {/* Bottom border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-primary/40 to-transparent" />

        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 h-14">
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-primary animate-[pulse-dot_2s_ease-in-out_infinite]" />
            <span className="font-display text-sm tracking-[0.1em] text-white uppercase">
              AGENT WOJAK
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <Link key={link.href} href={link.href} className="relative py-1">
                  <span
                    className={`font-mono text-[0.75rem] tracking-[0.15em] uppercase transition-colors ${
                      active
                        ? "text-cyan-primary"
                        : "text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.8)]"
                    }`}
                  >
                    {link.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-cyan-primary"
                      style={{ boxShadow: "0 0 6px var(--cyan-primary)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Status Readout (desktop only) */}
          <div className="hidden md:flex items-center gap-1.5 text-[0.6rem] font-mono text-[rgba(255,255,255,0.25)] tracking-[0.1em]">
            <span>SYS: ONLINE</span>
            <span className="text-success-green">●</span>
            <span>SOL_NET: ACTIVE</span>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] group"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-[1.5px] bg-[rgba(255,255,255,0.7)] group-hover:bg-white transition-colors origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
              className="block w-5 h-[1.5px] bg-[rgba(255,255,255,0.7)] group-hover:bg-white transition-colors"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-[1.5px] bg-[rgba(255,255,255,0.7)] group-hover:bg-white transition-colors origin-center"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Panel */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-bg-deep/80 backdrop-blur-sm z-40"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-[320px] bg-bg-deep z-50 border-l border-cyan-primary/10 flex flex-col"
            >
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-mono text-sm"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col mt-4">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href, pathname);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`py-4 px-6 font-mono text-[0.8rem] tracking-[0.15em] uppercase transition-colors ${
                        active
                          ? "border-l-2 border-cyan-primary text-cyan-primary"
                          : "border-l-2 border-orange-accent/30 text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.8)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
