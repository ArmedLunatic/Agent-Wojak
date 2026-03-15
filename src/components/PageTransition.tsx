"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
    >
      <motion.div
        className="h-px bg-cyan-primary/40 mb-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />
      {children}
    </motion.div>
  );
}
