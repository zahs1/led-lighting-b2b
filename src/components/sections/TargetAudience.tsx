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
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow">Кому мы подходим</span>
            <h2 className="mx-auto mt-4 mb-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Работаем с профессионалами
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted">
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
                <div className="card-base group h-full p-6 hover:border-amber-500/40 hover:bg-card-hover hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20">
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
                        className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted"
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
