"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analogFormSchema, type AnalogFormType } from "@/lib/validations";
import { Search, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import Honeypot from "@/components/Honeypot";
import SuccessMessage from "@/components/SuccessMessage";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";

export default function FindAnalogBlock() {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<AnalogFormType>({ resolver: zodResolver(analogFormSchema) });

  const { onSubmit, state } = useLeadSubmit<AnalogFormType>({
    formType: "analog",
    setError: setFieldError,
    extras: { file },
  });

  if (state.status === "success") {
    return (
      <SuccessMessage
        title="Заявка принята!"
        text="Мы найдём аналог и пришлём предложение."
      />
    );
  }

  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <div className="card-base mx-auto max-w-4xl p-8 shadow-sm md:p-12">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <FadeIn className="flex-1">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-border text-copper-400">
                <Search size={24} />
              </div>
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Не можете найти нужный светильник?
              </h2>
              <p className="mb-8 max-w-md text-base leading-relaxed text-muted">
                Пришлите фото, артикул или описание существующего светильника —
                мы подберём аналог из ассортимента или разработаем под заказ.
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-4"
              >
                <Honeypot register={register} name="website_url" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="analog-name" className="mb-2 block text-sm font-medium text-foreground">
                      Ваше имя *
                    </label>
                    <input
                      id="analog-name"
                      {...register("name")}
                      placeholder="Иван Петров"
                      className="input-field"
                    />
                    {errors.name && (
                      <p role="alert" className="mt-1.5 text-sm text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="analog-phone" className="mb-2 block text-sm font-medium text-foreground">
                      Телефон *
                    </label>
                    <input
                      id="analog-phone"
                      {...register("phone")}
                      type="tel"
                      placeholder="+7 (495) 123-45-67"
                      className="input-field"
                    />
                    {errors.phone && (
                      <p role="alert" className="mt-1.5 text-sm text-red-400">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="analog-email" className="mb-2 block text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <input
                      id="analog-email"
                      {...register("email")}
                      type="email"
                      placeholder="ivan@company.ru"
                      className="input-field"
                    />
                    {errors.email && (
                      <p role="alert" className="mt-1.5 text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="analog-message" className="mb-2 block text-sm font-medium text-foreground">
                      Марка / артикул / описание
                    </label>
                    <input
                      id="analog-message"
                      {...register("message")}
                      placeholder="Например, Trilux 356248"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="analog-quantity" className="mb-2 block text-sm font-medium text-foreground">
                      Количество (шт)
                    </label>
                    <input
                      id="analog-quantity"
                      {...register("quantity")}
                      type="number"
                      min={1}
                      placeholder="10"
                      className="input-field"
                    />
                  </div>
                  <label htmlFor="analog-file" className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-card px-5 py-3 transition-all hover:border-copper-500/40 hover:bg-card-hover">
                    <Upload size={18} className="text-copper-400" />
                    <span className="truncate text-sm text-muted">
                      {file ? file.name : "Фото аналога"}
                    </span>
                    <input
                      id="analog-file"
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                      aria-label="Загрузить фото аналога"
                    />
                  </label>
                </div>
                {state.error && (
                  <p role="alert" className="text-sm text-red-400">{state.error}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Поиск...
                    </>
                  ) : (
                    <>
                      <Search size={18} /> Подобрать аналог
                    </>
                  )}
                </button>
              </form>
            </FadeIn>
            <div className="relative hidden h-56 w-56 shrink-0 overflow-hidden rounded-lg border border-border md:block">
              <Image
                src="/images/find-analog.jpg"
                alt="Подбор аналога светильника"
                fill
                sizes="224px"
                className="parallax-y object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
