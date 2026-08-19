import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ message: "Нужна авторизация." }, { status: 401 });
}

function serializePortfolioItem(item: {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  editorId: string;
  createdAt: Date;
  editor?: { name: string; accentColor: string };
}) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    youtubeId: item.youtubeId,
    editorId: item.editorId,
    editorName: item.editor?.name,
    editorAccentColor: item.editor?.accentColor,
    createdAt: item.createdAt.toISOString()
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { editor: { select: { name: true, accentColor: true } } }
  });

  return NextResponse.json(items.map(serializePortfolioItem));
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    category?: string;
    youtubeId?: string;
    editorId?: string;
  } | null;

  if (!body?.title?.trim() || !body.category?.trim() || !body.youtubeId?.trim() || !body.editorId?.trim()) {
    return NextResponse.json({ message: "Заполните все поля работы." }, { status: 400 });
  }

  const item = await prisma.portfolioItem.create({
    data: {
      title: body.title.trim(),
      category: body.category.trim(),
      youtubeId: body.youtubeId.trim(),
      editorId: body.editorId.trim()
    },
    include: { editor: { select: { name: true, accentColor: true } } }
  });

  revalidatePath("/");
  return NextResponse.json(serializePortfolioItem(item), { status: 201 });
}
