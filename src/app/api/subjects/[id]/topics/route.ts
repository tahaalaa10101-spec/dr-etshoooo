import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topics = await prisma.topic.findMany({
      where: { subjectId: id, published: true },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { lectures: true, mcqs: true, essays: true, notes: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
