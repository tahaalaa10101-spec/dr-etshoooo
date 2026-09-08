import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();
    const isAdmin = user?.role === "admin";

    const publishedFilter = isAdmin ? {} : { published: true };

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        lectures: { where: publishedFilter, orderBy: { order: "asc" } },
        mcqs: { where: publishedFilter },
        essays: { where: publishedFilter },
        notes: { where: publishedFilter },
        clinicalCases: { where: publishedFilter },
        flashcards: { where: publishedFilter },
        exams: { where: publishedFilter },
      },
    });

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }

    const content = {
      lectures: topic.lectures,
      mcqs: topic.mcqs,
      essays: topic.essays,
      notes: topic.notes,
      clinicalCases: topic.clinicalCases,
      flashcards: topic.flashcards,
      exams: topic.exams,
    };

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
