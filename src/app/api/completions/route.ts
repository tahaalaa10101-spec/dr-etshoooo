import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { apiError, apiSuccess, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return unauthorized();

    const completions = await prisma.completion.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(completions);
  } catch (error) {
    console.error("Error fetching completions:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const { lectureId } = body;

    if (!lectureId) return apiError("lectureId is required");

    const lecture = await prisma.lecture.findUnique({ where: { id: lectureId } });
    if (!lecture) return apiError("Lecture not found", 404);

    const existing = await prisma.completion.findFirst({
      where: { userId: user.userId, lectureId },
    });

    if (existing) {
      await prisma.completion.delete({ where: { id: existing.id } });
      return apiSuccess({ completed: false });
    }

    await prisma.completion.create({
      data: { userId: user.userId, lectureId },
    });

    return apiSuccess({ completed: true }, 201);
  } catch (error) {
    console.error("Error toggling completion:", error);
    return serverError();
  }
}
