"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface HowToStudyEntry {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subjectId: string | null;
  order: number;
  subject: Subject | null;
}

export default function HowToStudyContent() {
  const [entries, setEntries] = useState<HowToStudyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const res = await fetch("/api/how-to-study?published=true");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setEntries(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch how-to-study entries");
    } finally {
      setLoading(false);
    }
  }

  const grouped = entries.reduce<Record<string, HowToStudyEntry[]>>((acc, entry) => {
    const key = entry.subject?.name || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Learning</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">How to Study</h1>
          <p className="mt-2 text-sm text-text-secondary">Learn effective study strategies for each medical subject</p>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-bold text-text-primary">No study guides available</p>
            <p className="text-sm text-text-secondary">Study guides will appear here once added</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([subjectName, subjectEntries]) => (
              <div key={subjectName}>
                <h2 className="mb-4 text-lg font-bold text-text-primary">{subjectName}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {subjectEntries.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/how-to-study/${entry.slug}`}
                      className="group rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70 card-hover"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                        <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-base font-bold text-text-primary group-hover:text-accent transition-colors">
                        {entry.title}
                      </h3>
                      {entry.description && (
                        <p className="text-sm text-text-secondary line-clamp-2">{entry.description}</p>
                      )}
                    </Link>
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
