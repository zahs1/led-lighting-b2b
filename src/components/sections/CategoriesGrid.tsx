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

export default function CategoriesGrid() {
  return (
    <div id="categories" className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow">Каталог</span>
            <h2 className="mx-auto mt-4 mb-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Категории светильников
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted">
              Широкий ассортимент LED-светильников для любых задач — от офиса до
              промышленного объекта.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <FadeIn key={cat.id} delay={idx * 80}>
              <a
                href="#popular-models"
                className="card-base group block overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm">
                      {cat.powerRange}
                    </span>
                  </div>
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-amber-400 backdrop-blur-sm">
                    {categoryIcons[cat.slug] ?? <Lightbulb size={22} />}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-amber-400">
                    {cat.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 transition-all group-hover:gap-3">
                    Смотреть модели
                    <ArrowRight size={15} />
                  </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
