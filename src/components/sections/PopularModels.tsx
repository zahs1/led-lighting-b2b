"use client";

import { products } from "@/data/mock";
import type { Product } from "@/types";
import { useState } from "react";
import Image from "next/image";
import { Eye, ShoppingCart } from "lucide-react";
import Modal from "@/components/Modal";
import LeadForm from "@/components/LeadForm";
import FadeIn from "@/components/FadeIn";

export default function PopularModels() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div id="popular-models" className="py-24 md:py-32">
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow">Хиты продаж</span>
            <h2 className="mx-auto mt-4 mb-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Популярные модели
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted">
              Оптимальное соотношение цены, качества и характеристик. Выбор наших
              клиентов.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 80}>
              <div className="card-base group flex h-full flex-col overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {product.oldPrice > product.price && (
                    <div className="absolute right-3 top-3">
                      <span className="rounded-lg bg-red-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                        -
                        {Math.round(
                          (1 - product.price / product.oldPrice) * 100
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-1 text-base font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
                    {product.description}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                      {product.power}
                    </span>
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
                      {product.luminousFlux}
                    </span>
                    <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                      {product.ip}
                    </span>
                    <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                      {product.warranty}
                    </span>
                  </div>

                  <div className="mb-5 mt-auto flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {product.price.toLocaleString("ru-RU")} ₽
                    </span>
                    {product.oldPrice > product.price && (
                      <span className="text-sm text-subtle line-through">
                        {product.oldPrice.toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href="#final-form"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-sm font-medium text-muted transition-all hover:border-amber-500/40 hover:text-amber-400"
                    >
                      <Eye size={16} />
                      Подробнее
                    </a>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 active:scale-95"
                    >
                      <ShoppingCart size={16} />
                      Запросить
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={`Запрос цены: ${selectedProduct?.name ?? ""}`}
      >
        <LeadForm
          onSuccess={() => setSelectedProduct(null)}
          modelName={selectedProduct?.name}
        />
      </Modal>
    </div>
  );
}
