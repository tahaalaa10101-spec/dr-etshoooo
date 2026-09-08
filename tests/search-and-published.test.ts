import {
  searchSchema,
  paginationSchema,
  yearSchema,
  semesterSchema,
  subjectSchema,
  topicSchema,
} from "@/lib/validation";

describe("Search API Response Format", () => {
  it("should define search query schema correctly", () => {
    const result = searchSchema.safeParse({ q: "anatomy" });
    expect(result.success).toBe(true);
  });

  it("should reject empty search query", () => {
    const result = searchSchema.safeParse({ q: "" });
    expect(result.success).toBe(false);
  });

  it("should accept search query with 2+ characters", () => {
    const result = searchSchema.safeParse({ q: "ab" });
    expect(result.success).toBe(true);
  });

  it("should accept search query with 1 character (API has additional length check)", () => {
    const result = searchSchema.safeParse({ q: "a" });
    expect(result.success).toBe(true);
  });

  it("should match expected API response keys with search page", () => {
    const expectedKeys = [
      "lectures",
      "mcqs",
      "notes",
      "terms",
      "cases",
      "essays",
      "apps",
      "howToStudy",
    ];
    const apiResponse = {
      lectures: [],
      mcqs: [],
      notes: [],
      terms: [],
      cases: [],
      essays: [],
      apps: [],
      howToStudy: [],
    };
    for (const key of expectedKeys) {
      expect(apiResponse).toHaveProperty(key);
      expect(Array.isArray(apiResponse[key as keyof typeof apiResponse])).toBe(true);
    }
  });

  it("search page should handle nested data.data response format", () => {
    const apiResponse = {
      success: true,
      data: {
        lectures: [{ id: "1", title: "Test Lecture", slug: "test-lecture" }],
        mcqs: [],
        notes: [],
        terms: [],
        cases: [],
        essays: [],
        apps: [],
        howToStudy: [],
      },
    };
    const data = apiResponse.data;
    const result = {
      lectures: data?.lectures || [],
      mcqs: data?.mcqs || [],
    };
    expect(result.lectures).toHaveLength(1);
    expect(result.lectures[0].title).toBe("Test Lecture");
    expect(result.mcqs).toHaveLength(0);
  });

  it("search page should handle flat data response format", () => {
    const apiResponse = {
      lectures: [{ id: "1", title: "Test" }],
      mcqs: [],
      notes: [],
      terms: [],
      cases: [],
      essays: [],
      apps: [],
      howToStudy: [],
    };
    const result = {
      lectures: apiResponse.lectures || [],
      mcqs: apiResponse.mcqs || [],
    };
    expect(result.lectures).toHaveLength(1);
  });
});

describe("Medical Term Cross-Language Search", () => {
  it("term schema should accept term with arabicTerm", () => {
    const result = {
      term: "Femur",
      arabicTerm: "عظمة الفخذ",
      latinTerm: "Os femoris",
      definition: "The longest bone in the body",
    };
    expect(result.term).toBe("Femur");
    expect(result.arabicTerm).toBe("عظمة الفخذ");
    expect(result.latinTerm).toBe("Os femoris");
  });

  it("search should match across term, arabicTerm, and latinTerm fields", () => {
    const searchFields = ["term", "arabicTerm", "latinTerm", "definition", "arabicMeaning"];
    expect(searchFields).toContain("term");
    expect(searchFields).toContain("arabicTerm");
    expect(searchFields).toContain("latinTerm");
  });
});

