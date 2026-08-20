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
  cards: Array<{
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    imageUrl: string | null;
    linkUrl: string | null;
    order: number;
  }>;
}) {
  return {
    ...section,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString()
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const sections = await prisma.customSection.findMany({
    orderBy: { order: "asc" },
    include: { cards: { orderBy: { order: "asc" } } }
  });

  return NextResponse.json(sections.map(serializeSection));
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    order?: number;
    isVisible?: boolean;
  } | null;

  if (!body?.title?.trim()) {
    return NextResponse.json({ message: "Введите название секции." }, { status: 400 });
  }

  const section = await prisma.customSection.create({
    data: {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      order: Number.isFinite(body.order) ? Number(body.order) : 10,
      isVisible: body.isVisible ?? true
    },
    include: { cards: true }
  });

  revalidatePath("/");
  return NextResponse.json(serializeSection(section), { status: 201 });
}
