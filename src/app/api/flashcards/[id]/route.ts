import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { apiSuccess, unauthorized, notFound, serverError } from "@/lib/errors";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const existing = await prisma.flashcard.findUnique({ where: { id } });
    if (!existing) return notFound("Flashcard not found");

    await prisma.flashcard.delete({ where: { id } });
    return apiSuccess({ message: "Flashcard deleted" });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return serverError();
  }
}
