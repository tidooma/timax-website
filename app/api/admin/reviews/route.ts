import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

function serializeReview(review: {
  id: string;
  clientName: string;
  text: string;
  rating: number | null;
  createdAt: Date;
}) {
  return {
    ...review,
    createdAt: review.createdAt.toISOString()
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(reviews.map(serializeReview));
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as {
    clientName?: string;
    text?: string;
    rating?: number | null;
  } | null;

  if (!body?.clientName?.trim() || !body.text?.trim()) {
    return NextResponse.json({ message: "Заполните имя клиента и текст." }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      clientName: body.clientName.trim(),
      text: body.text.trim(),
      rating: typeof body.rating === "number" ? body.rating : null
    }
  });

  revalidatePath("/");
  return NextResponse.json(serializeReview(review), { status: 201 });
}
