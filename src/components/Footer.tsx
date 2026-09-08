"use client";

const quickLinks = [
  { label: "Subjects", href: "/subjects" },
  { label: "Academic Years", href: "/years" },
  { label: "MCQs", href: "/mcqs" },
  { label: "Medical Cases", href: "/cases" },
  { label: "About", href: "/" },
  { label: "Contact", href: "mailto:support@dr-etshoooo.com" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-border">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <a href="/" className="mb-4 flex items-center gap-3">
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
            <p className="mb-6 max-w-sm text-[13px] leading-relaxed text-text-muted">
              A modern medical education platform designed to help medical students learn, revise, practice, and master medicine.
            </p>
            <div className="flex items-center gap-3">
              {["T", "I", "Y", "T"].map((s) => (
                <a key={s} href="#" aria-label="Social media" role="link"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface/40 text-sm font-medium text-text-muted transition-all hover:border-accent/30 hover:text-accent">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[13px] text-text-muted transition-colors hover:text-accent">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: "Lectures", href: "/subjects" },
                { label: "Notes", href: "/subjects" },
                { label: "Flashcards", href: "/subjects" },
                { label: "Study Groups", href: "/how-to-study" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[13px] text-text-muted transition-colors hover:text-accent">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-text-muted">&copy; 2026 Dr.Etshoooo. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="text-xs text-text-muted transition-colors hover:text-accent">Privacy Policy</a>
              <a href="/terms" className="text-xs text-text-muted transition-colors hover:text-accent">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
