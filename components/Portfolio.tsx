"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Film, Play, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SafeLogoImage } from "@/components/SafeLogoImage";
import { useClickSound } from "@/hooks/useSound";
import type { EditorDTO } from "@/lib/types";

type PortfolioProps = {
  editors: EditorDTO[];
};

type CategoryTab = "Все" | "YouTube" | "TikTok" | "Instagram" | "Др.";

type PortfolioCardItem = EditorDTO["portfolioItems"][number] & {
  editorName: string;
  editorAccentColor: string;
};

const categoryTabs: CategoryTab[] = ["Все", "YouTube", "TikTok", "Instagram", "Др."];

function resolveCategoryTab(category: string): Exclude<CategoryTab, "Все"> {
  const normalized = category.toLowerCase();

  if (normalized.includes("youtube") || normalized.includes("ютуб") || normalized.includes("shorts")) return "YouTube";
  if (normalized.includes("tiktok") || normalized.includes("tik tok") || normalized.includes("тикток")) return "TikTok";
  if (normalized.includes("instagram") || normalized.includes("inst") || normalized.includes("reels") || normalized.includes("рилс")) {
    return "Instagram";
  }

  return "Др.";
}

function sanitizeAccentColor(value?: string) {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#3B82F6";
}

function sortByCreatedAtDesc(items: PortfolioCardItem[]) {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function getPortfolioDescription(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("реклам")) return "Монтаж рекламного ролика, акцентный ритм и базовая работа со звуком.";
  if (normalized.includes("подкаст")) return "Сборка смысловых блоков, чистка звука и аккуратные перебивки.";
  if (normalized.includes("tiktok") || normalized.includes("short")) return "Динамичная нарезка, переходы под бит и акцентные титры.";
  return "Нарезка исходников, базовая цветокоррекция и оформление ключевых моментов.";
}

function interleaveByEditor(items: PortfolioCardItem[], editorIds: string[]) {
  const sortedItems = sortByCreatedAtDesc(items);
  const groupedItems = new Map<string, PortfolioCardItem[]>();
  const orderedItems: PortfolioCardItem[] = [];

  editorIds.forEach((editorId) => groupedItems.set(editorId, []));

  sortedItems.forEach((item) => {
    const group = groupedItems.get(item.editorId);

    if (group) {
      group.push(item);
    } else {
      orderedItems.push(item);
    }
  });

  let groupIndex = 0;
  let didAddItem = true;

  while (didAddItem) {
    didAddItem = false;

    editorIds.forEach((editorId) => {
      const item = groupedItems.get(editorId)?.[groupIndex];

      if (item) {
        orderedItems.push(item);
        didAddItem = true;
      }
    });

    groupIndex += 1;
  }

  return orderedItems;
}

