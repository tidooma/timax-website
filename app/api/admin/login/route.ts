import bcrypt from "bcryptjs";
import { verifySync } from "otplib";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, auditAdminAction, createAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const attempts = new Map<string, { count: number; startedAt: number; lockedUntil?: number }>();
const windowMs = 15 * 60 * 1000;

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  const now = Date.now();
  const attempt = attempts.get(key);
  if (attempt?.lockedUntil && attempt.lockedUntil > now) {
    return NextResponse.json({ message: "Слишком много попыток. Попробуйте через 15 минут." }, { status: 429 });
  }
  if (attempt && now - attempt.startedAt > windowMs) attempts.delete(key);

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string; code?: string } | null;
  const username = body?.username?.trim().toLowerCase();
  const user = username ? await prisma.adminUser.findUnique({ where: { username } }) : null;
  const passwordMatches = Boolean(user && body?.password && (await bcrypt.compare(body.password, user.passwordHash)));

  if (!user || !user.isActive || !passwordMatches) {
    const current = attempts.get(key) ?? { count: 0, startedAt: now };
    current.count += 1;
    if (current.count >= 5) current.lockedUntil = now + windowMs;
    attempts.set(key, current);
    await auditAdminAction({ request, userId: user?.id, username: username || "unknown", action: "LOGIN_FAILED", entity: "AdminUser" }).catch(() => undefined);
    return NextResponse.json({ message: "Неверные данные для входа." }, { status: 401 });
  }

  if (user.twoFactorEnabled) {
    const verification = body?.code && user.twoFactorSecret
      ? verifySync({ token: body.code, secret: user.twoFactorSecret })
      : { valid: false };
    if (!verification.valid) {
      return NextResponse.json({ message: "Введите корректный код двухфакторной аутентификации." }, { status: 401 });
    }
  }

  attempts.delete(key);
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await auditAdminAction({ request, userId: user.id, username: user.username, action: "LOGIN_SUCCESS", entity: "AdminUser" });

  const response = NextResponse.json({ ok: true, role: user.role, mustChangePassword: user.mustChangePassword && user.twoFactorEnabled });
  let permissions: Record<string, boolean> = {};
  try { permissions = JSON.parse(user.permissions) as Record<string, boolean>; } catch { permissions = {}; }
  response.cookies.set(ADMIN_COOKIE, createAdminToken({ id: user.id, username: user.username, role: user.role, permissions }), adminCookieOptions);
  return response;
}
