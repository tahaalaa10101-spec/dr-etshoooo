"use client";

import { useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  category: string;
  subject: string;
  content: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data.notes || data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = notes.reduce<Record<string, Note[]>>((acc, note) => {
    const key = note.category || "Uncategorized";
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Study</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">High-Yield Notes</h1>
          <p className="mt-2 text-sm text-text-secondary">Concise, exam-ready notes organized by category</p>
        </div>

        {notes.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-bold text-text-primary">No notes available</p>
            <p className="text-sm text-text-secondary">High-yield notes will appear here once added</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, categoryNotes]) => (
              <div key={category}>
                <h2 className="mb-4 text-lg font-bold text-text-primary">{category}</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryNotes.map((note) => (
                    <a
                      key={note.id}
                      href={`/notes/${note.id}`}
                      className="group rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-[11px] text-text-muted">{note.subject}</span>
                      </div>
                      <h3 className="mb-2 text-sm font-medium text-text-primary group-hover:text-accent">{note.title}</h3>
                      <p className="text-[13px] leading-relaxed text-text-secondary line-clamp-3">{note.content}</p>
                    </a>
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
