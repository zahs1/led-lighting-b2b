"use client";

import type { FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

interface HoneypotProps<T extends FieldValues> {
  /** register из useForm соответствующей формы. */
  register: UseFormRegister<T>;
  /** Имя поля в схеме zod (во всех лид-формах — website_url). */
  name: FieldPath<T>;
}

/**
 * Скрытый honeypot-инпут. Регистрируется в react-hook-form, чтобы значение
 * попадало в FormData и валидировалось zod-схемой (website_url: z.string().max(0).optional()).
 * Боты заполняют поле → валидация падает, заявка не уходит.
 * Для людей поле пустое — max(0) проходит, поведение не меняется.
 */
export default function Honeypot<T extends FieldValues>({
  register,
  name,
}: HoneypotProps<T>) {
  return (
    <input
      type="text"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px]"
      {...register(name)}
    />
  );
}
