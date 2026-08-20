import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

function serializeSection(section: {
  id: string;
  title: string;
  description: string | null;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  cards: Array<unknown>;
}) {
  return {
    ...section,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString()
  };
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  const section = await prisma.customSection.findUnique({
    where: { id },
    include: { cards: { orderBy: { order: "asc" } } }
  });

  if (!section) return NextResponse.json({ message: "Секция не найдена." }, { status: 404 });
  return NextResponse.json(serializeSection(section));
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    order?: number;
    isVisible?: boolean;
  } | null;

  if (!body?.title?.trim()) {
    return NextResponse.json({ message: "Введите название секции." }, { status: 400 });
  }

  const section = await prisma.customSection.update({
    where: { id },
    data: {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      order: Number.isFinite(body.order) ? Number(body.order) : 10,
      isVisible: body.isVisible ?? true
    },
    include: { cards: { orderBy: { order: "asc" } } }
  });

  revalidatePath("/");
  return NextResponse.json(serializeSection(section));
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  await prisma.customSection.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
