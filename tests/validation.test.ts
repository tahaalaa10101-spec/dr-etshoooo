import {
  loginSchema,
  registerSchema,
  yearSchema,
  semesterSchema,
  subjectSchema,
  topicSchema,
  lectureSchema,
  mcqSchema,
  noteSchema,
  caseSchema,
  termSchema,
  appSchema,
  howToStudySchema,
} from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should accept valid login data", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("should accept valid registration data", () => {
      const result = registerSchema.safeParse({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject short name", () => {
      const result = registerSchema.safeParse({
        name: "T",
        email: "test@example.com",
        password: "Password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("yearSchema", () => {
    it("should accept valid year data", () => {
      const result = yearSchema.safeParse({
        title: "First Year",
        slug: "first-year",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid slug", () => {
      const result = yearSchema.safeParse({
        title: "First Year",
        slug: "First Year!",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("subjectSchema", () => {
    it("should accept valid subject data", () => {
      const result = subjectSchema.safeParse({
        name: "Anatomy",
        slug: "anatomy",
        semesterId: "some-id",
      });
      expect(result.success).toBe(true);
    });

    it("should require semesterId", () => {
      const result = subjectSchema.safeParse({
        name: "Anatomy",
        slug: "anatomy",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("lectureSchema", () => {
    it("should accept valid lecture data", () => {
      const result = lectureSchema.safeParse({
        title: "Introduction to Anatomy",
        slug: "intro-anatomy",
        topicId: "some-id",
      });
      expect(result.success).toBe(true);
    });

    it("should accept optional fields", () => {
      const result = lectureSchema.safeParse({
        title: "Introduction to Anatomy",
        slug: "intro-anatomy",
        topicId: "some-id",
        content: "This is the content",
        videoUrl: "https://example.com/video.mp4",
        pdfUrl: "https://example.com/file.pdf",
        duration: 60,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("mcqSchema", () => {
    it("should accept valid MCQ data", () => {
      const result = mcqSchema.safeParse({
        question: "What is the largest organ?",
        options: JSON.stringify(["Skin", "Liver", "Brain", "Heart"]),
        correctAnswer: "A",
        topicId: "some-id",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty question", () => {
      const result = mcqSchema.safeParse({
        question: "",
        options: "[]",
        correctAnswer: "A",
        topicId: "some-id",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("termSchema", () => {
    it("should accept valid term data", () => {
      const result = termSchema.safeParse({
        term: "Tachycardia",
        definition: "Fast heart rate",
      });
      expect(result.success).toBe(true);
    });

    it("should accept all optional fields", () => {
      const result = termSchema.safeParse({
        term: "Tachycardia",
        arabicTerm: "تسارع القلب",
        latinTerm: "Tachycardia",
        definition: "Fast heart rate",
        simpleExplanation: "Heart beating too fast",
        arabicMeaning: "ضربات القلب السريعة",
        pronunciation: "ta-ki-KAR-dee-uh",
        clinicalRelevance: "May indicate cardiac disease",
        relatedTerms: "Bradycardia, Arrhythmia",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("appSchema", () => {
    it("should accept valid app data", () => {
      const result = appSchema.safeParse({
        name: "Anatomy Atlas",
        description: "A comprehensive anatomy reference",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("howToStudySchema", () => {
    it("should accept valid study guide", () => {
      const result = howToStudySchema.safeParse({
        title: "How to Study Anatomy",
        slug: "how-to-study-anatomy",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid slug", () => {
      const result = howToStudySchema.safeParse({
        title: "How to Study Anatomy",
        slug: "How To Study Anatomy!!!",
      });
      expect(result.success).toBe(false);
    });
  });
});
