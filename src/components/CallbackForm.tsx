"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { callbackFormSchema, type CallbackFormType } from "@/lib/validations";
import { Loader2 } from "lucide-react";
import Honeypot from "@/components/Honeypot";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";

interface CallbackFormProps {
  onSuccess?: () => void;
}

export default function CallbackForm({ onSuccess }: CallbackFormProps) {
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<CallbackFormType>({
    resolver: zodResolver(callbackFormSchema),
  });

  const { onSubmit, state } = useLeadSubmit<CallbackFormType>({
    formType: "callback",
    setError: setFieldError,
    onSuccess,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Honeypot register={register} name="website_url" />
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
          "Заказать звонок"
        )}
      </button>
    </form>
  );
}
