"use client";

import { useState, useCallback } from "react";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  slug?: string;
  description?: string;
  subject?: string;
  question?: string;
  name?: string;
  category?: string;
  term?: string;
  arabicTerm?: string;
  latinTerm?: string;
  definition?: string;
}

interface SearchResults {
  lectures: SearchResult[];
  mcqs: SearchResult[];
  notes: SearchResult[];
  terms: SearchResult[];
  cases: SearchResult[];
  essays: SearchResult[];
  apps: SearchResult[];
  howToStudy: SearchResult[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults({
        lectures: data.data?.lectures || data.lectures || [],
        mcqs: data.data?.mcqs || data.mcqs || [],
        notes: data.data?.notes || data.notes || [],
        terms: data.data?.terms || data.terms || [],
        cases: data.data?.cases || data.cases || [],
        essays: data.data?.essays || data.essays || [],
        apps: data.data?.apps || data.apps || [],
        howToStudy: data.data?.howToStudy || data.howToStudy || [],
      });
    } catch {
      setResults({ lectures: [], mcqs: [], notes: [], terms: [], cases: [], essays: [], apps: [], howToStudy: [] });
    }
    setLoading(false);
  }, [query]);

  const totalResults = results
    ? results.lectures.length + results.mcqs.length + results.notes.length +
      results.terms.length + results.cases.length + results.essays.length +
      results.apps.length + results.howToStudy.length
    : 0;

  const sections = [
    { title: "Lectures", items: results?.lectures || [], href: (item: SearchResult) => `/lectures/${item.slug}` },
    { title: "Medical Terms", items: results?.terms || [], href: (_item: SearchResult) => `/terminology` },
    { title: "MCQs", items: results?.mcqs || [], href: (item: SearchResult) => `/subjects` },
    { title: "Notes", items: results?.notes || [], href: (item: SearchResult) => `/subjects` },
    { title: "Clinical Cases", items: results?.cases || [], href: (item: SearchResult) => `/subjects` },
    { title: "Essays", items: results?.essays || [], href: (item: SearchResult) => `/subjects` },
    { title: "Medical Apps", items: results?.apps || [], href: (_item: SearchResult) => `/apps` },
    { title: "How to Study", items: results?.howToStudy || [], href: (item: SearchResult) => item.slug ? `/how-to-study/${item.slug}` : `/how-to-study` },
  ];

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Search</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Find Anything</h1>
          <p className="mt-2 text-sm text-text-secondary">Search across lectures, terms, MCQs, notes, cases, apps, and more</p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search subjects, lectures, terms..."
                className="w-full rounded-xl border border-border bg-surface/60 py-3.5 pl-12 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent/50"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="shrink-0 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-light disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}

        {!loading && searched && results && (
          <div>
            <p className="mb-6 text-sm text-text-secondary">
              {totalResults} {totalResults === 1 ? "result" : "results"} found for &quot;{query}&quot;
            </p>

            {totalResults === 0 ? (
              <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
                <p className="mb-2 text-lg font-bold text-text-primary">No results found</p>
                <p className="text-sm text-text-secondary">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-8">
                {sections.map((section) =>
                  section.items.length > 0 ? (
                    <div key={section.title}>
                      <h2 className="mb-4 text-lg font-bold text-text-primary">{section.title}</h2>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {section.items.map((item) => (
                          <a
                            key={item.id}
                            href={section.href(item)}
                            className="group rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
                          >
                            <h3 className="mb-1 text-sm font-medium text-text-primary group-hover:text-accent">
                              {item.title || item.question || item.name || item.term || "Untitled"}
                            </h3>
                            {(item.description || item.definition) && (
                              <p className="text-xs text-text-secondary line-clamp-2">{item.description || item.definition}</p>
                            )}
                            {(item.subject || item.category || item.arabicTerm) && (
                              <p className="mt-2 text-[11px] text-text-muted">
                                {item.subject || item.category || item.arabicTerm}
                              </p>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
