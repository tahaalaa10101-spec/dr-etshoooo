import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        subject: true,
        lectures: { orderBy: { order: "asc" } },
        mcqs: true,
        essays: true,
        notes: true,
        clinicalCases: true,
        flashcards: true,
        exams: true,
      },
    });

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { topicSchema } = await import("@/lib/validation");
    const body = await request.json();
    const parsed = topicSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.topic.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }

    const topic = await prisma.topic.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: topic });
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.topic.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { message: "Topic deleted" } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
