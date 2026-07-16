"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Layers3 } from "lucide-react";
import Modal from "@/components/Modal";
import LeadForm from "@/components/LeadForm";
import Counter from "@/components/Counter";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useInView } from "@/hooks/useInView";
import { projects } from "@/data/mock";

/**
 * Optional hero background video. Drop a file into Vercel Blob (already a
 * project dependency) and set NEXT_PUBLIC_HERO_VIDEO to its URL — the hero
 * swaps the still image for an autoplaying loop with no code change.
 * Omit it and the existing /images/hero.jpg is used (poster for the video).
 */
const HERO_VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO;

// Headline tokens for staggered word reveal.
const HEADLINE_ACCENT = ["для", "вашего", "бизнеса"];

export default function HeroSection() {
  const [cpModal, setCpModal] = useState(false);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const magneticRef = useMagnetic<HTMLButtonElement>({ strength: 0.25 });
  const { ref: headlineRef, inView: headlineIn } =
    useInView<HTMLHeadingElement>({ threshold: 0.35 });
  const proof = projects[0];

  const onCursorParallax = (event: React.MouseEvent<HTMLDivElement>) => {
    const layer = atmosphereRef.current;
    if (!layer) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 24;
    const y = (event.clientY / window.innerHeight - 0.5) * 24;
    layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <>
      <section
        onMouseMove={onCursorParallax}
        className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-900 to-background"
      >
        {/* Atmosphere — grid + sweeping spotlight + pulsing glow (cursor-parallax) */}
        <div
          ref={atmosphereRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        >
          <div className="hairline-grid absolute inset-0 opacity-40" />
          <div className="spotlight absolute -left-1/4 top-0 h-[700px] w-[700px] rounded-full bg-copper-500/10 blur-[140px]" />
          <div className="glow-pulse absolute -right-24 bottom-0 h-[460px] w-[460px] rounded-full bg-copper-500/[0.06] blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 h-px w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-copper-400/20 to-transparent" />
        </div>

        <div className="container-custom relative">
          <div className="grid grid-cols-1 items-center gap-16 pb-24 pt-16 md:pb-32 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            {/* ── Left: copy ── */}
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 font-mono text-xs font-medium text-muted backdrop-blur">
                <span className="glow-pulse h-1.5 w-1.5 rounded-full bg-copper-500" />
                Собственное производство · РФ
              </span>

              <h1
                ref={headlineRef}
                className={`mt-8 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.08] tracking-tight text-foreground ${
                  headlineIn ? "is-visible" : ""
                }`}
              >
                <span
                  className="reveal-word mr-[0.28em]"
                  style={{ transitionDelay: "0ms" }}
                >
                  LED-светильники
                </span>
                {HEADLINE_ACCENT.map((word, i) => (
                  <span
                    key={word}
                    className="reveal-word text-gradient-copper"
                    style={{ transitionDelay: `${140 + i * 90}ms` }}
                  >
                    {word}
                    {i < HEADLINE_ACCENT.length - 1 ? " " : ""}
                  </span>
                ))}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Производим, поставляем и делаем светотехнический расчёт под ваш
                объект. Гарантия до 5 лет. Отгрузка по всей РФ и ЕАЭС.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  ref={magneticRef}
                  onClick={() => setCpModal(true)}
                  className="btn-primary magnetic px-8 py-4 text-base"
                >
                  <span className="magnetic-inner items-center gap-2">
                    Получить КП
                    <ArrowRight size={18} />
                  </span>
                </button>
                <a
                  href="#categories"
                  className="btn-secondary px-8 py-4 text-base"
                >
                  Смотреть каталог
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-subtle">
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

            {/* ── Right: media + floating proof ── */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)]">
                {HERO_VIDEO ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/images/hero.jpg"
                  >
                    <source src={HERO_VIDEO} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src="/images/hero.jpg"
                    alt="Светодиодные светильники в офисе"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}
                {/* inner glaze */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-copper-400/10" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-copper-500/10 via-transparent to-transparent" />
              </div>

              {/* Floating stat chip — objects delivered */}
              <div
                className="float-y absolute -left-3 top-10 hidden rounded-xl border border-border bg-card/90 px-4 py-3 shadow-lg backdrop-blur md:block"
                style={{ animationDelay: "1.2s" }}
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                  Объектов сдано
                </div>
                <div className="text-xl font-bold text-foreground">
                  <Counter to={500} suffix="+" />
                </div>
              </div>

              {/* Floating stat chip — avg payback */}
              <div
                className="float-y absolute -right-3 bottom-24 hidden rounded-xl border border-border bg-card/90 px-4 py-3 shadow-lg backdrop-blur md:block"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                  Экономия энергии
                </div>
                <div className="text-xl font-bold text-copper-400">
                  <Counter to={70} suffix="%" />
                </div>
              </div>

              {/* Proof → latest case */}
              {proof && (
                <a
                  href="#projects"
                  className="group mt-5 flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-all duration-200 hover:border-border-strong hover:shadow-lg"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-copper-400">
                      <Layers3 size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {proof.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
                        <MapPin size={11} />
                        {proof.description}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs font-medium text-copper-400">
                    Кейсы
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

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
