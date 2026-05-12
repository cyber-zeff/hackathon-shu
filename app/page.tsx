"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ChatBot from "@/app/components/ChatBot";

const fields = [
  "Technology", "Medicine", "Business", "Engineering",
  "Law", "Design", "Finance", "Research",
];

export default function HomePage() {
  const searchParams = useSearchParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchType, setSearchType] = useState<"uni" | "field" | null>(null);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchParams.get("chat") === "true") {
      setIsChatOpen(true);
    }
  }, [searchParams]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    setSearchResult("");

    try {
      const prompt = searchType === "uni" 
        ? `Recommend top universities in Pakistan for the field: ${query}. Provide a concise list with a one-sentence reason for each.`
        : `Explain the career field "${query}" in the context of Pakistan. What are the top roles, salary ranges in PKR, and future outlook?`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          context: "User is using the quick search feature on the home page. Focus exclusively on Pakistan.",
        }),
      });

      const data = await res.json();
      setSearchResult(data.content);
    } catch (err) {
      setSearchResult("Failed to get information. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--paper)]">
      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between border-b border-[var(--border)] bg-white/50 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Tota-ly Guiding Logo" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-display text-lg tracking-tight">Tota-ly Guiding</span>
        </div>
        <div className="hidden md:flex gap-6">
           <button onClick={() => {setSearchType("uni"); setSearchResult(""); setQuery("")}} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">Universities</button>
           <button onClick={() => {setSearchType("field"); setSearchResult(""); setQuery("")}} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">Career Fields</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent)] text-xs font-medium tracking-widest uppercase mb-8 animate-fade-up"
            style={{ color: "var(--accent-deep)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Bas woh degree mat lena jo dost le raha hai.
          </div>

          <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6 animate-fade-up">
            Your Future in <em className="shimmer-text not-italic">Pakistan</em><br />Starts Here
          </h1>
          
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto mb-12 animate-fade-up delay-100">
            Empowering Pakistani students to make informed decisions about their careers and education.
          </p>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8 px-4">
            {/* 1. Assessment */}
            <Link href="/assessment" className="group p-8 bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--accent)] transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--paper)] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">📝</div>
                <h3 className="font-display text-2xl mb-3 text-[var(--ink)]">Take Assessment</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">Discover your ideal path through 10 personality-based questions.</p>
              </div>
              <div className="mt-8 text-sm font-bold text-[var(--accent-deep)] flex items-center gap-2">
                Get Started <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            {/* 2. Search Universities */}
            <button onClick={() => {setSearchType("uni"); setSearchResult(""); setQuery("")}} className="group p-8 bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--accent)] transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--paper)] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🏛</div>
                <h3 className="font-display text-2xl mb-3 text-[var(--ink)]">Search Universities</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">Find top-ranked Pakistani universities for any specific field.</p>
              </div>
              <div className="mt-8 text-sm font-bold text-[var(--accent-deep)] flex items-center gap-2">
                Find Uni <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            {/* 3. Search Fields */}
            <button onClick={() => {setSearchType("field"); setSearchResult(""); setQuery("")}} className="group p-8 bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--accent)] transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--paper)] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🚀</div>
                <h3 className="font-display text-2xl mb-3 text-[var(--ink)]">Explore Fields</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">Learn about emerging roles and market demand in Pakistan.</p>
              </div>
              <div className="mt-8 text-sm font-bold text-[var(--accent-deep)] flex items-center gap-2">
                Explore Now <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            {/* 4. Chat Direct */}
            <button onClick={() => setIsChatOpen(true)} className="group p-8 bg-[var(--ink)] rounded-2xl shadow-lg hover:shadow-2xl transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🦜</div>
                <h3 className="font-display text-2xl mb-3 text-white">Talk to padhleTota</h3>
                <p className="text-white/70 text-sm leading-relaxed">Have a direct conversation with our AI career mentor.</p>
              </div>
              <div className="mt-8 text-sm font-bold text-[var(--accent)] flex items-center gap-2">
                Start Chatting <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Search Overlay/Modal */}
      {searchType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[var(--ink)]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-fade-up">
             <div className="px-8 py-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--paper)]">
                <h3 className="font-display text-2xl">
                  {searchType === "uni" ? "Find Pakistani Universities" : "Explore Career Fields"}
                </h3>
                <button onClick={() => setSearchType(null)} className="text-[var(--muted)] hover:text-[var(--ink)]">✕</button>
             </div>
             <div className="p-8">
                <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                  <input 
                    autoFocus
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchType === "uni" ? "e.g. Software Engineering, Medicine..." : "e.g. Data Science, Digital Marketing..."}
                    className="flex-1 px-6 py-4 rounded-xl border border-[var(--border)] focus:border-[var(--accent)] outline-none"
                  />
                  <button 
                    disabled={isSearching || !query.trim()}
                    type="submit" 
                    className="px-8 bg-[var(--ink)] text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                </form>

                {searchResult && (
                  <div className="bg-[var(--paper)] p-6 rounded-2xl border border-[var(--border)] max-h-[300px] overflow-y-auto animate-fade-in">
                    <div className="prose prose-sm text-[var(--ink)]">
                      {searchResult.split("\n").map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Fields ticker */}
      <section className="mt-auto border-t border-[var(--border)] py-4 overflow-hidden bg-[var(--ink)]">
        <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...fields, ...fields].map((f, i) => (
            <span key={i} className="text-[var(--accent)] text-sm font-medium tracking-widest uppercase">
              {f} ·
            </span>
          ))}
        </div>
      </section>

      {/* Direct Chat Component */}
      <ChatBot careers={[]} answers={[]} forceOpen={isChatOpen} setForceOpen={setIsChatOpen} isHomeMode={true} />

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
