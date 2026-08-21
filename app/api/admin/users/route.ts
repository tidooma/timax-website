import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { auditAdminAction, getAdminFromRequest, isAdminRequest, type AdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roles: AdminRole[] = ["SUPER_ADMIN", "EDITOR", "MODERATOR"];
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/;

function superAdmin(request: NextRequest) {
  const session = getAdminFromRequest(request);
  return session && session.username === "tima" && session.role === "SUPER_ADMIN" && isAdminRequest(request) ? session : null;
}

export async function GET(request: NextRequest) {
  if (!superAdmin(request)) return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
  const users = await prisma.adminUser.findMany({ orderBy: { username: "asc" }, select: { id: true, username: true, role: true, isActive: true, twoFactorEnabled: true, permissions: true, lastLoginAt: true, createdAt: true } });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const session = superAdmin(request);
  if (!session) return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string; role?: AdminRole; permissions?: Record<string, boolean> } | null;
  if (!body?.username || !body.password || !passwordPattern.test(body.password) || !body.role || !roles.includes(body.role)) {
    return NextResponse.json({ message: "Укажите логин, сильный пароль и корректную роль." }, { status: 400 });
  }

  const user = await prisma.adminUser.create({ data: { username: body.username.trim().toLowerCase(), passwordHash: await bcrypt.hash(body.password, 12), role: body.role, permissions: JSON.stringify(body.permissions ?? {}) } });
  await auditAdminAction({ request, userId: session.userId, username: session.username, action: "USER_CREATED", entity: user.username });
  return NextResponse.json({ ok: true }, { status: 201 });
}
