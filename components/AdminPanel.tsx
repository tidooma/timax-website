"use client";

import {
  BriefcaseBusiness,
  ClipboardList,
  Film,
  LogOut,
  MessageSquareQuote,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Layers3,
  Trash2,
  UsersRound,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useReadySound } from "@/hooks/useSound";
import { TimaxLogo } from "@/components/TimaxLogo";
import type { CustomSectionDTO, EditorDTO, HeroBannerDTO, OrderDTO, PortfolioItemDTO, ReviewDTO, ServiceDTO } from "@/lib/types";

type TabId = "editors" | "portfolio" | "services" | "reviews" | "orders" | "banner" | "sections";

type TabItem = {
  id: TabId;
  label: string;
  icon: LucideIcon;
};

type AdminData = {
  editors: EditorDTO[];
  portfolio: PortfolioItemDTO[];
  services: ServiceDTO[];
  reviews: ReviewDTO[];
  banner: HeroBannerDTO | null;
  sections: CustomSectionDTO[];
  orders: OrderDTO[];
};

const tabs: TabItem[] = [
  { id: "editors", label: "Редакторы", icon: UsersRound },
  { id: "portfolio", label: "Портфолио", icon: Film },
  { id: "services", label: "Услуги", icon: BriefcaseBusiness },
  { id: "reviews", label: "Отзывы", icon: MessageSquareQuote },
  { id: "banner", label: "Лента", icon: Sparkles },
  { id: "sections", label: "Секции", icon: Layers3 },
  { id: "orders", label: "Заявки", icon: ClipboardList }
];

const emptyData: AdminData = {
  editors: [],
  portfolio: [],
  services: [],
  reviews: [],
  banner: null,
  sections: [],
  orders: []
};

const emptyEditorForm = {
  id: "",
  name: "",
  avatar: "",
  description: "",
  accentColor: "#3B82F6",
  isActive: true
};

const emptyPortfolioForm = {
  id: "",
  title: "",
  category: "",
  youtubeId: "",
  editorId: ""
};

const emptyServiceForm = {
  id: "",
  title: "",
  description: "",
  price: "",
  isPopular: false
};

const emptyReviewForm = {
  id: "",
  clientName: "",
  text: "",
  rating: "5"
};

const emptyBannerForm = {
  id: "",
  title: "",
  description: "",
  isActive: true
};

const emptySectionForm = { id: "", title: "", description: "", order: "10", isVisible: true };
const emptyCardForm = { id: "", sectionId: "", title: "", subtitle: "", description: "", imageUrl: "", linkUrl: "", order: "0" };

const fieldClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/10 dark:bg-white/[0.08] dark:placeholder:text-white/40";

const panelClass =
  "pixel-border rounded-3xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.045]";

const statusLabels: Record<string, string> = {
  new: "Новая",
  "in-progress": "В работе",
  done: "Готово"
};

const statusClasses: Record<string, string> = {
  new: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  "in-progress": "border-orange-400/40 bg-orange-400/10 text-orange-300",
  done: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
};

