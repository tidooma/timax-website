import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/data";
import { sendOrderTelegramNotification } from "@/lib/telegram";

const requiredFields = ["clientName", "telegram", "videoType", "duration", "description", "urgency"] as const;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, string | boolean> | null;

  if (!body) {
    return NextResponse.json({ message: "Проверьте данные заявки." }, { status: 400 });
  }

  const missing = requiredFields.filter((field) => typeof body[field] !== "string" || !String(body[field]).trim());

  if (missing.length || body.consent !== true) {
    return NextResponse.json({ message: "Заполните обязательные поля." }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      clientName: String(body.clientName).trim(),
      telegram: String(body.telegram).trim(),
      videoType: String(body.videoType).trim(),
      duration: String(body.duration).trim(),
      description: String(body.description).trim(),
      urgency: String(body.urgency).trim(),
      status: "new"
    }
  });

  revalidatePath("/admin");

  await sendOrderTelegramNotification(order).catch((error) => {
    console.error("Order was saved, but Telegram notification failed:", error);
  });

  return NextResponse.json(serializeOrder(order), { status: 201 });
}
