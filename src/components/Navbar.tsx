"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Study", href: "/subjects" },
  { label: "How to Study", href: "/how-to-study" },
  { label: "Terminology", href: "/terminology" },
  { label: "Medical Apps", href: "/apps" },
  { label: "Dictionary", href: "/dictionary" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => {
        if (result?.success && result?.data?.user) {
          setIsLoggedIn(true);
          setUserName(result.data.user.name || "");
          setUserRole(result.data.user.role || "");
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    window.location.href = "/";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/30" : "bg-primary-dark/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-[72px]">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
              <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-text-primary">Dr.Etshoooo</span>
              <p className="text-[11px] text-text-muted">Medical Education Platform</p>
            </div>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary transition-colors hover:text-text-primary"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {isLoggedIn ? (
              <>
                {userRole === "admin" && (
                  <a href="/admin" className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-accent transition-colors hover:bg-accent/10">
                    Admin Panel
                  </a>
                )}
                <a href="/dashboard" className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-white/5">
                  Dashboard
                </a>
                <a href="/profile" className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-white/5">
                  Profile
                </a>
                <button onClick={handleLogout} className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
                  Log In
                </a>
                <a href="/register" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/20 transition-all hover:bg-accent-light hover:shadow-xl hover:shadow-accent/30">
                  Get Started
                </a>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary lg:hidden">
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass border-t border-border lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary">
                {link.label}
              </a>
            ))}
            <div className="border-t border-border pt-3 mt-2 space-y-2">
              <button
                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                {theme === "dark" ? (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
              {isLoggedIn ? (
                <>
                  {userRole === "admin" && (
                    <a href="/admin" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10">
                      Admin Panel
                    </a>
                  )}
                  <a href="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary">
                    Dashboard
                  </a>
                  <a href="/profile" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary">
                    Profile
                  </a>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary">
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary">
                    Log In
                  </a>
                  <a href="/register" onClick={() => setMobileOpen(false)} className="block w-full rounded-xl bg-accent px-5 py-3 text-center text-sm font-semibold text-primary">
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