const notificationMuteReasons = ["Конец смены", "Ночь", "Другие обстоятельства"] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("editors");
  const [data, setData] = useState<AdminData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [editorForm, setEditorForm] = useState(emptyEditorForm);
  const [portfolioForm, setPortfolioForm] = useState(emptyPortfolioForm);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [bannerForm, setBannerForm] = useState(emptyBannerForm);
  const [sectionForm, setSectionForm] = useState(emptySectionForm);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [newOrderNotification, setNewOrderNotification] = useState<OrderDTO | null>(null);
  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [notificationMuteReason, setNotificationMuteReason] = useState("");
  const [selectedMuteReason, setSelectedMuteReason] = useState("");
  const knownOrderIds = useRef<Set<string> | null>(null);
  const playReady = useReadySound();

  const activeTitle = useMemo(() => tabs.find((tab) => tab.id === activeTab)?.label ?? "Панель", [activeTab]);
  const defaultEditorId = data.editors[0]?.id ?? "";

  const loadData = useCallback(async () => {
    setLoading(true);
    setNotice("");

    const responses = await Promise.all([
      fetch("/api/admin/editors", { cache: "no-store" }),
      fetch("/api/admin/portfolio", { cache: "no-store" }),
      fetch("/api/admin/services", { cache: "no-store" }),
      fetch("/api/admin/reviews", { cache: "no-store" }),
      fetch("/api/admin/hero-banner", { cache: "no-store" }),
      fetch("/api/admin/sections", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" })
    ]);

    if (responses.some((response) => response.status === 401)) {
      router.refresh();
      return;
    }

    if (responses.some((response) => !response.ok)) {
      setNotice("Не удалось загрузить данные.");
      setLoading(false);
      return;
    }

    const [editors, portfolio, services, reviews, banner, sections, orders] = await Promise.all(responses.map((response) => response.json()));
    setData({ editors, portfolio, services, reviews, banner: banner ?? null, sections, orders });
    if (knownOrderIds.current === null) {
      knownOrderIds.current = new Set(orders.map((order: OrderDTO) => order.id));
    }
    setLoading(false);
  }, [router]);

  async function mutate(url: string, method: string, body?: unknown) {
    setNotice("");
    setSaving(true);

    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setNotice(payload?.message || "Не удалось сохранить изменения.");
        return false;
      }

      await loadData();
      setNotice("Изменения сохранены.");
      return true;
    } catch {
      setNotice("Не удалось соединиться с сервером.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  useEffect(() => {
    const savedMute = window.localStorage.getItem("timax-admin-order-notifications-muted");
    const savedReason = window.localStorage.getItem("timax-admin-order-notifications-reason");
    if (savedMute === "true") setNotificationsMuted(true);
    if (savedReason) setNotificationMuteReason(savedReason);
  }, []);

  function muteOrderNotifications() {
    if (!selectedMuteReason) return;

    window.localStorage.setItem("timax-admin-order-notifications-muted", "true");
    window.localStorage.setItem("timax-admin-order-notifications-reason", selectedMuteReason);
    setNotificationsMuted(true);
    setNotificationMuteReason(selectedMuteReason);
    setSelectedMuteReason("");
    setNewOrderNotification(null);
  }

  function enableOrderNotifications() {
    window.localStorage.removeItem("timax-admin-order-notifications-muted");
    window.localStorage.removeItem("timax-admin-order-notifications-reason");
    setNotificationsMuted(false);
    setNotificationMuteReason("");
  }

  useEffect(() => {
    let cancelled = false;

    const checkForNewOrders = async () => {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!response.ok || cancelled) return;

      const orders = (await response.json()) as OrderDTO[];
      const previousOrderIds = knownOrderIds.current;

      setData((value) => ({ ...value, orders }));
      knownOrderIds.current = new Set(orders.map((order) => order.id));

      if (previousOrderIds === null) return;

      const newOrder = orders.find((order) => !previousOrderIds.has(order.id));
      if (newOrder && !notificationsMuted) {
        setNewOrderNotification(newOrder);
        playReady();
      }
    };

    const intervalId = window.setInterval(() => {
      void checkForNewOrders();
    }, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [notificationsMuted, playReady]);

  async function logout() {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (response.ok) {
      router.replace("/");
      return;
    }

    router.refresh();
  }

  async function submitEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      name: editorForm.name,
      avatar: editorForm.avatar,
      description: editorForm.description,
      accentColor: editorForm.accentColor,
      isActive: editorForm.isActive
    };
    const saved = editorForm.id
      ? await mutate(`/api/admin/editors/${editorForm.id}`, "PUT", payload)
      : await mutate("/api/admin/editors", "POST", payload);
    if (saved) setEditorForm(emptyEditorForm);
  }

  async function submitPortfolio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: portfolioForm.title,
      category: portfolioForm.category,
      youtubeId: portfolioForm.youtubeId,
      editorId: portfolioForm.editorId
    };
    const saved = portfolioForm.id
      ? await mutate(`/api/admin/portfolio/${portfolioForm.id}`, "PUT", payload)
      : await mutate("/api/admin/portfolio", "POST", payload);
    if (saved) setPortfolioForm({ ...emptyPortfolioForm, editorId: data.editors[0]?.id ?? "" });
  }

  async function submitService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: serviceForm.title,
      description: serviceForm.description,
      price: serviceForm.price,
      isPopular: serviceForm.isPopular
    };
    const saved = serviceForm.id
      ? await mutate(`/api/admin/services/${serviceForm.id}`, "PUT", payload)
      : await mutate("/api/admin/services", "POST", payload);
    if (saved) setServiceForm(emptyServiceForm);
  }

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      clientName: reviewForm.clientName,
      text: reviewForm.text,
      rating: reviewForm.rating ? Number(reviewForm.rating) : null
    };
    const saved = reviewForm.id
      ? await mutate(`/api/admin/reviews/${reviewForm.id}`, "PUT", payload)
      : await mutate("/api/admin/reviews", "POST", payload);
    if (saved) setReviewForm(emptyReviewForm);
  }

  async function submitBanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: bannerForm.title,
      description: bannerForm.description,
      isActive: bannerForm.isActive
    };
    const saved = bannerForm.id
      ? await mutate(`/api/admin/hero-banner/${bannerForm.id}`, "PUT", payload)
      : await mutate("/api/admin/hero-banner", "POST", payload);
    if (saved) setBannerForm(emptyBannerForm);
  }

  async function submitSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: sectionForm.title,
      description: sectionForm.description,
      order: Number(sectionForm.order),
      isVisible: sectionForm.isVisible
    };
    const saved = sectionForm.id
      ? await mutate(`/api/admin/sections/${sectionForm.id}`, "PUT", payload)
      : await mutate("/api/admin/sections", "POST", payload);
    if (saved) setSectionForm(emptySectionForm);
  }

  async function submitCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cardForm.sectionId) return;
    const payload = {
      title: cardForm.title,
      subtitle: cardForm.subtitle,
      description: cardForm.description,
      imageUrl: cardForm.imageUrl,
      linkUrl: cardForm.linkUrl,
      order: Number(cardForm.order)
    };
    const saved = cardForm.id
      ? await mutate(`/api/admin/sections/${cardForm.sectionId}/cards/${cardForm.id}`, "PUT", payload)
      : await mutate(`/api/admin/sections/${cardForm.sectionId}/cards`, "POST", payload);
    if (saved) setCardForm({ ...emptyCardForm, sectionId: cardForm.sectionId });
  }

  async function deleteItem(url: string) {
    if (!window.confirm("Удалить запись?")) return;
    await mutate(url, "DELETE");
  }

  async function deleteAllOrders() {
    if (!data.orders.length || !window.confirm("Удалить все заявки? Это действие нельзя отменить.")) return;
    await mutate("/api/admin/orders", "DELETE");
  }

  useEffect(() => {
    if (portfolioForm.editorId || !defaultEditorId) return;

    const timeoutId = window.setTimeout(() => {
      setPortfolioForm((value) => (value.editorId ? value : { ...value, editorId: defaultEditorId }));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [defaultEditorId, portfolioForm.editorId]);

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-black dark:bg-timax-black dark:text-white">
      <div className="fixed inset-0 bg-pixel-grid bg-[length:36px_36px] opacity-[0.04]" />
      <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-4 lg:flex-row lg:p-6">
        <aside className="pixel-border-blue rounded-3xl border border-blue-500/30 bg-white p-4 shadow-blue dark:bg-[#090909] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72">
          <div className="mb-7 flex items-center justify-between">
            <TimaxLogo compact />
            <button
              type="button"
              onClick={logout}
              aria-label="Выйти"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] text-red-500 dark:border-white/10 dark:bg-white/[0.08]"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          <nav className="grid gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition hover:scale-[1.02] ${
                    active
                      ? "bg-blue-500 text-white shadow-blue"
                      : "border border-black/10 bg-black/[0.03] text-black/60 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-5 flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.045] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Управление Timax</p>
              <h1 className="mt-2 font-days text-3xl tracking-normal md:text-5xl">{activeTitle}</h1>
            </div>
            <button
              type="button"
              onClick={() => void loadData()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 font-bold text-blue-600 transition hover:scale-[1.02] hover:shadow-blue dark:text-blue-300"
            >
              <RefreshCw className="h-5 w-5" />
              Обновить
            </button>
          </div>

          {notice ? (
            <div className="mb-5 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-700 dark:text-blue-200">
              {notice}
            </div>
          ) : null}

          {newOrderNotification ? (
            <div role="status" aria-live="polite" className="fixed right-4 top-4 z-[120] w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-blue-400/45 bg-[#090d15]/95 p-4 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-blue-200">Новая заявка</p>
                  <p className="mt-1 truncate font-days text-lg tracking-normal">{newOrderNotification.clientName}</p>
                  <p className="mt-1 text-sm text-white/65">{newOrderNotification.videoType}</p>
                </div>
                <button
                  type="button"
                  aria-label="Закрыть уведомление"
                  onClick={() => setNewOrderNotification(null)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition hover:border-blue-400/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-xs font-semibold text-white/45">Откройте раздел «Заявки», чтобы посмотреть детали.</p>
            </div>
          ) : null}

          {loading ? (
            <div className={panelClass}>Загружаем данные...</div>
          ) : (
            <>
              {activeTab === "editors" ? (
                <div className="grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
                  <form onSubmit={submitEditor} className={panelClass}>
                    <FormTitle icon={Plus} title={editorForm.id ? "Редактировать редактора" : "Добавить редактора"} />
                    <Field label="Имя">
                      <input className={fieldClass} value={editorForm.name} onChange={(event) => setEditorForm((value) => ({ ...value, name: event.target.value }))} required />
                    </Field>
                    <Field label="Аватар">
                      <input className={fieldClass} value={editorForm.avatar} onChange={(event) => setEditorForm((value) => ({ ...value, avatar: event.target.value }))} placeholder="https://..." />
                    </Field>
                    <Field label="Описание">
                      <textarea className={`${fieldClass} min-h-28`} value={editorForm.description} onChange={(event) => setEditorForm((value) => ({ ...value, description: event.target.value }))} required />
                    </Field>
                    <Field label="Цвет подсветки">
                      <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.06]">
                        <input
                          type="color"
                          value={editorForm.accentColor}
                          onChange={(event) => setEditorForm((value) => ({ ...value, accentColor: event.target.value }))}
                          className="h-10 w-14 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                          aria-label="Цвет подсветки монтажёра"
                        />
                        <span className="text-sm font-bold text-black/60 dark:text-white/60">{editorForm.accentColor}</span>
                      </div>
                    </Field>
                    <label className="mt-4 flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.03] p-3 text-sm font-semibold dark:border-white/10 dark:bg-white/[0.06]">
                      <input type="checkbox" checked={editorForm.isActive} onChange={(event) => setEditorForm((value) => ({ ...value, isActive: event.target.checked }))} className="h-4 w-4 accent-blue-500" />
                      Активен
                    </label>
                    <SubmitRow editing={Boolean(editorForm.id)} saving={saving} onCancel={() => setEditorForm(emptyEditorForm)} />
                  </form>

                  <ListPanel>
                    {data.editors.map((editor) => (
                      <AdminCard key={editor.id}>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-days text-xl tracking-normal">{editor.name}</h3>
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: editor.accentColor }}
                            />
                          </div>
                          <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">{editor.description}</p>
                          <p className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-300">{editor.isActive ? "Активен" : "Скрыт"}</p>
                        </div>
                        <CardActions
                          onEdit={() => setEditorForm({ id: editor.id, name: editor.name, avatar: editor.avatar ?? "", description: editor.description, accentColor: editor.accentColor, isActive: editor.isActive })}
                          onDelete={() => void deleteItem(`/api/admin/editors/${editor.id}`)}
                        />
                      </AdminCard>
                    ))}
                  </ListPanel>
                </div>
              ) : null}

              {activeTab === "portfolio" ? (
                <div className="grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
                  <form onSubmit={submitPortfolio} className={panelClass}>
                    <FormTitle icon={Plus} title={portfolioForm.id ? "Редактировать работу" : "Добавить работу"} />
                    <Field label="Название">
                      <input className={fieldClass} value={portfolioForm.title} onChange={(event) => setPortfolioForm((value) => ({ ...value, title: event.target.value }))} required />
                    </Field>
                    <Field label="Категория">
                      <input className={fieldClass} value={portfolioForm.category} onChange={(event) => setPortfolioForm((value) => ({ ...value, category: event.target.value }))} placeholder="YouTube, TikTok, Instagram или Др." required />
                    </Field>
                    <Field label="YouTube ID">
                      <input className={fieldClass} value={portfolioForm.youtubeId} onChange={(event) => setPortfolioForm((value) => ({ ...value, youtubeId: event.target.value }))} placeholder="dQw4w9WgXcQ" required />
                    </Field>
                    <Field label="Редактор">
                      <select className={fieldClass} value={portfolioForm.editorId} onChange={(event) => setPortfolioForm((value) => ({ ...value, editorId: event.target.value }))} required>
                        {data.editors.map((editor) => (
                          <option key={editor.id} value={editor.id}>
                            {editor.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <SubmitRow editing={Boolean(portfolioForm.id)} saving={saving} onCancel={() => setPortfolioForm({ ...emptyPortfolioForm, editorId: data.editors[0]?.id ?? "" })} />
                  </form>

                  <ListPanel>
                    {data.portfolio.map((item) => (
                      <AdminCard key={item.id}>
                        <div>
                          <h3 className="font-days text-xl tracking-normal">{item.title}</h3>
                          <p className="mt-2 text-sm text-black/60 dark:text-white/60">{item.category} · {item.editorName}</p>
                          <p className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-300">{item.youtubeId}</p>
                        </div>
                        <CardActions
                          onEdit={() => setPortfolioForm({ id: item.id, title: item.title, category: item.category, youtubeId: item.youtubeId, editorId: item.editorId })}
                          onDelete={() => void deleteItem(`/api/admin/portfolio/${item.id}`)}
                        />
                      </AdminCard>
                    ))}
                  </ListPanel>
                </div>
              ) : null}

              {activeTab === "services" ? (
                <div className="grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
                  <form onSubmit={submitService} className={panelClass}>
                    <FormTitle icon={Plus} title={serviceForm.id ? "Редактировать услугу" : "Добавить услугу"} />
                    <Field label="Название">
                      <input className={fieldClass} value={serviceForm.title} onChange={(event) => setServiceForm((value) => ({ ...value, title: event.target.value }))} required />
                    </Field>
                    <Field label="Описание">
                      <textarea className={`${fieldClass} min-h-28`} value={serviceForm.description} onChange={(event) => setServiceForm((value) => ({ ...value, description: event.target.value }))} required />
                    </Field>
                    <Field label="Цена">
                      <input className={fieldClass} value={serviceForm.price} onChange={(event) => setServiceForm((value) => ({ ...value, price: event.target.value }))} placeholder="от 8 000 ₽" required />
                    </Field>
                    <label className="mt-4 flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.03] p-3 text-sm font-semibold dark:border-white/10 dark:bg-white/[0.06]">
                      <input type="checkbox" checked={serviceForm.isPopular} onChange={(event) => setServiceForm((value) => ({ ...value, isPopular: event.target.checked }))} className="h-4 w-4 accent-blue-500" />
                      Популярный
                    </label>
                    <SubmitRow editing={Boolean(serviceForm.id)} saving={saving} onCancel={() => setServiceForm(emptyServiceForm)} />
                  </form>

                  <ListPanel>
                    {data.services.map((service) => (
                      <AdminCard key={service.id}>
                        <div>
                          <h3 className="font-days text-xl tracking-normal">{service.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">{service.description}</p>
                          <p className="mt-2 text-sm font-bold text-blue-600 dark:text-blue-300">{service.price}{service.isPopular ? " · Популярный" : ""}</p>
                        </div>
                        <CardActions
                          onEdit={() => setServiceForm({ id: service.id, title: service.title, description: service.description, price: service.price, isPopular: service.isPopular })}
                          onDelete={() => void deleteItem(`/api/admin/services/${service.id}`)}
                        />
                      </AdminCard>
                    ))}
                  </ListPanel>
                </div>
              ) : null}

              {activeTab === "reviews" ? (
                <div className="grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
                  <form onSubmit={submitReview} className={panelClass}>
                    <FormTitle icon={Plus} title={reviewForm.id ? "Редактировать отзыв" : "Добавить отзыв"} />
                    <Field label="Имя клиента">
                      <input className={fieldClass} value={reviewForm.clientName} onChange={(event) => setReviewForm((value) => ({ ...value, clientName: event.target.value }))} required />
                    </Field>
                    <Field label="Текст">
                      <textarea className={`${fieldClass} min-h-32`} value={reviewForm.text} onChange={(event) => setReviewForm((value) => ({ ...value, text: event.target.value }))} required />
                    </Field>
                    <Field label="Оценка">
                      <select className={fieldClass} value={reviewForm.rating} onChange={(event) => setReviewForm((value) => ({ ...value, rating: event.target.value }))}>
                        <option value="">Без оценки</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                      </select>
                    </Field>
                    <SubmitRow editing={Boolean(reviewForm.id)} saving={saving} onCancel={() => setReviewForm(emptyReviewForm)} />
                  </form>

                  <ListPanel>
                    {data.reviews.map((review) => (
                      <AdminCard key={review.id}>
                        <div>
                          <h3 className="font-days text-xl tracking-normal">{review.clientName}</h3>
                          <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">{review.text}</p>
                          <p className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-300">Оценка: {review.rating ?? "нет"}</p>
                        </div>
                        <CardActions
                          onEdit={() => setReviewForm({ id: review.id, clientName: review.clientName, text: review.text, rating: review.rating ? String(review.rating) : "" })}
                          onDelete={() => void deleteItem(`/api/admin/reviews/${review.id}`)}
                        />
                      </AdminCard>
                    ))}
                  </ListPanel>
                </div>
              ) : null}

              {activeTab === "banner" ? (
                <div className="grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
                  <form onSubmit={submitBanner} className={panelClass}>
                    <FormTitle icon={Sparkles} title={bannerForm.id ? "Редактировать ленту" : "Добавить ленту"} />
                    <Field label="Заголовок">
                      <input className={fieldClass} value={bannerForm.title} onChange={(event) => setBannerForm((value) => ({ ...value, title: event.target.value }))} placeholder="Новое видео / Новость" required />
                    </Field>
                    <Field label="Описание">
                      <textarea className={`${fieldClass} min-h-24`} value={bannerForm.description} onChange={(event) => setBannerForm((value) => ({ ...value, description: event.target.value }))} placeholder="Кратко опишите событие или новость" required />
                    </Field>
                    <label className="mt-4 flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.03] p-3 text-sm font-semibold dark:border-white/10 dark:bg-white/[0.06]">
                      <input type="checkbox" checked={bannerForm.isActive} onChange={(event) => setBannerForm((value) => ({ ...value, isActive: event.target.checked }))} className="h-4 w-4 accent-blue-500" />
                      Показывать на главном экране
                    </label>
                    <SubmitRow editing={Boolean(bannerForm.id)} saving={saving} onCancel={() => setBannerForm(emptyBannerForm)} />
                  </form>

                  <ListPanel>
                    {data.banner ? (
                      <AdminCard>
                        <div>
                          <h3 className="font-days text-xl tracking-normal">{data.banner.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">{data.banner.description}</p>
                          <p className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-300">{data.banner.isActive ? "Активна" : "Не активна"}</p>
                        </div>
                        <CardActions
                          onEdit={() => setBannerForm({ id: data.banner!.id, title: data.banner!.title, description: data.banner!.description, isActive: data.banner!.isActive })}
                          onDelete={() => void deleteItem(`/api/admin/hero-banner/${data.banner!.id}`)}
                        />
                      </AdminCard>
                    ) : (
                      <div className={panelClass}>Ленты пока нет.</div>
                    )}
                  </ListPanel>
                </div>
              ) : null}

              {activeTab === "sections" ? (
                <div className="grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
                  <div className="grid content-start gap-5">
                    <form onSubmit={submitSection} className={panelClass}>
                      <FormTitle icon={Layers3} title={sectionForm.id ? "Редактировать секцию" : "Добавить секцию"} />
                      <Field label="Название">
                        <input className={fieldClass} value={sectionForm.title} onChange={(event) => setSectionForm((value) => ({ ...value, title: event.target.value }))} required />
                      </Field>
                      <Field label="Описание">
                        <textarea className={`${fieldClass} min-h-24`} value={sectionForm.description} onChange={(event) => setSectionForm((value) => ({ ...value, description: event.target.value }))} />
                      </Field>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Порядок">
                          <input className={fieldClass} type="number" value={sectionForm.order} onChange={(event) => setSectionForm((value) => ({ ...value, order: event.target.value }))} />
                        </Field>
                        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-black/10 p-3 text-sm font-semibold dark:border-white/10">
                          <input type="checkbox" checked={sectionForm.isVisible} onChange={(event) => setSectionForm((value) => ({ ...value, isVisible: event.target.checked }))} className="h-4 w-4 accent-blue-500" />
                          Видима
                        </label>
                      </div>
                      <SubmitRow editing={Boolean(sectionForm.id)} saving={saving} onCancel={() => setSectionForm(emptySectionForm)} />
                    </form>

                    <form onSubmit={submitCard} className={panelClass}>
                      <FormTitle icon={Plus} title={cardForm.id ? "Редактировать карточку" : "Добавить карточку"} />
                      <Field label="Секция">
                        <select className={fieldClass} value={cardForm.sectionId} onChange={(event) => setCardForm((value) => ({ ...value, sectionId: event.target.value }))} required>
                          <option value="">Выберите секцию</option>
                          {data.sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
                        </select>
                      </Field>
                      <Field label="Заголовок"><input className={fieldClass} value={cardForm.title} onChange={(event) => setCardForm((value) => ({ ...value, title: event.target.value }))} required /></Field>
                      <Field label="Подзаголовок"><input className={fieldClass} value={cardForm.subtitle} onChange={(event) => setCardForm((value) => ({ ...value, subtitle: event.target.value }))} /></Field>
                      <Field label="Описание"><textarea className={`${fieldClass} min-h-24`} value={cardForm.description} onChange={(event) => setCardForm((value) => ({ ...value, description: event.target.value }))} /></Field>
                      <Field label="URL изображения"><input className={fieldClass} type="url" value={cardForm.imageUrl} onChange={(event) => setCardForm((value) => ({ ...value, imageUrl: event.target.value }))} /></Field>
                      <Field label="URL ссылки"><input className={fieldClass} type="url" value={cardForm.linkUrl} onChange={(event) => setCardForm((value) => ({ ...value, linkUrl: event.target.value }))} /></Field>
                      <Field label="Порядок"><input className={fieldClass} type="number" value={cardForm.order} onChange={(event) => setCardForm((value) => ({ ...value, order: event.target.value }))} /></Field>
                      <SubmitRow editing={Boolean(cardForm.id)} saving={saving} onCancel={() => setCardForm(emptyCardForm)} />
                    </form>
                  </div>

                  <ListPanel>
                    {data.sections.map((section) => (
                      <AdminCard key={section.id}>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-days text-xl tracking-normal">{section.title}</h3>
                            <span className="rounded-xl bg-blue-500/10 px-2 py-1 text-xs font-bold text-blue-600 dark:text-blue-300">#{section.order} · {section.isVisible ? "Видима" : "Скрыта"}</span>
                          </div>
                          {section.description ? <p className="mt-2 text-sm text-black/60 dark:text-white/60">{section.description}</p> : null}
                          <div className="mt-4 grid gap-2">
                            {section.cards.map((card) => (
                              <div key={card.id} className="flex items-start justify-between gap-3 rounded-2xl border border-black/10 p-3 dark:border-white/10">
                                <div><p className="font-semibold">{card.title}</p><p className="text-xs text-black/55 dark:text-white/55">#{card.order}{card.subtitle ? ` · ${card.subtitle}` : ""}</p></div>
                                <div className="flex gap-2">
                                  <button type="button" aria-label="Редактировать карточку" onClick={() => setCardForm({ id: card.id, sectionId: section.id, title: card.title, subtitle: card.subtitle ?? "", description: card.description ?? "", imageUrl: card.imageUrl ?? "", linkUrl: card.linkUrl ?? "", order: String(card.order) })} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 text-blue-500"><Pencil className="h-4 w-4" /></button>
                                  <button type="button" aria-label="Удалить карточку" onClick={() => void deleteItem(`/api/admin/sections/${section.id}/cards/${card.id}`)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 text-red-500"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <CardActions
                          onEdit={() => setSectionForm({ id: section.id, title: section.title, description: section.description ?? "", order: String(section.order), isVisible: section.isVisible })}
                          onDelete={() => void deleteItem(`/api/admin/sections/${section.id}`)}
                        />
                      </AdminCard>
                    ))}
                    {!data.sections.length ? <div className={panelClass}>Секций пока нет.</div> : null}
                  </ListPanel>
                </div>
              ) : null}

              {activeTab === "orders" ? (
                <div className="grid content-start gap-3">
                  <div className="flex flex-col gap-3 rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.045] sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-black/60 dark:text-white/60">Всего заявок: {data.orders.length}</p>
                      <p className="mt-1 text-xs text-black/45 dark:text-white/45">
                        {notificationsMuted ? `Звуковые уведомления отключены: ${notificationMuteReason}.` : "Звуковые уведомления включены."}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      {notificationsMuted ? (
                        <button
                          type="button"
                          onClick={enableOrderNotifications}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-500 transition hover:scale-[1.02]"
                        >
                          Включить уведомления
                        </button>
                      ) : (
                        <>
                          <select
                            value={selectedMuteReason}
                            onChange={(event) => setSelectedMuteReason(event.target.value)}
                            aria-label="Причина отключения уведомлений"
                            className={`${fieldClass} min-w-48`}
                          >
                            <option value="">Причина отключения</option>
                            {notificationMuteReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                          </select>
                          <button
                            type="button"
                            disabled={!selectedMuteReason}
                            onClick={muteOrderNotifications}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-500 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Отключить уведомления
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        disabled={!data.orders.length || saving}
                        onClick={() => void deleteAllOrders()}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500 transition hover:scale-[1.02] hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                        Очистить все заявки
                      </button>
                    </div>
                  </div>
                  <ListPanel>
                    {data.orders.map((order) => (
                      <AdminCard key={order.id}>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-days text-xl tracking-normal">{order.clientName}</h3>
                            <span className={`rounded-xl border px-3 py-1 text-xs font-bold ${statusClasses[order.status] ?? "border-white/15 bg-white/10 text-white/70"}`}>
                              {statusLabels[order.status] ?? order.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-black/60 dark:text-white/60">{order.telegram} · {order.videoType} · {order.duration}</p>
                          <p className="mt-2 text-sm leading-6 text-black/70 dark:text-white/70">{order.description}</p>
                          <p className="mt-2 text-xs font-semibold text-black/50 dark:text-white/50">{order.urgency} · {formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2">
                          <select
                            className={`${fieldClass} min-w-36`}
                            value={order.status}
                            onChange={(event) => void mutate(`/api/admin/orders/${order.id}`, "PUT", { status: event.target.value })}
                          >
                            <option value="new">Новая</option>
                            <option value="in-progress">В работе</option>
                            <option value="done">Готово</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => void deleteItem(`/api/admin/orders/${order.id}`)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500 transition hover:scale-[1.02]"
                          >
                            <Trash2 className="h-4 w-4" />
                            Удалить
                          </button>
                        </div>
                      </AdminCard>
                    ))}
                    {!data.orders.length ? <div className={panelClass}>Заявок пока нет.</div> : null}
                  </ListPanel>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 grid gap-2 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}

function FormTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-days text-2xl tracking-normal">{title}</h2>
    </div>
  );
}

function SubmitRow({ editing, saving, onCancel }: { editing: boolean; saving: boolean; onCancel: () => void }) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
      <button
        type="submit"
        disabled={saving}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-bold text-white shadow-blue transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"
      >
        <Plus className="h-5 w-5" />
        {saving ? "Сохраняем..." : editing ? "Сохранить" : "Добавить"}
      </button>
      {editing ? (
        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          className="rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-3 font-bold transition hover:scale-[1.02] dark:border-white/10 dark:bg-white/[0.08]"
        >
          Отмена
        </button>
      ) : null}
    </div>
  );
}

function ListPanel({ children }: { children: React.ReactNode }) {
  return <div className="grid content-start gap-3">{children}</div>;
}

function AdminCard({ children }: { children: React.ReactNode }) {
  return (
    <article className="pixel-border flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.045] md:flex-row md:items-start md:justify-between">
      {children}
    </article>
  );
}

function CardActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Редактировать"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-600 transition hover:scale-[1.02] dark:text-blue-300"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Удалить"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 transition hover:scale-[1.02]"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
