import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_ACCENT_COLOR = "#3B82F6";

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

function normalizeAccentColor(value?: string) {
  const color = value?.trim();
  return color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_ACCENT_COLOR;
}

function serializeEditor(editor: {
  id: string;
  name: string;
  avatar: string | null;
  description: string;
  accentColor: string;
  isActive: boolean;
  createdAt: Date;
}) {
  return {
    ...editor,
    createdAt: editor.createdAt.toISOString(),
    portfolioItems: []
  };
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    avatar?: string;
    description?: string;
    accentColor?: string;
    isActive?: boolean;
  } | null;

  if (!body?.name?.trim() || !body.description?.trim()) {
    return NextResponse.json({ message: "Заполните имя и описание." }, { status: 400 });
  }

  const editor = await prisma.editor.update({
    where: { id },
    data: {
      name: body.name.trim(),
      avatar: body.avatar?.trim() || null,
      description: body.description.trim(),
      accentColor: normalizeAccentColor(body.accentColor),
      isActive: body.isActive ?? true
    }
  });

  revalidatePath("/");
  return NextResponse.json(serializeEditor(editor));
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  await prisma.editor.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
