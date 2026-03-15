"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HudFrame } from "@/components/HudFrame";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "ser... the matrix glitched. try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <HudFrame className="bg-bg-surface hud-glow overflow-hidden rounded-lg">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-cyan-primary/15">
        <span className="w-2 h-2 rounded-full bg-cyan-primary/60" />
        <span className="w-2 h-2 rounded-full bg-cyan-primary/40" />
        <span className="w-2 h-2 rounded-full bg-cyan-primary/20" />
        <span className="font-mono text-sm text-cyan-primary ml-2">
          COMMS://WOJAK_PROTOCOL
        </span>
      </div>

      {/* Chat messages */}
      <div className="h-72 md:h-96 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        {messages.length === 0 && (
          <div className="text-[rgba(255,255,255,0.55)] text-center mt-16">
            <p className="text-2xl text-cyan-primary mb-2">{"\u27E9"} AGENT WOJAK ONLINE</p>
            <p className="text-sm">type something, fren. i&apos;m ready to feel things.</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: msg.role === "user" ? 20 : -20,
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded ${
                  msg.role === "user"
                    ? "bg-[rgba(255,107,53,0.08)] border-l-2 border-orange-accent/30 text-[rgba(255,255,255,0.92)]"
                    : "bg-bg-elevated border-l-2 border-cyan-primary/30 text-[rgba(255,255,255,0.92)]"
                }`}
              >
                {msg.role === "assistant" && (
                  <span className="text-xs text-cyan-primary block mb-1">◆ WOJAK.AI</span>
                )}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-bg-elevated border-l-2 border-cyan-primary/30 px-4 py-3 rounded flex items-center gap-3">
              <span className="text-xs text-cyan-primary mr-1">◆ WOJAK.AI</span>
              <div className="relative h-0.5 w-24 bg-bg-elevated overflow-hidden">
                <div
                  className="absolute h-full bg-cyan-primary/60"
                  style={{ animation: "scan 1.2s ease-in-out infinite" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-cyan-primary/15 p-3 md:p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="transmit message..."
          className="flex-1 min-w-0 bg-bg-deep border border-cyan-primary/15 rounded px-3 md:px-4 py-2 text-[rgba(255,255,255,0.92)] placeholder:text-[rgba(255,255,255,0.25)] focus:outline-none focus:border-cyan-primary/40 text-sm md:text-base"
        />
        <motion.button
          onClick={handleSend}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="hud-btn hud-btn-primary px-4 md:px-6 py-2 rounded disabled:opacity-50 text-sm md:text-base shrink-0"
        >
          [SEND]
        </motion.button>
      </div>
    </HudFrame>
  );
}
