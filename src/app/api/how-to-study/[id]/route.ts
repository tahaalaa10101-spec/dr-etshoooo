import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { howToStudySchema } from "@/lib/validation";
import { apiError, apiSuccess, unauthorized, notFound, serverError } from "@/lib/errors";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUser();
    const isAdmin = user?.role === "admin";

    const where: Record<string, unknown> = isAdmin
      ? { OR: [{ id }, { slug: id }] }
      : { AND: [{ OR: [{ id }, { slug: id }] }, { published: true }] };

    const item = await prisma.howToStudy.findFirst({
      where,
      include: { subject: { select: { id: true, name: true, slug: true } } },
    });
    if (!item) return notFound("Article not found");
    return apiSuccess(item);
  } catch (error) {
    console.error("Error fetching how-to-study:", error);
    return serverError();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const parsed = howToStudySchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const existing = await prisma.howToStudy.findUnique({ where: { id } });
    if (!existing) return notFound("Article not found");

    const item = await prisma.howToStudy.update({ where: { id }, data: parsed.data });
    return apiSuccess(item);
  } catch (error) {
    console.error("Error updating how-to-study:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const existing = await prisma.howToStudy.findUnique({ where: { id } });
    if (!existing) return notFound("Article not found");

    await prisma.howToStudy.delete({ where: { id } });
    return apiSuccess({ message: "Article deleted" });
  } catch (error) {
    console.error("Error deleting how-to-study:", error);
    return serverError();
  }
}
