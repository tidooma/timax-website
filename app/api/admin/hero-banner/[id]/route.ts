import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

function serializeBanner(banner: {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}) {
  return {
    ...banner,
    createdAt: banner.createdAt.toISOString()
  };
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    isActive?: boolean;
  } | null;

  if (!body?.title?.trim() || !body.description?.trim()) {
    return NextResponse.json({ message: "Заполните заголовок и описание." }, { status: 400 });
  }

  const banner = await prisma.heroBanner.update({
    where: { id },
    data: {
      title: body.title.trim(),
      description: body.description.trim(),
      isActive: body.isActive ?? true
    }
  });

  revalidatePath("/");
  return NextResponse.json(serializeBanner(banner));
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  await prisma.heroBanner.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}