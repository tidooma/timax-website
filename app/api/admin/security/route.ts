import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = getAdminFromRequest(request);
  if (!session || session.username !== "tima" || session.role !== "SUPER_ADMIN" || !isAdminRequest(request)) {
    return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
  }

  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(logs);
}