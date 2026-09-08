import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { essaySchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiPaginated, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const topicId = searchParams.get("topicId");
    const search = searchParams.get("search");

    const user = await getUser();
    const isAdmin = user?.role === "admin";

    const where: Record<string, unknown> = { published: true };
    if (topicId) where.topicId = topicId;
    if (search) where.question = { contains: search, mode: "insensitive" };

    const select: Record<string, unknown> = {
      id: true, question: true, difficulty: true, topicId: true, published: true,
      createdAt: true, updatedAt: true,
      topic: { select: { id: true, name: true, slug: true, subject: { select: { id: true, name: true } } } },
    };
    if (isAdmin) {
      select.modelAnswer = true;
      select.explanation = true;
    }

    const [essays, total] = await Promise.all([
      prisma.essay.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, select }),
      prisma.essay.count({ where }),
    ]);

    return apiPaginated(essays, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching essays:", error);
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
    const parsed = essaySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { question, modelAnswer, explanation, difficulty, topicId, published } = parsed.data;

    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) return apiError("Topic not found");

    const essay = await prisma.essay.create({
      data: { question, modelAnswer, explanation, difficulty: difficulty ?? "medium", topicId, published: published ?? true },
    });

    return apiSuccess(essay, 201);
  } catch (error) {
    console.error("Error creating essay:", error);
    return serverError();
  }
}
