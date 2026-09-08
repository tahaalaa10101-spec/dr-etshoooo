import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalSubjects,
      totalLectures,
      totalTopics,
      totalMcqs,
      totalEssays,
      totalNotes,
      totalClinicalCases,
      totalFlashcards,
      totalExams,
      totalTerms,
      totalYears,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subject.count(),
      prisma.lecture.count(),
      prisma.topic.count(),
      prisma.mcq.count(),
      prisma.essay.count(),
      prisma.note.count(),
      prisma.clinicalCase.count(),
      prisma.flashcard.count(),
      prisma.exam.count(),
      prisma.medicalTerm.count(),
      prisma.academicYear.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalSubjects,
        totalLectures,
        totalTopics,
        totalMcqs,
        totalEssays,
        totalNotes,
        totalClinicalCases,
        totalFlashcards,
        totalExams,
        totalTerms,
        totalYears,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
