import { NextResponse } from "next/server";

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiSuccess(data: unknown, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiPaginated(data: unknown[], pagination: { page: number; limit: number; total: number; totalPages: number }) {
  return NextResponse.json({ success: true, data, pagination });
}

export function unauthorized(message: string = "Unauthorized") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbidden(message: string = "Admin access required") {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function notFound(message: string = "Not found") {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function conflict(message: string = "Resource already exists") {
  return NextResponse.json({ success: false, error: message }, { status: 409 });
}

export function serverError(message: string = "Internal server error") {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
