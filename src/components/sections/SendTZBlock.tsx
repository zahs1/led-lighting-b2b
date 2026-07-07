"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tzFormSchema, type TZFormType } from "@/lib/validations";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { submitLead } from "@/lib/submit-lead";

export default function SendTZBlock() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<TZFormType>({ resolver: zodResolver(tzFormSchema) });

  const onSubmit = async (data: TZFormType) => {
    setError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });
    if (file) formData.append("file", file);
    formData.append("formType", "tz");

    const result = await submitLead(formData);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    if (result.fieldErrors) {
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        setFieldError(field as keyof TZFormType, { message: msgs[0] });
      }
    }
    if (result.error) setError(result.error);
  };

  if (submitted) {
    return (
      <div className="py-24 md:py-32">
        <div className="container-custom mx-auto max-w-lg text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-foreground">ТЗ получено!</h3>
          <p className="text-muted">Мы свяжемся с вами в ближайшее время.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="container-custom relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div>
              <span className="eyebrow">Отправьте ТЗ</span>
              <h2 className="mt-4 mb-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Есть проект?
                <br />
                <span className="text-gradient-amber">
                  Пришлите техническое задание
                </span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted">
                Прикрепите ТЗ, чертежи, спецификацию или фотографии объекта. Мы
                подготовим светотехнический расчёт и коммерческое предложение в
                течение 24 часов.
              </p>
              <ul className="space-y-4 text-base text-muted">
                {[
                  "Бесплатный расчёт в Dialux EVO",
                  "Подбор оборудования под бюджет",
                  "КП с ценами и сроками за 24 часа",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card-base p-8 shadow-xl shadow-black/30 md:p-10"
            >
              <input
                type="text"
                name="website_url"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px]"
                aria-hidden="true"
              />
              <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Ваше имя *
                  </label>
                  <input
                    {...register("name")}
                    className="input-field"
                    placeholder="Иван Петров"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Телефон *
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className="input-field"
                    placeholder="+7 (495) 123-45-67"
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Email *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="input-field"
                    placeholder="ivan@company.ru"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Компания
                  </label>
                  <input
                    {...register("company")}
                    className="input-field"
                    placeholder="ООО «СтройГрупп»"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Описание задачи
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Краткое описание задачи"
                />
              </div>
              <div className="mb-6">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-5 py-4 transition-all hover:border-amber-500/40 hover:bg-card-hover">
                  <Upload size={18} className="text-amber-400" />
                  <span className="text-sm text-muted">
                    {file
                      ? file.name
                      : "Прикрепить файл (PDF, DWG, DOC, JPG до 10 МБ)"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                    aria-label="Прикрепить файл технического задания"
                  />
                </label>
              </div>
              {error && (
                <p className="mb-4 text-center text-xs text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full !py-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Отправка...
                  </>
                ) : (
                  <>
                    <FileText size={18} /> Отправить ТЗ
                  </>
                )}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
