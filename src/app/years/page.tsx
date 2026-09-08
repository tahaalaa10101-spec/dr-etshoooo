"use client";

import { useEffect, useState } from "react";

interface Year {
  id: string;
  title: string;
  slug: string;
  description: string;
  semestersCount: number;
}

export default function YearsPage() {
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/years")
      .then((res) => res.json())
      .then((data) => setYears(data.years || data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Academic Years</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Browse by Year</h1>
          <p className="mt-2 text-sm text-text-secondary">Select your academic year to find relevant content</p>
        </div>

        {years.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <p className="text-text-secondary">No academic years available yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {years.map((year) => (
              <a
                key={year.id}
                href={`/years/${year.slug}`}
                className="group rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-text-primary group-hover:text-accent">{year.title}</h3>
                <p className="mb-4 text-sm text-text-secondary line-clamp-2">{year.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-accent">{year.semestersCount} Semesters</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-primary">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
