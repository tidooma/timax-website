import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { serializeOrder } from "@/lib/data";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

const allowedStatuses = new Set(["new", "in-progress", "done"]);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  const body = (await request.json().catch(() => null)) as { status?: string } | null;

  if (!body?.status || !allowedStatuses.has(body.status)) {
    return NextResponse.json({ message: "Выберите корректный статус." }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status }
  });

  return NextResponse.json(serializeOrder(order));
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminRequest(request)) return unauthorized();
  const { id } = await params;

  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
