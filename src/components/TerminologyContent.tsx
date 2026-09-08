"use client";

import { useEffect, useState, useMemo } from "react";

interface Term {
  id: string;
  term: string;
  definition: string;
  arabicMeaning?: string;
  pronunciation?: string;
  category?: string;
}

export default function TerminologyContent() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/terms")
      .then((res) => res.json())
      .then((data) => setTerms(data.terms || data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return terms;
    const q = search.toLowerCase();
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.arabicMeaning?.toLowerCase().includes(q)
    );
  }, [terms, search]);

  const grouped = filtered.reduce<Record<string, Term[]>>((acc, term) => {
    const key = term.category || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(term);
    return acc;
  }, {});

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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Reference</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Medical Terminology</h1>
          <p className="mt-2 text-sm text-text-secondary">Comprehensive glossary of medical terms</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms, definitions..."
              className="w-full rounded-xl border border-border bg-surface/60 py-3.5 pl-12 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent/50"
            />
          </div>
        </div>

        {terms.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-bold text-text-primary">No terms available</p>
            <p className="text-sm text-text-secondary">Medical terms will appear here once added</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, categoryTerms]) => (
              <div key={category}>
                <h2 className="mb-4 text-lg font-bold text-text-primary">{category}</h2>
                <div className="space-y-3">
                  {categoryTerms.map((term) => (
                    <div
                      key={term.id}
                      className="rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="text-base font-bold text-text-primary">{term.term}</h3>
                            {term.pronunciation && (
                              <span className="text-xs text-text-muted">/{term.pronunciation}/</span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed text-text-secondary">{term.definition}</p>
                          {term.arabicMeaning && (
                            <p className="mt-2 text-sm text-accent">{term.arabicMeaning}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
