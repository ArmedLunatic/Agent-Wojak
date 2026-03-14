"use client";

import { useState, useRef, useEffect } from "react";

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
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-green-700 text-center mt-16">
            <p className="text-2xl glow mb-2">⟩ AGENT WOJAK ONLINE</p>
            <p className="text-sm">type something, fren. i&apos;m ready to feel things.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
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
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-green-950/50 text-green-600 px-4 py-2 rounded border border-green-900/50">
              <span className="animate-pulse">wojak is feeling things...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-green-900 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="say something to wojak..."
          className="flex-1 bg-black border border-green-900 rounded px-4 py-2 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-900/50 border border-green-700 px-6 py-2 rounded text-green-400 hover:bg-green-800/50 transition-colors disabled:opacity-50"
        >
          [SEND]
        </button>
      </div>
    </div>
  );
}
