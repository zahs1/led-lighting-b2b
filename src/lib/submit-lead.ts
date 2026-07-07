/**
 * Общий клиентский сабмит формы заявки на /api/lead.
 * Различает сетевой сбой, 429 (rate limit), 400 (ошибки валидации по полям),
 * 502/500 (сбой интеграций) и успех.
 */

export type LeadSubmitResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      status: number;
    };

export async function submitLead(formData: FormData): Promise<LeadSubmitResult> {
  let res: Response;
  try {
    res = await fetch("/api/lead", { method: "POST", body: formData });
  } catch {
    return {
      ok: false,
      error: "Нет связи с сервером. Проверьте подключение к интернету.",
      status: 0,
    };
  }

  if (res.ok) return { ok: true };

  let error = "Не удалось отправить заявку. Попробуйте позже.";
  let fieldErrors: Record<string, string[]> | undefined;

  try {
    const data = (await res.json()) as {
      error?: string;
      fieldErrors?: Record<string, string[]>;
    };
    if (typeof data?.error === "string") error = data.error;
    if (data?.fieldErrors && typeof data.fieldErrors === "object") {
      fieldErrors = data.fieldErrors;
    }
  } catch {
    // тело не JSON — оставляем сообщение по умолчанию
  }

  return { ok: false, error, fieldErrors, status: res.status };
}
