import { prisma } from "@/lib/prisma";

export type ContentKey = "hero" | "about" | "workflow" | "guarantees" | "faq" | "pricing" | "contacts" | "disclaimer" | "blog";

export type ContentSection = {
  title: string;
  description: string;
  items?: Array<{ title: string; description: string }>;
};

export const CONTENT_PERMISSION_KEYS = [
  "content.hero.edit",
  "content.about.edit",
  "content.workflow.edit",
  "content.guarantees.edit",
  "content.faq.edit",
  "content.pricing.edit",
  "content.portfolio.edit",
  "content.reviews.edit",
  "content.contacts.edit",
  "content.disclaimer.edit",
  "content.blog.edit",
  "content.editors.edit",
  "content.sections.edit",
  "orders.view",
  "orders.manage",
  "users.manage",
  "permissions.manage",
  "audit.view",
  "security.manage"
] as const;

export const DEFAULT_CONTENT: Record<ContentKey, ContentSection> = {
  hero: { title: "ТЕБЕ НУЖЕН МОНТАЖ", description: "Профессиональный видеомонтаж для YouTube, TikTok, Instagram и др." },
  about: { title: "Тима и Макс", description: "Превращаем сырые исходники в ролики, которые приятно смотреть и легко публиковать.", items: [{ title: "Опыт", description: "Прозрачный процесс, понятные сроки и внимание к деталям." }, { title: "Программы", description: "Adobe Premiere Pro, After Effects и DaVinci Resolve." }, { title: "Доверие", description: "Показываем черновик и учитываем 2 раунда бесплатных правок." }] },
  workflow: { title: "От исходников до готового ролика", description: "Понятный процесс без лишних рисков.", items: [{ title: "Заполняем бриф", description: "Фиксируем задачу, формат и сроки." }, { title: "Передаёте исходники", description: "Через облако или Telegram." }, { title: "Делаем черновой монтаж", description: "Собираем структуру и ритм." }, { title: "Вносим правки", description: "2 раунда бесплатных правок включены." }, { title: "Финальный рендер и оплата", description: "Проверяете результат и получаете файл." }] },
  guarantees: { title: "Гарантии", description: "Спокойный процесс работы.", items: [{ title: "2 раунда правок", description: "Уточняем результат вместе." }, { title: "До 48 часов", description: "Согласуем точный дедлайн." }, { title: "Безопасная оплата", description: "Фиксируем условия до старта." }] },
  faq: { title: "Частые вопросы", description: "Ответы на основные вопросы.", items: [{ title: "Делаете динамичные субтитры?", description: "Да, добавляем акцентные субтитры и анимацию." }, { title: "Выбираете музыку и есть ли проблемы с YouTube?", description: "Подберём безопасную музыку и заранее обсудим риски." }, { title: "Что если исходников очень много?", description: "Принимаем большие объёмы через облако и оцениваем задачу заранее." }, { title: "Какие сроки и способы оплаты?", description: "Обычно от 48 часов, условия фиксируем до старта." }] },
  pricing: { title: "Услуги и цены", description: "Итоговая стоимость зависит от объёма исходников, сложности графики, сценария и субтитров.", items: [{ title: "Короткое видео", description: "от 499 ₽/мин · нарезка, титры · 24–48 часов" }, { title: "YouTube-выпуск", description: "Структура, звук, графика · до 48 часов" }, { title: "Дополнительно", description: "Субтитры, обложка, саунд-дизайн" }] },
  contacts: { title: "Наш телеграм канал", description: "Анонсы, новые работы и обновления Timax." },
  disclaimer: { title: "Юридическая информация", description: "Meta (Instagram) признана экстремистской организацией на территории Российской Федерации." },
  blog: { title: "Полезно для контента", description: "Советы по съёмке и монтажу.", items: [{ title: "Как снять видео, которое легко монтировать", description: "Чистый звук и понятная структура экономят время." }, { title: "TikTok-тренды 2026", description: "Разбираем темп и первые секунды ролика." }] }
};

export async function getContent(key: ContentKey): Promise<ContentSection> {
  const fallback = DEFAULT_CONTENT[key];
  const row = await prisma.siteContent.findUnique({ where: { key } });
  if (!row || typeof row.data !== "object" || row.data === null) return fallback;
  return { ...fallback, ...(row.data as Partial<ContentSection>), items: Array.isArray((row.data as ContentSection).items) ? (row.data as ContentSection).items : fallback.items };
}
