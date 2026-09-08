"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Topic {
  id: string;
  name: string;
  slug: string;
  lecturesCount?: number;
  _count?: { lectures: number };
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  topics: Topic[];
  completedTopics: number;
  totalTopics: number;
}

export default function SubjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/subjects/${slug}`)
      .then((res) => res.json())
      .then((result) => {
        const s = result.data;
        if (s) {
          setSubject({
            ...s,
            topics: s.topics || [],
            completedTopics: s.completedTopics || 0,
            totalTopics: s.topics?.length || 0,
          });
        }
      })
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

  if (!subject) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">Subject not found</p>
      </div>
    );
  }

  const progressPercent = subject.totalTopics
    ? Math.round((subject.completedTopics / subject.totalTopics) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <a href="/subjects" className="hover:text-text-primary transition-colors">Subjects</a>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-text-primary">{subject.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{subject.name}</h1>
              <p className="mt-1 text-sm text-text-secondary">{subject.description}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-secondary">Progress</span>
              <span className="font-semibold text-accent">{progressPercent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-text-muted">
              {subject.completedTopics} of {subject.totalTopics} topics completed
            </p>
          </div>
        </div>

        {/* Topics */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-text-primary">Topics</h2>
          {subject.topics.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface/40 p-8 text-center">
              <p className="text-sm text-text-secondary">No topics available yet</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subject.topics.map((topic) => (
                <a
                  key={topic.id}
                  href={`/subjects/${subject.slug}/${topic.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary group-hover:text-accent">{topic.name}</p>
                    <p className="text-xs text-text-secondary">{topic._count?.lectures || topic.lecturesCount || 0} lectures</p>
                  </div>
                  <svg className="h-4 w-4 flex-shrink-0 text-text-muted group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
