"use client";

import { useEffect, useState } from "react";

interface Year {
  id: string;
  title: string;
  slug: string;
  description?: string;
  semesters?: { subjects?: { name: string }[] }[];
}

export default function AcademicYears() {
  const [years, setYears] = useState<Year[]>([]);

  useEffect(() => {
    fetch("/api/years")
      .then((res) => res.json())
      .then((result) => setYears(result.data || []))
      .catch(() => {});
  }, []);

  if (years.length === 0) return null;

  return (
    <section id="years" className="section-padding bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Academic Years</p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Your Journey Through <span className="text-accent">Medical School</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {years.map((y) => {
            const subjectNames = y.semesters?.flatMap((s) => s.subjects?.map((sub) => sub.name) || []) || [];
            return (
              <a key={y.id} href={`/years/${y.slug}`}
                className="group rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-300 card-hover hover:border-accent/20 hover:bg-surface/70">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-xl text-accent transition-transform duration-300 group-hover:scale-110">
                    🎓
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-text-muted transition-colors group-hover:text-accent">
                    <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">Explore</span>
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                <div className="mb-1 text-sm font-bold text-accent">{y.title}</div>
                <p className="mb-3 text-xs text-text-muted">{y.description || "Medical education"}</p>
                {subjectNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {subjectNames.slice(0, 4).map((s) => (
                      <span key={s} className="rounded-lg bg-primary-light/80 px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
