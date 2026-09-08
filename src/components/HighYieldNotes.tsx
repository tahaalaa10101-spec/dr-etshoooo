"use client";

import { useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  topic?: { name: string; subject?: { name: string } };
}

export default function HighYieldNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch("/api/notes?limit=4")
      .then((res) => res.json())
      .then((result) => setNotes(result.data || []))
      .catch(() => {});
  }, []);

  if (notes.length === 0) return null;

  return (
    <section id="notes" className="section-padding bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">High-Yield Notes</p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Study Smarter with <span className="text-accent">High-Yield Notes</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {notes.map((note) => (
            <a key={note.id} href="/subjects"
              className="group rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-300 card-hover hover:border-accent/20 hover:bg-surface/70">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xl">📝</span>
                <span className="text-xs text-text-muted">{note.category || "General"}</span>
              </div>
              <h3 className="mb-1.5 text-base font-bold text-text-primary">{note.title}</h3>
              <p className="mb-4 text-[13px] leading-relaxed text-text-secondary line-clamp-2">{note.content}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors group-hover:text-accent-light">
                View Notes
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
