"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wholesaleFormSchema, type WholesaleFormType } from "@/lib/validations";
import { useState } from "react";
import { Download, Loader2, CheckCircle } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { submitLead } from "@/lib/submit-lead";

export default function WholesalePriceForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<WholesaleFormType>({
    resolver: zodResolver(wholesaleFormSchema),
  });

  const onSubmit = async (data: WholesaleFormType) => {
    setError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });
    formData.append("formType", "wholesale");

    const result = await submitLead(formData);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    if (result.fieldErrors) {
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        setFieldError(field as keyof WholesaleFormType, { message: msgs[0] });
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
            Прайс-лист отправлен!
          </h3>
          <p className="text-muted">Проверьте вашу почту.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <div className="mx-auto max-w-xl">
          <FadeIn>
            <div className="mb-12 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <Download size={28} />
              </div>
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Получить оптовый прайс-лист
              </h2>
              <p className="mx-auto max-w-lg text-lg leading-relaxed text-muted">
                Оставьте заявку — вышлем актуальные цены со специальными
                оптовыми условиями.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card-base p-8 shadow-xl shadow-black/20 md:p-10"
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
                    Компания *
                  </label>
                  <input
                    {...register("company")}
                    className="input-field"
                    placeholder="ООО «СтройГрупп»"
                  />
                  {errors.company && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.company.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Тип клиента *
                </label>
                <select
                  {...register("clientType")}
                  className="input-field appearance-none"
                  defaultValue=""
                >
                  <option value="">Выберите тип клиента</option>
                  <option value="installer">Монтажная организация</option>
                  <option value="contractor">Генподрядчик</option>
                  <option value="designer">Проектировщик</option>
                  <option value="dealer">Дилер / оптовик</option>
                  <option value="private">Частный клиент</option>
                </select>
                {errors.clientType && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.clientType.message}
                  </p>
                )}
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
                    <Download size={18} /> Получить прайс-лист
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
