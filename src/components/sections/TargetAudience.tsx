import { audienceCards } from "@/data/mock";
import {
  Building2,
  Wrench,
  Ruler,
  Package,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

const iconMap: Record<string, LucideIcon> = {
  wrench: Wrench,
  building: Building2,
  ruler: Ruler,
  package: Package,
  key: KeyRound,
};

export default function TargetAudience() {
  return (
    <div id="target-audience" className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="section-header">
            <span className="eyebrow">Кому мы подходим</span>
            <h2 className="section-title">
              Работаем с профессионалами
            </h2>
            <p className="section-subtitle">
              Понимаем специфику каждой аудитории. Находим индивидуальный подход
              к клиентам любого масштаба.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {audienceCards.map((card, idx) => {
            const Icon = iconMap[card.icon] ?? Building2;
            return (
              <FadeIn key={card.title} delay={idx * 80}>
                <div className="card-base group h-full p-6 transition-all duration-200 hover:border-border-strong hover:shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-copper-400 transition-colors group-hover:border-copper-500/30 group-hover:bg-copper-500/5">
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted">
                    {card.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.features.map((feat) => (
                      <span
                        key={feat}
                        className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
