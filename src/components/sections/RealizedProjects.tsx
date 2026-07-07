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
              <div className="card-base group h-full overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-sm">
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
