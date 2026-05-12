"use client";

import { useState, useRef, useEffect } from "react";
import type { Career, Answer } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBotProps {
  careers?: Career[];
  answers?: Answer[];
  forceOpen?: boolean;
  setForceOpen?: (open: boolean) => void;
  isHomeMode?: boolean;
}

export default function ChatBot({ 
  careers = [], 
  answers = [], 
  forceOpen = false, 
  setForceOpen,
  isHomeMode = false
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync internal open state with forceOpen prop
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Handle closing
  function handleClose() {
    setIsOpen(false);
    if (setForceOpen) setForceOpen(false);
  }

  // Initialize chat with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      if (isHomeMode) {
        setMessages([
          {
            role: "assistant",
            content: `Salam! I'm padhleTota, your Pakistani career mentor. 🇵🇰

I'm here to help you navigate your future. To get started, tell me: what are your favorite subjects in school, or is there a specific career you've been dreaming about?`,
          },
        ]);
      } else if (careers.length > 0) {
        const careerList = careers.map((c) => c.title).join(", ");
        setMessages([
          {
            role: "assistant",
            content: `Hi there! I'm padhleTota. I see your top career matches are **${careerList}**. 

How can I help you explore these fields further? Feel free to ask about day-to-day life, salary expectations, or which one might fit your interests best!`,
          },
        ]);
      }
    }
  }, [careers, messages.length, isHomeMode]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const context = isHomeMode 
        ? "User is talking to you directly from the home page. No assessment results yet. Ask them questions about their interests in Pakistan."
        : `
User Assessment Answers:
${answers.map((a) => `Q: ${a.question}\nA: ${a.selected}`).join("\n")}

Recommended Careers:
${careers
  .map(
    (c) =>
      `- ${c.title} (${c.field}): ${c.reason}\n  Degree: ${c.degree}`
  )
  .join("\n")}
`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl border border-[var(--border)] shadow-2xl flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="px-6 py-4 bg-[var(--ink)] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-display text-lg tracking-tight">padhleTota</span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--paper)]/50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[var(--accent-deep)] text-white rounded-tr-none"
                      : "bg-white border border-[var(--border)] text-[var(--ink)] rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content.split("\n").map((line, j) => (
                    <p key={j} className={line.trim() === "" ? "h-2" : "mb-1"}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-[var(--border)] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask padhleTota anything..."
              className="flex-1 px-4 py-2 rounded-full border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center hover:bg-[var(--accent-deep)] transition-colors disabled:opacity-50"
            >
              ↑
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 bg-[var(--ink)] text-white"
        >
          <div className="flex flex-col items-center">
             <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center mb-0.5">
                <span className="text-[var(--ink)] text-[8px] font-bold">AI</span>
             </div>
             <span className="text-[8px] font-bold uppercase tracking-tighter">Chat</span>
          </div>
        </button>
      )}
    </div>
  );
}
