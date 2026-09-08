import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { apiError, apiSuccess, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return unauthorized();

    const progress = await prisma.progress.findMany({
      where: { userId: user.userId },
      orderBy: { updatedAt: "desc" },
    });

    return apiSuccess(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const { subjectId, percentage } = body;

    if (!subjectId) return apiError("subjectId is required");

    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) return apiError("Subject not found", 404);

    const progress = await prisma.progress.upsert({
      where: { userId_subjectId: { userId: user.userId, subjectId } },
      update: { percentage: percentage ?? 0 },
      create: { userId: user.userId, subjectId, percentage: percentage ?? 0 },
    });

    return apiSuccess(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return serverError();
  }
}
