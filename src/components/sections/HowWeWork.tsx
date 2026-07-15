import { steps } from "@/data/mock";
import {
  FileText,
  Calculator,
  Lightbulb,
  FileCheck,
  Package,
  ClipboardCheck,
  Settings,
  Truck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

const iconMap: Record<string, LucideIcon> = {
  "file-text": FileText,
  calculator: Calculator,
  lightbulb: Lightbulb,
  "file-check": FileCheck,
  "package": Package,
  "clipboard-check": ClipboardCheck,
  settings: Settings,
  truck: Truck,
  "shield-check": ShieldCheck,
};

export default function HowWeWork() {
  return (
    <div id="how-we-work" className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="section-header">
            <span className="eyebrow">Процесс</span>
            <h2 className="section-title">
              Как мы работаем
            </h2>
            <p className="section-subtitle">
              От заявки до подписания закрывающих документов — прозрачный
              процесс на каждом этапе.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-[30px] right-[30px] top-7 z-0 hidden lg:block">
            <div className="h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {steps.map((step, idx) => {
              const Icon = iconMap[step.icon] ?? FileText;
              return (
                <FadeIn key={step.id} delay={idx * 80}>
                  <div className="group relative z-10 text-center lg:text-left">
                    <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground ring-8 ring-background lg:mx-0">
                      <Icon size={22} />
                    </div>
                    <div className="mb-2 font-mono text-xs text-copper-400">
                      Шаг {String(step.number).padStart(2, "0")}
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
