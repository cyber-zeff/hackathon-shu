"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { questions } from "@/lib/questions";
import type { Answer } from "@/lib/types";

export default function AssessmentPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const question = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;
  const isLast = currentQ === questions.length - 1;
  const hasAnswer = selected !== null || answers[question.id] !== undefined;
  const currentSelected = selected ?? answers[question.id] ?? null;

  function selectOption(value: string) {
    setSelected(value);
  }

  async function handleNext() {
    if (!currentSelected) return;

    const newAnswers = { ...answers, [question.id]: currentSelected };
    setAnswers(newAnswers);

    if (!isLast) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setTransitioning(false);
      }, 300);
    } else {
      await submitAnswers(newAnswers);
    }
  }

  function handleBack() {
    if (currentQ === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentQ((q) => q - 1);
      setSelected(null);
      setTransitioning(false);
    }, 200);
  }

  async function submitAnswers(allAnswers: Record<number, string>) {
    setLoading(true);
    setError(null);

    const payload: Answer[] = questions.map((q) => ({
      question_id: q.id,
      question: q.question,
      selected: allAnswers[q.id] || "",
    }));

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      sessionStorage.setItem("advisor_results", JSON.stringify(data));
      sessionStorage.setItem("advisor_answers", JSON.stringify(payload));
      router.push("/results");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get recommendations";
      setError(msg);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--paper)] px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-8 relative">
            <div className="w-16 h-16 rounded-full border-2 border-[var(--border)] absolute" />
            <div className="w-16 h-16 rounded-full border-t-2 border-[var(--accent-deep)] animate-spin absolute" />
          </div>
          <h2 className="font-display text-3xl mb-3">Analyzing your answers...</h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            Our AI is crafting personalized career recommendations just for you.
            This usually takes 10–20 seconds.
          </p>
          <div className="mt-8 flex gap-2 justify-center">
            {["Mapping your profile", "Matching careers", "Finding universities"].map((s, i) => (
              <div
                key={i}
                className="px-3 py-1 rounded-full bg-[var(--border)] text-xs text-[var(--muted)] animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)]">
      {/* Top bar */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Tota-ly Guiding Logo" className="w-7 h-7 rounded-full object-cover" />
          <span className="font-display text-base tracking-tight">Tota-ly Guiding</span>
        </Link>
        <span className="text-sm text-[var(--muted)]">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--border)] w-full">
        <div
          className="h-full bg-[var(--accent-deep)] progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div
          className={`w-full max-w-2xl transition-all duration-300 ${
            transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Question number badge */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "var(--accent-deep)" }}
            >
              Question {currentQ + 1}
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-10">
            {question.question}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((opt, i) => {
              const isSelected = currentSelected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectOption(opt.value)}
                  className={`option-card text-left px-6 py-4 rounded-xl border-2 cursor-pointer font-medium text-base transition-all ${
                    isSelected
                      ? "selected"
                      : "border-[var(--border)] bg-white hover:border-[var(--accent)] hover:shadow-md"
                  }`}
                  style={{
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <span
                    className={`text-xs font-bold mr-3 ${
                      isSelected ? "text-[var(--accent)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <strong>Error:</strong> {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 underline text-red-500 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={handleBack}
              disabled={currentQ === 0}
              className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswer && !currentSelected}
              className={`px-8 py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                currentSelected
                  ? "bg-[var(--ink)] text-white hover:bg-[var(--accent-deep)] hover:scale-105 shadow-md hover:shadow-lg"
                  : "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
              }`}
            >
              {isLast ? "Get My Results →" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="pb-8 flex justify-center gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === currentQ
                ? "w-5 h-1.5 bg-[var(--accent-deep)]"
                : i < currentQ
                ? "w-1.5 h-1.5 bg-[var(--accent)]"
                : "w-1.5 h-1.5 bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
