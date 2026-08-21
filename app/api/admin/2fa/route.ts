import QRCode from "qrcode";
import { generateSecret, generateURI, verifySync } from "otplib";
import { NextRequest, NextResponse } from "next/server";
import { auditAdminAction, getAdminFromRequest, isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function forbidden() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const session = getAdminFromRequest(request);
  if (!session || !isAdminRequest(request)) return forbidden();

  const secret = generateSecret();
  const uri = generateURI({ issuer: "Timax", label: session.username, secret });
  const qrCode = await QRCode.toDataURL(uri);
  return NextResponse.json({ secret, uri, qrCode });
}

export async function PUT(request: NextRequest) {
  const session = getAdminFromRequest(request);
  if (!session || !isAdminRequest(request)) return forbidden();

  const body = (await request.json().catch(() => null)) as { secret?: string; code?: string } | null;
  if (!body?.secret || !body.code || !verifySync({ token: body.code, secret: body.secret })) {
    return NextResponse.json({ message: "Неверный код подтверждения." }, { status: 400 });
  }

  await prisma.adminUser.update({ where: { id: session.userId }, data: { twoFactorSecret: body.secret, twoFactorEnabled: true } });
  await auditAdminAction({ request, userId: session.userId, username: session.username, action: "2FA_ENABLED", entity: "AdminUser" });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const session = getAdminFromRequest(request);
  if (!session || !isAdminRequest(request)) return forbidden();

  await prisma.adminUser.update({ where: { id: session.userId }, data: { twoFactorSecret: null, twoFactorEnabled: false } });
  await auditAdminAction({ request, userId: session.userId, username: session.username, action: "2FA_DISABLED", entity: "AdminUser" });
  return NextResponse.json({ ok: true });
}
