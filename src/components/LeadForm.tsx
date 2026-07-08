"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadFormSchema, type LeadFormType } from "@/lib/validations";
import { Loader2 } from "lucide-react";
import Honeypot from "@/components/Honeypot";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";

interface LeadFormProps {
  onSuccess?: () => void;
  modelName?: string;
}

export default function LeadForm({ onSuccess, modelName }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormType>({
    resolver: zodResolver(leadFormSchema),
  });

  const { onSubmit, state } = useLeadSubmit<LeadFormType>({
    formType: "cp",
    setError: setFieldError,
    extras: { modelName },
    onSuccess,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Honeypot register={register} name="website_url" />
      {modelName && (
        <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
          Модель:{" "}
          <span className="font-medium text-foreground">{modelName}</span>
        </p>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Ваше имя *
        </label>
        <input
          {...register("name")}
          placeholder="Иван Петров"
          className="input-field"
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Телефон *
        </label>
        <input
          {...register("phone")}
          placeholder="+7 (495) 123-45-67"
          type="tel"
          className="input-field"
        />
        {errors.phone && (
          <p className="mt-1.5 text-sm text-red-400">{errors.phone.message}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Email *
        </label>
        <input
          {...register("email")}
          placeholder="ivan@company.ru"
          type="email"
          className="input-field"
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Компания
        </label>
        <input
          {...register("company")}
          placeholder="ООО «СтройГрупп»"
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Комментарий
        </label>
        <textarea
          {...register("message")}
          placeholder="Опишите вашу задачу"
          rows={3}
          className="input-field resize-none"
        />
      </div>
      {state.error && (
        <p className="text-center text-sm text-red-400">{state.error}</p>
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
          "Отправить"
        )}
      </button>
    </form>
  );
}
