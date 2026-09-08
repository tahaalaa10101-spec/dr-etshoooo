"use client";

import { useEffect, useState } from "react";

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject?: string;
  topic?: string;
}

export default function MCQsPage() {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data.subjects || data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const url = subjectFilter ? `/api/mcqs?subject=${subjectFilter}` : "/api/mcqs";
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setMcqs(data.mcqs || data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [subjectFilter]);

  const currentMCQ = mcqs[currentIndex];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentIndex((prev) => Math.min(prev + 1, mcqs.length - 1));
  };

  const prevQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Practice</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">MCQs</h1>
          <p className="mt-2 text-sm text-text-secondary">Test your knowledge with multiple choice questions</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <select
            value={subjectFilter}
            onChange={(e) => { setSubjectFilter(e.target.value); setCurrentIndex(0); setSelectedAnswer(null); setShowExplanation(false); }}
            className="rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary outline-none focus:border-accent/50"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {mcqs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <p className="mb-2 text-lg font-bold text-text-primary">No MCQs available</p>
            <p className="text-sm text-text-secondary">Questions will appear here once added</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {/* Progress */}
            <div className="mb-6 flex items-center justify-between text-sm text-text-secondary">
              <span>Question {currentIndex + 1} of {mcqs.length}</span>
              <span>{Math.round(((currentIndex + 1) / mcqs.length) * 100)}% Complete</span>
            </div>
            <div className="mb-8 h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / mcqs.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
              {currentMCQ.subject && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">{currentMCQ.subject}</span>
                  {currentMCQ.topic && (
                    <span className="rounded-lg bg-surface px-2.5 py-1 text-[11px] text-text-muted">{currentMCQ.topic}</span>
                  )}
                </div>
              )}

              <h2 className="mb-6 text-lg font-bold text-text-primary sm:text-xl">{currentMCQ.question}</h2>

              <div className="space-y-3">
                {currentMCQ.options.map((option, index) => {
                  let optionClass = "border-border bg-surface/40 hover:border-accent/30 hover:bg-surface/70";
                  if (selectedAnswer !== null) {
                    if (index === currentMCQ.correctAnswer) {
                      optionClass = "border-success/50 bg-success/10";
                    } else if (index === selectedAnswer) {
                      optionClass = "border-danger/50 bg-danger/10";
                    } else {
                      optionClass = "border-border bg-surface/20 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full rounded-xl border p-4 text-left text-sm font-medium text-text-primary transition-all ${optionClass}`}
                    >
                      <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-xs text-text-muted">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-accent">Explanation</span>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">{currentMCQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/5 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentIndex === mcqs.length - 1}
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-light disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
