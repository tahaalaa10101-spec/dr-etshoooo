import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { getStorage, validateFileType, validateFileSize, generateSafeFilename, getFileType } from "@/lib/storage";
import { apiError, apiSuccess, unauthorized, serverError } from "@/lib/errors";

const UPLOAD_DIR = "uploads";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return unauthorized("Admin access required");
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { rateLimit } = await import("@/lib/rate-limit");
    const rate = rateLimit(`upload:${ip}`, 10, 60000);
    if (!rate.success) return apiError("Rate limit exceeded", 429);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file provided");
    }

    // Validate file type
    if (!validateFileType(file.type)) {
      return apiError("File type not allowed. Allowed: JPEG, PNG, WebP, GIF, PDF");
    }

    // Validate file size
    const fileType = getFileType(file.type);
    if (!validateFileSize(file.size, fileType)) {
      const maxSize = fileType === "image" ? "5MB" : "20MB";
      return apiError(`File too large. Maximum size: ${maxSize}`);
    }

    // Generate safe filename
    const safeName = generateSafeFilename(file.name);
    const folder = fileType === "image" ? "images" : "documents";
    const key = `${UPLOAD_DIR}/${folder}/${safeName}`;

    // Convert to buffer and upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorage();
    const result = await storage.upload(key, buffer, file.type);

    return apiSuccess({
      url: result.url,
      key: result.key,
      size: result.size,
      contentType: result.contentType,
      name: file.name,
    }, 201);
  } catch (error) {
    console.error("Upload error:", error);
    return serverError();
  }
}
