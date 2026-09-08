"use client";

import { useEffect, useState } from "react";

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  _count?: { topics: number };
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((result) => setSubjects(result.data || []))
      .catch(() => {});
  }, []);

  if (subjects.length === 0) return null;

  return (
    <section id="subjects" className="section-padding bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Explore Medicine</p>
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
              Everything You Need to Master Medicine
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Access high-quality content across all major medical subjects
            </p>
          </div>
          <a href="/subjects" className="hidden items-center gap-2 rounded-xl border border-border bg-surface/50 px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent/30 hover:text-text-primary md:inline-flex">
            View All Subjects
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.slice(0, 8).map((subject) => (
            <a key={subject.id} href={`/subjects/${subject.slug}`}
              className="group rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 card-hover hover:border-accent/20 hover:bg-surface/70">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="mb-1.5 text-base font-bold text-text-primary">{subject.name}</h3>
              <p className="mb-4 text-[13px] leading-relaxed text-text-secondary line-clamp-2">{subject.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-accent">{subject._count?.topics || 0} Topics</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-primary">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {subjects.length > 8 && (
          <div className="mt-6 flex justify-center md:hidden">
            <a href="/subjects" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent/30 hover:text-text-primary">
              View All Subjects
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
