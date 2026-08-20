import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string; cardId: string }> };

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

async function findCard(id: string, cardId: string) {
  return prisma.customCard.findFirst({ where: { id: cardId, sectionId: id } });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id, cardId } = await params;
  if (!(await findCard(id, cardId))) return NextResponse.json({ message: "Карточка не найдена." }, { status: 404 });

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    order?: number;
  } | null;

  if (!body?.title?.trim()) return NextResponse.json({ message: "Введите заголовок карточки." }, { status: 400 });

  const card = await prisma.customCard.update({
    where: { id: cardId },
    data: {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      description: body.description?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      linkUrl: body.linkUrl?.trim() || null,
      order: Number.isFinite(body.order) ? Number(body.order) : 0
    }
  });

  revalidatePath("/");
  return NextResponse.json(card);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id, cardId } = await params;
  if (!(await findCard(id, cardId))) return NextResponse.json({ message: "Карточка не найдена." }, { status: 404 });

  await prisma.customCard.delete({ where: { id: cardId } });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
