import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format").max(255),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// Content
export const yearSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(2000).optional().nullable(),
  order: z.number().int().min(0).max(9999).optional(),
  published: z.boolean().optional(),
});

export const semesterSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  academicYearId: z.string().min(1),
  description: z.string().max(2000).optional().nullable(),
  order: z.number().int().min(0).max(9999).optional(),
  published: z.boolean().optional(),
});

export const subjectSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional().nullable(),
  icon: z.string().max(10).optional().nullable(),
  image: z.string().url().optional().nullable(),
  semesterId: z.string().min(1),
  order: z.number().int().min(0).max(9999).optional(),
  published: z.boolean().optional(),
});

export const topicSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional().nullable(),
  subjectId: z.string().min(1),
  order: z.number().int().min(0).max(9999).optional(),
  published: z.boolean().optional(),
});

export const lectureSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(100000).optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  pdfUrl: z.string().url().optional().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  topicId: z.string().min(1),
  duration: z.number().int().min(0).max(10000).optional().nullable(),
  order: z.number().int().min(0).max(9999).optional(),
  published: z.boolean().optional(),
});

export const mcqSchema = z.object({
  question: z.string().min(1).max(5000),
  options: z.string().max(10000),
  correctAnswer: z.string().min(1).max(10),
  explanation: z.string().max(5000).optional().nullable(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  topicId: z.string().min(1),
  published: z.boolean().optional(),
});

export const essaySchema = z.object({
  question: z.string().min(1).max(5000),
  modelAnswer: z.string().min(1).max(50000),
  explanation: z.string().max(5000).optional().nullable(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  topicId: z.string().min(1),
  published: z.boolean().optional(),
});

export const noteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(100000),
  category: z.string().max(100).optional(),
  topicId: z.string().min(1),
  published: z.boolean().optional(),
});

export const caseSchema = z.object({
  title: z.string().min(1).max(200),
  patientInfo: z.string().min(1).max(5000),
  symptoms: z.string().min(1).max(5000),
  signs: z.string().max(5000).optional().nullable(),
  investigations: z.string().max(5000).optional().nullable(),
  differentialDiag: z.string().max(5000).optional().nullable(),
  finalDiagnosis: z.string().max(5000).optional().nullable(),
  management: z.string().max(5000).optional().nullable(),
  topicId: z.string().min(1),
  published: z.boolean().optional(),
});

export const flashcardSchema = z.object({
  front: z.string().min(1).max(5000),
  back: z.string().min(1).max(5000),
  topicId: z.string().min(1),
  published: z.boolean().optional(),
});

export const examSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  duration: z.number().int().min(0).max(10000).optional().nullable(),
  questionCount: z.number().int().min(0).max(10000).optional().nullable(),
  topicId: z.string().min(1),
  published: z.boolean().optional(),
});

export const termSchema = z.object({
  term: z.string().min(1).max(200),
  arabicTerm: z.string().max(200).optional().nullable(),
  latinTerm: z.string().max(200).optional().nullable(),
  definition: z.string().min(1).max(5000),
  simpleExplanation: z.string().max(5000).optional().nullable(),
  arabicMeaning: z.string().max(200).optional().nullable(),
  pronunciation: z.string().max(200).optional().nullable(),
  clinicalRelevance: z.string().max(5000).optional().nullable(),
  relatedTerms: z.string().max(2000).optional().nullable(),
  subjectId: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

export const appSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  features: z.string().max(5000).optional().nullable(),
  isFree: z.boolean().optional(),
  howToUse: z.string().max(5000).optional().nullable(),
  officialUrl: z.string().url().optional().nullable(),
  platform: z.string().max(100).optional().nullable(),
  published: z.boolean().optional(),
});

export const howToStudySchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional().nullable(),
  subjectId: z.string().optional().nullable(),
  content: z.string().max(100000).optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  tips: z.string().max(10000).optional().nullable(),
  studyMethod: z.string().max(10000).optional().nullable(),
  order: z.number().int().min(0).max(9999).optional(),
  published: z.boolean().optional(),
});

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Search
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
});
