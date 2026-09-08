"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  content: string | null;
  videoUrl: string | null;
  tips: string | null;
  studyMethod: string | null;
  subjectId: string | null;
  subject: Subject | null;
}

export default function HowToStudyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [entry, setEntry] = useState<HowToStudyEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntry();
  }, [slug]);

  async function fetchEntry() {
    try {
      const res = await fetch(`/api/how-to-study/${slug}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setEntry(result.data);
        } else {
          setError("Entry not found");
        }
      } else {
        setError("Entry not found");
      }
    } catch {
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4 text-lg text-text-secondary">{error || "Entry not found"}</p>
          <Link href="/how-to-study" className="text-accent hover:text-accent-light transition-colors">
            Back to How to Study
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
        <Link
          href="/how-to-study"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-6"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to How to Study
        </Link>

        {entry.subject && (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
            {entry.subject.name}
          </p>
        )}

        <h1 className="mb-4 text-3xl font-bold text-text-primary">{entry.title}</h1>

        {entry.description && (
          <p className="mb-8 text-lg text-text-secondary leading-relaxed">{entry.description}</p>
        )}

        {entry.studyMethod && (
          <div className="mb-8 rounded-2xl border border-accent/20 bg-accent/5 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-text-primary">Study Method</h2>
            </div>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{entry.studyMethod}</p>
          </div>
        )}

        {entry.content && (
          <div className="mb-8 rounded-2xl border border-border bg-surface/40 p-6">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Content</h2>
            <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </div>
          </div>
        )}

        {entry.tips && (
          <div className="mb-8 rounded-2xl border border-success/20 bg-success/5 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20">
                <svg className="h-4 w-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-text-primary">Tips</h2>
            </div>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{entry.tips}</p>
          </div>
        )}

        {entry.videoUrl && (
          <div className="mb-8 rounded-2xl border border-border bg-surface/40 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/20">
                <svg className="h-4 w-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-text-primary">Video</h2>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={entry.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
