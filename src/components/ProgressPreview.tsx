"use client";

export default function ProgressPreview() {
  return (
    <section className="section-padding bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Dashboard</p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Track Your <span className="text-accent">Progress</span>
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface/60 shadow-xl shadow-black/20">
            <div className="border-b border-border bg-gradient-to-r from-accent/15 to-accent/5 p-6">
              <div className="flex items-center gap-4">
                <img src="/doctor.png" alt="Student" className="h-12 w-12 rounded-full object-cover ring-2 ring-accent/30" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Student Dashboard</h3>
                  <p className="text-sm text-text-muted">Sign in to track your progress across all subjects.</p>
                </div>
              </div>
            </div>

            <div className="p-8 text-center">
              <p className="mb-4 text-text-secondary">Login to see your personalized dashboard with progress tracking, achievements, and more.</p>
              <a href="/login" className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-xl">
                Sign In to Start
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
