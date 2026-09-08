"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: "Dr.Etshoooo",
    siteDescription: "Medical Education Platform",
    maintenanceMode: false,
    allowRegistration: true,
    maxUploadSize: 10,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Configuration</p>
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface/40 p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">General Settings</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Site Name</label>
              <input type="text" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Site Description</label>
              <textarea value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" rows={3} />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Max Upload Size (MB)</label>
              <input type="number" value={form.maxUploadSize} onChange={(e) => setForm({ ...form, maxUploadSize: Number(e.target.value) })} className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary" />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface/40 cursor-pointer">
                <div>
                  <span className="text-sm text-text-primary font-medium">Maintenance Mode</span>
                  <p className="text-xs text-text-muted">Temporarily disable public access</p>
                </div>
                <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} className="w-4 h-4 rounded border-border bg-surface/60 text-accent" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface/40 cursor-pointer">
                <div>
                  <span className="text-sm text-text-primary font-medium">Allow Registration</span>
                  <p className="text-xs text-text-muted">Allow new students to register</p>
                </div>
                <input type="checkbox" checked={form.allowRegistration} onChange={(e) => setForm({ ...form, allowRegistration: e.target.checked })} className="w-4 h-4 rounded border-border bg-surface/60 text-accent" />
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 hover:bg-accent-light transition-colors">
                Save Settings
              </button>
              {saved && (
                <span className="text-sm text-success">Settings saved successfully!</span>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface/40 p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Platform Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Application</span>
                <span className="text-text-primary">Dr.Etshoooo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Version</span>
                <span className="text-text-primary">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Framework</span>
                <span className="text-text-primary">Next.js</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Database</span>
                <span className="text-text-primary">SQLite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Environment</span>
                <span className="text-text-primary">{process.env.NODE_ENV || "development"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Database Status</span>
                <span className="text-success">Connected</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/40 p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a href="/admin/years" className="w-full text-left px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface/60 transition-colors block">
                Manage Years &amp; Semesters
              </a>
              <a href="/admin/subjects" className="w-full text-left px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface/60 transition-colors block">
                Manage Subjects
              </a>
              <a href="/admin/students" className="w-full text-left px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface/60 transition-colors block">
                View Students
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
