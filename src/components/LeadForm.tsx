"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadFormSchema, type LeadFormType } from "@/lib/validations";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { submitLead } from "@/lib/submit-lead";

interface LeadFormProps {
  onSuccess?: () => void;
  modelName?: string;
}

export default function LeadForm({ onSuccess, modelName }: LeadFormProps) {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormType>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormType) => {
    setError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });
    if (modelName) formData.append("modelName", modelName);
    formData.append("formType", "cp");

    const result = await submitLead(formData);
    if (result.ok) {
      onSuccess?.();
      return;
    }
    if (result.fieldErrors) {
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        setFieldError(field as keyof LeadFormType, { message: msgs[0] });
      }
    }
    if (result.error) setError(result.error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px]"
        aria-hidden="true"
      />
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
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
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
