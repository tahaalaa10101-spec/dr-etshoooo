"use client";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-bg">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-accent/10 to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
          Your Medical Journey Starts Here.
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg text-text-secondary">
          Study smarter. Practice better. Become the doctor you want to be.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/subjects" className="group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-bold text-primary shadow-xl shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-2xl hover:shadow-accent/30">
            Start Learning Today
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#subjects" className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-8 py-4 text-sm font-bold text-text-primary transition-all hover:border-accent/30 hover:bg-accent/5">
            Explore Subjects
          </a>
        </div>
      </div>
    </section>
  );
}
