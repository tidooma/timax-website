import crypto from "crypto";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE = "timax_admin";
export const SESSION_MAX_AGE_SECONDS = 60 * 30;
export type AdminRole = "SUPER_ADMIN" | "EDITOR" | "MODERATOR";

type SessionPayload = {
  userId: string;
  username: string;
  role: AdminRole;
  permissions: Record<string, boolean>;
  iat: number;
  exp: number;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters.");
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createAdminToken(user: { id: string; username: string; role: AdminRole; permissions?: Record<string, boolean> }) {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({ userId: user.id, username: user.username, role: user.role, permissions: user.permissions ?? {}, iat: now, exp: now + SESSION_MAX_AGE_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string): SessionPayload | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (!data.userId || !data.username || !["SUPER_ADMIN", "EDITOR", "MODERATOR"].includes(data.role)) return null;
    data.permissions = data.permissions ?? {};
    return data.exp > Math.floor(Date.now() / 1000) ? data : null;
  } catch {
    return null;
  }
}

export async function getAdminFromCookies() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function isAdminFromCookies() {
  return Boolean(await getAdminFromCookies());
}

export function getAdminFromRequest(request: NextRequest) {
  return verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function isAdminRequest(request: NextRequest, requiredPermission?: string) {
  const session = getAdminFromRequest(request);
  if (!session) return false;

  const path = request.nextUrl.pathname;
  if (process.env.NODE_ENV !== "production") {
    console.log("User permissions:", session.permissions);
    console.log("Required permission:", requiredPermission ?? "path-based");
  }
  void auditAdminAction({ request, userId: session.userId, username: session.username, action: `${request.method}_ACCESS`, entity: path }).catch(() => undefined);
  if (session.role === "SUPER_ADMIN") return true;
  if (requiredPermission) return session.permissions[requiredPermission] === true;
  if (session.role === "MODERATOR") return path.startsWith("/api/admin/orders") && request.method === "GET" && session.permissions["orders.view"] === true;
  if (path.includes("/users") || path.includes("/security")) return false;
  if (session.role !== "EDITOR") return false;

  const permission = path.startsWith("/api/admin/orders")
    ? request.method === "GET" ? "orders.view" : "orders.manage"
    : path.includes("/editors") ? "content.editors.edit"
      : path.includes("/portfolio") ? "content.portfolio.edit"
        : path.includes("/services") ? "content.pricing.edit"
          : path.includes("/reviews") ? "content.reviews.edit"
              : path.includes("hero-banner") ? "content.hero.edit"
                : path.includes("/sections") ? "content.sections.edit"
              : null;

  return Boolean(permission && session.permissions[permission] === true);
}

export async function auditAdminAction(input: {
  request?: NextRequest;
  userId?: string;
  username: string;
  action: string;
  entity?: string;
  details?: string;
}) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      username: input.username,
      action: input.action,
      entity: input.entity,
      details: input.details,
      ipAddress: input.request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? input.request?.headers.get("x-real-ip"),
      userAgent: input.request?.headers.get("user-agent")
    }
  });
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS
};
