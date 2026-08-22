"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, KeyRound, ShieldCheck, UserCog } from "lucide-react";
import type { AdminRole } from "@/lib/auth";
import { CONTENT_PERMISSION_KEYS } from "@/lib/content";

type AdminUser = {
  id: string;
  username: string;
  role: AdminRole;
  isActive: boolean;
  twoFactorEnabled: boolean;
  permissions: string;
};

type AdminSecurityProps = {
  currentUserId?: string;
  currentUserTwoFactorEnabled: boolean;
  isSuperAdmin: boolean;
  users: AdminUser[];
  onUsersChange: () => void;
};

const permissionLabels: Record<string, string> = {
  "content.hero.edit": "Редактировать Hero",
  "content.about.edit": "Редактировать «О нас»",
  "content.workflow.edit": "Редактировать процесс работы",
  "content.guarantees.edit": "Редактировать гарантии",
  "content.faq.edit": "Редактировать FAQ",
  "content.pricing.edit": "Редактировать цены",
  "content.portfolio.edit": "Редактировать портфолио",
  "content.reviews.edit": "Редактировать отзывы",
  "content.contacts.edit": "Редактировать контакты",
  "content.disclaimer.edit": "Редактировать дисклеймер",
  "content.blog.edit": "Редактировать советы и блог",
  "content.editors.edit": "Управлять редакторами",
  "content.sections.edit": "Управлять секциями",
  "orders.view": "Просматривать заявки",
  "orders.manage": "Управлять заявками",
  "users.manage": "Управлять пользователями",
  "permissions.manage": "Управлять разрешениями",
  change_password: "Смена пароля",
  "audit.view": "Просматривать журнал действий",
  "security.manage": "Управлять безопасностью"
};

const contentPermissions = CONTENT_PERMISSION_KEYS.filter((key) => key.startsWith("content."));
const orderPermissions = CONTENT_PERMISSION_KEYS.filter((key) => key.startsWith("orders."));
const adminPermissions = CONTENT_PERMISSION_KEYS.filter((key) => !key.startsWith("content.") && !key.startsWith("orders."));

const fieldClass = "w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15";

