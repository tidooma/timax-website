import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sections = await prisma.customSection.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
    include: { cards: { orderBy: { order: "asc" } } }
  });

  return NextResponse.json(sections);
}
