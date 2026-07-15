import FadeIn from "@/components/FadeIn";

const points = [
  {
    figure: "Полный цикл",
    label: "Собственное производство",
    text: "Завод в Московской области: от входного контроля компонентов до тестирования каждой партии.",
  },
  {
    figure: "5 лет",
    label: "Гарантия",
    text: "Максимальная в отрасли. Сервисные центры в 12 городах РФ, постгарантийный ремонт.",
  },
  {
    figure: "5000 SKU",
    label: "Складская программа",
    text: "Отгрузка день в день со склада готовой продукции. Срочное производство — 3 дня.",
  },
  {
    figure: "Dialux EVO",
    label: "Расчёт бесплатно",
    text: "Светотехнический расчёт по нормам СП 52.13330 и СанПиН. Карта освещённости и подбор серий.",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="py-24 md:py-32 bg-surface">
      <div className="container-custom">
        <FadeIn>
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">Преимущества</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Почему выбирают нас
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              10 лет на рынке светотехники. Четыре факта, которые можно
              проверить, — вместо десяти одинаковых обещаний.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {points.map((p) => (
              <div key={p.label} className="bg-card p-7 md:p-8">
                <div className="font-mono text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {p.figure}
                </div>
                <div className="mt-1 font-mono text-xs text-copper-400">
                  {p.label}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
