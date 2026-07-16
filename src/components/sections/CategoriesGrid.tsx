import { categories } from "@/data/mock";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Warehouse,
  Lightbulb,
  LampCeiling,
  Sofa,
  Sparkles,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

const categoryIcons: Record<string, React.ReactNode> = {
  office: <Building2 size={22} />,
  industrial: <Warehouse size={22} />,
  street: <Lightbulb size={22} />,
  linear: <LampCeiling size={22} />,
  home: <Sofa size={22} />,
  custom: <Sparkles size={22} />,
};

/** Bento spans — index aligns with categories order in mock.ts. */
const bentoClass = (idx: number): string => {
  if (idx === 0) return "sm:col-span-2 lg:col-span-2 lg:row-span-2"; // office (anchor)
  if (idx === 1) return "lg:col-span-2"; // industrial (wide)
  if (idx === 4) return "sm:col-span-2 lg:col-span-2"; // home
  if (idx === 5) return "sm:col-span-2 lg:col-span-2"; // custom
  return ""; // street, linear
};

export default function CategoriesGrid() {
  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="section-header">
            <span className="eyebrow">Каталог</span>
            <h2 className="section-title">Категории светильников</h2>
            <p className="section-subtitle">
              Широкий ассортимент LED-светильников для любых задач — от офиса до
              промышленного объекта.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[224px] lg:gap-5">
          {categories.map((cat, idx) => {
            const isAnchor = idx === 0;

            return (
              <FadeIn
                key={cat.id}
                delay={idx * 70}
                variant={isAnchor ? "scale" : "up"}
                className={`h-full ${bentoClass(idx)}`}
              >
                <a
                  href="#popular-models"
                  className={`group sheen edge-glow relative flex h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-border-strong hover:shadow-xl ${
                    isAnchor ? "min-h-[300px] flex-col justify-end" : "flex-col"
                  }`}
                >
                  {/* Media */}
                  <div
                    className={`relative overflow-hidden bg-surface ${
                      isAnchor
                        ? "absolute inset-0"
                        : // min-h критичен для next/image fill: без явной высоты
                          // родителя (на mobile flex-col card без auto-rows) Image
                          // получает height 0 и не рендерится.
                          "aspect-[16/10] min-h-[180px] flex-1"
                    }`}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="parallax-y object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      sizes={
                        isAnchor
                          ? "(max-width: 1024px) 100vw, 50vw"
                          : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      }
                      priority={isAnchor}
                    />
                    {isAnchor && (
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
                    )}

                    {/* Power badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="rounded-md border border-border bg-background/85 px-2.5 py-1 font-mono text-xs font-medium text-foreground backdrop-blur">
                        {cat.powerRange}
                      </span>
                    </div>
                    {/* Icon chip */}
                    <div className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/85 text-copper-400 backdrop-blur">
                      {categoryIcons[cat.slug] ?? <Lightbulb size={20} />}
                    </div>
                  </div>

                  {/* Caption */}
                  <div
                    className={isAnchor ? "relative z-10 p-6 lg:p-7" : "p-4"}
                  >
                    {isAnchor && (
                      <span className="eyebrow mb-2">Флагман категории</span>
                    )}
                    <h3
                      className={`font-semibold text-foreground transition-colors group-hover:text-copper-400 ${
                        isAnchor ? "text-2xl lg:text-3xl" : "mb-1 text-base"
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed text-muted ${
                        isAnchor ? "mt-2 max-w-md" : "line-clamp-2"
                      }`}
                    >
                      {cat.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-copper-400 transition-all group-hover:gap-3">
                      Смотреть модели
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
