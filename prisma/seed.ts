import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { DEFAULT_CONTENT } from "../lib/content";

const prisma = new PrismaClient();

async function main() {
  const adminUsers = [
    { username: "tima", role: "SUPER_ADMIN" as const },
    { username: "max", role: "EDITOR" as const }
  ];

  for (const admin of adminUsers) {
    const existing = await prisma.adminUser.findUnique({ where: { username: admin.username } });
    if (!existing) {
      const temporaryPassword = `${crypto.randomBytes(18).toString("base64url")}A1!`;
      await prisma.adminUser.create({
        data: {
          username: admin.username,
          passwordHash: await bcrypt.hash(temporaryPassword, 12),
          role: admin.role,
          mustChangePassword: true
        }
      });
      console.log(`Temporary password for ${admin.username}: ${temporaryPassword}`);
    }
  }

  for (const [key, data] of Object.entries(DEFAULT_CONTENT)) {
    await prisma.siteContent.upsert({ where: { key }, create: { key, data }, update: {} });
  }

  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.service.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.editor.deleteMany();

  const editorOne = await prisma.editor.create({
    data: {
      name: "Монтажёр 1",
      avatar: "",
      description: "Динамичный монтаж для коротких форматов, рекламы и быстрых запусков.",
      accentColor: "#3B82F6"
    }
  });

  const editorTwo = await prisma.editor.create({
    data: {
      name: "Монтажёр 2",
      avatar: "",
      description: "Аккуратная сборка длинных видео, YouTube-выпусков и подкастов.",
      accentColor: "#FFD700"
    }
  });

  await prisma.portfolioItem.createMany({
    data: [
      {
        title: "Вертикальный ролик с быстрым темпом",
        category: "Instagram",
        youtubeId: "dQw4w9WgXcQ",
        editorId: editorOne.id
      },
      {
        title: "Короткая реклама продукта",
        category: "Др.",
        youtubeId: "M7lc1UVf-VE",
        editorId: editorOne.id
      },
      {
        title: "TikTok с переходами под бит",
        category: "TikTok",
        youtubeId: "ysz5S6PUM-U",
        editorId: editorOne.id
      },
      {
        title: "YouTube-выпуск с чистой структурой",
        category: "YouTube",
        youtubeId: "ScMzIvxBSi4",
        editorId: editorTwo.id
      },
      {
        title: "Подкаст с нарезкой смысловых блоков",
        category: "YouTube",
        youtubeId: "aqz-KE-bpKQ",
        editorId: editorTwo.id
      },
      {
        title: "Shorts для экспертного блога",
        category: "YouTube",
        youtubeId: "jNQXAC9IVRw",
        editorId: editorTwo.id
      }
    ]
  });

  await prisma.service.createMany({
    data: [
      {
        title: "Короткое видео",
        description: "Монтаж YouTube, TikTok, Instagram* и других коротких форматов до 60 секунд.",
        price: "от 2 500 ₽",
        isPopular: false
      },
      {
        title: "YouTube-выпуск",
        description: "Сборка длинного видео, чистый звук, титры, перебивки и базовая графика.",
        price: "от 8 000 ₽",
        isPopular: true
      },
      {
        title: "Рекламный ролик",
        description: "Сценарный монтаж, акценты на продукте, ритм, оффер и финальный призыв.",
        price: "от 12 000 ₽",
        isPopular: false
      }
    ]
  });

  await prisma.review.createMany({
    data: [
      {
        clientName: "Алина",
        text: "Отправила исходники вечером, утром уже получила понятный черновик. Попали в стиль с первого раза.",
        rating: 5
      },
      {
        clientName: "Даниил",
        text: "Нужно было быстро собрать выпуск для YouTube. Монтаж чистый, правки спокойные, дедлайн выдержали.",
        rating: 5
      },
      {
        clientName: "Мария",
        text: "Реклама стала выглядеть дороже, а ролик не потерял живость. Приятно работать.",
        rating: 5
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
