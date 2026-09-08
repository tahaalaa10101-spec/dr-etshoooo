import { prisma } from "./prisma";

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

export interface StorageProvider {
  upload(key: string, file: Buffer, contentType: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

// Local filesystem storage for development
class LocalStorage implements StorageProvider {
  private uploadDir: string;

  constructor(uploadDir: string = "./public/uploads") {
    this.uploadDir = uploadDir;
  }

  async upload(key: string, file: Buffer, contentType: string): Promise<UploadResult> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(this.uploadDir, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file);
    return {
      url: `/uploads/${key}`,
      key,
      size: file.length,
      contentType,
    };
  }

  async delete(key: string): Promise<void> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(this.uploadDir, key);
    await fs.unlink(filePath).catch(() => {});
  }

  async getSignedUrl(key: string): Promise<string> {
    return `/uploads/${key}`;
  }
}

// S3-compatible storage for production
class S3Storage implements StorageProvider {
  private bucket: string;
  private endpoint: string;
  private accessKey: string;
  private secretKey: string;
  private region: string;

  constructor() {
    this.bucket = process.env.STORAGE_BUCKET || "";
    this.endpoint = process.env.STORAGE_ENDPOINT || "";
    this.accessKey = process.env.STORAGE_ACCESS_KEY || "";
    this.secretKey = process.env.STORAGE_SECRET_KEY || "";
    this.region = process.env.STORAGE_REGION || "auto";
  }

  async upload(key: string, file: Buffer, contentType: string): Promise<UploadResult> {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });

    await client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    }));

    const url = this.endpoint
      ? `${this.endpoint}/${this.bucket}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    return { url, key, size: file.length, contentType };
  }

  async delete(key: string): Promise<void> {
    const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });

    await client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
    const client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });

    return getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn }
    );
  }
}

let storageInstance: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!storageInstance) {
    const provider = process.env.STORAGE_PROVIDER || "local";
    if (provider === "s3") {
      storageInstance = new S3Storage();
    } else {
      storageInstance = new LocalStorage();
    }
  }
  return storageInstance;
}

// File validation
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];
const ALLOWED_UPLOAD_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

const MAX_FILE_SIZES: Record<string, number> = {
  image: 5 * 1024 * 1024,    // 5MB
  document: 20 * 1024 * 1024, // 20MB
};

export function validateFileType(contentType: string): boolean {
  return ALLOWED_UPLOAD_TYPES.includes(contentType);
}

export function validateFileSize(size: number, type: "image" | "document"): boolean {
  const maxSize = MAX_FILE_SIZES[type] || MAX_FILE_SIZES.document;
  return size <= maxSize;
}

export function generateSafeFilename(originalFilename: string): string {
  const ext = originalFilename.split(".").pop()?.toLowerCase() || "bin";
  const random = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  return `${timestamp}-${random}.${ext}`;
}

export function getFileType(contentType: string): "image" | "document" {
  if (ALLOWED_IMAGE_TYPES.includes(contentType)) return "image";
  return "document";
}

export { ALLOWED_UPLOAD_TYPES, MAX_FILE_SIZES };
