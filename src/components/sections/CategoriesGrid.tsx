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
          <div className="section-header">
            <span className="eyebrow">Каталог</span>
            <h2 className="section-title">
              Категории светильников
            </h2>
            <p className="section-subtitle">
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
                className="card-base group block overflow-hidden transition-all duration-200 hover:border-border-strong hover:shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-md border border-border bg-background/90 px-2.5 py-1 font-mono text-xs font-medium text-foreground">
                      {cat.powerRange}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/90 text-foreground">
                    {categoryIcons[cat.slug] ?? <Lightbulb size={20} />}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-copper-400">
                    {cat.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-copper-400 transition-all group-hover:gap-3">
                    Смотреть модели
                    <ArrowRight size={14} />
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