export function AdminSecurity({ currentUserId, currentUserTwoFactorEnabled, isSuperAdmin, users, onUsersChange }: AdminSecurityProps) {
  const [setup, setSetup] = useState<{ secret: string; qrCode: string } | null>(null);
  const [targetUserId, setTargetUserId] = useState(currentUserId ?? "");
  const [code, setCode] = useState("");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedUser = users.find((user) => user.id === targetUserId);
  const targetTwoFactorEnabled = selectedUser?.twoFactorEnabled ?? currentUserTwoFactorEnabled;

  async function beginTwoFactorSetup() {
    setMessage("");
    const response = await fetch("/api/admin/2fa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetUserId }) });
    const payload = (await response.json()) as { secret?: string; qrCode?: string; message?: string };
    if (!response.ok || !payload.secret || !payload.qrCode) {
      setMessage(payload.message || "Не удалось подготовить 2FA.");
      return;
    }
    setSetup({ secret: payload.secret, qrCode: payload.qrCode });
  }

  async function confirmTwoFactor() {
    if (!setup || !code) return;
    setLoading(true);
    const response = await fetch("/api/admin/2fa", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: setup.secret, code, targetUserId }) });
    const payload = (await response.json()) as { message?: string };
    setLoading(false);
    setMessage(response.ok ? "2FA включена для аккаунта." : payload.message || "Не удалось включить 2FA.");
    if (response.ok) {
      setSetup(null);
      setCode("");
      onUsersChange();
    }
  }

  async function disableTwoFactor() {
    setLoading(true);
    const response = await fetch("/api/admin/2fa", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetUserId }) });
    setLoading(false);
    setMessage(response.ok ? "2FA отключена." : "Не удалось отключить 2FA.");
    if (response.ok) onUsersChange();
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/admin/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(passwords) });
    const payload = (await response.json()) as { message?: string };
    setLoading(false);
    setMessage(response.ok ? "Пароль изменён." : payload.message || "Не удалось изменить пароль.");
    if (response.ok) setPasswords({ currentPassword: "", newPassword: "" });
  }

  async function updateUser(user: AdminUser, changes: Record<string, unknown>) {
    const response = await fetch(`/api/admin/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(changes) });
    if (response.ok) {
      setMessage("Права обновлены. Пользователю нужно выйти и войти снова.");
      onUsersChange();
    }
  }

  return (
    <div className="grid gap-5">
      {message ? <div role="status" className="rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200">{message}</div> : null}
      <section className="rounded-3xl border border-blue-500/25 bg-white/[0.045] p-5">
        <div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-blue-400" /><h2 className="font-days text-2xl tracking-normal">Смена пароля</h2></div>
        <form onSubmit={changePassword} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className={fieldClass} type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} placeholder="Текущий пароль" required />
          <input className={fieldClass} type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} placeholder="Новый пароль: 12+ символов" required />
          <button type="submit" disabled={loading} className="rounded-2xl bg-blue-500 px-4 py-3 font-bold text-white shadow-blue disabled:opacity-50 sm:col-span-2">Изменить пароль</button>
        </form>
      </section>

      <section className="rounded-3xl border border-blue-500/25 bg-white/[0.045] p-5">
        <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-emerald-400" /><h2 className="font-days text-2xl tracking-normal">Двухфакторная защита</h2></div>
        <p className="mt-2 text-sm text-white/60">Подключите Google Authenticator, Яндекс Ключ или другое приложение TOTP.</p>
        {isSuperAdmin ? <label className="mt-4 grid gap-2 text-sm font-semibold">Аккаунт для настройки 2FA<select className={fieldClass} value={targetUserId} onChange={(event) => { setTargetUserId(event.target.value); setSetup(null); setCode(""); }}><option value="">Выберите аккаунт</option>{users.map((user) => <option key={user.id} value={user.id}>{user.username} · {user.twoFactorEnabled ? "включена" : "не подключена"}</option>)}</select></label> : null}
        {!setup ? <button type="button" disabled={targetTwoFactorEnabled} onClick={() => void beginTwoFactorSetup()} className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 font-bold text-blue-200 disabled:cursor-not-allowed disabled:opacity-60">{targetTwoFactorEnabled ? "2FA подключена" : "Подключить 2FA"}</button> : <div className="mt-4 grid gap-4 sm:grid-cols-[9rem_1fr]"><Image src={setup.qrCode} alt="QR-код для подключения 2FA" width={144} height={144} className="h-36 w-36 rounded-xl bg-white p-2" unoptimized /><div><p className="text-sm text-white/70">Отсканируйте QR-код. Если сканирование недоступно, используйте ключ:</p><code className="mt-2 block break-all rounded-xl bg-black/30 p-3 text-sm text-blue-200">{setup.secret}</code><input className={`${fieldClass} mt-3`} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Код из приложения" inputMode="numeric" /><button type="button" disabled={loading || code.length !== 6} onClick={() => void confirmTwoFactor()} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-bold text-white disabled:opacity-50"><Check className="h-4 w-4" />Подтвердить</button></div></div>}
        {targetTwoFactorEnabled ? <button type="button" disabled={loading} onClick={() => void disableTwoFactor()} className="mt-4 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 font-bold text-orange-200 disabled:opacity-50">Отключить 2FA</button> : null}
      </section>

      {isSuperAdmin ? (
        <section className="rounded-3xl border border-blue-500/25 bg-white/[0.045] p-5">
          <div className="flex items-center gap-3"><UserCog className="h-5 w-5 text-blue-400" /><h2 className="font-days text-2xl tracking-normal">Пользователи и права</h2></div>
          <p className="mt-2 text-sm text-white/55">Выберите пользователя и включите только те возможности, которые ему нужны.</p>
          <div className="mt-4 grid gap-3">
            {users.map((user) => {
              let permissions: Record<string, boolean> = {};
              try { permissions = JSON.parse(user.permissions) as Record<string, boolean>; } catch { permissions = {}; }
              const isCurrentSuperAdmin = user.id === currentUserId;
              return (
                <article key={user.id} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-semibold">{user.username} · {user.role}</p><p className="mt-1 text-xs text-white/50">2FA: {user.twoFactorEnabled ? "включена" : "не подключена"}</p></div>
                    {isCurrentSuperAdmin ? <span className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-300">Все права</span> : <button type="button" onClick={() => void updateUser(user, { isActive: !user.isActive })} className={`rounded-xl border px-3 py-2 text-sm font-bold ${user.isActive ? "border-orange-500/30 text-orange-300" : "border-emerald-500/30 text-emerald-300"}`}>{user.isActive ? "Заблокировать" : "Разблокировать"}</button>}
                  </div>
                  {!isCurrentSuperAdmin ? <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {[{ title: "Контент сайта", keys: contentPermissions }, { title: "Заявки", keys: orderPermissions }, { title: "Администрирование и безопасность", keys: adminPermissions }].map((group) => <fieldset key={group.title} className="rounded-2xl border border-white/10 p-3"><legend className="px-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-300">{group.title}</legend><div className="grid gap-2">{group.keys.map((permission) => <label key={permission} className="flex items-start gap-2 text-sm text-white/70"><input type="checkbox" checked={permissions[permission] === true} onChange={(event) => void updateUser(user, { permissions: { ...permissions, [permission]: event.target.checked } })} className="mt-0.5 accent-blue-500" />{permissionLabels[permission]}</label>)}</div></fieldset>)}
                  </div> : <p className="mt-4 text-xs text-white/45">Супер-администратор не ограничивается матрицей разрешений.</p>}
                </article>
              );
            })}
          </div>
          {!users.length ? <p className="mt-4 text-sm text-white/55">Пользователи не найдены. Выполните `npx prisma db seed` на сервере.</p> : null}
        </section>
      ) : null}
    </div>
  );
}
