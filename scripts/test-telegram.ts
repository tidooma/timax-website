import { loadEnvConfig } from "@next/env";
import { sendOrderTelegramNotification } from "../lib/telegram";

loadEnvConfig(process.cwd());

async function main() {
  const missing = ["TELEGRAM_BOT_TOKEN"].filter((key) => !process.env[key]?.trim());

  if (!process.env.TELEGRAM_CHAT_ID?.trim() && !process.env.TELEGRAM_CHAT_IDS?.trim()) {
    missing.push("TELEGRAM_CHAT_ID");
  }

  if (missing.length) {
    console.error(`Telegram is not configured. Missing: ${missing.join(", ")}`);
    process.exit(1);
  }

  await sendOrderTelegramNotification({
    id: "telegram-test",
    clientName: "Тест Timax",
    telegram: "@test",
    videoType: "Проверка уведомлений",
    duration: "до 5 мин",
    description: "Это тестовое сообщение. Если оно пришло, Telegram-уведомления работают.",
    urgency: "Стандарт (3-5 дней)",
    createdAt: new Date()
  });

  console.log("Telegram test message sent.");
}

main().catch((error) => {
  console.error("Telegram test failed:", error);
  process.exit(1);
});
