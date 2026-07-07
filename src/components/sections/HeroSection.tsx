"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Truck,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import Modal from "@/components/Modal";
import LeadForm from "@/components/LeadForm";

export default function HeroSection() {
  const [cpModal, setCpModal] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Amber ambient glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-amber-400/5 blur-3xl" />

        <div className="container-custom relative">
          <div className="flex flex-col items-center gap-12 py-24 md:py-32 lg:flex-row lg:gap-20">
            <div className="max-w-2xl flex-1 text-center lg:text-left">
              <span className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Собственное производство в РФ
              </span>

              <h1 className="mb-6 text-5xl font-bold leading-[1.08] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                LED-светильники
                <br />
                <span className="text-gradient-amber">для вашего бизнеса</span>
              </h1>

              <p className="mx-auto mb-10 max-w-xl text-xl leading-relaxed text-muted lg:mx-0 md:text-2xl">
                Производство, поставка и светотехнический расчёт. Гарантия до 5
                лет. Работаем по всей РФ и ЕАЭС.
              </p>

              <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <button onClick={() => setCpModal(true)} className="btn-primary !px-8 !py-4 text-lg">
                  Получить КП
                  <ArrowRight size={20} />
                </button>
                <a href="#categories" className="btn-secondary !px-8 !py-4 text-lg">
                  <LayoutGrid size={20} />
                  Смотреть каталог
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted lg:justify-start">
                <span className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-400" />
                  Светотехнический расчёт
                </span>
                <span className="flex items-center gap-2">
                  <Truck size={16} className="text-amber-400" />
                  Доставка по всей РФ
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-400" />
                  Гарантия до 5 лет
                </span>
              </div>
            </div>

            <div className="hidden w-full max-w-xl flex-1 md:block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/50">
                <Image
                  src="https://images.unsplash.com/photo-1565636192335-b228011032a4?w=800&q=85"
                  alt="Светодиодные светильники в офисе"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/40 via-transparent to-transparent" />
                <div className="glass animate-float absolute -bottom-3 -left-3 max-w-[210px] rounded-2xl px-5 py-4 shadow-xl shadow-black/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
                      <CheckCircle size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold leading-none text-foreground">
                        53 000+
                      </p>
                      <p className="text-xs text-muted">светильников отгружено</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={cpModal}
        onClose={() => setCpModal(false)}
        title="Получить коммерческое предложение"
      >
        <LeadForm onSuccess={() => setCpModal(false)} />
      </Modal>
    </>
  );
}
