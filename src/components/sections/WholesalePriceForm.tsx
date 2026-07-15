"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wholesaleFormSchema, type WholesaleFormType } from "@/lib/validations";
import { Download, Loader2 } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import Honeypot from "@/components/Honeypot";
import SuccessMessage from "@/components/SuccessMessage";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";

export default function WholesalePriceForm() {
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<WholesaleFormType>({
    resolver: zodResolver(wholesaleFormSchema),
  });

  const { onSubmit, state } = useLeadSubmit<WholesaleFormType>({
    formType: "wholesale",
    setError: setFieldError,
  });

  if (state.status === "success") {
    return (
      <SuccessMessage
        title="Заявка на прайс-лист отправлена!"
        text="Наш менеджер свяжется с вами и пришлёт прайс."
      />
    );
  }

  return (
    <div className="py-24 md:py-32">
      <div className="container-custom">
        <div className="mx-auto max-w-xl">
          <FadeIn>
            <div className="mb-12 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-border text-copper-400">
                <Download size={28} />
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
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
              noValidate
              className="card-base p-8 shadow-sm md:p-10"
            >
              <Honeypot register={register} name="website_url" />
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
                    <p className="mt-1.5 text-sm text-red-400">
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
                    <p className="mt-1.5 text-sm text-red-400">
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
                    <p className="mt-1.5 text-sm text-red-400">
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
                    <p className="mt-1.5 text-sm text-red-400">
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
                  <p className="mt-1.5 text-sm text-red-400">
                    {errors.clientType.message}
                  </p>
                )}
              </div>
              {state.error && (
                <p className="mb-4 text-center text-sm text-red-400">
                  {state.error}
                </p>
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
