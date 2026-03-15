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
        className="bg-bg-surface border border-cyan-primary/20 rounded-lg p-5 cursor-pointer h-full flex flex-col hover:shadow-[0_0_15px_rgba(0,212,255,0.08)] transition-all duration-300"
      >
        {/* Icon */}
        <div className="text-4xl mb-3">{icon}</div>

        {/* Title */}
        <h3 className="text-cyan-primary font-mono text-sm mb-2 tracking-wider uppercase">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[rgba(255,255,255,0.55)] text-sm flex-grow">{description}</p>

        {/* Play Button */}
        <div className="mt-4">
          <span className="hud-btn hud-btn-primary text-sm inline-block">
            LAUNCH
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
