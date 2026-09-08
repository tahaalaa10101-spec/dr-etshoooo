"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function AppsContent() {
  const [apps, setApps] = useState<MedicalApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    apps.forEach(app => {
      if (app.category) cats.add(app.category);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [apps]);

  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((data) => setApps(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "All" ? apps : apps.filter((app) => app.category === activeCategory);

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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Resources</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Medical Apps</h1>
          <p className="mt-2 text-sm text-text-secondary">Recommended apps for medical students</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-accent text-primary shadow-lg shadow-accent/25"
                  : "border border-border bg-surface/40 text-text-secondary hover:text-text-primary hover:border-accent/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <span className="text-3xl">📱</span>
            </div>
            <p className="mb-2 text-lg font-bold text-text-primary">No apps in this category</p>
            <p className="text-sm text-text-secondary">Apps will appear here once added by the admin</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {app.imageUrl ? (
                      <img src={app.imageUrl} alt={app.name} className="h-10 w-10 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                        <span className="text-accent font-bold text-sm">{app.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">{app.name}</h3>
                      <span className="text-[11px] text-text-muted">{app.platform || "Multi-platform"}</span>
                    </div>
                  </div>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                      app.isFree
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {app.isFree ? "Free" : "Paid"}
                  </span>
                </div>

                {app.description && (
                  <p className="mb-3 text-[13px] leading-relaxed text-text-secondary line-clamp-3">
                    {app.description}
                  </p>
                )}

                {app.features && (
                  <div className="mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">Features</p>
                    <p className="text-[13px] text-text-secondary line-clamp-3">{app.features}</p>
                  </div>
                )}

                {app.howToUse && (
                  <div className="mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">How to Use</p>
                    <p className="text-[13px] text-text-secondary line-clamp-2">{app.howToUse}</p>
                  </div>
                )}

                {app.officialUrl && (
                  <a
                    href={app.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-light transition-colors"
                  >
                    Official Link
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
