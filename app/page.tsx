"use client";

import Link from "next/link";

const fields = [
  "Technology", "Medicine", "Business", "Engineering",
  "Law", "Design", "Finance", "Research",
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Tota-ly Guiding Logo" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-display text-lg tracking-tight">Tota-ly Guiding</span>
        </div>
        <Link
          href="/assessment"
          className="text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          Start Assessment →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-[var(--border)] opacity-40" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-[var(--border)] opacity-60" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-[var(--accent)] opacity-30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent)] text-xs font-medium tracking-widest uppercase mb-8 opacity-0 animate-fade-up"
            style={{ color: "var(--accent-deep)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            AI-Powered Career Intelligence
          </div>

          <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-tight mb-6 opacity-0 animate-fade-up delay-100">
            Find Your{" "}
            <em className="shimmer-text not-italic">Perfect</em>
            <br />
            Career Path
          </h1>

          <p className="text-[var(--muted)] text-xl max-w-xl mx-auto leading-relaxed mb-12 opacity-0 animate-fade-up delay-200">
            Answer 10 questions. Get 3 personalized career recommendations — complete with
            top universities to help you get there.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center opacity-0 animate-fade-up delay-300">
            <Link
              href="/assessment"
              className="group px-8 py-4 bg-[var(--ink)] text-white rounded-full font-medium text-base hover:bg-[var(--accent-deep)] transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
            >
              Begin Your Assessment
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <span className="text-[var(--muted)] text-sm">Takes about 3 minutes</span>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-t border-[var(--border)] px-8 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "✦",
              title: "10 Smart Questions",
              desc: "Carefully designed to understand your personality, interests, and goals.",
            },
            {
              icon: "◈",
              title: "3 AI-Matched Careers",
              desc: "GPT-4 analyzes your answers and generates personalized career recommendations.",
            },
            {
              icon: "⬡",
              title: "Top University Matches",
              desc: "Each career is paired with the top 5 universities ranked in that field.",
            },
          ].map((f, i) => (
            <div key={i} className="flex flex-col gap-3">
              <span className="text-2xl text-[var(--accent)]">{f.icon}</span>
              <h3 className="font-display text-xl">{f.title}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fields ticker */}
      <section className="border-t border-[var(--border)] py-4 overflow-hidden bg-[var(--ink)]">
        <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...fields, ...fields].map((f, i) => (
            <span key={i} className="text-[var(--accent)] text-sm font-medium tracking-widest uppercase">
              {f} ·
            </span>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
