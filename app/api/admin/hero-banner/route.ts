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

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const banner = await prisma.heroBanner.findFirst({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(banner ? serializeBanner(banner) : null);
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    isActive?: boolean;
  } | null;

  if (!body?.title?.trim() || !body.description?.trim()) {
    return NextResponse.json({ message: "Заполните заголовок и описание." }, { status: 400 });
  }

  const banner = await prisma.heroBanner.create({
    data: {
      title: body.title.trim(),
      description: body.description.trim(),
      isActive: body.isActive ?? true
    }
  });

  revalidatePath("/");
  return NextResponse.json(serializeBanner(banner), { status: 201 });
}