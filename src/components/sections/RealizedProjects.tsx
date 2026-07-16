import { projects } from "@/data/mock";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import Counter from "@/components/Counter";
import type { Project } from "@/types";

function MetricRow({ project }: { project: Project }) {
  if (!project.metrics?.length) return null;
  return (
    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
      {project.metrics.slice(0, 3).map((m) => (
        <div key={m.label}>
          <div className="text-lg font-bold text-foreground lg:text-xl">
            <Counter
              to={m.value}
              prefix={m.prefix}
              suffix={m.suffix}
              decimals={m.decimals}
            />
          </div>
          <div className="mt-0.5 text-[11px] leading-tight text-subtle">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RealizedProjects() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p.id !== featured.id).slice(0, 5);

  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow">Портфолио</span>
            <h2 className="section-title">Реализованные проекты</h2>
            <p className="section-subtitle">
              Более 500 объектов по всей России — от офисов до промышленных
              комплексов. Цифры, а не обещания.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[232px]">
          {/* Featured case — large overlay card */}
          <FadeIn variant="scale" className="lg:col-span-2 lg:row-span-2">
            <div className="group sheen edge-glow relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-xl border border-border">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="parallax-y object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />

              <div className="relative z-10 p-6 lg:p-8">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-md border border-copper-400/30 bg-copper-500/10 px-2.5 py-1 font-mono text-xs font-medium text-copper-400">
                    Флагман-кейс
                  </span>
                  <span className="rounded-md border border-border bg-background/70 px-2.5 py-1 font-mono text-xs font-medium text-foreground backdrop-blur">
                    {featured.category}
                  </span>
                </div>
                <h3 className="max-w-lg text-2xl font-bold text-foreground lg:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                  {featured.description}
                </p>
                <MetricRow project={featured} />
              </div>
            </div>
          </FadeIn>

          {/* Compact tiles */}
          {rest.map((project, idx) => (
            <FadeIn key={project.id} delay={idx * 70}>
              <div className="group sheen relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-border-strong hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="parallax-y object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute left-3 top-3 rounded-md border border-border bg-background/85 px-2.5 py-1 font-mono text-xs font-medium text-foreground backdrop-blur">
                    {project.category}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="absolute right-3 top-3 text-copper-400 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-[15px] font-semibold text-foreground transition-colors group-hover:text-copper-400">
                    {project.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  {project.metrics?.[0] && (
                    <div className="mt-auto pt-3">
                      <span className="font-mono text-xs text-subtle">
                        {project.metrics[0].value.toLocaleString("ru-RU")}
                        {project.metrics[0].suffix ?? ""}{" "}
                        {project.metrics[0].label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
