"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
}

interface YearDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  semesters: Semester[];
}

export default function YearDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [year, setYear] = useState<YearDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/years/${slug}`)
      .then((res) => res.json())
      .then((data) => setYear(data.year || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!year) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">Year not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
          <a href="/years" className="hover:text-text-primary transition-colors">Years</a>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-text-primary">{year.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{year.title}</h1>
              <p className="mt-1 text-sm text-text-secondary">{year.description}</p>
            </div>
          </div>
        </div>

        {/* Semesters */}
        <div className="space-y-8">
          {year.semesters.map((semester) => (
            <div key={semester.id}>
              <h2 className="mb-4 text-lg font-bold text-text-primary">{semester.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {semester.subjects.map((subject) => (
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
                    <h3 className="mb-1.5 text-base font-bold text-text-primary group-hover:text-accent">{subject.name}</h3>
                    <p className="text-[13px] leading-relaxed text-text-secondary line-clamp-2">{subject.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
