"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analogFormSchema, type AnalogFormType } from "@/lib/validations";
import { Search, Loader2, CheckCircle, Upload } from "lucide-react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { submitLead } from "@/lib/submit-lead";

export default function FindAnalogBlock() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<AnalogFormType>({ resolver: zodResolver(analogFormSchema) });

  const onSubmit = async (data: AnalogFormType) => {
    setError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });
    if (file) formData.append("file", file);
    formData.append("formType", "analog");

    const result = await submitLead(formData);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    if (result.fieldErrors) {
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        setFieldError(field as keyof AnalogFormType, { message: msgs[0] });
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
            Заявка принята!
          </h3>
          <p className="text-muted">Мы найдём аналог и пришлём предложение.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <div className="card-base mx-auto max-w-4xl p-8 shadow-xl shadow-black/20 md:p-12">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <FadeIn className="flex-1">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <Search size={24} />
              </div>
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Не можете найти нужный светильник?
              </h2>
              <p className="mb-8 max-w-md text-base leading-relaxed text-muted">
                Пришлите фото, артикул или описание существующего светильника —
                мы подберём аналог из ассортимента или разработаем под заказ.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                  type="text"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute -left-[9999px]"
                  aria-hidden="true"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      {...register("name")}
                      placeholder="Ваше имя *"
                      className="input-field"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="Телефон *"
                      className="input-field"
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email *"
                      className="input-field"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <input
                    {...register("message")}
                    placeholder="Марка / артикул / описание аналога"
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    {...register("quantity")}
                    type="number"
                    min={1}
                    placeholder="Количество (шт)"
                    className="input-field"
                  />
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-5 py-3 transition-all hover:border-amber-500/40 hover:bg-card-hover">
                    <Upload size={18} className="text-amber-400" />
                    <span className="truncate text-sm text-muted">
                      {file ? file.name : "Фото аналога"}
                    </span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                      aria-label="Загрузить фото аналога"
                    />
                  </label>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
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
            <div className="relative hidden h-56 w-56 shrink-0 overflow-hidden rounded-2xl border border-border md:block">
              <Image
                src="/images/find-analog.jpg"
                alt="Подбор аналога светильника"
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
