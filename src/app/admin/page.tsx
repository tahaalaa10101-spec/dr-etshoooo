"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalUsers: number;
  totalSubjects: number;
  totalLectures: number;
  totalMcqs: number;
  totalNotes: number;
  totalClinicalCases: number;
  totalFlashcards: number;
  totalTerms: number;
  totalYears: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) setStats(result.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Users", value: stats?.totalUsers ?? 0, icon: "👥", color: "text-accent" },
    { label: "Years", value: stats?.totalYears ?? 0, icon: "📅", color: "text-success" },
    { label: "Subjects", value: stats?.totalSubjects ?? 0, icon: "📚", color: "text-warning" },
    { label: "Lectures", value: stats?.totalLectures ?? 0, icon: "🎓", color: "text-danger" },
    { label: "MCQs", value: stats?.totalMcqs ?? 0, icon: "❓", color: "text-accent" },
    { label: "Notes", value: stats?.totalNotes ?? 0, icon: "📝", color: "text-success" },
    { label: "Cases", value: stats?.totalClinicalCases ?? 0, icon: "🏥", color: "text-warning" },
    { label: "Terms", value: stats?.totalTerms ?? 0, icon: "📖", color: "text-danger" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Dashboard</p>
        <h2 className="text-2xl font-bold text-text-primary">Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-surface/40 p-5 hover:border-accent/20 hover:bg-surface/70 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
            </div>
            <p className="text-sm text-text-secondary">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Start</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/admin/years" className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-4 hover:border-accent/20 hover:bg-surface/80 transition-colors">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-sm font-semibold text-text-primary">Add Year</p>
              <p className="text-xs text-text-muted">Start with academic years</p>
            </div>
          </a>
          <a href="/admin/subjects" className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-4 hover:border-accent/20 hover:bg-surface/80 transition-colors">
            <span className="text-xl">📚</span>
            <div>
              <p className="text-sm font-semibold text-text-primary">Add Subject</p>
              <p className="text-xs text-text-muted">Create medical subjects</p>
            </div>
          </a>
          <a href="/admin/lectures" className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-4 hover:border-accent/20 hover:bg-surface/80 transition-colors">
            <span className="text-xl">🎓</span>
            <div>
              <p className="text-sm font-semibold text-text-primary">Add Lecture</p>
              <p className="text-xs text-text-muted">Upload lecture content</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
