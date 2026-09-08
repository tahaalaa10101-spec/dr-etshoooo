"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Back to Site", icon: "🏠" },
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/years", label: "Years", icon: "📅" },
  { href: "/admin/semesters", label: "Semesters", icon: "📆" },
  { href: "/admin/subjects", label: "Subjects", icon: "📚" },
  { href: "/admin/topics", label: "Topics", icon: "📑" },
  { href: "/admin/lectures", label: "Lectures", icon: "🎓" },
  { href: "/admin/mcqs", label: "MCQs", icon: "❓" },
  { href: "/admin/notes", label: "Notes", icon: "📝" },
  { href: "/admin/cases", label: "Cases", icon: "🏥" },
  { href: "/admin/flashcards", label: "Flashcards", icon: "🃏" },
  { href: "/admin/terms", label: "Terms", icon: "📖" },
  { href: "/admin/how-to-study", label: "How to Study", icon: "📖" },
  { href: "/admin/students", label: "Students", icon: "👥" },
  { href: "/admin/apps", label: "Medical Apps", icon: "📱" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const result = await res.json();
        if (!result.success || !result.data) {
          router.replace("/login");
          return;
        }
        if (result.data.user.role !== "admin") {
          router.replace("/login");
          return;
        }
        setAdminName(result.data.user.name || "Admin");
      } catch {
        router.replace("/login");
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#060b16] border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold text-sm">DE</span>
          </div>
          <span className="text-text-primary font-semibold">Admin Panel</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
          {navItems.map((item, index) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <span key={item.href}>
                {index === 1 && <div className="border-t border-border my-2" />}
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    index === 0
                      ? "text-accent hover:bg-accent/10 mb-1"
                      : isActive
                        ? "text-accent bg-accent/10"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface/40"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </span>
            );
          })}
        </nav>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-bg/80 backdrop-blur-lg border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface/40"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary hidden sm:block">{adminName}</span>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-sm font-semibold">{adminName.charAt(0).toUpperCase()}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:text-danger hover:border-danger/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