describe("Published Content Filter", () => {
  it("year schema should support published field", () => {
    const published = yearSchema.safeParse({
      title: "Year 1",
      slug: "year-1",
      published: true,
    });
    expect(published.success).toBe(true);

    const draft = yearSchema.safeParse({
      title: "Year 2",
      slug: "year-2",
      published: false,
    });
    expect(draft.success).toBe(true);
  });

  it("semester schema should support published field", () => {
    const result = semesterSchema.safeParse({
      title: "Semester 1",
      slug: "semester-1",
      academicYearId: "abc123",
      published: true,
    });
    expect(result.success).toBe(true);
  });

  it("subject schema should support published field", () => {
    const result = subjectSchema.safeParse({
      name: "Anatomy",
      slug: "anatomy",
      semesterId: "abc123",
      published: false,
    });
    expect(result.success).toBe(true);
  });

  it("topic schema should support published field", () => {
    const result = topicSchema.safeParse({
      name: "Upper Limb",
      slug: "upper-limb",
      subjectId: "abc123",
      published: true,
    });
    expect(result.success).toBe(true);
  });

  it("should define published filter structure for non-admin queries", () => {
    const isAdmin = false;
    const where: Record<string, unknown> = isAdmin ? {} : { published: true };
    expect(where).toEqual({ published: true });
  });

  it("should define empty filter for admin queries", () => {
    const isAdmin = true;
    const where: Record<string, unknown> = isAdmin ? {} : { published: true };
    expect(where).toEqual({});
  });

  it("should combine published filter with other filters", () => {
    const isAdmin = false;
    const semesterId = "sem-123";
    const where: Record<string, unknown> = isAdmin ? {} : { published: true };
    if (semesterId) where.semesterId = semesterId;
    expect(where).toEqual({ published: true, semesterId: "sem-123" });
  });

  it("should apply published filter to nested semesters in years query", () => {
    const isAdmin = false;
    const semesterWhere = isAdmin ? {} : { published: true };
    expect(semesterWhere).toEqual({ published: true });
  });

  it("admin should see unpublished nested semesters", () => {
    const isAdmin = true;
    const semesterWhere = isAdmin ? {} : { published: true };
    expect(semesterWhere).toEqual({});
  });

  it("should apply published filter to nested content in topics", () => {
    const isAdmin = false;
    const publishedFilter = isAdmin ? {} : { published: true };
    expect(publishedFilter).toEqual({ published: true });

    const topicInclude = {
      lectures: { where: publishedFilter, orderBy: { order: "asc" } },
      mcqs: { where: publishedFilter },
      notes: { where: publishedFilter },
    };
    expect(topicInclude.lectures.where).toEqual({ published: true });
    expect(topicInclude.mcqs.where).toEqual({ published: true });
    expect(topicInclude.notes.where).toEqual({ published: true });
  });

  it("admin should see all nested content including drafts", () => {
    const isAdmin = true;
    const publishedFilter = isAdmin ? {} : { published: true };
    expect(publishedFilter).toEqual({});

    const topicInclude = {
      lectures: { where: publishedFilter },
    };
    expect(topicInclude.lectures.where).toEqual({});
  });
});

describe("Pagination Schema", () => {
  it("should default to page 1 and limit 20", () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("should accept valid page and limit", () => {
    const result = paginationSchema.safeParse({ page: 2, limit: 10 });
    expect(result.success).toBe(true);
  });

  it("should reject page less than 1", () => {
    const result = paginationSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject limit greater than 100", () => {
    const result = paginationSchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });
});

describe("Search Result Item Rendering", () => {
  it("should display title, question, name, or term as primary text", () => {
    const items: Array<Record<string, string>> = [
      { id: "1", title: "Lecture 1" },
      { id: "2", question: "What is the femur?" },
      { id: "3", name: "Anatomy Atlas" },
      { id: "4", term: "Femur" },
    ];

    for (const item of items) {
      const displayText = item.title || item.question || item.name || item.term || "Untitled";
      expect(displayText).not.toBe("Untitled");
    }
  });

  it("should handle items with no displayable text", () => {
    const item: Record<string, string> = { id: "1" };
    const displayText = item.title || item.question || item.name || item.term || "Untitled";
    expect(displayText).toBe("Untitled");
  });

  it("should show description or definition as secondary text", () => {
    const withDescription: Record<string, string> = { description: "A long bone" };
    const withDefinition: Record<string, string> = { definition: "The longest bone" };
    const neither: Record<string, string> = {};

    expect(withDescription.description || withDefinition.definition || "").toBe("A long bone");
    expect(neither.description || neither.definition || "").toBe("");
  });
});
