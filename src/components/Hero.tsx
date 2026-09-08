"use client";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden hero-gradient pt-16 lg:pt-[72px]">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent/3 blur-[100px]" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
        {/* ECG Line */}
        <svg className="absolute top-1/3 left-0 w-full h-24 opacity-20" viewBox="0 0 1440 80" fill="none">
          <path d="M0 40 L200 40 L220 10 L240 70 L260 20 L280 60 L300 40 L600 40 L620 15 L640 65 L660 25 L680 55 L700 40 L1000 40 L1020 12 L1040 68 L1060 22 L1080 58 L1100 40 L1440 40"
            stroke="var(--accent)" strokeWidth="1.5" fill="none" opacity="0.4" />
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-[calc(92vh-72px)] max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <span className="text-base">🩺</span>
              Medical Education Platform
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-[1.1] text-text-primary sm:text-5xl lg:text-6xl xl:text-[68px]">
              Master Medicine.
              <br />
              Understand More.
              <br />
              <span className="text-accent">Achieve</span> Better.
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
              A modern medical education platform designed to help medical
              students learn, revise, practice, and master medicine — all in one
              place.
            </p>

            <div className="mb-8 flex flex-wrap items-center gap-4">
              <a href="/subjects"
                className="group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-xl hover:shadow-accent/30">
                Start Learning
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#subjects"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-text-secondary transition-all hover:bg-surface/70 hover:text-text-primary hover:border-accent/30">
                Explore Subjects
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
              <span className="flex items-center gap-1.5"><svg className="h-4 w-4 text-accent/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Built for Medical Students</span>
              <span className="h-1 w-1 rounded-full bg-text-muted/40" />
              <span className="flex items-center gap-1.5"><svg className="h-4 w-4 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> Learn</span>
              <span className="h-1 w-1 rounded-full bg-text-muted/40" />
              <span className="flex items-center gap-1.5"><svg className="h-4 w-4 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Practice</span>
              <span className="h-1 w-1 rounded-full bg-text-muted/40" />
              <span className="flex items-center gap-1.5"><svg className="h-4 w-4 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> Progress</span>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:flex lg:items-center lg:justify-center">
            {/* Anatomy circle background */}
            <div className="absolute h-[500px] w-[500px] rounded-full border border-accent/10 opacity-50" />
            <div className="absolute h-[400px] w-[400px] rounded-full border border-accent/5 opacity-30" />

            {/* Main doctor image */}
            <div className="animate-float relative z-10">
              <div className="relative overflow-hidden rounded-3xl border border-border shadow-2xl shadow-accent/10">
                <img src="/doctor.png" alt="Dr. Etshoooo" className="h-[420px] w-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating Card: Anatomy */}
            <div className="animate-float-delayed absolute top-8 left-0 z-20 rounded-2xl glass-card p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
                  <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">Anatomy</p>
                  <p className="text-[11px] text-text-muted">Brachial Plexus</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-muted">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lecture · 45 min
                  </div>
                </div>
                <div className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Card: MCQ Practice */}
            <div className="animate-float absolute top-12 right-0 z-20 rounded-2xl glass-card p-5 shadow-xl">
              <p className="mb-3 text-xs font-semibold text-text-primary">MCQ Practice</p>
              <div className="relative mb-3 flex justify-center">
                <svg className="h-20 w-20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="color-mix(in srgb, var(--accent) 15%, transparent)" strokeWidth="6" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent)" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="37.68" strokeLinecap="round" transform="rotate(-90 50 50)" />
                  <text x="50" y="46" textAnchor="middle" className="fill-text-primary text-[18px] font-bold">85%</text>
                  <text x="50" y="60" textAnchor="middle" className="fill-text-muted text-[8px]">accuracy</text>
                </svg>
              </div>
              <p className="text-center text-[11px] text-text-muted">1,240 Questions</p>
            </div>

            {/* Floating Card: High-Yield Notes */}
            <div className="animate-float-delayed absolute bottom-20 right-0 z-20 rounded-2xl glass-card p-4 shadow-xl">
              <div className="mb-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs font-semibold text-text-primary">High-Yield Notes</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <div className="h-1 w-1 rounded-full bg-accent/60" /> Cardiovascular System
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <div className="h-1 w-1 rounded-full bg-accent/60" /> Respiratory System
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <div className="h-1 w-1 rounded-full bg-accent/60" /> Neuroscience
                </div>
              </div>
            </div>

            {/* Brain illustration */}
            <div className="animate-float-slow absolute bottom-32 left-4 z-20 flex h-16 w-16 items-center justify-center rounded-2xl glass-card text-2xl shadow-xl">
              🧠
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
