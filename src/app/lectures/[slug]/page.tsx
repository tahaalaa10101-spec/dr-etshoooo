"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Lecture {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl?: string;
  pdfUrl?: string;
  topic: {
    id: string;
    name: string;
    slug: string;
    subject: { name: string; slug: string };
  };
}

interface Mcq {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface CaseItem {
  id: string;
  title: string;
  description: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface Essay {
  id: string;
  question: string;
  hint?: string;
}

interface Exam {
  id: string;
  title: string;
  description?: string;
}

const tabs = ["Overview", "MCQs", "Cases", "Notes", "Flashcards", "Essays", "Exams"] as const;
type Tab = (typeof tabs)[number];

export default function LectureDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [mcqs, setMcqs] = useState<Mcq[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/lectures/${slug}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setLecture(result.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!lecture?.topic?.id) return;
    const topicId = lecture.topic.id;

    fetch(`/api/mcqs?topicId=${topicId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMcqs(d.data ?? []); })
      .catch(() => {});

    fetch(`/api/cases?topicId=${topicId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setCases(d.data ?? []); })
      .catch(() => {});

    fetch(`/api/notes?topicId=${topicId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setNotes(d.data ?? []); })
      .catch(() => {});

    fetch(`/api/flashcards?topicId=${topicId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setFlashcards(d.data ?? []); })
      .catch(() => {});

    fetch(`/api/essays?topicId=${topicId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setEssays(d.data ?? []); })
      .catch(() => {});

    fetch(`/api/exams?topicId=${topicId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setExams(d.data ?? []); })
      .catch(() => {});
  }, [lecture?.topic?.id]);

