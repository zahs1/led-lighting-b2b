"use client";

import { useEffect, useRef, useState } from "react";
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
  package: Package,
  "clipboard-check": ClipboardCheck,
  settings: Settings,
  truck: Truck,
  "shield-check": ShieldCheck,
};

export default function HowWeWork() {
  const [active, setActive] = useState(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Activate whichever step crosses the viewport's vertical center.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            const step = steps[idx];
            if (step) setActive(step.number);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const activeStep = steps.find((s) => s.number === active) ?? steps[0];

  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* ── Sticky explainer panel ── */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <FadeIn>
              <span className="eyebrow">Процесс</span>
              <h2 className="mt-4 mb-4 max-w-md text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Как мы работаем
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-muted">
                От заявки до подписания закрывающих документов — прозрачный
                процесс на каждом этапе.
              </p>
            </FadeIn>

            {/* Live step display */}
            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-5xl font-bold tabular-nums text-copper-400">
                  {String(activeStep.number).padStart(2, "0")}
                </span>
                <span className="font-mono text-sm text-subtle">
                  / {String(steps.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-bold text-foreground">
                {activeStep.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {activeStep.description}
              </p>
              {/* Progress */}
              <div
                className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface"
                role="progressbar"
                aria-valuenow={activeStep.number}
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-label={`Шаг ${activeStep.number} из ${steps.length}`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-copper-500 to-copper-300 transition-[width] duration-500 ease-out"
                  style={{
                    width: `${(activeStep.number / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Steps list ── */}
          <div className="relative">
            {steps.map((step, idx) => {
              const Icon = iconMap[step.icon] ?? FileText;
              const isActive = step.number === activeStep.number;
              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  data-idx={idx}
                  className={`group relative mb-3 flex gap-4 rounded-xl border p-5 transition-all duration-300 ${
                    isActive
                      ? "border-copper-400/40 bg-card shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)]"
                      : "border-border bg-card/40 hover:bg-card/70"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isActive
                        ? "border-copper-400/40 bg-copper-500/10 text-copper-400"
                        : "border-border bg-surface text-foreground"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-copper-400">
                      Шаг {String(step.number).padStart(2, "0")}
                    </span>
                    <h4 className="mt-0.5 text-base font-semibold text-foreground">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                  {/* Active indicator rail */}
                  <span
                    className={`absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full bg-copper-400 transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
