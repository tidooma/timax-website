import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { DEFAULT_CONTENT, type ContentKey } from "@/lib/content";
import { auditAdminAction, getAdminFromRequest, isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function keyFromRequest(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key") as ContentKey | null;
  return key && key in DEFAULT_CONTENT ? key : null;
}

async function authorize(request: NextRequest, key: ContentKey) {
  const session = getAdminFromRequest(request);
  if (!session) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !user.isActive) return null;
  if (!isAdminRequest(request, `content.${key}.edit`)) return null;
  return { session, user };
}

export async function GET(request: NextRequest) {
  const key = keyFromRequest(request);
  if (!key) return NextResponse.json({ message: "Неизвестный раздел." }, { status: 400 });
  const access = await authorize(request, key);
  if (!access) return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
  const row = await prisma.siteContent.findUnique({ where: { key }, include: { updatedBy: { select: { username: true } } } });
  return NextResponse.json({ key, data: row?.data ?? DEFAULT_CONTENT[key], updatedAt: row?.updatedAt ?? null, updatedBy: row?.updatedBy?.username ?? null });
}

export async function PUT(request: NextRequest) {
  const key = keyFromRequest(request);
  if (!key) return NextResponse.json({ message: "Неизвестный раздел." }, { status: 400 });
  const access = await authorize(request, key);
  if (!access) return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { data?: unknown } | null;
  if (!body || typeof body.data !== "object" || body.data === null) return NextResponse.json({ message: "Некорректные данные." }, { status: 400 });
  await prisma.siteContent.upsert({ where: { key }, create: { key, data: body.data, updatedById: access.user.id }, update: { data: body.data, updatedById: access.user.id } });
  await auditAdminAction({ request, userId: access.user.id, username: access.user.username, action: "CONTENT_UPDATED", entity: key });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const key = keyFromRequest(request);
  if (!key) return NextResponse.json({ message: "Неизвестный раздел." }, { status: 400 });
  const access = await authorize(request, key);
  if (!access) return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
  await prisma.siteContent.deleteMany({ where: { key } });
  await auditAdminAction({ request, userId: access.user.id, username: access.user.username, action: "CONTENT_RESET", entity: key });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