  const toggleBookmark = async () => {
    setBookmarking(true);
    try {
      const method = isBookmarked ? "DELETE" : "POST";
      const url = isBookmarked
        ? `/api/bookmarks?itemType=lecture&itemId=${lecture?.id}`
        : "/api/bookmarks";
      const res = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: {
          ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
        },
        ...(method === "POST" ? { body: JSON.stringify({ itemType: "lecture", itemId: lecture?.id }) } : {}),
      });
      if (res.ok) setIsBookmarked(!isBookmarked);
    } catch {}
    setBookmarking(false);
  };

  const toggleFavorite = async () => {
    try {
      const method = isFavorited ? "DELETE" : "POST";
      const url = isFavorited
        ? `/api/favorites?itemType=lecture&itemId=${lecture?.id}`
        : "/api/favorites";
      const res = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: {
          ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
        },
        ...(method === "POST" ? { body: JSON.stringify({ itemType: "lecture", itemId: lecture?.id }) } : {}),
      });
      if (res.ok) setIsFavorited(!isFavorited);
    } catch {}
  };

  const markComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lectureId: lecture?.id }),
      });
      if (res.ok) setIsCompleted(true);
    } catch {}
    setCompleting(false);
  };

  const hasMcqs = mcqs.length > 0;
  const hasCases = cases.length > 0;
  const hasNotes = notes.length > 0;
  const hasFlashcards = flashcards.length > 0;
  const hasEssays = essays.length > 0;
  const hasExams = exams.length > 0;

  const availableTabs = tabs.filter((t) => {
    if (t === "Overview") return true;
    if (t === "MCQs") return hasMcqs;
    if (t === "Cases") return hasCases;
    if (t === "Notes") return hasNotes;
    if (t === "Flashcards") return hasFlashcards;
    if (t === "Essays") return hasEssays;
    if (t === "Exams") return hasExams;
    return false;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">Lecture not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <a href="/subjects" className="hover:text-text-primary transition-colors">Subjects</a>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <a href={`/subjects/${lecture.topic.subject.slug}`} className="hover:text-text-primary transition-colors">{lecture.topic.subject.name}</a>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <a href={`/subjects/${lecture.topic.subject.slug}/${lecture.topic.slug}`} className="hover:text-text-primary transition-colors">{lecture.topic.name}</a>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-text-primary">{lecture.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            <h1 className="mb-2 text-2xl font-bold text-text-primary sm:text-3xl">{lecture.title}</h1>
            <p className="mb-6 text-sm text-text-secondary">{lecture.description}</p>

            {/* Video Player */}
            {lecture.videoUrl && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface/40">
                <div className="aspect-video">
                  <iframe
                    src={lecture.videoUrl}
                    className="h-full w-full"
                    allowFullScreen
                    title={lecture.title}
                  />
                </div>
              </div>
            )}

            {/* PDF Link */}
            {lecture.pdfUrl && (
              <a
                href={lecture.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-surface/40 p-4 transition-all hover:border-accent/20 hover:bg-surface/70"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
                  <svg className="h-5 w-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Download PDF</p>
                  <p className="text-xs text-text-secondary">View lecture slides</p>
                </div>
              </a>
            )}

            {/* Tabs */}
            {availableTabs.length > 1 && (
              <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
                {availableTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "bg-accent text-primary shadow-lg shadow-accent/25"
                        : "text-text-secondary hover:bg-surface/70 hover:text-text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            {/* Tab Content */}
            {activeTab === "Overview" && (
              <div className="space-y-6">
                {lecture.content && (
                  <div className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
                    <h2 className="mb-4 text-lg font-bold text-text-primary">Content</h2>
                    <div className="whitespace-pre-wrap text-text-secondary leading-relaxed">{lecture.content}</div>
                  </div>
                )}

                {!lecture.content && (
                  <div className="rounded-2xl border border-border bg-surface/40 p-8 text-center">
                    <p className="text-text-secondary">No content available for this lecture.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "MCQs" && hasMcqs && (
              <div className="space-y-4">
                {mcqs.map((mcq, index) => (
                  <div key={mcq.id} className="rounded-2xl border border-border bg-surface/40 p-6">
                    <p className="mb-4 text-sm font-medium text-text-primary">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
                        {index + 1}
                      </span>
                      {mcq.question}
                    </p>
                    <div className="space-y-2">
                      {mcq.options.map((option, optIndex) => {
                        const isSelected = selectedAnswers[mcq.id] === optIndex;
                        const isCorrect = mcq.correctAnswer === optIndex;
                        const showResult = selectedAnswers[mcq.id] !== undefined;
                        return (
                          <button
                            key={optIndex}
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [mcq.id]: optIndex }))
                            }
                            className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${
                              showResult && isCorrect
                                ? "border-success bg-success/10 text-success"
                                : showResult && isSelected && !isCorrect
                                ? "border-danger bg-danger/10 text-danger"
                                : isSelected
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border text-text-secondary hover:bg-surface/70 hover:text-text-primary"
                            }`}
                          >
                            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Cases" && hasCases && (
              <div className="space-y-4">
                {cases.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-border bg-surface/40 p-6">
                    <button
                      onClick={() => setExpandedCase(expandedCase === c.id ? null : c.id)}
                      className="flex w-full items-center justify-between"
                    >
                      <p className="text-sm font-bold text-text-primary">{c.title}</p>
                      <svg
                        className={`h-5 w-5 text-text-secondary transition-transform ${expandedCase === c.id ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedCase === c.id && (
                      <p className="mt-4 text-sm text-text-secondary leading-relaxed">{c.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Notes" && hasNotes && (
              <div className="grid gap-4 sm:grid-cols-2">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-2xl border border-border bg-surface/40 p-5">
                    <button
                      onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                      className="flex w-full items-center justify-between"
                    >
                      <p className="text-sm font-bold text-text-primary">{note.title}</p>
                      <svg
                        className={`h-5 w-5 text-text-secondary transition-transform ${expandedNote === note.id ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedNote === note.id && (
                      <div className="mt-3 whitespace-pre-wrap text-gray-300 leading-relaxed">{note.content}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Flashcards" && hasFlashcards && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {flashcards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setFlippedCard(flippedCard === card.id ? null : card.id)}
                    className="group relative h-48 w-full perspective-1000"
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl border border-border bg-surface/40 p-6 transition-transform duration-500 ${
                        flippedCard === card.id ? "rotate-y-180" : ""
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 flex items-center justify-center p-6"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <p className="text-center text-sm font-medium text-text-primary">{card.front}</p>
                      </div>
                      {/* Back */}
                      <div
                        className="absolute inset-0 flex items-center justify-center p-6"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      >
                        <p className="text-center text-sm text-text-secondary">{card.back}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === "Essays" && hasEssays && (
              <div className="space-y-4">
                {essays.map((essay, index) => (
                  <div key={essay.id} className="rounded-2xl border border-border bg-surface/40 p-6">
                    <p className="mb-2 text-sm font-medium text-text-primary">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
                        {index + 1}
                      </span>
                      {essay.question}
                    </p>
                    {essay.hint && (
                      <p className="mt-2 ml-8 text-xs text-text-muted italic">Hint: {essay.hint}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Exams" && hasExams && (
              <div className="space-y-3">
                {exams.map((exam) => (
                  <a
                    key={exam.id}
                    href={`/exams/${exam.id}`}
                    className="flex items-center justify-between rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/20 hover:bg-surface/70"
                  >
                    <div>
                      <p className="text-sm font-bold text-text-primary">{exam.title}</p>
                      {exam.description && (
                        <p className="mt-1 text-xs text-text-secondary">{exam.description}</p>
                      )}
                    </div>
                    <svg className="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={toggleBookmark}
                disabled={bookmarking}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  isBookmarked
                    ? "bg-accent text-primary"
                    : "border border-border text-text-secondary hover:bg-surface/70 hover:text-text-primary"
                }`}
              >
                <svg className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>

              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  isFavorited
                    ? "bg-danger text-white"
                    : "border border-border text-text-secondary hover:bg-surface/70 hover:text-text-primary"
                }`}
              >
                <svg className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorited ? "Favorited" : "Favorite"}
              </button>

              <button
                onClick={markComplete}
                disabled={completing || isCompleted}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  isCompleted
                    ? "bg-success text-primary"
                    : "bg-accent text-primary shadow-lg shadow-accent/25 hover:bg-accent-light"
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isCompleted ? "Completed" : "Mark Complete"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-border bg-surface/40 p-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Lecture Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-text-muted">Subject</p>
                    <p className="text-text-primary font-medium">{lecture.topic.subject.name}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Topic</p>
                    <p className="text-text-primary font-medium">{lecture.topic.name}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-text-muted">Status</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {isCompleted && (
                        <span className="inline-flex items-center rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                          Completed
                        </span>
                      )}
                      {isBookmarked && (
                        <span className="inline-flex items-center rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          Bookmarked
                        </span>
                      )}
                      {isFavorited && (
                        <span className="inline-flex items-center rounded-lg bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                          Favorited
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-text-muted">Resources</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {lecture.videoUrl && (
                        <span className="inline-flex items-center rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          Video
                        </span>
                      )}
                      {lecture.pdfUrl && (
                        <span className="inline-flex items-center rounded-lg bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                          PDF
                        </span>
                      )}
                      {hasMcqs && (
                        <span className="inline-flex items-center rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          {mcqs.length} MCQs
                        </span>
                      )}
                      {hasCases && (
                        <span className="inline-flex items-center rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                          {cases.length} Cases
                        </span>
                      )}
                      {hasNotes && (
                        <span className="inline-flex items-center rounded-lg bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                          {notes.length} Notes
                        </span>
                      )}
                      {hasFlashcards && (
                        <span className="inline-flex items-center rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          {flashcards.length} Cards
                        </span>
                      )}
                      {hasEssays && (
                        <span className="inline-flex items-center rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                          {essays.length} Essays
                        </span>
                      )}
                      {hasExams && (
                        <span className="inline-flex items-center rounded-lg bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                          {exams.length} Exams
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
