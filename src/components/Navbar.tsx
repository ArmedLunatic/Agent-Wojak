"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "[CHAT]" },
  { href: "/meme", label: "[MEME LAB]" },
  { href: "/gallery", label: "[GALLERY]" },
  { href: "/about", label: "[TOKEN]" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-green-900 py-4 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/">
          <motion.span
            className="text-xl font-bold glow glitch inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            AGENT WOJAK
          </motion.span>
        </Link>
        <div className="flex gap-6 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="relative">
              <motion.span
                className="inline-block hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {link.label}
              </motion.span>
              {pathname === link.href && (
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
      </div>
    </nav>
  );
}
