import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const [years, subjects, lectures, mcqs, notes, cases, terms] = await Promise.all([
      prisma.academicYear.count({ where: { published: true } }),
      prisma.subject.count({ where: { published: true } }),
      prisma.lecture.count({ where: { published: true } }),
      prisma.mcq.count({ where: { published: true } }),
      prisma.note.count({ where: { published: true } }),
      prisma.clinicalCase.count({ where: { published: true } }),
      prisma.medicalTerm.count({ where: { published: true } }),
    ]);

    return apiSuccess({ years, subjects, lectures, mcqs, notes, cases, terms });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return serverError();
  }
}
