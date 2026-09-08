"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface DictionaryTerm {
  id: string;
  term: string;
  arabicTerm: string | null;
  latinTerm: string | null;
  definition: string;
  simpleExplanation: string | null;
  arabicMeaning: string | null;
  pronunciation: string | null;
  clinicalRelevance: string | null;
  relatedTerms: string | null;
  subjectId: string | null;
  subject: { id: string; name: string } | null;
}

export default function DictionaryContent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DictionaryTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/dictionary?search=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      setResults(data.success ? data.data : []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(query);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Medical Dictionary</p>
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Smart Search</h1>
          <p className="mt-3 text-sm text-text-secondary">Search in English, Arabic, or Latin — across all medical terms</p>
        </div>

        <div className="mb-10">
          <div className="relative">
            <svg className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a term in English, Arabic, or Latin..."
              className="w-full rounded-2xl border border-border bg-surface/60 py-5 pl-14 pr-6 text-base text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface/40 p-16 text-center">
            <svg className="mx-auto h-16 w-16 text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="mb-2 text-lg font-bold text-text-primary">No results found</p>
            <p className="text-sm text-text-secondary">Try a different search term in English, Arabic, or Latin</p>
          </div>
        )}

        {!loading && searched && results.length > 0 && (
          <div>
            <p className="mb-6 text-sm text-text-secondary">
              {results.length} {results.length === 1 ? "term" : "terms"} found for &quot;{query}&quot;
            </p>
            <div className="space-y-4">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{item.term}</h3>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {item.arabicTerm && (
                          <span className="text-sm text-accent font-medium" dir="rtl">{item.arabicTerm}</span>
                        )}
                        {item.latinTerm && (
                          <span className="text-sm text-text-muted italic">{item.latinTerm}</span>
                        )}
                      </div>
                    </div>
                    {item.subject && (
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        {item.subject.name}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-text-secondary mb-3 leading-relaxed">{item.definition}</p>

                  {item.simpleExplanation && (
                    <div className="mb-3 rounded-xl bg-surface-alt/50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Simple Explanation</p>
                      <p className="text-sm text-text-secondary">{item.simpleExplanation}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                    {item.arabicMeaning && (
                      <span dir="rtl">{item.arabicMeaning}</span>
                    )}
                    {item.clinicalRelevance && (
                      <span className="text-accent">Clinical: {item.clinicalRelevance}</span>
                    )}
                    {item.relatedTerms && (
                      <span>Related: {item.relatedTerms}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !searched && (
          <div className="rounded-2xl border border-border bg-surface/40 p-16 text-center">
            <svg className="mx-auto h-16 w-16 text-accent/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="mb-2 text-lg font-bold text-text-primary">Start Searching</p>
            <p className="text-sm text-text-secondary">Type any medical term to see its definition, translation, and clinical relevance</p>
          </div>
        )}
      </div>
    </div>
  );
}
