import QRCode from "qrcode";
import { generateSecret, generateURI, verifySync } from "otplib";
import { NextRequest, NextResponse } from "next/server";
import { auditAdminAction, getAdminFromRequest, isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function forbidden() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

async function getTargetUser(request: NextRequest, targetUserId?: string) {
  const session = getAdminFromRequest(request);
  if (!session || !isAdminRequest(request, "security.manage")) return null;
  if (!targetUserId || targetUserId === session.userId) {
    return prisma.adminUser.findUnique({ where: { id: session.userId } }).then((user) => ({ session, user }));
  }
  if (session.username !== "tima" || session.role !== "SUPER_ADMIN") return null;
  return prisma.adminUser.findUnique({ where: { id: targetUserId } }).then((user) => ({ session, user }));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { targetUserId?: string } | null;
  const access = await getTargetUser(request, body?.targetUserId);
  if (!access?.user) return forbidden();

  const secret = generateSecret();
  const uri = generateURI({ issuer: "Timax", label: access.user.username, secret });
  const qrCode = await QRCode.toDataURL(uri);
  return NextResponse.json({ secret, uri, qrCode });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { secret?: string; code?: string; targetUserId?: string } | null;
  const access = await getTargetUser(request, body?.targetUserId);
  if (!access?.user) return forbidden();
  const secret = body?.secret;
  const code = body?.code;
  if (!secret || !code || !verifySync({ token: code, secret }).valid) {
    return NextResponse.json({ message: "Неверный код подтверждения." }, { status: 400 });
  }

  await prisma.adminUser.update({ where: { id: access.user.id }, data: { twoFactorSecret: secret, twoFactorEnabled: true } });
  await auditAdminAction({ request, userId: access.session.userId, username: access.session.username, action: "2FA_ENABLED", entity: access.user.username });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { targetUserId?: string } | null;
  const access = await getTargetUser(request, body?.targetUserId);
  if (!access?.user) return forbidden();

  await prisma.adminUser.update({ where: { id: access.user.id }, data: { twoFactorSecret: null, twoFactorEnabled: false } });
  await auditAdminAction({ request, userId: access.session.userId, username: access.session.username, action: "2FA_DISABLED", entity: access.user.username });
  return NextResponse.json({ ok: true });
}
