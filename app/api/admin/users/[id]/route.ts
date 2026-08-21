import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { auditAdminAction, getAdminFromRequest, isAdminRequest, type AdminRole } from "@/lib/auth";
import { CONTENT_PERMISSION_KEYS } from "@/lib/content";
import { prisma } from "@/lib/prisma";

const roles: AdminRole[] = ["SUPER_ADMIN", "EDITOR", "MODERATOR"];

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = getAdminFromRequest(request);
  if (!session || session.username !== "tima" || session.role !== "SUPER_ADMIN" || !isAdminRequest(request)) return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { role?: AdminRole; isActive?: boolean; permissions?: Record<string, boolean>; password?: string } | null;
  if (!body || (body.role && !roles.includes(body.role))) return NextResponse.json({ message: "Некорректные данные." }, { status: 400 });
  const target = await prisma.adminUser.findUnique({ where: { id }, select: { username: true, role: true } });
  if (!target) return NextResponse.json({ message: "Пользователь не найден." }, { status: 404 });
  if (target.username === "tima" || target.role === "SUPER_ADMIN") return NextResponse.json({ message: "Супер-администратор не может быть ограничен." }, { status: 403 });

  const data: { role?: AdminRole; isActive?: boolean; permissions?: string; passwordHash?: string; mustChangePassword?: boolean } = {};
  if (body.role) data.role = body.role;
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (body.permissions) {
    const permissions = Object.fromEntries(CONTENT_PERMISSION_KEYS.map((permission) => [permission, body.permissions?.[permission] === true]));
    data.permissions = JSON.stringify(permissions);
  }
  if (body.password) {
    data.passwordHash = await bcrypt.hash(body.password, 12);
    data.mustChangePassword = true;
  }
  await prisma.adminUser.update({ where: { id }, data });
  await auditAdminAction({ request, userId: session.userId, username: session.username, action: body.permissions ? "PERMISSIONS_UPDATED" : "USER_UPDATED", entity: target.username, details: body.permissions ? data.permissions : undefined });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const session = getAdminFromRequest(request);
  if (!session || session.username !== "tima" || session.role !== "SUPER_ADMIN" || !isAdminRequest(request)) return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
  const { id } = await params;
  const target = await prisma.adminUser.findUnique({ where: { id }, select: { username: true, role: true } });
  if (target?.username === "tima" || target?.role === "SUPER_ADMIN") return NextResponse.json({ message: "Супер-администратор не может быть удалён." }, { status: 403 });
  if (id === session.userId) return NextResponse.json({ message: "Нельзя удалить текущий аккаунт." }, { status: 400 });
  await prisma.adminUser.delete({ where: { id } });
  await auditAdminAction({ request, userId: session.userId, username: session.username, action: "USER_DELETED", entity: id });
  return NextResponse.json({ ok: true });
}
