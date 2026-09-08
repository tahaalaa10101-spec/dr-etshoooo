"use client";

import { useEffect, useState } from "react";

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  topicsCount: number;
  lecturesCount: number;
}

export default function SubjectsContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((result) => setSubjects(result.data || []))
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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Explore</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">All Subjects</h1>
          <p className="mt-2 text-sm text-text-secondary">Browse all medical subjects and start learning</p>
        </div>

        {subjects.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <p className="text-text-secondary">No subjects available yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map((subject) => (
              <a
                key={subject.id}
                href={`/subjects/${subject.slug}`}
                className="group rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="mb-1.5 text-base font-bold text-text-primary">{subject.name}</h3>
                <p className="mb-4 text-[13px] leading-relaxed text-text-secondary line-clamp-2">{subject.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="font-semibold text-accent">{subject.topicsCount} Topics</span>
                    <span>{subject.lecturesCount} Lectures</span>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-primary">
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