export function Portfolio({ editors }: PortfolioProps) {
  const playClick = useClickSound();
  const [priorityEditorId, setPriorityEditorId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>("Все");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true
  });

  const allItems = useMemo<PortfolioCardItem[]>(
    () =>
      editors.flatMap((editor) =>
        editor.portfolioItems.map((item) => ({
          ...item,
          editorName: item.editorName ?? editor.name,
          editorAccentColor: item.editorAccentColor ?? editor.accentColor
        }))
      ),
    [editors]
  );

  const editorIds = useMemo(() => editors.map((editor) => editor.id), [editors]);

  const filteredItems = useMemo(() => {
    const items =
      selectedCategory === "Все"
        ? allItems
        : allItems.filter((item) => resolveCategoryTab(item.category) === selectedCategory);

    if (!priorityEditorId) return interleaveByEditor(items, editorIds);

    const priorityItems = sortByCreatedAtDesc(items.filter((item) => item.editorId === priorityEditorId));
    const restItems = interleaveByEditor(
      items.filter((item) => item.editorId !== priorityEditorId),
      editorIds.filter((editorId) => editorId !== priorityEditorId)
    );

    return [...priorityItems, ...restItems];
  }, [allItems, editorIds, priorityEditorId, selectedCategory]);

  useEffect(() => {
    emblaApi?.reInit();
    emblaApi?.scrollTo(0);
  }, [emblaApi, filteredItems.length, priorityEditorId, selectedCategory]);

  return (
    <section id="portfolio" className="section-surface relative scroll-mt-24 px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
              <Film className="h-4 w-4" />
              Портфолио
            </div>
            <h2 className="font-days text-4xl tracking-normal md:text-6xl">Наши работы</h2>
          </div>
        </div>

        {editors.length ? (
          <div className="space-y-5 sm:space-y-8">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
                {categoryTabs.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      playClick();
                      setSelectedCategory(category);
                    }}
                    className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      category === selectedCategory
                        ? "border-blue-500/40 bg-blue-500/12 text-white shadow-blue"
                        : "border-white/8 bg-white/[0.02] text-slate-300 hover:border-blue-400/30 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <label className="inline-flex items-center gap-3 rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-bold text-black/70 dark:border-white/10 dark:bg-white/[0.08] dark:text-white/70">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-blue-500" />
                <span className="shrink-0">Сначала</span>
                <select
                  value={priorityEditorId}
                  onChange={(event) => setPriorityEditorId(event.target.value)}
                  className="min-w-0 bg-transparent font-bold outline-none"
                >
                  <option value="">все монтажёры</option>
                  {editors.map((editor) => (
                    <option key={editor.id} value={editor.id}>
                      {editor.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="overflow-hidden py-1" ref={emblaRef}>
              <div className="-ml-4 flex touch-pan-y">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="min-w-0 shrink-0 grow-0 basis-[86%] pl-4 sm:basis-[58%] lg:basis-[38%] xl:basis-[31%]"
                  >
                    <div className="tech-panel animated-card liquid-glass flex h-full flex-col overflow-hidden rounded-[1.7rem] p-2.5 dark:bg-white/[0.045] sm:p-3">
                      <PortfolioVideo youtubeId={item.youtubeId} title={item.title} />
                      <div className="flex flex-1 flex-col p-2 sm:p-3">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-300">
                          <Play className="h-3.5 w-3.5" />
                          {resolveCategoryTab(item.category)}
                        </div>
                        <h3 className="min-h-12 flex-1 text-sm font-bold leading-6 sm:min-h-14 sm:text-lg sm:leading-7">{item.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-white/55">{getPortfolioDescription(item.title)}</p>
                        <EditorBadge name={item.editorName} accentColor={item.editorAccentColor} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {!filteredItems.length ? (
              <div className="rounded-3xl border border-dashed border-blue-500/30 bg-blue-500/[0.08] p-8 text-center text-black/60 dark:text-white/60">
                Работы для этой категории скоро появятся.
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-blue-500/30 bg-blue-500/[0.08] p-8 text-center text-black/60 dark:text-white/60">
            Работы скоро появятся.
          </div>
        )}
      </div>
    </section>
  );
}

function PortfolioVideo({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const playClick = useClickSound();
  const safeYoutubeId = encodeURIComponent(youtubeId.trim());
  const thumbnail = `https://i.ytimg.com/vi/${safeYoutubeId}/hqdefault.jpg`;

  return (
    <div className="aspect-video max-h-[300px] overflow-hidden rounded-2xl bg-black sm:max-h-[500px]">
      {loaded ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${safeYoutubeId}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          aria-label={`Воспроизвести ${title}`}
          onClick={() => {
            playClick();
            setLoaded(true);
          }}
          className="group relative flex h-full w-full items-center justify-center overflow-hidden"
        >
          <SafeLogoImage sources={[thumbnail]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-b from-black/[0.08] to-black/[0.42]" />
          <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-blue transition group-hover:scale-[1.04]">
            <Play className="ml-1 h-6 w-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}

function EditorBadge({ name, accentColor }: { name: string; accentColor?: string }) {
  const accent = sanitizeAccentColor(accentColor);

  return (
    <div className="mt-auto self-start inline-flex w-fit items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-2.5 py-1.5 text-[0.68rem] font-bold leading-none text-black/65 dark:border-white/10 dark:bg-white/[0.07] dark:text-white/70">
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full"
        style={{ backgroundColor: `${accent}22` }}
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
      </span>
      <span>сделал {name}</span>
    </div>
  );
}
