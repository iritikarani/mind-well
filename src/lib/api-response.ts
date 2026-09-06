import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function zodErrorResponse(error: ZodError) {
  const first = error.issues[0];
  return errorResponse(first?.message ?? "Invalid input", 422);
}

export const isDev = process.env.NODE_ENV !== "production";
