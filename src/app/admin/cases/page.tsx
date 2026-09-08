"use client";

import { useEffect, useState } from "react";

interface ClinicalCase {
  id: string;
  title: string;
  patientInfo: string;
  symptoms: string;
  signs: string | null;
  investigations: string | null;
  differentialDiag: string | null;
  finalDiagnosis: string | null;
  management: string | null;
  topicId: string;
  topic: { id: string; name: string; subject: { name: string } };
}

interface Topic {
  id: string;
  name: string;
  subject: { name: string };
}

export default function AdminCases() {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ClinicalCase | null>(null);
  const [form, setForm] = useState({ title: "", patientInfo: "", symptoms: "", signs: "", investigations: "", differentialDiag: "", finalDiagnosis: "", management: "", topicId: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCases();
  }, [page]);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchCases() {
    try {
      const res = await fetch(`/api/cases?page=${page}&limit=10`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setCases(result.data);
          if (result.pagination) setTotalPages(result.pagination.totalPages);
        }
      }
    } catch {
      console.error("Failed to fetch cases");
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

  const filtered = filterTopic ? cases.filter((c) => c.topicId === filterTopic) : cases;

  function openCreate() {
    setEditing(null);
    setForm({ title: "", patientInfo: "", symptoms: "", signs: "", investigations: "", differentialDiag: "", finalDiagnosis: "", management: "", topicId: topics[0]?.id ?? "" });
    setShowModal(true);
  }

  function openEdit(c: ClinicalCase) {
    setEditing(c);
    setForm({
      title: c.title,
      patientInfo: c.patientInfo,
      symptoms: c.symptoms,
      signs: c.signs ?? "",
      investigations: c.investigations ?? "",
      differentialDiag: c.differentialDiag ?? "",
      finalDiagnosis: c.finalDiagnosis ?? "",
      management: c.management ?? "",
      topicId: c.topicId,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/cases/${editing.id}` : "/api/cases";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        fetchCases();
      }
    } catch {
      console.error("Failed to save case");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/cases/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchCases();
      }
    } catch {
      console.error("Failed to delete case");
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
          <h2 className="text-2xl font-bold text-text-primary">Clinical Cases</h2>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-text-primary">
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.subject.name} — {t.name}</option>
            ))}
          </select>
          <button onClick={openCreate} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors">
            + Add Case
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Title</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Topic</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Diagnosis</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Symptoms</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-primary font-medium">{c.title}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{c.topic.name}</td>
                  <td className="px-5 py-4 text-sm text-success">{c.finalDiagnosis ?? "—"}</td>
                  <td className="px-5 py-4 text-sm text-text-muted max-w-xs truncate">{c.symptoms}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEdit(c)} className="text-accent hover:text-accent-light text-sm font-medium mr-3">Edit</button>
                    <button onClick={() => setDeleteId(c.id)} className="text-danger hover:text-red-400 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No clinical cases found</td>
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
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{editing ? "Edit Case" : "Add Case"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" required />
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
                  <label className="block text-sm text-text-secondary mb-1">Patient Info</label>
                  <textarea value={form.patientInfo} onChange={(e) => setForm({ ...form, patientInfo: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} required />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Symptoms</label>
                  <textarea value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Signs</label>
                <textarea value={form.signs} onChange={(e) => setForm({ ...form, signs: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={2} />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Investigations</label>
                <textarea value={form.investigations} onChange={(e) => setForm({ ...form, investigations: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={2} />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Differential Diagnosis</label>
                <textarea value={form.differentialDiag} onChange={(e) => setForm({ ...form, differentialDiag: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={2} />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Final Diagnosis</label>
                <input type="text" value={form.finalDiagnosis} onChange={(e) => setForm({ ...form, finalDiagnosis: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Management</label>
                <textarea value={form.management} onChange={(e) => setForm({ ...form, management: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} />
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
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this clinical case?</p>
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
