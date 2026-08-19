import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

function serializeService(service: {
  id: string;
  title: string;
  description: string;
  price: string;
  isPopular: boolean;
  createdAt: Date;
}) {
  return {
    ...service,
    createdAt: service.createdAt.toISOString()
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
    price?: string;
    isPopular?: boolean;
  } | null;

  if (!body?.title?.trim() || !body.description?.trim() || !body.price?.trim()) {
    return NextResponse.json({ message: "Заполните услугу, описание и цену." }, { status: 400 });
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      title: body.title.trim(),
      description: body.description.trim(),
      price: body.price.trim(),
      isPopular: body.isPopular ?? false
    }
  });

  revalidatePath("/");
  return NextResponse.json(serializeService(service));
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
