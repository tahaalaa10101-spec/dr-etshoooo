"use client";

const popularSearches = ["Anatomy", "Cardiovascular System", "Cranial Nerves", "Pharmacology", "Pathology"];

export default function Search() {
  return (
    <section className="section-padding bg-bg">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
          Find Anything. <span className="text-accent">Learn Faster.</span>
        </h2>
        <p className="mb-8 text-sm text-text-secondary">
          Search across lectures, topics, MCQs, and medical terms.
        </p>

        <div className="relative mx-auto max-w-2xl">
          <div className="flex items-center rounded-2xl border border-border bg-surface/60 p-2 shadow-lg shadow-black/20 transition-all focus-within:border-accent/40 focus-within:shadow-accent/10">
            <div className="flex items-center pl-4 text-text-muted">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input type="text" placeholder="Search lectures, topics, MCQs, medical terms..."
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-text-primary outline-none placeholder:text-text-muted" />
            <button className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-accent/20 transition-all hover:bg-accent-light">
              Search
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-text-muted">Popular:</span>
          {popularSearches.map((term) => (
            <button key={term}
              className="rounded-full border border-border bg-surface/40 px-4 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-accent/30 hover:text-accent">
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
