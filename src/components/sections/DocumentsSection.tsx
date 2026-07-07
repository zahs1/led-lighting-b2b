import {
  FileCheck,
  ShieldCheck,
  FileText,
  ScrollText,
  ArrowRight,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import type { LucideIcon } from "lucide-react";

const documents: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: FileCheck,
    title: "Сертификаты соответствия",
    desc: "Декларации ТР ТС и EAC на все серии светильников. Пожарные и гигиенические сертификаты.",
  },
  {
    icon: FileText,
    title: "Паспорта изделий",
    desc: "Технические паспорта с характеристиками, схемами подключения и инструкциями по монтажу.",
  },
  {
    icon: ScrollText,
    title: "Протоколы испытаний",
    desc: "Результаты фотометрических и климатических испытаний из собственной лаборатории.",
  },
  {
    icon: ShieldCheck,
    title: "Гарантия 5 лет",
    desc: "Бесплатное гарантийное обслуживание. Сервисные центры в 12 городах РФ. Постгарантийный ремонт.",
  },
];

export default function DocumentsSection() {
  return (
    <div id="documents" className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow">Документация</span>
            <h2 className="mx-auto mt-4 mb-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Документы и гарантия
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted">
              Предоставляем полный пакет документов на каждую партию. Гарантия до
              5 лет на все светильники.
            </p>
          </div>
        </FadeIn>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {documents.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={idx * 80}>
                <div className="card-base h-full p-6 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={120}>
          <div className="text-center">
            <a href="#final-form" className="btn-primary">
              Запросить пакет документов
              <ArrowRight size={18} />
            </a>
            <p className="mt-3 text-sm text-subtle">
              Пришлём сертификаты, паспорта и гарантийный талон на ваш email.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
