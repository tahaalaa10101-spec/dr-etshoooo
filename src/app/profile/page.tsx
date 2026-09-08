"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data?.user) {
          setUser(result.data.user);
          setName(result.data.user.name);
        } else {
          window.location.href = "/login";
        }
      })
      .catch(() => { window.location.href = "/login"; })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const body: Record<string, string> = {};
    if (name !== user?.name) body.name = name;
    if (newPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    if (Object.keys(body).length === 0) {
      setMessage({ type: "error", text: "No changes to update" });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result.success) {
        setUser(result.data);
        setName(result.data.name);
        setEditing(false);
        setCurrentPassword("");
        setNewPassword("");
        setMessage({ type: "success", text: "Profile updated successfully" });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update profile" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setName(user?.name || "");
    setCurrentPassword("");
    setNewPassword("");
    setMessage(null);
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
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Account</p>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Your Profile</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Profile Info */}
          <div>
            <div className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary">Personal Information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-lg bg-accent/10 px-4 py-2.5 min-h-[44px] flex items-center text-sm font-medium text-accent transition-colors hover:bg-accent/20"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {message && (
                <div className={`mb-4 rounded-lg p-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-danger/10 text-danger border border-danger/20"
                }`}>
                  {message.text}
                </div>
              )}

              {editing ? (
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
                    <p className="text-text-secondary">{user?.email}</p>
                    <p className="mt-1 text-xs text-text-secondary">Email cannot be changed</p>
                  </div>

                  <div className="border-t border-border pt-5">
                    <h3 className="mb-3 text-sm font-semibold text-text-primary">Change Password (optional)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-text-secondary">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-text-secondary">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
                          placeholder="Min 8 chars, uppercase, lowercase, number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Full Name</label>
                    <p className="text-text-primary">{user?.name || "N/A"}</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
                    <p className="text-text-primary">{user?.email || "N/A"}</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Role</label>
                    <span className="inline-flex items-center rounded-lg bg-accent/10 px-3 py-1 text-sm font-medium text-accent capitalize">
                      {user?.role || "student"}
                    </span>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Member Since</label>
                    <p className="text-text-primary">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <a href="/favorites" className="flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/20 hover:bg-surface/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10">
                <svg className="h-6 w-6 text-danger" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-text-primary">Favorites</p>
                <p className="text-xs text-text-secondary">View your saved favorites</p>
              </div>
            </a>

            <a href="/bookmarks" className="flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/20 hover:bg-surface/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <svg className="h-6 w-6 text-warning" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-text-primary">Bookmarks</p>
                <p className="text-xs text-text-secondary">View your saved bookmarks</p>
              </div>
            </a>

            <a href="/dashboard" className="flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/20 hover:bg-surface/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-text-primary">Dashboard</p>
                <p className="text-xs text-text-secondary">View your learning progress</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
