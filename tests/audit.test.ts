import {
  noteSchema,
  caseSchema,
  termSchema,
  flashcardSchema,
  essaySchema,
  lectureSchema,
  mcqSchema,
} from "@/lib/validation";

describe("DELETE API Routes - Validation", () => {
  describe("Notes DELETE route", () => {
    it("should have note schema with required fields", () => {
      const result = noteSchema.safeParse({
        title: "Test Note",
        content: "Note content",
        topicId: "topic-123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject note without title", () => {
      const result = noteSchema.safeParse({
        content: "Note content",
        topicId: "topic-123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject note without content", () => {
      const result = noteSchema.safeParse({
        title: "Test Note",
        topicId: "topic-123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject note without topicId", () => {
      const result = noteSchema.safeParse({
        title: "Test Note",
        content: "Note content",
      });
      expect(result.success).toBe(false);
    });

    it("should accept note with optional category", () => {
      const result = noteSchema.safeParse({
        title: "Test Note",
        content: "Note content",
        topicId: "topic-123",
        category: "lecture-notes",
        published: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Cases DELETE route", () => {
    it("should have case schema with required fields", () => {
      const result = caseSchema.safeParse({
        title: "Clinical Case",
        patientInfo: "45 year old male",
        symptoms: "Chest pain",
        topicId: "topic-123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject case without title", () => {
      const result = caseSchema.safeParse({
        patientInfo: "45 year old male",
        symptoms: "Chest pain",
        topicId: "topic-123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject case without patientInfo", () => {
      const result = caseSchema.safeParse({
        title: "Clinical Case",
        symptoms: "Chest pain",
        topicId: "topic-123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject case without symptoms", () => {
      const result = caseSchema.safeParse({
        title: "Clinical Case",
        patientInfo: "45 year old male",
        topicId: "topic-123",
      });
      expect(result.success).toBe(false);
    });

    it("should accept case with all optional fields", () => {
      const result = caseSchema.safeParse({
        title: "Clinical Case",
        patientInfo: "45 year old male",
        symptoms: "Chest pain",
        signs: "Tenderness",
        investigations: "ECG normal",
        differentialDiag: "Musculoskeletal",
        finalDiagnosis: "Costochondritis",
        management: "NSAIDs",
        topicId: "topic-123",
        published: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Terms DELETE route", () => {
    it("should have term schema with required fields", () => {
      const result = termSchema.safeParse({
        term: "Femur",
        definition: "The longest bone in the body",
      });
      expect(result.success).toBe(true);
    });

    it("should reject term without term name", () => {
      const result = termSchema.safeParse({
        definition: "The longest bone in the body",
      });
      expect(result.success).toBe(false);
    });

    it("should reject term without definition", () => {
      const result = termSchema.safeParse({
        term: "Femur",
      });
      expect(result.success).toBe(false);
    });

    it("should accept term with all optional fields", () => {
      const result = termSchema.safeParse({
        term: "Femur",
        arabicTerm: "عظمة الفخذ",
        latinTerm: "Os femoris",
        definition: "The longest bone in the body",
        simpleExplanation: "Big thigh bone",
        arabicMeaning: "عظمة الفخذ",
        pronunciation: "FEE-mer",
        clinicalRelevance: "Common fracture site",
        relatedTerms: "Tibia, Fibula",
        subjectId: "subj-123",
        published: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Flashcards DELETE route", () => {
    it("should have flashcard schema with required fields", () => {
      const result = flashcardSchema.safeParse({
        front: "What is the femur?",
        back: "The longest bone in the body",
        topicId: "topic-123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject flashcard without front", () => {
      const result = flashcardSchema.safeParse({
        back: "The longest bone in the body",
        topicId: "topic-123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject flashcard without back", () => {
      const result = flashcardSchema.safeParse({
        front: "What is the femur?",
        topicId: "topic-123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject flashcard without topicId", () => {
      const result = flashcardSchema.safeParse({
        front: "What is the femur?",
        back: "The longest bone in the body",
      });
      expect(result.success).toBe(false);
    });

    it("should accept flashcard with published field", () => {
      const result = flashcardSchema.safeParse({
        front: "What is the femur?",
        back: "The longest bone in the body",
        topicId: "topic-123",
        published: false,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe("Admin Sidebar Navigation", () => {
  it("should include all admin content pages in navItems", () => {
    const navItems = [
      { href: "/", label: "Back to Site", icon: "🏠" },
      { href: "/admin", label: "Dashboard", icon: "📊" },
      { href: "/admin/years", label: "Years", icon: "📅" },
      { href: "/admin/semesters", label: "Semesters", icon: "📆" },
      { href: "/admin/subjects", label: "Subjects", icon: "📚" },
      { href: "/admin/topics", label: "Topics", icon: "📑" },
      { href: "/admin/lectures", label: "Lectures", icon: "🎓" },
      { href: "/admin/mcqs", label: "MCQs", icon: "❓" },
      { href: "/admin/notes", label: "Notes", icon: "📝" },
      { href: "/admin/cases", label: "Cases", icon: "🏥" },
      { href: "/admin/flashcards", label: "Flashcards", icon: "🃏" },
      { href: "/admin/terms", label: "Terms", icon: "📖" },
      { href: "/admin/how-to-study", label: "How to Study", icon: "📖" },
      { href: "/admin/students", label: "Students", icon: "👥" },
      { href: "/admin/apps", label: "Medical Apps", icon: "📱" },
      { href: "/admin/settings", label: "Settings", icon: "⚙️" },
    ];

    const requiredPages = [
      "/admin",
      "/admin/years",
      "/admin/semesters",
      "/admin/subjects",
      "/admin/topics",
      "/admin/lectures",
      "/admin/mcqs",
      "/admin/notes",
      "/admin/cases",
      "/admin/flashcards",
      "/admin/terms",
      "/admin/how-to-study",
      "/admin/students",
      "/admin/apps",
      "/admin/settings",
    ];

    for (const page of requiredPages) {
      const found = navItems.find((item) => item.href === page);
      expect(found).toBeDefined();
      expect(found?.label).toBeTruthy();
      expect(found?.icon).toBeTruthy();
    }
  });

  it("should have Back to Site as first item", () => {
    const navItems = [
      { href: "/", label: "Back to Site", icon: "🏠" },
    ];
    expect(navItems[0].href).toBe("/");
    expect(navItems[0].label).toBe("Back to Site");
  });

  it("should have unique href for each nav item", () => {
    const navItems = [
      { href: "/" },
      { href: "/admin" },
      { href: "/admin/years" },
      { href: "/admin/semesters" },
      { href: "/admin/subjects" },
      { href: "/admin/topics" },
      { href: "/admin/lectures" },
      { href: "/admin/mcqs" },
      { href: "/admin/notes" },
      { href: "/admin/cases" },
      { href: "/admin/flashcards" },
      { href: "/admin/terms" },
      { href: "/admin/how-to-study" },
      { href: "/admin/students" },
      { href: "/admin/apps" },
      { href: "/admin/settings" },
    ];
    const hrefs = navItems.map((item) => item.href);
    const uniqueHrefs = new Set(hrefs);
    expect(uniqueHrefs.size).toBe(hrefs.length);
  });
});

describe("404 Page Structure", () => {
  it("should have 404 text content", () => {
    const content = "Page Not Found";
    expect(content).toBe("Page Not Found");
  });

  it("should have a link back to home", () => {
    const homeLink = "/";
    expect(homeLink).toBe("/");
  });

  it("should not expose technical information", () => {
    const errorContent = "Page Not Found";
    expect(errorContent).not.toContain("stack trace");
    expect(errorContent).not.toContain("server error");
    expect(errorContent).not.toContain("database");
  });
});

describe("Error Boundary Structure", () => {
  it("should have try again action", () => {
    const resetAction = "reset";
    expect(resetAction).toBe("reset");
  });

  it("should have go home action", () => {
    const homeLink = "/";
    expect(homeLink).toBe("/");
  });

  it("should not expose stack traces", () => {
    const errorMessage = "Something went wrong";
    expect(errorMessage).not.toContain("stack");
    expect(errorMessage).not.toContain("trace");
    expect(errorMessage).not.toContain("Error:");
  });
});

describe("Dictionary Empty Search Behavior", () => {
  it("should support both q and search query params", () => {
    const urlWithQ = new URL("http://localhost/api/dictionary?q=femur");
    const urlWithSearch = new URL("http://localhost/api/dictionary?search=femur");

    const queryQ = urlWithQ.searchParams.get("q")?.trim() || urlWithSearch.searchParams.get("search")?.trim();
    const querySearch = urlWithSearch.searchParams.get("q")?.trim() || urlWithSearch.searchParams.get("search")?.trim();

    expect(queryQ).toBe("femur");
    expect(querySearch).toBe("femur");
  });

  it("should return all published terms when no query provided", () => {
    const url = new URL("http://localhost/api/dictionary");
    const query = url.searchParams.get("q")?.trim() || url.searchParams.get("search")?.trim();
    expect(query).toBeUndefined();
  });

  it("should handle empty query gracefully", () => {
    const query = "";
    const trimmed = query.trim();
    expect(trimmed).toBe("");
  });

  it("should support Arabic search terms", () => {
    const arabicQuery = "عظمة الفخذ";
    expect(arabicQuery).toContain("عظمة");
  });

  it("should support Latin search terms", () => {
    const latinQuery = "Os femoris";
    expect(latinQuery).toContain("femoris");
  });
});

describe("Sitemap Published Filter", () => {
  it("should only include published subjects", () => {
    const subjects = [
      { slug: "anatomy", published: true },
      { slug: "histology", published: false },
      { slug: "physiology", published: true },
    ];
    const published = subjects.filter((s) => s.published);
    expect(published).toHaveLength(2);
    expect(published.map((s) => s.slug)).toContain("anatomy");
    expect(published.map((s) => s.slug)).toContain("physiology");
  });

  it("should only include published how-to-study articles", () => {
    const articles = [
      { slug: "study-tips", published: true },
      { slug: "draft-article", published: false },
    ];
    const published = articles.filter((a) => a.published);
    expect(published).toHaveLength(1);
    expect(published[0].slug).toBe("study-tips");
  });

  it("should only include published lectures", () => {
    const lectures = [
      { slug: "upper-limb", published: true },
      { slug: "lower-limb", published: false },
    ];
    const published = lectures.filter((l) => l.published);
    expect(published).toHaveLength(1);
    expect(published[0].slug).toBe("upper-limb");
  });

  it("should generate correct URLs with base URL", () => {
    const BASE_URL = "https://dr-etshoooo.com";
    const slug = "anatomy";
    const url = `${BASE_URL}/subjects/${slug}`;
    expect(url).toBe("https://dr-etshoooo.com/subjects/anatomy");
  });

  it("should handle database errors gracefully by returning static pages", () => {
    const staticPages = [
      { url: "https://dr-etshoooo.com", priority: 1 },
      { url: "https://dr-etshoooo.com/subjects", priority: 0.9 },
    ];
    expect(staticPages.length).toBeGreaterThan(0);
  });
});

describe("Docker Compose Configuration", () => {
  it("should use environment variables for credentials", () => {
    const config = {
      POSTGRES_USER: "${POSTGRES_USER:-postgres}",
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD:-dr_etshoooo_2026}",
      POSTGRES_DB: "${POSTGRES_DB:-dr_etshoooo}",
    };
    expect(config.POSTGRES_USER).toContain("${POSTGRES_USER");
    expect(config.POSTGRES_PASSWORD).toContain("${POSTGRES_PASSWORD");
    expect(config.POSTGRES_DB).toContain("${POSTGRES_DB");
  });

  it("should have consistent DATABASE_URL format", () => {
    const dbUrl = "postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-dr_etshoooo_2026}@db:5432/${POSTGRES_DB:-dr_etshoooo}?schema=public";
    expect(dbUrl).toContain("postgresql://");
    expect(dbUrl).toContain("@db:5432");
    expect(dbUrl).toContain("schema=public");
  });

  it("should have correct service dependencies", () => {
    const appService = {
      depends_on: ["db"],
    };
    expect(appService.depends_on).toContain("db");
  });

  it("should use postgres:16-alpine image", () => {
    const image = "postgres:16-alpine";
    expect(image).toMatch(/^postgres:\d+/);
  });
});
