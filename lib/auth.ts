import crypto from "crypto";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "timax_admin";
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.ADMIN_SECRET || "timax-local-secret-change-me";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({ role: "admin", iat: Date.now() })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) return false;
  if (!crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      role?: string;
      iat?: number;
    };

    if (data.role !== "admin" || typeof data.iat !== "number") return false;
    return Date.now() - data.iat < WEEK_IN_SECONDS * 1000;
  } catch {
    return false;
  }
}

export async function isAdminFromCookies() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function isAdminRequest(request: NextRequest) {
  return verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function isValidAdminPassword(password: string) {
  return password === (process.env.ADMIN_PASSWORD || "timax2026");
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  path: "/",
  maxAge: WEEK_IN_SECONDS
};
