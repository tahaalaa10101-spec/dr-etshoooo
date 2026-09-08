"use client";

import { useEffect, useState } from "react";

interface Case {
  id: string;
  title: string;
  patientInfo: string;
  symptoms: string;
  investigations?: string;
  finalDiagnosis?: string;
  topic?: { name: string; subject?: { name: string } };
}

export default function MedicalCases() {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    fetch("/api/cases?limit=1")
      .then((res) => res.json())
      .then((result) => setCases(result.data || []))
      .catch(() => {});
  }, []);

  if (cases.length === 0) return null;

  const c = cases[0];

  return (
    <section id="cases" className="section-padding bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Clinical Cases</p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Think Like a <span className="text-accent">Doctor</span>
          </h2>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="group overflow-hidden rounded-3xl border border-border bg-surface/60 shadow-xl shadow-black/20 transition-all duration-300 card-hover hover:border-accent/20">
            <div className="bg-gradient-to-r from-accent/20 to-accent/5 p-8 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent">🏥 Clinical Case</span>
                <span className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-medium text-text-muted">{c.topic?.subject?.name || "Subject"}</span>
              </div>
              <h3 className="mt-3 text-xl font-bold text-text-primary">{c.title}</h3>
            </div>

            <div className="p-8">
              <div className="mb-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-lg">🔴</div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-text-primary">Symptoms</p>
                    <p className="text-[13px] text-text-secondary">{c.symptoms}</p>
                  </div>
                </div>
                {c.investigations && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg">🔬</div>
                    <div>
                      <p className="mb-1 text-sm font-semibold text-text-primary">Investigations</p>
                      <p className="text-[13px] text-text-secondary">{c.investigations}</p>
                    </div>
                  </div>
                )}
                {c.finalDiagnosis && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-lg">✅</div>
                    <div>
                      <p className="mb-1 text-sm font-semibold text-text-primary">Diagnosis</p>
                      <p className="text-[13px] text-text-secondary">{c.finalDiagnosis}</p>
                    </div>
                  </div>
                )}
              </div>
              <a href="/cases" className="group/btn inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-xl">
                Solve Case
                <svg className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
