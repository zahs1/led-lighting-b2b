import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Алексей Смирнов",
    role: "Руководитель отдела снабжения",
    company: "ООО «СтройГрупп»",
    text: "Работаем с LEDLight уже третий год. Стабильное качество, чёткие сроки, всегда есть на складе. Отдельное спасибо за светотехнический расчёт — помогли оптимизировать проект и сэкономить 15% бюджета.",
    image: "/images/avatar-1.jpg",
  },
  {
    id: 2,
    name: "Елена Кузнецова",
    role: "Главный инженер проектов",
    company: "АО «ПромСвет»",
    text: "Перешли на LEDLight после тестирования образцов. Их промышленные светильники показали лучшие характеристики в нашем цехе. Предоставили полные протоколы испытаний — для нас это было важно.",
    image: "/images/avatar-2.jpg",
  },
  {
    id: 3,
    name: "Дмитрий Орлов",
    role: "Директор по развитию",
    company: "УК «РегионСтрой»",
    text: "Оснастили 8 наших объектов светильниками LEDLight. Ни одного нарекания за два года. Гарантийный случай обработали за 2 дня — заменили светильник без вопросов. Рекомендуем как надёжного партнёра.",
    image: "/images/avatar-3.jpg",
  },
];

const partners = [
  "СтройГрупп",
  "ПромСвет",
  "РегионСтрой",
  "Северсталь",
  "Метрополис",
  "PNK Парк",
];

export default function TestimonialsSection() {
  return (
    <div id="testimonials" className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow">Отзывы</span>
            <h2 className="mx-auto mt-4 mb-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Нам доверяют
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted">
              Более 500 постоянных клиентов по всей России. Вот что говорят о
              нас.
            </p>
          </div>
        </FadeIn>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 100}>
              <div className="card-base flex h-full flex-col p-6 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5">
                <Quote size={24} className="mb-4 shrink-0 text-amber-500/40" />
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                  {item.text}
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-subtle">
                      {item.role}, {item.company}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={120}>
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              Среди наших клиентов
            </span>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((name, idx) => (
              <FadeIn key={name} delay={idx * 60}>
                <div className="flex h-12 w-32 items-center justify-center rounded-lg border border-border bg-card px-3">
                  <span className="text-sm font-semibold tracking-tight text-muted">
                    {name}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
