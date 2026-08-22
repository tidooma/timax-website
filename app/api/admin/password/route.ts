import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { auditAdminAction, getAdminFromRequest, isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/;

export async function PUT(request: NextRequest) {
  const session = getAdminFromRequest(request);
  if (!session || !isAdminRequest(request, "change_password")) return NextResponse.json({ message: "Недостаточно прав для смены пароля." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as { currentPassword?: string; newPassword?: string } | null;
  if (!body?.currentPassword || !body.newPassword || !passwordPattern.test(body.newPassword)) {
    return NextResponse.json({ message: "Пароль должен содержать минимум 12 символов, прописную, строчную букву, цифру и спецсимвол." }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !(await bcrypt.compare(body.currentPassword, user.passwordHash))) {
    return NextResponse.json({ message: "Текущий пароль указан неверно." }, { status: 400 });
  }

  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(body.newPassword, 12), mustChangePassword: false } });
  await auditAdminAction({ request, userId: user.id, username: user.username, action: "PASSWORD_CHANGED", entity: "AdminUser" });
  return NextResponse.json({ ok: true });
}