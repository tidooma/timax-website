"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { CONTENT_PERMISSION_KEYS, DEFAULT_CONTENT, type ContentKey, type ContentSection } from "@/lib/content";

const contentKeys = Object.keys(DEFAULT_CONTENT) as ContentKey[];
const labels: Record<ContentKey, string> = { hero: "Hero", about: "О нас", workflow: "Как работаем", guarantees: "Гарантии", faq: "FAQ", pricing: "Цены", contacts: "Контакты", disclaimer: "Дисклеймер", blog: "Советы" };

type Props = { permissions: Record<string, boolean>; isSuperAdmin: boolean };

export function AdminContent({ permissions, isSuperAdmin }: Props) {
  const availableKeys = useMemo(() => contentKeys.filter((key) => isSuperAdmin || permissions[`content.${key}.edit`]), [isSuperAdmin, permissions]);
  const [key, setKey] = useState<ContentKey>(availableKeys[0] ?? "about");
  const selectedKey = availableKeys.includes(key) ? key : (availableKeys[0] ?? "about");
  const [content, setContent] = useState<ContentSection>(DEFAULT_CONTENT[selectedKey]);
  const [meta, setMeta] = useState<{ updatedAt: string | null; updatedBy: string | null }>({ updatedAt: null, updatedBy: null });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!availableKeys.includes(selectedKey)) return;
    void fetch(`/api/admin/content?key=${selectedKey}`, { cache: "no-store" }).then(async (response) => {
      if (!response.ok) return;
      const payload = await response.json() as { data: ContentSection; updatedAt: string | null; updatedBy: string | null };
      setContent(payload.data);
      setMeta({ updatedAt: payload.updatedAt, updatedBy: payload.updatedBy });
    });
  }, [availableKeys, selectedKey]);

  async function save() {
    const response = await fetch(`/api/admin/content?key=${selectedKey}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: content }) });
    setMessage(response.ok ? "Изменения сохранены." : "Недостаточно прав для этого раздела.");
    if (response.ok) setMeta({ updatedAt: new Date().toISOString(), updatedBy: "вы" });
  }

  async function reset() {
    if (!window.confirm("Сбросить этот раздел к значениям по умолчанию?")) return;
    const response = await fetch(`/api/admin/content?key=${selectedKey}`, { method: "DELETE" });
    if (response.ok) {
      setContent(DEFAULT_CONTENT[selectedKey]);
      setMeta({ updatedAt: null, updatedBy: null });
      setMessage("Раздел сброшен к значениям по умолчанию.");
    }
  }

  function updateItem(index: number, field: "title" | "description", value: string) {
    setContent((current) => ({ ...current, items: (current.items ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  }

  if (!availableKeys.length) return <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 text-white/60">Вам пока не выданы права на редактирование контента.</div>;

  return <div className="grid gap-5">
    <section className="rounded-3xl border border-blue-500/25 bg-white/[0.045] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><label className="grid gap-2 text-sm font-semibold text-white/75">Раздел сайта<select value={key} onChange={(event) => setKey(event.target.value as ContentKey)} className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-white">{availableKeys.map((item) => <option key={item} value={item}>{labels[item]}</option>)}</select></label><p className="text-xs text-white/45">{meta.updatedBy && meta.updatedAt ? `Последнее изменение: ${meta.updatedBy}, ${new Date(meta.updatedAt).toLocaleString("ru-RU")}` : "Используются значения по умолчанию"}</p></div>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-white/75">Заголовок<input value={content.title} onChange={(event) => setContent({ ...content, title: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-white" /></label>
      <label className="mt-4 grid gap-2 text-sm font-semibold text-white/75">Описание<textarea value={content.description} onChange={(event) => setContent({ ...content, description: event.target.value })} className="min-h-28 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-white" /></label>
      <div className="mt-4 grid gap-3">{(content.items ?? []).map((item, index) => <div key={`${key}-${index}`} className="rounded-2xl border border-white/10 p-4"><input value={item.title} onChange={(event) => updateItem(index, "title", event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2 text-white" /><textarea value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} className="mt-2 min-h-20 w-full rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2 text-white" /></div>)}</div>
      {message ? <p role="status" className="mt-4 text-sm text-blue-200">{message}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void save()} className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-bold text-white"><Save className="h-4 w-4" />Сохранить</button><button type="button" onClick={() => void reset()} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-bold text-white/70"><RotateCcw className="h-4 w-4" />Сбросить по умолчанию</button></div>
    </section>
    <p className="text-xs text-white/35">Доступные ключи: {CONTENT_PERMISSION_KEYS.filter((permission) => isSuperAdmin || permissions[permission]).join(", ") || "нет"}</p>
  </div>;
}
