"use client";

import { useEffect, useState } from "react";

interface Mcq {
  id: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string | null;
  difficulty: string;
  topicId: string;
  topic: { id: string; name: string; subject: { name: string } };
}

interface Topic {
  id: string;
  name: string;
  subject: { name: string };
}

export default function AdminMcqs() {
  const [mcqs, setMcqs] = useState<Mcq[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Mcq | null>(null);
  const [form, setForm] = useState({ question: "", options: "", correctAnswer: "", explanation: "", difficulty: "medium", topicId: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMcqs();
  }, [page]);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchMcqs() {
    try {
      const res = await fetch(`/api/mcqs?page=${page}&limit=10`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setMcqs(result.data);
          if (result.pagination) setTotalPages(result.pagination.totalPages);
        }
      }
    } catch {
      console.error("Failed to fetch MCQs");
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

  const filtered = filterTopic ? mcqs.filter((m) => m.topicId === filterTopic) : mcqs;

  function openCreate() {
    setEditing(null);
    setForm({ question: "", options: "", correctAnswer: "", explanation: "", difficulty: "medium", topicId: topics[0]?.id ?? "" });
    setShowModal(true);
  }

  function openEdit(mcq: Mcq) {
    setEditing(mcq);
    setForm({
      question: mcq.question,
      options: mcq.options,
      correctAnswer: mcq.correctAnswer,
      explanation: mcq.explanation ?? "",
      difficulty: mcq.difficulty,
      topicId: mcq.topicId,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/mcqs/${editing.id}` : "/api/mcqs";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        fetchMcqs();
      }
    } catch {
      console.error("Failed to save MCQ");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/mcqs/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchMcqs();
      }
    } catch {
      console.error("Failed to delete MCQ");
    }
  }

  function getDifficultyColor(d: string) {
    switch (d) {
      case "easy": return "bg-success/10 text-success";
      case "medium": return "bg-warning/10 text-warning";
      case "hard": return "bg-danger/10 text-danger";
      default: return "bg-text-muted/10 text-text-muted";
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
          <h2 className="text-2xl font-bold text-text-primary">MCQs</h2>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-text-primary">
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.subject.name} — {t.name}</option>
            ))}
          </select>
          <button onClick={openCreate} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors">
            + Add MCQ
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Question</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Topic</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Difficulty</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Answer</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((mcq) => (
                <tr key={mcq.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-primary font-medium max-w-xs truncate">{mcq.question}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{mcq.topic.name}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(mcq.difficulty)}`}>
                      {mcq.difficulty}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-success font-medium">{mcq.correctAnswer}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEdit(mcq)} className="text-accent hover:text-accent-light text-sm font-medium mr-3">Edit</button>
                    <button onClick={() => setDeleteId(mcq.id)} className="text-danger hover:text-red-400 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No MCQs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded bg-surface px-4 py-2 text-sm text-gray-300 hover:bg-surface-light disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded bg-surface px-4 py-2 text-sm text-gray-300 hover:bg-surface-light disabled:opacity-50">Next</button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{editing ? "Edit MCQ" : "Add MCQ"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Question</label>
                <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Options (one per line or comma-separated)</label>
                <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={4} required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Correct Answer</label>
                <input type="text" value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" required />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Explanation</label>
                <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} />
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
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this MCQ?</p>
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
