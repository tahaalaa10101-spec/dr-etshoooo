import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { apiError, apiSuccess, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return unauthorized();

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    const resolvedBookmarks = await Promise.all(
      bookmarks.map(async (bm) => {
        let name = "";
        let slug = "";
        try {
          if (bm.itemType === "lecture") {
            const item = await prisma.lecture.findUnique({ where: { id: bm.itemId }, select: { title: true, slug: true } });
            name = item?.title || "";
            slug = item?.slug ? `/lectures/${item.slug}` : "";
          } else if (bm.itemType === "note") {
            const item = await prisma.note.findUnique({ where: { id: bm.itemId }, select: { title: true } });
            name = item?.title || "";
          } else if (bm.itemType === "mcq") {
            const item = await prisma.mcq.findUnique({ where: { id: bm.itemId }, select: { question: true } });
            name = item?.question?.substring(0, 80) || "";
          } else if (bm.itemType === "exam") {
            const item = await prisma.exam.findUnique({ where: { id: bm.itemId }, select: { title: true } });
            name = item?.title || "";
          } else if (bm.itemType === "essay") {
            const item = await prisma.essay.findUnique({ where: { id: bm.itemId }, select: { question: true } });
            name = item?.question?.substring(0, 80) || "";
          }
        } catch {}
        return { ...bm, name, slug };
      })
    );

    return apiSuccess(resolvedBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const { itemType, itemId } = body;

    if (!itemType || !itemId) return apiError("itemType and itemId are required");

    const existing = await prisma.bookmark.findFirst({
      where: { userId: user.userId, itemType, itemId },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return apiSuccess({ bookmarked: false });
    }

    await prisma.bookmark.create({ data: { userId: user.userId, itemType, itemId } });
    return apiSuccess({ bookmarked: true }, 201);
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return serverError();
  }
}
