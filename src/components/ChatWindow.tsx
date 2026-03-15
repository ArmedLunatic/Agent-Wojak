"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="border border-green-900 rounded-lg overflow-hidden">
      {/* Chat messages */}
      <div className="h-72 md:h-96 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        {messages.length === 0 && (
          <div className="text-green-700 text-center mt-16">
            <p className="text-2xl glow mb-2">{"\u27E9"} AGENT WOJAK ONLINE</p>
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
                    ? "bg-green-900/30 text-green-300"
                    : "bg-green-950/50 text-green-400 border border-green-900/50"
                }`}
              >
                {msg.role === "assistant" && (
                  <span className="text-xs text-green-600 block mb-1">WOJAK://</span>
                )}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-green-950/50 text-green-400 px-4 py-3 rounded border border-green-900/50 flex items-center gap-1">
              <span className="text-xs text-green-600 mr-2">WOJAK://</span>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block w-2 h-2 rounded-full bg-green-400"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-green-900 p-3 md:p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="say something to wojak..."
          className="flex-1 min-w-0 bg-black border border-green-900 rounded px-3 md:px-4 py-2 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-500 text-sm md:text-base"
        />
        <motion.button
          onClick={handleSend}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="bg-green-900/50 border border-green-700 px-4 md:px-6 py-2 rounded text-green-400 hover:bg-green-800/50 transition-colors disabled:opacity-50 text-sm md:text-base shrink-0"
        >
          [SEND]
        </motion.button>
      </div>
    </div>
  );
}
