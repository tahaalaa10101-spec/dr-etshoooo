"use client";

import { useEffect, useState } from "react";

interface Lecture {
  id: string;
  title: string;
  slug: string;
  duration?: number;
  topic?: { name: string; subject?: { name: string } };
}

export default function FeaturedLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    fetch("/api/lectures?limit=4")
      .then((res) => res.json())
      .then((result) => setLectures(result.data || []))
      .catch(() => {});
  }, []);

  if (lectures.length === 0) return null;

  return (
    <section id="lectures" className="section-padding bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Lectures</p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Featured <span className="text-accent">Lectures</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lectures.map((lecture) => (
            <a key={lecture.id} href={`/lectures/${lecture.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface/40 transition-all duration-300 card-hover hover:border-accent/20 hover:bg-surface/70">
              <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-accent/5 to-transparent">
                <span className="text-5xl transition-transform duration-300 group-hover:scale-110">📖</span>
              </div>
              <div className="p-5">
                <span className="inline-block rounded-lg border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                  {lecture.topic?.subject?.name || "Subject"}
                </span>
                <h3 className="mt-3 mb-2 text-sm font-bold text-text-primary leading-snug">{lecture.title}</h3>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                  {lecture.duration && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {lecture.duration} min
                    </span>
                  )}
                  <span>{lecture.topic?.name || ""}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
