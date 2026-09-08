import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { apiError, apiSuccess, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return unauthorized();

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    const resolvedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        let name = "";
        let slug = "";
        try {
          if (fav.itemType === "subject") {
            const item = await prisma.subject.findUnique({ where: { id: fav.itemId }, select: { name: true, slug: true } });
            name = item?.name || "";
            slug = item?.slug ? `/subjects/${item.slug}` : "";
          } else if (fav.itemType === "lecture") {
            const item = await prisma.lecture.findUnique({ where: { id: fav.itemId }, select: { title: true, slug: true } });
            name = item?.title || "";
            slug = item?.slug ? `/lectures/${item.slug}` : "";
          } else if (fav.itemType === "note") {
            const item = await prisma.note.findUnique({ where: { id: fav.itemId }, select: { title: true } });
            name = item?.title || "";
          } else if (fav.itemType === "mcq") {
            const item = await prisma.mcq.findUnique({ where: { id: fav.itemId }, select: { question: true } });
            name = item?.question?.substring(0, 80) || "";
          } else if (fav.itemType === "clinicalCase") {
            const item = await prisma.clinicalCase.findUnique({ where: { id: fav.itemId }, select: { title: true } });
            name = item?.title || "";
          }
        } catch {}
        return { ...fav, name, slug };
      })
    );

    return apiSuccess(resolvedFavorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
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

    const existing = await prisma.favorite.findFirst({
      where: { userId: user.userId, itemType, itemId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return apiSuccess({ favorited: false });
    }

    await prisma.favorite.create({ data: { userId: user.userId, itemType, itemId } });
    return apiSuccess({ favorited: true }, 201);
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return serverError();
  }
}
