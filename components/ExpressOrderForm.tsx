"use client";

import { CheckCircle2, Clock, Send, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useClickSound, useReadySound } from "@/hooks/useSound";

type ExpressOrderFormProps = {
  open: boolean;
  onClose: () => void;
  defaultVideoType?: string;
};

type FormState = {
  clientName: string;
  telegram: string;
  videoType: string;
  duration: string;
  description: string;
  urgency: string;
  consent: boolean;
};

const initialForm: FormState = {
  clientName: "",
  telegram: "",
  videoType: "",
  duration: "",
  description: "",
  urgency: "Стандарт (3-5 дней)",
  consent: false
};

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-black outline-none transition placeholder:text-black/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/10 dark:bg-white/[0.08] dark:text-white dark:placeholder:text-white/40";

const requiredLabels: Record<keyof FormState, string> = {
  clientName: "имя",
  telegram: "Telegram",
  videoType: "тип видео",
  duration: "длительность исходника",
  description: "описание задачи",
  urgency: "срочность",
  consent: "согласие"
};

export function ExpressOrderForm({ open, onClose, defaultVideoType }: ExpressOrderFormProps) {
  const [form, setForm] = useState<FormState>(() => ({
    ...initialForm,
    videoType: defaultVideoType ?? ""
  }));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const playClick = useClickSound();
  const playReady = useReadySound();

  const remainingFields = useMemo(() => {
    return (Object.keys(requiredLabels) as Array<keyof FormState>).filter((key) => {
      const value = form[key];
      if (typeof value === "boolean") return !value;
      if (key === "telegram") return value.trim().length <= 1;
      return !value.trim();
    });
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    playClick();
    setError("");

    if (remainingFields.length) return;

    setLoading(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message || "Не получилось отправить заявку. Проверьте поля и попробуйте ещё раз.");
      return;
    }

    setSuccess(true);
    playReady();
    setForm(initialForm);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/[0.64] px-3 py-4 sm:px-4 sm:py-6 sm:backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center">
        <div className="order-modal-panel liquid-glass relative w-full max-w-3xl overflow-hidden rounded-3xl border border-blue-500/30 bg-white p-4 shadow-blue dark:bg-[#090909] sm:p-6">
          <div className="absolute inset-0 bg-pixel-grid bg-[length:28px_28px] opacity-[0.05]" />
          <div className="relative z-10">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
                  <Clock className="h-4 w-4" />
                  Экспресс заказ
                </div>
                <h2 className="font-days text-3xl tracking-normal md:text-4xl">Заявка на монтаж</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                aria-label="Закрыть"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-blue-500" />
                <h3 className="mt-4 font-days text-2xl tracking-normal">Заявка отправлена</h3>
                <p className="mt-3 text-black/60 dark:text-white/60">Мы скоро напишем в Telegram.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    onClose();
                  }}
                  className="mt-6 rounded-2xl bg-blue-500 px-6 py-3 font-bold text-white shadow-blue"
                >
                  Готово
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold">
                    Ваше имя
                    <input
                      className={inputClass}
                      value={form.clientName}
                      onChange={(event) => setForm((value) => ({ ...value, clientName: event.target.value }))}
                      placeholder="Ваше имя"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    Telegram
                    <input
                      className={inputClass}
                      value={form.telegram}
                      onFocus={() => setForm((value) => ({ ...value, telegram: value.telegram || "@" }))}
                      onChange={(event) => {
                        const telegram = event.target.value.replace(/\s/g, "");
                        setForm((value) => ({ ...value, telegram: telegram ? (telegram.startsWith("@") ? telegram : `@${telegram}`) : "@" }));
                      }}
                      placeholder="@username"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold">
                  Тип видео
                  <select
                    className={inputClass}
                    value={form.videoType}
                    onChange={(event) => setForm((value) => ({ ...value, videoType: event.target.value }))}
                  >
                    <option value="">Выберите тип видео</option>
                    <option>YouTube / TikTok / Instagram (короткое видео до 60 сек)</option>
                    <option>Длинное видео (YouTube, подкаст и т.д.)</option>
                    <option>Рекламный ролик</option>
                    <option>Другое</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Длительность исходника
                  <select
                    className={inputClass}
                    value={form.duration}
                    onChange={(event) => setForm((value) => ({ ...value, duration: event.target.value }))}
                  >
                    <option value="">Выберите длительность</option>
                    <option>до 5 мин</option>
                    <option>5-15 мин</option>
                    <option>15-30 мин</option>
                    <option>30+ мин</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Описание задачи
                  <textarea
                    className={`${inputClass} min-h-32 resize-y`}
                    value={form.description}
                    onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))}
                    placeholder="Расскажите, что нужно смонтировать..."
                  />
                </label>

                <fieldset className="grid gap-3 rounded-3xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <legend className="px-2 text-sm font-semibold">Срочность</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Стандарт (3-5 дней)", "Срочно (1-2 дня) + доплата"].map((urgency) => (
                      <label
                        key={urgency}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-white p-3 text-sm dark:border-white/10 dark:bg-black/30"
                      >
                        <input
                          type="radio"
                          name="urgency"
                          checked={form.urgency === urgency}
                          onChange={() => setForm((value) => ({ ...value, urgency }))}
                          className="h-4 w-4 accent-blue-500"
                        />
                        {urgency}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => setForm((value) => ({ ...value, consent: event.target.checked }))}
                    className="mt-1 h-4 w-4 shrink-0 accent-blue-500"
                  />
                  Даю согласие на обработку моих персональных данных
                </label>

                <div className="rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-sm text-blue-700 dark:text-blue-200">
                  {remainingFields.length
                    ? `Осталось заполнить: ${remainingFields.map((key) => requiredLabels[key]).join(", ")}`
                    : "Все обязательные поля заполнены."}
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading || remainingFields.length > 0}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-4 font-bold text-white shadow-blue transition hover:scale-[1.02] hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                  {loading ? "Отправляем..." : "Отправить заявку"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
