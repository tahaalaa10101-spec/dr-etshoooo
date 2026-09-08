"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MedicalApp {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  features: string | null;
  isFree: boolean;
  howToUse: string | null;
  officialUrl: string | null;
  platform: string | null;
}

const categories = ["Subject Apps", "Time & Organization", "Flashcards", "AI Tools"];
const platforms = ["Android", "iOS", "Web", "Multi-platform"];

export default function AdminApps() {
  const router = useRouter();
  const [apps, setApps] = useState<MedicalApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MedicalApp | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Subject Apps",
    imageUrl: "",
    features: "",
    isFree: true,
    howToUse: "",
    officialUrl: "",
    platform: "Multi-platform",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    try {
      const res = await fetch("/api/apps");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setApps(result.data);
        }
      }
    } catch {
      console.error("Failed to fetch apps");
    } finally {
      setLoading(false);
    }
  }

  const filtered = filterCategory ? apps.filter((a) => a.category === filterCategory) : apps;

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      category: "Subject Apps",
      imageUrl: "",
      features: "",
      isFree: true,
      howToUse: "",
      officialUrl: "",
      platform: "Multi-platform",
    });
    setShowModal(true);
  }

  function openEdit(app: MedicalApp) {
    setEditing(app);
    setForm({
      name: app.name,
      description: app.description || "",
      category: app.category || "Subject Apps",
      imageUrl: app.imageUrl || "",
      features: app.features || "",
      isFree: app.isFree,
      howToUse: app.howToUse || "",
      officialUrl: app.officialUrl || "",
      platform: app.platform || "Multi-platform",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/apps/${editing.id}` : "/api/apps";

    const payload = {
      ...form,
      description: form.description || null,
      imageUrl: form.imageUrl || null,
      features: form.features || null,
      howToUse: form.howToUse || null,
      officialUrl: form.officialUrl || null,
      platform: form.platform || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowModal(false);
        router.refresh();
      }
    } catch {
      console.error("Failed to save app");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/apps/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      console.error("Failed to delete app");
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
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Resources</p>
          <h2 className="text-2xl font-bold text-text-primary">Medical Apps</h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-text-primary"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={openCreate}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors"
          >
            + Add App
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Free/Paid</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Platform</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-border hover:bg-surface/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-text-primary">{app.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                      {app.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                        app.isFree
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {app.isFree ? "Free" : "Paid"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">{app.platform || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(app)}
                        className="text-accent hover:text-accent-light text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(app.id)}
                        className="text-danger hover:text-red-400 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted text-sm">No apps found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">{editing ? "Edit App" : "Add App"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Platform</label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Features (one per line or comma-separated)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">How to Use</label>
                <textarea
                  value={form.howToUse}
                  onChange={(e) => setForm({ ...form, howToUse: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Official URL</label>
                <input
                  type="url"
                  value={form.officialUrl}
                  onChange={(e) => setForm({ ...form, officialUrl: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Pricing</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                    <input
                      type="radio"
                      checked={form.isFree === true}
                      onChange={() => setForm({ ...form, isFree: true })}
                      className="accent-accent"
                    />
                    Free
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                    <input
                      type="radio"
                      checked={form.isFree === false}
                      onChange={() => setForm({ ...form, isFree: false })}
                      className="accent-accent"
                    />
                    Paid
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Confirm Delete</h3>
            <p className="text-sm text-text-secondary mb-6">Are you sure you want to delete this app?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-danger px-5 py-2.5 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
