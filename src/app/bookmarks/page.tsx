"use client";

import { useEffect, useState } from "react";

interface BookmarkItem {
  id: string;
  itemType: string;
  itemId: string;
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setBookmarks(result.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (itemType: string, itemId: string) => {
    try {
      const res = await fetch(`/api/bookmarks?itemType=${encodeURIComponent(itemType)}&itemId=${encodeURIComponent(itemId)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((item) => !(item.itemType === itemType && item.itemId === itemId)));
      }
    } catch {}
  };

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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Saved</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Your Bookmarks</h1>
          <p className="mt-2 text-sm text-text-secondary">Content you&apos;ve saved for later</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <svg className="h-8 w-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-bold text-text-primary">No bookmarks yet</p>
            <p className="mb-4 text-sm text-text-secondary">Bookmark lectures to access them quickly later</p>
            <a href="/subjects" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-light">
              Browse Subjects
            </a>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-5 transition-all duration-300 hover:border-accent/20 hover:bg-surface/70"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-warning/10">
                  <svg className="h-5 w-5 text-warning" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate capitalize">
                    {item.itemType}
                  </p>
                  <p className="text-xs text-text-secondary capitalize">{item.itemType} · {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => removeBookmark(item.itemType, item.itemId)}
                  className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg p-2 text-text-muted transition-colors hover:text-danger"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
