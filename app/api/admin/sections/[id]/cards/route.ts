import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    order?: number;
  } | null;

  if (!body?.title?.trim()) {
    return NextResponse.json({ message: "Введите заголовок карточки." }, { status: 400 });
  }

  const card = await prisma.customCard.create({
    data: {
      sectionId: id,
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      description: body.description?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      linkUrl: body.linkUrl?.trim() || null,
      order: Number.isFinite(body.order) ? Number(body.order) : 0
    }
  });

  revalidatePath("/");
  return NextResponse.json(card, { status: 201 });
}
