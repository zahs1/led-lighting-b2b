"use client";

import { useState } from "react";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { submitLead } from "@/lib/submit-lead";

export type LeadSubmitStatus = "idle" | "submitting" | "success" | "error";

export interface LeadSubmitState {
  status: LeadSubmitStatus;
  /** Текст общей ошибки (для вывода под формой). Пусто, если ошибки нет. */
  error: string;
}

export interface LeadSubmitExtras {
  /** Опциональный файл (ТЗ, фото, ведомость). */
  file?: File | null;
  /** Опциональное название модели (для формы карточки товара). */
  modelName?: string;
}

interface UseLeadSubmitOptions<T extends FieldValues> {
  /** Тип формы — добавляется в FormData как formType. */
  formType: string;
  /** setError из react-hook-form для маппинга fieldErrors. */
  setError: UseFormSetError<T>;
  /** Доп. данные, не входящие в схему формы (файл, modelName). */
  extras?: LeadSubmitExtras;
  /** Колбэк при успехе (закрытие модалки и т.п.). */
  onSuccess?: () => void;
}

/**
 * Инкапсулирует onSubmit-логику лид-форм:
 * сбор FormData → submitLead → маппинг ответа в state (success/fieldErrors/generalError).
 *
 * Возвращает onSubmit (передаётся в handleSubmit из react-hook-form) и state
 * с фазой процесса и текстом общей ошибки. isSubmitting от react-hook-form
 * используется отдельно для блокировки кнопки.
 */
export function useLeadSubmit<T extends FieldValues>({
  formType,
  setError,
  extras,
  onSuccess,
}: UseLeadSubmitOptions<T>) {
  const [state, setState] = useState<LeadSubmitState>({
    status: "idle",
    error: "",
  });

  const onSubmit = async (data: T) => {
    setState({ status: "submitting", error: "" });

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });
    if (extras?.file) formData.append("file", extras.file);
    if (extras?.modelName) formData.append("modelName", extras.modelName);
    formData.append("formType", formType);

    const result = await submitLead(formData);

    if (result.ok) {
      setState({ status: "success", error: "" });
      onSuccess?.();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        setError(field as FieldPath<T>, { message: msgs[0] });
      }
    }
    setState({ status: "error", error: result.error });
  };

  return { onSubmit, state };
}
