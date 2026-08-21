"use client";

import { useState } from "react";
import { ChevronDown, Clock3, Cloud, CreditCard, FileCheck2, Film, Layers3, MessageCircleQuestion, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import type { PublicDataDTO } from "@/lib/types";

const workflowSteps = [
  ["Заполняем бриф", "Фиксируем задачу, референсы, формат и сроки."],
  ["Передаёте исходники", "Через облачное хранилище или Telegram, как удобнее."],
  ["Делаем черновой монтаж", "Собираем структуру, ритм и основные акценты."],
  ["Вносим бесплатные правки", "В стоимость включены 2 раунда бесплатных правок."],
  ["Финальный рендер и оплата", "Проверяете результат, после чего получаете готовый файл."]
];

const guarantees = [
  ["2 раунда правок", "Уточняем результат вместе, без неожиданных доплат."],
  ["Срок до 48 часов", "Для стандартных задач заранее согласуем точный дедлайн."],
  ["Безопасная оплата", "Условия и стоимость фиксируем до начала работы."],
  ["Ваши файлы под защитой", "Исходники используем только для выполнения заказа."]
];

const faqs = [
  ["Делаете динамичные субтитры?", "Да. Добавляем акцентные субтитры, выделение слов, эмодзи и анимацию под стиль ролика."],
  ["Выбираете музыку? Не будет проблем с авторскими правами на YouTube?", "Подберём музыку из безопасных библиотек или работаем с вашим треком. Риски по авторским правам обсуждаем до публикации."],
  ["Что делать, если исходников очень много?", "Это нормально: принимаем большие объёмы через облако, сортируем материал и заранее оцениваем объём работы."],
  ["Какие сроки и способы оплаты?", "Обычно от 48 часов для стандартной задачи. Способ оплаты и этапы фиксируем в переписке до старта." ]
];

const blogTips = [
  ["Как снять видео, которое легко монтировать", "Чистый звук, запас по кадру и понятная структура экономят часы на монтаже."],
  ["TikTok-тренды 2026", "Разбираем темп, первые секунды и форматы, которые помогают удерживать внимание."],
  ["Зачем ролику монтажный план", "Короткий план помогает быстрее прийти к сильному финальному результату."]
];

export function TrustSections({ content }: { content?: PublicDataDTO["content"] }) {
  const [openQuestion, setOpenQuestion] = useState(0);
  const about = content?.about;
  const workflow = content?.workflow;
  const guaranteesContent = content?.guarantees;
  const faqContent = content?.faq;
  const blog = content?.blog;
  const workflowItems = workflow?.items ?? workflowSteps.map(([title, description]) => ({ title, description }));
  const guaranteeItems = guaranteesContent?.items ?? guarantees.map(([title, description]) => ({ title, description }));
  const faqItems = faqContent?.items ?? faqs.map(([title, description]) => ({ title, description }));
  const blogItems = blog?.items ?? blogTips.map(([title, description]) => ({ title, description }));

  return (
    <>
      <section id="about" className="section-surface scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300"><Sparkles className="h-4 w-4" />О нас</div>
            <h2 className="font-days text-4xl tracking-normal md:text-6xl">{about?.title ?? "Тима и Макс"}</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/65">{about?.description ?? "Мы превращаем сырые исходники в ролики, которые приятно смотреть и легко публиковать."}</p>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/65">Работаем прозрачно: согласуем задачу, показываем черновик и учитываем правки. Ваши материалы и сроки остаются под контролем.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Adobe Premiere Pro", "After Effects", "DaVinci Resolve"].map((software) => <div key={software} className="ambient-card rounded-3xl border border-blue-500/20 bg-white/[0.045] p-5 text-center text-sm font-semibold text-blue-100"><Film className="relative z-10 mx-auto mb-3 h-6 w-6 text-blue-400" /><span className="relative z-10">{software}</span></div>)}
          </div>
        </div>
      </section>

      <section id="workflow" className="section-surface scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10"><div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300"><Layers3 className="h-4 w-4" />Как работаем</div><h2 className="font-days text-4xl tracking-normal md:text-6xl">{workflow?.title ?? "От исходников до готового ролика"}</h2></div>
          <div className="grid gap-4 md:grid-cols-5">{workflowItems.map(({ title, description }, index) => <article key={title} className="ambient-card rounded-3xl border border-blue-500/20 bg-white/[0.045] p-5"><span className="relative z-10 font-days text-3xl text-blue-400">0{index + 1}</span><h3 className="relative z-10 mt-5 font-days text-xl tracking-normal">{title}</h3><p className="relative z-10 mt-3 text-sm leading-6 text-white/60">{description}</p></article>)}</div>
        </div>
      </section>

      <section id="guarantees" className="section-surface scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><div className="mb-10"><div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300"><ShieldCheck className="h-4 w-4" />Гарантии</div><h2 className="font-days text-4xl tracking-normal md:text-6xl">{guaranteesContent?.title ?? "Спокойный процесс"}</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{guaranteeItems.map(({ title, description }, index) => <div key={title} className="ambient-card rounded-3xl border border-blue-500/20 bg-white/[0.045] p-5"><div className="relative z-10 mb-4 text-blue-400">{index === 0 ? <FileCheck2 /> : index === 1 ? <Clock3 /> : index === 2 ? <CreditCard /> : <Cloud />}</div><h3 className="relative z-10 font-days text-xl tracking-normal">{title}</h3><p className="relative z-10 mt-3 text-sm leading-6 text-white/60">{description}</p></div>)}</div></div>
      </section>

      <section id="faq" className="section-surface scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><div className="mb-10"><div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300"><MessageCircleQuestion className="h-4 w-4" />FAQ</div><h2 className="font-days text-4xl tracking-normal md:text-6xl">{faqContent?.title ?? "Частые вопросы"}</h2></div><div className="grid gap-3">{faqItems.map(({ title: question, description: answer }, index) => { const isOpen = openQuestion === index; return <div key={question} className="faq-item rounded-3xl border border-blue-500/20 bg-white/[0.045]"><button type="button" onClick={() => setOpenQuestion(isOpen ? -1 : index)} className="faq-question relative z-10 flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"><span>{question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-blue-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen ? <p className="relative z-10 px-5 pb-5 text-sm leading-7 text-white/60">{answer}</p> : null}</div>; })}</div></div></section>

      <section id="tips" className="section-surface scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-10"><div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300"><WandSparkles className="h-4 w-4" />Советы</div><h2 className="font-days text-4xl tracking-normal md:text-6xl">{blog?.title ?? "Полезно для контента"}</h2></div><div className="grid gap-4 md:grid-cols-3">{blogItems.map(({ title, description }) => <article key={title} className="ambient-card rounded-3xl border border-blue-500/20 bg-white/[0.045] p-5"><h3 className="relative z-10 font-days text-xl tracking-normal">{title}</h3><p className="relative z-10 mt-3 text-sm leading-6 text-white/60">{description}</p></article>)}</div></div></section>
    </>
  );
}
