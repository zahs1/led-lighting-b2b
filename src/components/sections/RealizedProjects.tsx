import { projects } from "@/data/mock";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export default function RealizedProjects() {
  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow">Портфолио</span>
            <h2 className="mx-auto mt-4 mb-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Реализованные проекты
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted">
              Более 500 объектов по всей России. От офисов до промышленных
              комплексов.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project, idx) => (
            <FadeIn key={project.id} delay={idx * 60}>
              <div className="card-base group h-full overflow-hidden transition-colors hover:border-border-strong">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className="absolute left-3 top-3 rounded-md border border-border bg-background/90 px-2.5 py-1 font-mono text-xs font-medium text-foreground">
                    {project.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
