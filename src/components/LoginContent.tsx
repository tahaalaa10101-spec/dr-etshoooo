"use client";

import { useState } from "react";

export default function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      if (result.data?.user?.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/subjects";
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent/3 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20">
            <svg className="h-7 w-7 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="mt-1 text-sm text-text-secondary">Sign in to continue learning</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
          {error && (
            <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-light disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-medium text-accent hover:text-accent-light">
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
