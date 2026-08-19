"use client";

import { LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TimaxLogo } from "@/components/TimaxLogo";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Неверный пароль.");
      return;
    }

    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-black dark:bg-timax-black dark:text-white">
      <div className="absolute inset-0 bg-pixel-grid bg-[length:34px_34px] opacity-[0.06]" />
      <form
        onSubmit={handleSubmit}
        className="pixel-border-blue relative z-10 w-full max-w-md rounded-3xl border border-blue-500/30 bg-white p-6 shadow-blue dark:bg-[#090909]"
      >
        <div className="mb-8 flex items-center justify-between">
          <TimaxLogo />
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <LockKeyhole className="h-6 w-6" />
          </div>
        </div>
        <h1 className="font-days text-3xl tracking-normal">Админ панель</h1>
        <label className="mt-6 grid gap-2 text-sm font-semibold">
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/10 dark:bg-white/[0.08]"
            placeholder="Введите пароль"
          />
        </label>
        {error ? <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-blue-500 px-5 py-4 font-bold text-white shadow-blue transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Проверяем..." : "Войти"}
        </button>
      </form>
    </main>
  );
}
