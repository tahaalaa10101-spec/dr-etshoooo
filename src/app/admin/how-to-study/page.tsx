"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Subject {
  id: string;
  name: string;
}

interface HowToStudyEntry {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subjectId: string | null;
  content: string | null;
  videoUrl: string | null;
  tips: string | null;
  studyMethod: string | null;
  order: number;
  published: boolean;
  subject: Subject | null;
}

export default function AdminHowToStudy() {
  const router = useRouter();
  const [entries, setEntries] = useState<HowToStudyEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<HowToStudyEntry | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    subjectId: "",
    content: "",
    videoUrl: "",
    tips: "",
    studyMethod: "",
    order: "0",
    published: true,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
    fetchSubjects();
  }, []);

  async function fetchEntries() {
    try {
      const res = await fetch("/api/how-to-study");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setEntries(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSubjects() {
    try {
      const res = await fetch("/api/subjects");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setSubjects(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch subjects");
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      description: "",
      subjectId: "",
      content: "",
      videoUrl: "",
      tips: "",
      studyMethod: "",
      order: "0",
      published: true,
    });
    setShowModal(true);
  }

  function openEdit(entry: HowToStudyEntry) {
    setEditing(entry);
    setForm({
      title: entry.title,
      slug: entry.slug,
      description: entry.description ?? "",
      subjectId: entry.subjectId ?? "",
      content: entry.content ?? "",
      videoUrl: entry.videoUrl ?? "",
      tips: entry.tips ?? "",
      studyMethod: entry.studyMethod ?? "",
      order: entry.order.toString(),
      published: entry.published,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/how-to-study/${editing.id}` : "/api/how-to-study";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subjectId: form.subjectId || null,
          order: parseInt(form.order) || 0,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        router.refresh();
      }
    } catch {
      console.error("Failed to save entry");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/how-to-study/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      console.error("Failed to delete entry");
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Content</p>
          <h2 className="text-2xl font-bold text-text-primary">How to Study</h2>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors">
          + Add Entry
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Title</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Published</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Order</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-primary font-medium">{entry.title}</td>
                  <td className="px-5 py-4 text-sm text-accent">{entry.subject?.name ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${entry.published ? "bg-success/10 text-success" : "bg-text-muted/10 text-text-muted"}`}>
                      {entry.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{entry.order}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEdit(entry)} className="text-accent hover:text-accent-light text-sm font-medium mr-3">Edit</button>
                    <button onClick={() => setDeleteId(entry.id)} className="text-danger hover:text-red-400 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No how-to-study entries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{editing ? "Edit Entry" : "Add Entry"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm({ ...form, title, slug: editing ? form.slug : generateSlug(title) });
                    }}
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Subject</label>
                  <select
                    value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  >
                    <option value="">No subject (General)</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Study Method</label>
                <textarea
                  value={form.studyMethod}
                  onChange={(e) => setForm({ ...form, studyMethod: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  rows={3}
                  placeholder="Describe the recommended study method..."
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  rows={5}
                  placeholder="Main content for the how-to-study guide..."
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Tips</label>
                <textarea
                  value={form.tips}
                  onChange={(e) => setForm({ ...form, tips: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  rows={3}
                  placeholder="Study tips and advice..."
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Video URL</label>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-border bg-surface/60 text-accent focus:ring-accent"
                />
                <label htmlFor="published" className="text-sm text-text-secondary">Published</label>
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
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this how-to-study entry?</p>
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
