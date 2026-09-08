"use client";

import { useEffect, useState } from "react";

interface ClinicalCase {
  id: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  difficulty: string;
}

export default function CasesPage() {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => setCases(data.cases || data || []))
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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Clinical</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Medical Cases</h1>
          <p className="mt-2 text-sm text-text-secondary">Apply your knowledge with real clinical scenarios</p>
        </div>

        {cases.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-bold text-text-primary">No cases available</p>
            <p className="text-sm text-text-secondary">Clinical cases will appear here once added</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((item) => (
              <a
                key={item.id}
                href={`/cases/${item.slug}`}
                className="group rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">{item.subject}</span>
                  <span className="rounded-lg bg-warning/10 px-2.5 py-1 text-[11px] font-medium text-warning capitalize">{item.difficulty}</span>
                </div>
                <h3 className="mb-2 text-base font-bold text-text-primary group-hover:text-accent">{item.title}</h3>
                <p className="mb-4 text-[13px] leading-relaxed text-text-secondary line-clamp-3">{item.description}</p>
                <div className="flex items-center gap-2 text-xs text-accent">
                  <span>View Case</span>
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
