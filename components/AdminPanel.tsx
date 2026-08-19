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
  Trash2,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TimaxLogo } from "@/components/TimaxLogo";
import type { EditorDTO, OrderDTO, PortfolioItemDTO, ReviewDTO, ServiceDTO } from "@/lib/types";

type TabId = "editors" | "portfolio" | "services" | "reviews" | "orders";

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
  orders: OrderDTO[];
};

const tabs: TabItem[] = [
  { id: "editors", label: "Редакторы", icon: UsersRound },
  { id: "portfolio", label: "Портфолио", icon: Film },
  { id: "services", label: "Услуги", icon: BriefcaseBusiness },
  { id: "reviews", label: "Отзывы", icon: MessageSquareQuote },
  { id: "orders", label: "Заявки", icon: ClipboardList }
];

const emptyData: AdminData = {
  editors: [],
  portfolio: [],
  services: [],
  reviews: [],
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

const fieldClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/10 dark:bg-white/[0.08] dark:placeholder:text-white/40";

const panelClass =
  "pixel-border rounded-3xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.045]";

const statusLabels: Record<string, string> = {
  new: "Новая",
  "in-progress": "В работе",
  done: "Готово"
};

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
  const [notice, setNotice] = useState("");
  const [editorForm, setEditorForm] = useState(emptyEditorForm);
  const [portfolioForm, setPortfolioForm] = useState(emptyPortfolioForm);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);

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

    const [editors, portfolio, services, reviews, orders] = await Promise.all(responses.map((response) => response.json()));
    setData({ editors, portfolio, services, reviews, orders });
    setLoading(false);
  }, [router]);

  async function mutate(url: string, method: string, body?: unknown) {
    setNotice("");
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
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
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

  async function deleteItem(url: string) {
    if (!window.confirm("Удалить запись?")) return;
    await mutate(url, "DELETE");
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
                    <SubmitRow editing={Boolean(editorForm.id)} onCancel={() => setEditorForm(emptyEditorForm)} />
                  </form>

                  <ListPanel>
                    {data.editors.map((editor) => (
                      <AdminCard key={editor.id}>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-days text-xl tracking-normal">{editor.name}</h3>
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: editor.accentColor,
                                boxShadow: `0 0 16px ${editor.accentColor}`
                              }}
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
                    <SubmitRow editing={Boolean(portfolioForm.id)} onCancel={() => setPortfolioForm({ ...emptyPortfolioForm, editorId: data.editors[0]?.id ?? "" })} />
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
                    <SubmitRow editing={Boolean(serviceForm.id)} onCancel={() => setServiceForm(emptyServiceForm)} />
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
                    <SubmitRow editing={Boolean(reviewForm.id)} onCancel={() => setReviewForm(emptyReviewForm)} />
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

              {activeTab === "orders" ? (
                <ListPanel>
                  {data.orders.map((order) => (
                    <AdminCard key={order.id}>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-days text-xl tracking-normal">{order.clientName}</h3>
                          <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-300">
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

function SubmitRow({ editing, onCancel }: { editing: boolean; onCancel: () => void }) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
      <button
        type="submit"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-bold text-white shadow-blue transition hover:scale-[1.02]"
      >
        <Plus className="h-5 w-5" />
        {editing ? "Сохранить" : "Добавить"}
      </button>
      {editing ? (
        <button
          type="button"
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
