import { advantages } from "@/data/mock";
import {
  Factory,
  Award,
  BadgeCheck,
  Clock,
  Headphones,
  Wrench,
  Paintbrush,
  Ruler,
  Users,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

const iconMap: Record<string, LucideIcon> = {
  factory: Factory,
  certificate: Award,
  badge: BadgeCheck,
  clock: Clock,
  headphones: Headphones,
  wrench: Wrench,
  paintbrush: Paintbrush,
  ruler: Ruler,
  users: Users,
  leaf: Leaf,
};

export default function WhyChooseUs() {
  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow">Преимущества</span>
            <h2 className="mx-auto mt-4 mb-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Почему выбирают нас
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted">
              10 лет на рынке светотехники. Собственное производство,
              инженерный центр и гарантия качества.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {advantages.slice(0, 10).map((adv, idx) => {
            const Icon = iconMap[adv.icon] ?? BadgeCheck;
            return (
              <FadeIn key={adv.id} delay={idx * 60}>
                <div className="card-base group h-full p-6 text-center hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-black">
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                    {adv.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted">
                    {adv.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
