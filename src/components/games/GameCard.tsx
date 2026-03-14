"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export function GameCard({ title, description, icon, href }: GameCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="group relative border border-green-900 rounded-lg p-5 cursor-pointer h-full flex flex-col hover:border-green-700 hover:border-glow transition-colors duration-300"
      >
        {/* Scanline overlay on hover */}
        <div className="absolute inset-0 z-10 pointer-events-none rounded-lg bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.03)_0px,rgba(0,255,65,0.03)_1px,transparent_1px,transparent_3px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Corner brackets */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-green-500/0 group-hover:border-green-500/80 transition-all duration-300" />

        {/* Icon */}
        <div className="text-4xl mb-3">{icon}</div>

        {/* Title */}
        <h3 className="text-green-400 font-mono text-sm mb-2 glow">
          {"// "}
          {title}
        </h3>

        {/* Description */}
        <p className="text-green-600 text-sm flex-grow">{description}</p>

        {/* Play Button */}
        <div className="mt-4">
          <span className="bg-green-900/50 border border-green-700 px-4 py-2 rounded text-green-400 hover:bg-green-800/50 transition-colors text-sm inline-block">
            [PLAY]
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
