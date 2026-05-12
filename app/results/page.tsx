"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Career, RecommendationResult, Answer } from "@/lib/types";
import ChatBot from "@/app/components/ChatBot";

const FIELD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Technology: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Business: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Healthcare: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Engineering: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  "Data Science": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Arts & Design": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Law: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Finance: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  "Social Sciences": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "Media & Communications": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
};

function getFieldStyle(field: string) {
  return FIELD_COLORS[field] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
}

function CareerCard({ career, index }: { career: Career; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const style = getFieldStyle(career.field);

  return (
    <div
      className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "forwards" }}
    >
      {/* Card header */}
      <div className="p-8 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-sm font-bold font-display">
              {index + 1}
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}
            >
              {career.field}
            </span>
          </div>
        </div>

        <h2 className="font-display text-3xl leading-tight mb-4">{career.title}</h2>

        <p className="text-[var(--muted)] text-sm leading-relaxed">{career.reason}</p>

        <div className="mt-5 flex items-start gap-2 p-3 rounded-lg bg-[var(--paper)] border border-[var(--border)]">
          <span className="text-[var(--accent)] mt-0.5">✦</span>
          <div>
            <p className="text-xs font-medium text-[var(--muted)] mb-0.5 uppercase tracking-widest">
              Recommended Degree
            </p>
            <p className="text-sm font-medium text-[var(--ink)]">{career.degree}</p>
          </div>
        </div>
      </div>

      {/* Universities */}
      <div className="border-t border-[var(--border)]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-8 py-4 flex items-center justify-between text-sm font-medium hover:bg-[var(--paper)] transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="text-[var(--accent)]">⬡</span>
            Top Universities for {career.field}
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[var(--border)] text-xs text-[var(--muted)]">
              {career.universities.length}
            </span>
          </span>
          <span
            className="text-[var(--muted)] transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ↓
          </span>
        </button>

        {expanded && (
          <div className="px-8 pb-6 space-y-3 animate-fade-in">
            {career.universities.length === 0 ? (
              <p className="text-[var(--muted)] text-sm italic">
                No universities found for this field yet.
              </p>
            ) : (
              career.universities.map((uni, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-sm transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--paper)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--muted)]">
                    #{uni.ranking}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{uni.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {uni.location}, {uni.country}
                    </p>
                  </div>
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--accent-deep)] opacity-0 group-hover:opacity-100 transition-opacity font-medium whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit →
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [data, setData] = useState<RecommendationResult | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("advisor_results");
      const rawAnswers = sessionStorage.getItem("advisor_answers");
      if (!raw) {
        setError("No results found. Please complete the assessment first.");
        return;
      }
      setData(JSON.parse(raw));
      if (rawAnswers) {
        setAnswers(JSON.parse(rawAnswers));
      }
    } catch {
      setError("Failed to load results. Please try the assessment again.");
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <div className="text-4xl mb-4">⚠</div>
          <h2 className="font-display text-2xl mb-3">{error}</h2>
          <Link
            href="/assessment"
            className="inline-block mt-4 px-6 py-3 bg-[var(--ink)] text-white rounded-full text-sm font-medium hover:bg-[var(--accent-deep)] transition-colors"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-t-2 border-[var(--accent-deep)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between border-b border-[var(--border)] bg-white/80 backdrop-blur sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Tota-ly Guiding Logo" className="w-7 h-7 rounded-full object-cover" />
          <span className="font-display text-base tracking-tight">Tota-ly Guiding</span>
        </Link>
        <Link
          href="/assessment"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          Retake Assessment
        </Link>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent)] text-xs font-medium tracking-widest uppercase mb-6 opacity-0 animate-fade-up"
          style={{ color: "var(--accent-deep)", animationFillMode: "forwards" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          Your Personalized Results
        </div>
        <h1
          className="font-display text-5xl md:text-6xl leading-tight mb-4 opacity-0 animate-fade-up delay-100"
          style={{ animationFillMode: "forwards" }}
        >
          Your Ideal Career Paths
        </h1>
        <p
          className="text-[var(--muted)] text-lg max-w-md mx-auto opacity-0 animate-fade-up delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          Based on your assessment, here are 3 careers matched to your personality,
          strengths, and aspirations.
        </p>
      </div>

      {/* Career Cards */}
      <div className="max-w-3xl mx-auto px-6 pb-24 space-y-6">
        {data.careers.map((career: Career, i: number) => (
          <CareerCard key={i} career={career} index={i} />
        ))}

        {/* Footer CTA */}
        <div
          className="text-center pt-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
        >
          <p className="text-[var(--muted)] text-sm mb-4">
            Want different results? Your answers shape the recommendations.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--ink)] text-[var(--ink)] rounded-full text-sm font-medium hover:bg-[var(--ink)] hover:text-white transition-all duration-200"
          >
            Retake Assessment
          </Link>
        </div>
      </div>

      <ChatBot careers={data.careers} answers={answers} />
    </div>
  );
}
