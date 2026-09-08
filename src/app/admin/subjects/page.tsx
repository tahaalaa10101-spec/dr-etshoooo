"use client";

import { useEffect, useState } from "react";

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  semesterId: string;
  order: number;
  published: boolean;
  semester: { id: string; title: string; academicYear: { title: string } };
}

interface Semester {
  id: string;
  title: string;
  academicYear: { title: string };
}

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSemester, setFilterSemester] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "", image: "", semesterId: "", order: 0, published: true });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSubjects();
  }, [page]);

  useEffect(() => {
    fetchSemesters();
  }, []);

  async function fetchSubjects() {
    try {
      const res = await fetch(`/api/subjects?page=${page}&limit=10`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setSubjects(result.data);
          if (result.pagination) setTotalPages(result.pagination.totalPages);
        }
      }
    } catch {
      console.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSemesters() {
    try {
      const res = await fetch("/api/semesters");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setSemesters(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch semesters");
    }
  }

  const filtered = filterSemester ? subjects.filter((s) => s.semesterId === filterSemester) : subjects;

  function openCreate() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", icon: "", image: "", semesterId: semesters[0]?.id ?? "", order: 0, published: true });
    setShowModal(true);
  }

  function openEdit(sub: Subject) {
    setEditing(sub);
    setForm({
      name: sub.name,
      slug: sub.slug,
      description: sub.description ?? "",
      icon: sub.icon ?? "",
      image: sub.image ?? "",
      semesterId: sub.semesterId,
      order: sub.order,
      published: sub.published,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/subjects/${editing.id}` : "/api/subjects";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        fetchSubjects();
      }
    } catch {
      console.error("Failed to save subject");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/subjects/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchSubjects();
      }
    } catch {
      console.error("Failed to delete subject");
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
          <h2 className="text-2xl font-bold text-text-primary">Subjects</h2>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-text-primary">
            <option value="">All Semesters</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>{s.academicYear.title} - {s.title}</option>
            ))}
          </select>
          <button onClick={openCreate} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors">
            + Add Subject
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Semester</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Published</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Order</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {sub.icon && <span className="text-xl">{sub.icon}</span>}
                      <div>
                        <div className="text-sm text-text-primary font-medium">{sub.name}</div>
                        <div className="text-xs text-text-muted">{sub.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{sub.semester.title}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.published ? "bg-success/10 text-success" : "bg-text-muted/10 text-text-muted"}`}>
                      {sub.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{sub.order}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEdit(sub)} className="text-accent hover:text-accent-light text-sm font-medium mr-3">Edit</button>
                    <button onClick={() => setDeleteId(sub.id)} className="text-danger hover:text-red-400 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No subjects found</td>
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
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{editing ? "Edit Subject" : "Add Subject"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Semester</label>
                <select value={form.semesterId} onChange={(e) => setForm({ ...form, semesterId: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" required>
                  <option value="">Select semester</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.academicYear.title} - {s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Icon (emoji)</label>
                  <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" placeholder="e.g. 🫀" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Image URL</label>
                  <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded border-border bg-surface/60 text-accent" />
                    Published
                  </label>
                </div>
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
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this subject?</p>
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
