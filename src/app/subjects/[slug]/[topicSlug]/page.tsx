"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ContentItem {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  duration?: number;
  question?: string;
  front?: string;
  back?: string;
  term?: string;
  definition?: string;
}

interface TopicContent {
  lectures: ContentItem[];
  notes: ContentItem[];
  mcqs: ContentItem[];
  essays: ContentItem[];
  clinicalCases: ContentItem[];
  flashcards: ContentItem[];
  exams: ContentItem[];
}

interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subject: {
    id: string;
    name: string;
    slug: string;
    semester: {
      academicYear: { title: string; slug: string };
    };
  };
}

export default function TopicDetailPage() {
  const params = useParams();
  const subjectSlug = params.slug as string;
  const topicSlug = params.topicSlug as string;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [content, setContent] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // First get the subject to find its ID
        const subjectRes = await fetch(`/api/subjects`);
        const subjectData = await subjectRes.json();
        const subject = subjectData.data?.find((s: { slug: string }) => s.slug === subjectSlug);
        if (!subject) return;

        // Then get topics for this subject
        const topicsRes = await fetch(`/api/subjects/${subject.id}/topics`);
        const topicsData = await topicsRes.json();
        const topicData = topicsData.data?.find((t: { slug: string }) => t.slug === topicSlug);
        if (!topicData) return;

        setTopic({ ...topicData, subject });

        // Get content for this topic
        const contentRes = await fetch(`/api/topics/${topicData.id}/content`);
        const contentData = await contentRes.json();
        if (contentData.success) {
          setContent(contentData.data);
        }
      } catch (err) {
        console.error("Failed to load topic:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [subjectSlug, topicSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Topic Not Found</h1>
          <Link href="/subjects" className="text-accent hover:underline">Back to Subjects</Link>
        </div>
      </div>
    );
  }

  const sections = [
    { key: "lectures", title: "Lectures", icon: "📖", items: content?.lectures || [] },
    { key: "notes", title: "Notes", icon: "📝", items: content?.notes || [] },
    { key: "mcqs", title: "MCQs", icon: "❓", items: content?.mcqs || [] },
    { key: "essays", title: "Essay Questions", icon: "✍️", items: content?.essays || [] },
    { key: "clinicalCases", title: "Clinical Cases", icon: "🏥", items: content?.clinicalCases || [] },
    { key: "flashcards", title: "Flashcards", icon: "🃏", items: content?.flashcards || [] },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/subjects" className="hover:text-accent">Subjects</Link>
          <span>/</span>
          <Link href={`/subjects/${subjectSlug}`} className="hover:text-accent">{topic.subject.name}</Link>
          <span>/</span>
          <span className="text-text-primary">{topic.name}</span>
        </nav>

        {/* Topic Header */}
        <div className="mb-8 rounded-2xl border border-border bg-surface/40 p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">{topic.name}</h1>
          {topic.description && (
            <p className="text-text-secondary">{topic.description}</p>
          )}
        </div>

        {/* Content Sections */}
        {sections.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
            <p className="text-text-muted text-lg">No content available yet for this topic.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.key} className="rounded-2xl border border-border bg-surface/40 p-6">
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span>{section.icon}</span> {section.title}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.id}
                      href={section.key === "lectures" ? `/lectures/${item.slug || item.id}` : "#"}
                      className="flex items-center justify-between rounded-xl border border-border bg-primary/30 p-4 transition-all hover:border-accent/20 hover:bg-surface/60"
                    >
                      <div>
                        <h3 className="font-semibold text-text-primary">{item.title || item.term || item.question || "Untitled"}</h3>
                        {item.description && (
                          <p className="text-sm text-text-muted mt-1 line-clamp-1">{item.description}</p>
                        )}
                      </div>
                      <svg className="h-5 w-5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
