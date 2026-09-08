"use client";

import { useEffect, useState } from "react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  topicId: string;
  topic: { id: string; name: string; subject: { name: string } };
}

interface Topic {
  id: string;
  name: string;
  subject: { name: string };
}

export default function AdminFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Flashcard | null>(null);
  const [form, setForm] = useState({ front: "", back: "", topicId: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchFlashcards(), fetchTopics()]);
  }, []);

  async function fetchFlashcards() {
    try {
      const res = await fetch("/api/flashcards");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setFlashcards(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTopics() {
    try {
      const res = await fetch("/api/topics");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setTopics(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch topics");
    }
  }

  const filtered = filterTopic ? flashcards.filter((f) => f.topicId === filterTopic) : flashcards;

  function openCreate() {
    setEditing(null);
    setForm({ front: "", back: "", topicId: topics[0]?.id ?? "" });
    setShowModal(true);
  }

  function openEdit(fc: Flashcard) {
    setEditing(fc);
    setForm({ front: fc.front, back: fc.back, topicId: fc.topicId });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/flashcards/${editing.id}` : "/api/flashcards";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        fetchFlashcards();
      }
    } catch {
      console.error("Failed to save flashcard");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/flashcards/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchFlashcards();
      }
    } catch {
      console.error("Failed to delete flashcard");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Content</p>
          <h2 className="text-2xl font-bold text-text-primary">Flashcards</h2>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-text-primary">
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.subject.name} — {t.name}</option>
            ))}
          </select>
          <button onClick={openCreate} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors">
            + Add Flashcard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fc) => (
          <div key={fc.id} className="rounded-2xl border border-border bg-surface/40 p-5 hover:border-accent/20 hover:bg-surface/70 transition-colors">
            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Front</span>
              <p className="text-sm text-text-primary mt-1">{fc.front}</p>
            </div>
            <div className="mb-3 pt-3 border-t border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Back</span>
              <p className="text-sm text-text-secondary mt-1">{fc.back}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-text-muted">{fc.topic.subject.name} — {fc.topic.name}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(fc)} className="text-accent hover:text-accent-light text-sm font-medium">Edit</button>
                <button onClick={() => setDeleteId(fc.id)} className="text-danger hover:text-red-400 text-sm font-medium">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-text-muted text-sm">No flashcards found</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{editing ? "Edit Flashcard" : "Add Flashcard"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Front (Question/Term)</label>
                <textarea value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Back (Answer/Definition)</label>
                <textarea value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Topic</label>
                <select value={form.topicId} onChange={(e) => setForm({ ...form, topicId: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" required>
                  <option value="">Select topic</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.subject.name} — {t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary">Cancel</button>
                <button type="submit" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25">{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Confirm Delete</h3>
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this flashcard?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary">Cancel</button>
              <button onClick={handleDelete} className="rounded-xl bg-danger px-5 py-2.5 text-sm font-semibold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
