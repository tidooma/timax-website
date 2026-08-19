type TelegramOrder = {
  id: string;
  clientName: string;
  telegram: string;
  videoType: string;
  duration: string;
  description: string;
  urgency: string;
  createdAt: Date;
};

const TELEGRAM_API_BASE_URL = "https://api.telegram.org";
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_TIMEOUT_MS = 15000;
const MAX_DESCRIPTION_LENGTH = 900;

function escapeTelegramHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clampText(value: string, maxLength: number) {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) return trimmed;

  return `${trimmed.slice(0, maxLength - 1).trimEnd()}...`;
}

function getTelegramTimeoutMs() {
  const timeout = Number(process.env.TELEGRAM_NOTIFY_TIMEOUT_MS);

  if (!Number.isFinite(timeout) || timeout <= 0) return DEFAULT_TIMEOUT_MS;

  return Math.min(timeout, MAX_TIMEOUT_MS);
}

function getTelegramChatIds() {
  return (process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_IDS || "")
    .split(",")
    .map((chatId) => chatId.trim())
    .filter(Boolean);
}

function formatOrderDate(date: Date) {
  const timeZone = process.env.TELEGRAM_TIME_ZONE?.trim() || "Europe/Moscow";

  try {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function formatOrderMessage(order: TelegramOrder) {
  const description = clampText(order.description, MAX_DESCRIPTION_LENGTH);
  const rows = [
    "<b>Новая заявка Timax</b>",
    "",
    `<b>Имя:</b> ${escapeTelegramHtml(order.clientName)}`,
    `<b>Telegram:</b> ${escapeTelegramHtml(order.telegram)}`,
    `<b>Тип видео:</b> ${escapeTelegramHtml(order.videoType)}`,
    `<b>Исходник:</b> ${escapeTelegramHtml(order.duration)}`,
    `<b>Срочность:</b> ${escapeTelegramHtml(order.urgency)}`,
    "",
    `<b>Описание:</b>\n${escapeTelegramHtml(description)}`,
    "",
    `<b>Время:</b> ${escapeTelegramHtml(formatOrderDate(order.createdAt))}`,
    `<b>ID:</b> <code>${escapeTelegramHtml(order.id)}</code>`
  ];

  return rows.join("\n");
}

export async function sendOrderTelegramNotification(order: TelegramOrder) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = getTelegramChatIds();

  if (!botToken || !chatIds.length) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTelegramTimeoutMs());
  const text = formatOrderMessage(order);

  try {
    const results = await Promise.allSettled(
      chatIds.map(async (chatId) => {
        const response = await fetch(`${TELEGRAM_API_BASE_URL}/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            disable_web_page_preview: true,
            parse_mode: "HTML",
            text
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`chat_id ${chatId}: Telegram sendMessage failed with status ${response.status}`);
        }
      })
    );

    const failedResults = results.filter((result) => result.status === "rejected");

    if (failedResults.length) {
      throw new Error(`${failedResults.length}/${chatIds.length} Telegram notifications failed`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
