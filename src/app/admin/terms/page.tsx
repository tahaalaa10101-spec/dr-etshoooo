"use client";

import { useEffect, useState } from "react";

interface Subject {
  id: string;
  name: string;
}

interface MedicalTerm {
  id: string;
  term: string;
  arabicTerm: string | null;
  latinTerm: string | null;
  definition: string;
  simpleExplanation: string | null;
  arabicMeaning: string | null;
  pronunciation: string | null;
  clinicalRelevance: string | null;
  relatedTerms: string | null;
  subjectId: string | null;
  subject: { id: string; name: string } | null;
}

export default function AdminTerms() {
  const [terms, setTerms] = useState<MedicalTerm[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MedicalTerm | null>(null);
  const [form, setForm] = useState({
    term: "",
    arabicTerm: "",
    latinTerm: "",
    definition: "",
    simpleExplanation: "",
    arabicMeaning: "",
    pronunciation: "",
    clinicalRelevance: "",
    relatedTerms: "",
    subjectId: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTerms();
  }, [page]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchTerms() {
    try {
      const res = await fetch(`/api/terms?page=${page}&limit=10`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setTerms(result.data);
          if (result.pagination) setTotalPages(result.pagination.totalPages);
        }
      }
    } catch {
      console.error("Failed to fetch terms");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSubjects() {
    try {
      const res = await fetch("/api/subjects?limit=100");
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

  function openCreate() {
    setEditing(null);
    setForm({
      term: "",
      arabicTerm: "",
      latinTerm: "",
      definition: "",
      simpleExplanation: "",
      arabicMeaning: "",
      pronunciation: "",
      clinicalRelevance: "",
      relatedTerms: "",
      subjectId: "",
    });
    setShowModal(true);
  }

  function openEdit(t: MedicalTerm) {
    setEditing(t);
    setForm({
      term: t.term,
      arabicTerm: t.arabicTerm ?? "",
      latinTerm: t.latinTerm ?? "",
      definition: t.definition,
      simpleExplanation: t.simpleExplanation ?? "",
      arabicMeaning: t.arabicMeaning ?? "",
      pronunciation: t.pronunciation ?? "",
      clinicalRelevance: t.clinicalRelevance ?? "",
      relatedTerms: t.relatedTerms ?? "",
      subjectId: t.subjectId ?? "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/terms/${editing.id}` : "/api/terms";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        fetchTerms();
      }
    } catch {
      console.error("Failed to save term");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/terms/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchTerms();
      }
    } catch {
      console.error("Failed to delete term");
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
          <h2 className="text-2xl font-bold text-text-primary">Medical Terms</h2>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors">
          + Add Term
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Term</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Arabic</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Latin</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Subject</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-primary font-medium">{t.term}</td>
                  <td className="px-5 py-4 text-sm text-accent" dir="rtl">{t.arabicTerm ?? "—"}</td>
                  <td className="px-5 py-4 text-sm text-text-muted italic">{t.latinTerm ?? "—"}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{t.subject?.name ?? "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEdit(t)} className="text-accent hover:text-accent-light text-sm font-medium mr-3">Edit</button>
                    <button onClick={() => setDeleteId(t.id)} className="text-danger hover:text-red-400 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {terms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No medical terms found</td>
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
            <h3 className="text-lg font-semibold text-text-primary mb-4">{editing ? "Edit Term" : "Add Term"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Term (English) *</label>
                  <input type="text" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" required />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Arabic Term</label>
                  <input type="text" value={form.arabicTerm} onChange={(e) => setForm({ ...form, arabicTerm: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" dir="rtl" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Latin Term</label>
                <input type="text" value={form.latinTerm} onChange={(e) => setForm({ ...form, latinTerm: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary italic" placeholder="e.g. Myocardial Infarction" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Definition *</label>
                <textarea value={form.definition} onChange={(e) => setForm({ ...form, definition: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} required />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Simple Explanation</label>
                <textarea value={form.simpleExplanation} onChange={(e) => setForm({ ...form, simpleExplanation: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={2} placeholder="Explain in simple terms for students" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Arabic Meaning</label>
                  <input type="text" value={form.arabicMeaning} onChange={(e) => setForm({ ...form, arabicMeaning: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" dir="rtl" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Pronunciation</label>
                  <input type="text" value={form.pronunciation} onChange={(e) => setForm({ ...form, pronunciation: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" placeholder="/prəˌnʌnsiˈeɪʃən/" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Clinical Relevance</label>
                <textarea value={form.clinicalRelevance} onChange={(e) => setForm({ ...form, clinicalRelevance: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={2} />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Related Terms</label>
                <input type="text" value={form.relatedTerms} onChange={(e) => setForm({ ...form, relatedTerms: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" placeholder="Comma-separated" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Subject</label>
                <select
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                >
                  <option value="">No subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
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
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this term?</p>
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
