"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "[CHAT]" },
  { href: "/meme", label: "[MEME LAB]" },
  { href: "/gallery", label: "[GALLERY]" },
  { href: "/games", label: "[GAMES]" },
  { href: "/random", label: "[RNG]" },
  { href: "/about", label: "[TOKEN]" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-green-900 py-4 px-4 md:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <motion.span
            className="text-lg md:text-xl font-bold glow glitch inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            AGENT WOJAK
          </motion.span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="relative">
              <motion.span
                className="inline-block hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {link.label}
              </motion.span>
              {(pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-green-500"
                  style={{ boxShadow: "0 0 8px #00FF41" }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-green-400 hover:text-white transition-colors text-sm border border-green-900 px-2 py-1 rounded"
          aria-label="Toggle menu"
        >
          {menuOpen ? "[X]" : "[=]"}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-4 pb-2 max-w-4xl mx-auto">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded text-sm transition-colors ${
                    (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)))
                      ? "bg-green-900/30 text-white border-l-2 border-green-500"
                      : "text-green-400 hover:bg-green-900/20 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
