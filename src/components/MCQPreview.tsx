"use client";

import { useEffect, useState } from "react";

export default function MCQPreview() {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [mcq, setMcq] = useState<{ question: string; options: string; correctAnswer?: string; topic?: { name: string; subject?: { name: string } } } | null>(null);

  useEffect(() => {
    fetch("/api/mcqs?limit=1")
      .then((res) => res.json())
      .then((result) => {
        if (result.data?.length > 0) setMcq(result.data[0]);
      })
      .catch(() => {});
  }, []);

  if (!mcq) return null;

  let options: { letter: string; text: string }[];
  try {
    options = JSON.parse(mcq.options);
  } catch {
    options = [];
  }

  return (
    <section id="mcqs" className="section-padding bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Practice</p>
            <h2 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
              Test Your <span className="text-accent">Knowledge</span>
            </h2>
            <p className="mb-8 text-sm text-text-secondary">
              Practice thousands of medical questions and discover what you truly know.
            </p>
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">MCQ</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Multiple Choice Questions</p>
                  <p className="text-xs text-text-muted">Across all subjects</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-lg">📊</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Easy · Medium · Hard</p>
                  <p className="text-xs text-text-muted">Multiple difficulty levels</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-lg">⚡</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Instant Explanations</p>
                  <p className="text-xs text-text-muted">Learn from every question</p>
                </div>
              </div>
            </div>
            <a href="/mcqs" className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-xl">
              Practice MCQs
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="rounded-3xl border border-border bg-surface/60 p-8 shadow-xl shadow-black/20">
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400">
                {mcq.topic?.subject?.name || "Subject"}
              </span>
              <span className="text-xs text-text-muted">— {mcq.topic?.name || ""}</span>
            </div>
            <p className="mb-6 text-base font-medium leading-relaxed text-text-primary">
              {mcq.question}
            </p>
            <div className="mb-6 space-y-3">
              {options.map((opt) => (
                <button key={opt.letter} onClick={() => { setSelected(opt.letter); setChecked(false); }}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                    selected === opt.letter
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/30 hover:bg-surface/50"
                  }`}>
                  <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    selected === opt.letter ? "bg-accent text-primary" : "bg-primary-light text-text-secondary"
                  }`}>{opt.letter}</span>
                  <span className="text-sm font-medium text-text-primary">{opt.text}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-primary/50 p-4">
              <span className="text-sm text-text-muted">
                {checked
                  ? selected === mcq.correctAnswer
                    ? "Correct!"
                    : mcq.correctAnswer
                      ? `Incorrect. The correct answer is ${mcq.correctAnswer}.`
                      : "Answer submitted."
                  : "Select an answer"}
              </span>
              <button
                disabled={!selected}
                onClick={() => selected && setChecked(true)}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed">
                Check Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
