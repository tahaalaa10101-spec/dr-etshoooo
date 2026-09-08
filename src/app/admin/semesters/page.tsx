"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Semester {
  id: string;
  title: string;
  slug: string;
  academicYearId: string;
  description: string | null;
  order: number;
  published: boolean;
  academicYear: { id: string; title: string };
}

interface Year {
  id: string;
  title: string;
}

export default function AdminSemesters() {
  const router = useRouter();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Semester | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", academicYearId: "", description: "", order: 0, published: true });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchSemesters(), fetchYears()]);
  }, []);

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
    } finally {
      setLoading(false);
    }
  }

  async function fetchYears() {
    try {
      const res = await fetch("/api/years");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setYears(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch years");
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: "", slug: "", academicYearId: years[0]?.id ?? "", description: "", order: 0, published: true });
    setShowModal(true);
  }

  function openEdit(sem: Semester) {
    setEditing(sem);
    setForm({
      title: sem.title,
      slug: sem.slug,
      academicYearId: sem.academicYearId,
      description: sem.description ?? "",
      order: sem.order,
      published: sem.published,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/semesters/${editing.id}` : "/api/semesters";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        router.refresh();
      }
    } catch {
      console.error("Failed to save semester");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/semesters/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      console.error("Failed to delete semester");
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
          <h2 className="text-2xl font-bold text-text-primary">Semesters</h2>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors">
          + Add Semester
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Title</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Year</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Published</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Order</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((sem) => (
                <tr key={sem.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-primary font-medium">{sem.title}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{sem.academicYear.title}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sem.published ? "bg-success/10 text-success" : "bg-text-muted/10 text-text-muted"}`}>
                      {sem.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{sem.order}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEdit(sem)} className="text-accent hover:text-accent-light text-sm font-medium mr-3">Edit</button>
                    <button onClick={() => setDeleteId(sem.id)} className="text-danger hover:text-red-400 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {semesters.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No semesters found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{editing ? "Edit Semester" : "Add Semester"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted" required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted" required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Academic Year</label>
                <select value={form.academicYearId} onChange={(e) => setForm({ ...form, academicYearId: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" required>
                  <option value="">Select year</option>
                  {years.map((y) => (
                    <option key={y.id} value={y.id}>{y.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted" rows={3} />
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
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary">Cancel</button>
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
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this semester?</p>
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
