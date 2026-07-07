"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { finalFormSchema, type FinalFormType } from "@/lib/validations";
import {
  Upload,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { submitLead } from "@/lib/submit-lead";

export default function FinalApplicationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<FinalFormType>({ resolver: zodResolver(finalFormSchema) });

  const onSubmit = async (data: FinalFormType) => {
    setError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });
    if (file) formData.append("file", file);
    formData.append("formType", "final");

    const result = await submitLead(formData);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    if (result.fieldErrors) {
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        setFieldError(field as keyof FinalFormType, { message: msgs[0] });
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
          <h3 className="mb-2 text-2xl font-bold text-foreground">
            Спасибо за заявку!
          </h3>
          <p className="text-muted">Мы свяжемся с вами в ближайшее время.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-amber-600/8 blur-3xl" />
      <div className="container-custom relative z-10">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="mx-auto mb-12 max-w-xl text-center">
              <span className="eyebrow">Свяжитесь с нами</span>
              <h2 className="mt-4 mb-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Получите расчёт светильников под ваш объект
              </h2>
              <p className="text-lg leading-relaxed text-muted">
                Ответим в рабочее время. Можно отправить ТЗ, ведомость или фото
                объекта. Работаем с B2B и частными клиентами.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <form
              className="glass p-8 shadow-2xl shadow-black/40 md:p-10"
              onSubmit={handleSubmit(onSubmit)}
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
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Тип объекта *
                </label>
                <select
                  {...register("objectType")}
                  className="input-field appearance-none"
                  defaultValue=""
                >
                  <option value="">Выберите тип объекта</option>
                  <option value="office">Офис</option>
                  <option value="shop">Магазин</option>
                  <option value="warehouse">Склад</option>
                  <option value="industrial">Производство</option>
                  <option value="sport">Спортзал</option>
                  <option value="parking">Парковка</option>
                  <option value="home">Дом / квартира</option>
                  <option value="other">Другое</option>
                </select>
                {errors.objectType && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.objectType.message}
                  </p>
                )}
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Сообщение
                </label>
                <textarea
                  {...register("message")}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Опишите вашу задачу"
                />
              </div>
              <div className="mb-6">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-5 py-4 transition-all hover:border-amber-500/40 hover:bg-white/[0.06]">
                  <Upload size={18} className="text-amber-400" />
                  <span className="text-sm text-muted">
                    {file
                      ? file.name
                      : "Прикрепить файл (PDF, DWG, DOC, JPG до 10 МБ)"}
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                    aria-label="Прикрепить файл к заявке"
                  />
                </label>
              </div>
              {error && (
                <p className="mb-4 text-center text-xs text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full !py-4 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Отправка...
                  </>
                ) : (
                  <>
                    <Send size={20} /> Отправить заявку
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-xs text-subtle">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </form>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
