import { TimaxLogo } from "@/components/TimaxLogo";

export function Footer() {
  return (
    <footer
      id="contacts"
      className="section-surface relative scroll-mt-24 border-t border-black/10 px-4 pb-14 pt-24 dark:border-white/10 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <TimaxLogo footer />

        <div className="liquid-glass mt-9 w-full max-w-2xl rounded-3xl border border-blue-500/25 bg-white/55 p-6 shadow-blue backdrop-blur-xl dark:bg-white/[0.07] sm:p-8">
          <p className="font-days text-3xl tracking-normal sm:text-4xl">Наш телеграм канал</p>
          <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-8 text-black/85 dark:text-white/90">
            Подпишись на наш телеграм канал, чтобы всегда быть в курсе всех новостей!
          </p>
          <p className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-300">
            Анонсы, новые работы, обновления и быстрые новости Timax.
          </p>
          <a
            href="https://t.me/timaxvideo"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex min-h-14 w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-blue-500 px-6 py-4 font-bold text-white shadow-blue transition hover:scale-[1.02] hover:bg-blue-400"
          >
            <TelegramIcon className="h-6 w-6" />
            Telegram
          </a>
        </div>

        <p className="mt-8 text-sm text-black/50 dark:text-white/50">© 2026 Timax. Все права защищены.</p>
      </div>
    </footer>
  );
}

function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.5 4.7 18.4 19c-.23 1.04-.86 1.29-1.73.8l-4.78-3.52-2.3 2.22c-.26.25-.47.46-.97.46l.34-4.86 8.84-7.99c.38-.34-.08-.53-.6-.19L6.27 12.8 1.56 11.33c-1.02-.32-1.04-1.02.22-1.51L20.2 2.72c.86-.32 1.61.2 1.3 1.98Z"
        fill="currentColor"
      />
    </svg>
  );
}
