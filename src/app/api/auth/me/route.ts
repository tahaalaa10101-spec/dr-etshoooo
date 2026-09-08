import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { apiError, apiSuccess, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return apiError("Not authenticated", 401);
    }

    return apiSuccess({
      user: { id: user.userId, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return serverError();
  }
}
