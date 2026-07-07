"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { callbackFormSchema, type CallbackFormType } from "@/lib/validations";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { submitLead } from "@/lib/submit-lead";

interface CallbackFormProps {
  onSuccess?: () => void;
}

export default function CallbackForm({ onSuccess }: CallbackFormProps) {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<CallbackFormType>({
    resolver: zodResolver(callbackFormSchema),
  });

  const onSubmit = async (data: CallbackFormType) => {
    setError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });
    formData.append("formType", "callback");

    const result = await submitLead(formData);
    if (result.ok) {
      onSuccess?.();
      return;
    }
    if (result.fieldErrors) {
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        setFieldError(field as keyof CallbackFormType, { message: msgs[0] });
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
          "Заказать звонок"
        )}
      </button>
    </form>
  );
}
