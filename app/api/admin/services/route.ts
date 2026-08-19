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

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const services = await prisma.service.findMany({ orderBy: [{ isPopular: "desc" }, { createdAt: "asc" }] });
  return NextResponse.json(services.map(serializeService));
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    price?: string;
    isPopular?: boolean;
  } | null;

  if (!body?.title?.trim() || !body.description?.trim() || !body.price?.trim()) {
    return NextResponse.json({ message: "Заполните услугу, описание и цену." }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      title: body.title.trim(),
      description: body.description.trim(),
      price: body.price.trim(),
      isPopular: body.isPopular ?? false
    }
  });

  revalidatePath("/");
  return NextResponse.json(serializeService(service), { status: 201 });
}
