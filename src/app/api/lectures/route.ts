import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { lectureSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiPaginated, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const topicId = searchParams.get("topicId");
    const subjectId = searchParams.get("subjectId");
    const search = searchParams.get("search");

    const user = await getUser();
    const isAdmin = user?.role === "admin";
    const where: Record<string, unknown> = isAdmin ? {} : { published: true };
    if (topicId) where.topicId = topicId;
    if (subjectId) where.topic = { subjectId };
    if (search) where.title = { contains: search, mode: "insensitive" };

    const [lectures, total] = await Promise.all([
      prisma.lecture.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        select: {
          id: true, title: true, slug: true, description: true, videoUrl: true,
          pdfUrl: true, thumbnail: true, duration: true, order: true, published: true,
          createdAt: true, updatedAt: true, topicId: true,
          topic: { select: { id: true, name: true, slug: true, subject: { select: { id: true, name: true, slug: true } } } },
        },
      }),
      prisma.lecture.count({ where }),
    ]);

    return apiPaginated(lectures, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit(`api:${ip}`, 30, 60000);
    if (!rate.success) return apiError("Rate limit exceeded", 429);

    const body = await request.json();
    const parsed = lectureSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { title, slug, description, content, videoUrl, pdfUrl, thumbnail, topicId, duration, order, published } = parsed.data;

    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) return apiError("Topic not found");

    const existing = await prisma.lecture.findFirst({ where: { slug, topicId } });
    if (existing) return apiError("A lecture with this slug already exists in this topic", 409);

    const lecture = await prisma.lecture.create({
      data: { title, slug, description, content, videoUrl, pdfUrl, thumbnail, topicId, duration, order: order ?? 0, published: published ?? true },
    });

    return apiSuccess(lecture, 201);
  } catch (error) {
    console.error("Error creating lecture:", error);
    return serverError();
  }
}
