"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProgressItem {
  id: string;
  subjectId: string;
  percentage: number;
  subject?: { name: string; slug: string };
}

interface CompletionItem {
  id: string;
  lectureId: string;
  lecture: {
    id: string;
    title: string;
    slug: string;
    topic: {
      name: string;
      subject: { name: string };
    };
  };
}

interface BookmarkItem {
  id: string;
  itemType: string;
  itemId: string;
  createdAt: string;
}

interface FavoriteItem {
  id: string;
  itemType: string;
  itemId: string;
  createdAt: string;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [completions, setCompletions] = useState<CompletionItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const opts = { credentials: "same-origin" as const };

        const [userRes, progressRes, completionsRes, bookmarksRes, favoritesRes, subjectsRes] =
          await Promise.allSettled([
            fetch("/api/auth/me", opts),
            fetch("/api/progress", opts),
            fetch("/api/completions", opts),
            fetch("/api/bookmarks", opts),
            fetch("/api/favorites", opts),
            fetch("/api/subjects", opts),
          ]);

        if (userRes.status === "fulfilled" && userRes.value.ok) {
          const result = await userRes.value.json();
          if (result.success && result.data?.user) setUser(result.data.user);
        }

        if (progressRes.status === "fulfilled" && progressRes.value.ok) {
          const result = await progressRes.value.json();
          if (result.success) setProgress(result.data || []);
        }

        if (completionsRes.status === "fulfilled" && completionsRes.value.ok) {
          const result = await completionsRes.value.json();
          if (result.success) setCompletions(result.data || []);
        }

        if (bookmarksRes.status === "fulfilled" && bookmarksRes.value.ok) {
          const result = await bookmarksRes.value.json();
          if (result.success) setBookmarks(result.data || []);
        }

        if (favoritesRes.status === "fulfilled" && favoritesRes.value.ok) {
          const result = await favoritesRes.value.json();
          if (result.success) setFavorites(result.data || []);
        }

        if (subjectsRes.status === "fulfilled" && subjectsRes.value.ok) {
          const result = await subjectsRes.value.json();
          if (result.success) setSubjects(result.data || []);
        }
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            Welcome back, {user?.name || "Student"} 👋
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface/40 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-text-primary">{completions.length}</p>
            <p className="text-xs text-text-secondary">Lectures Completed</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/40 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
              <svg className="h-5 w-5 text-danger" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-text-primary">{favorites.length}</p>
            <p className="text-xs text-text-secondary">Favorites</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/40 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <svg className="h-5 w-5 text-warning" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-text-primary">{bookmarks.length}</p>
            <p className="text-xs text-text-secondary">Bookmarks</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/40 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-text-primary">{subjects.length}</p>
            <p className="text-xs text-text-secondary">Subjects</p>
          </div>
        </div>

        {/* Progress Section */}
        {progress.length > 0 && (
          <div className="mb-8 rounded-2xl border border-border bg-surface/40 p-6">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Subject Progress</h2>
            <div className="space-y-4">
              {progress.map((item) => (
                <div key={item.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">
                      {item.subject?.name || "Subject"}
                    </span>
                    <span className="text-sm text-accent">{item.percentage}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-alt">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Continue Learning */}
          <div>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">Continue</p>
                <h2 className="text-xl font-bold text-text-primary">Recently Completed</h2>
              </div>
            </div>
            <div className="space-y-3">
              {completions.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface/40 p-8 text-center">
                  <p className="text-sm text-text-secondary">No completed lectures yet</p>
                  <a href="/subjects" className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-light">
                    Browse Subjects
                  </a>
                </div>
              ) : (
                completions.slice(0, 5).map((item) => (
                  <a
                    key={item.id}
                    href={`/lectures/${item.lecture.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-4 transition-all hover:border-accent/20 hover:bg-surface/70"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-success/10">
                      <svg className="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary group-hover:text-accent">{item.lecture.title}</p>
                      <p className="text-xs text-text-secondary">{item.lecture.topic.subject.name}</p>
                    </div>
                    <span className="flex-shrink-0 rounded-lg bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">Done</span>
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">Explore</p>
                <h2 className="text-xl font-bold text-text-primary">Available Subjects</h2>
              </div>
              <a href="/subjects" className="text-sm font-medium text-accent hover:text-accent-light">
                View All
              </a>
            </div>
            <div className="space-y-3">
              {subjects.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface/40 p-8 text-center">
                  <p className="text-sm text-text-secondary">No subjects available</p>
                </div>
              ) : (
                subjects.slice(0, 5).map((subject) => (
                  <a
                    key={subject.id}
                    href={`/subjects/${subject.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-4 transition-all hover:border-accent/20 hover:bg-surface/70"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
                      <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary group-hover:text-accent">{subject.name}</p>
                      <p className="text-xs text-text-secondary truncate">{subject.description || "Medical subject"}</p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
