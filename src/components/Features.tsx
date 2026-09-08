"use client";

const features = [
  { icon: "📚", title: "Study", description: "Organized learning with Year → Semester → Subject → Topic → Lecture. Everything structured for you." },
  { icon: "🧠", title: "How to Study", description: "Expert study tips and strategies tailored for each medical subject." },
  { icon: "📖", title: "Medical Dictionary", description: "Search medical terms in English, Arabic, and Latin — all in one place." },
  { icon: "📱", title: "Medical Apps", description: "Curated collection of the best apps for medical students." },
  { icon: "🔎", title: "Smart Search", description: "Search across all content — lectures, notes, questions — in multiple languages." },
  { icon: "📊", title: "Track Progress", description: "Monitor your learning progress and know exactly where you stand." },
];

export default function Features() {
  return (
    <section className="section-padding bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Why Dr.Etshoooo</p>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Everything Medical Students Need.{" "}
            <span className="text-accent">One Platform.</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group row-span-2 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/10 to-accent/5 p-7 transition-all duration-300 card-hover">
            <div className="mb-6 flex justify-center">
              <img src="/doctor.png" alt="Dr. Etshoooo"
                className="h-32 w-32 rounded-2xl object-cover ring-4 ring-accent/20 shadow-xl shadow-accent/10" />
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-text-primary">Dr. Etshoooo</h3>
            <p className="mb-4 text-center text-sm font-medium text-accent">Medical Education Platform Creator</p>
            <p className="text-center text-[13px] leading-relaxed text-text-secondary">
              Dedicated to making medical education accessible, organized, and effective for every medical student.
            </p>
          </div>

          {features.map((feature) => (
            <div key={feature.title}
              className="group rounded-2xl border border-border bg-surface/40 p-7 transition-all duration-300 card-hover hover:border-accent/20 hover:bg-surface/70">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-xl transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-base font-bold text-text-primary">{feature.title}</h3>
              <p className="text-[13px] leading-relaxed text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
