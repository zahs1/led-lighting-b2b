"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Modal from "@/components/Modal";
import LeadForm from "@/components/LeadForm";
import { projects } from "@/data/mock";

export default function HeroSection() {
  const [cpModal, setCpModal] = useState(false);
  const proof = projects[0];

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="container-custom relative">
          <div className="grid grid-cols-1 items-center gap-16 pb-24 pt-16 md:pb-32 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-copper-500" />
                Собственное производство · РФ
              </span>

              <h1 className="mt-8 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-foreground">
                LED-светильники
                <br />
                <span className="text-copper-400">для вашего бизнеса</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Производим, поставляем и делаем светотехнический расчёт под ваш
                объект. Гарантия до 5 лет. Отгрузка по всей РФ и ЕАЭС.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setCpModal(true)}
                  className="btn-primary px-8 py-4 text-base"
                >
                  Получить КП
                  <ArrowRight size={18} />
                </button>
                <a
                  href="#categories"
                  className="btn-secondary px-8 py-4 text-base"
                >
                  Смотреть каталог
                </a>
              </div>

              <div className="mt-10 flex items-center gap-6 font-mono text-xs text-subtle">
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-copper-500/60" />
                  Расчёт Dialux EVO
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-copper-500/60" />
                  Гарантия до 5 лет
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-copper-500/60" />
                  Отгрузка от 1 дня
                </span>
              </div>
            </div>

            <div className="w-full">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 shadow-sm">
                <Image
                  src="/images/hero.jpg"
                  alt="Светодиодные светильники в офисе"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {proof && (
                <a
                  href="#projects"
                  className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-all duration-200 hover:border-border-strong hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {proof.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {proof.description}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs font-medium text-copper-400">
                    Кейсы
                    <ArrowRight size={14} />
                  </span>
                </a>
              )}
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
