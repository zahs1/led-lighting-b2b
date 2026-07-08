import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  leadFormSchema,
  tzFormSchema,
  callbackFormSchema,
  wholesaleFormSchema,
  finalFormSchema,
  analogFormSchema,
  FORM_TYPES,
} from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { uploadFile } from "@/lib/file-upload";
import { sendToBitrix24 } from "@/lib/bitrix24";
import { saveLeadLocally } from "@/lib/local-leads";

type FormType = (typeof FORM_TYPES)[number];

const MAX_BODY_BYTES = 12 * 1024 * 1024; // 12 МБ (файл до 10 + поля)

const SCHEMAS = {
  cp: leadFormSchema,
  tz: tzFormSchema,
  callback: callbackFormSchema,
  wholesale: wholesaleFormSchema,
  final: finalFormSchema,
  analog: analogFormSchema,
} as const;

const FORM_LABELS: Record<string, string> = {
  cp: "Запрос КП",
  tz: "Отправка ТЗ",
  callback: "Заказ звонка",
  wholesale: "Оптовый прайс",
  analog: "Подбор аналога",
  final: "Основная заявка",
};

const FIELD_LABELS: Record<string, string> = {
  company: "Компания",
  message: "Сообщение",
  description: "Описание задачи",
  clientType: "Тип клиента",
  objectType: "Тип объекта",
  quantity: "Количество",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isFormType(value: string): value is FormType {
  return (FORM_TYPES as readonly string[]).includes(value);
}

export async function POST(request: NextRequest) {
  // 1. Ограничение размера тела запроса
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Размер запроса превышает лимит" },
      { status: 413 }
    );
  }

  // 2. Rate limit
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте позже." },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfter) },
      }
    );
  }

  // 3. Парсинг FormData
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Некорректные данные формы" },
      { status: 400 }
    );
  }

  // 4. formType allowlist
  const formTypeRaw = String(formData.get("formType") ?? "");
  if (!isFormType(formTypeRaw)) {
    return NextResponse.json(
      { error: "Некорректный тип формы" },
      { status: 400 }
    );
  }
  const formType: FormType = formTypeRaw;
  const schema = SCHEMAS[formType];
  const modelName = formData.get("modelName");
  const modelValue =
    typeof modelName === "string" && modelName ? modelName : null;

  // 5. Сбор строковых полей (honeypot валидируется схемой)
  const rawData: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && key !== "formType" && key !== "file") {
      rawData[key] = value;
    }
  });

  // 6. Валидация
  let parsed: Record<string, string>;
  try {
    parsed = schema.parse(rawData) as Record<string, string>;
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of err.issues) {
        const field = issue.path[0]?.toString();
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = [issue.message];
        }
      }
      return NextResponse.json(
        { error: "Проверьте введённые данные", fieldErrors },
        { status: 400 }
      );
    }
    throw err;
  }

  // 7. Файл (опционально) → Vercel Blob
  const file = formData.get("file");
  let fileUrl: string | null = null;
  if (file instanceof File && file.size > 0) {
    try {
      const uploaded = await uploadFile(file);
      fileUrl = uploaded?.url ?? null;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка загрузки файла";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  // 8. Интеграции
  const bitrixData = buildBitrixPayload(parsed, formType, modelValue, fileUrl);
  const [bitrixRes, emailRes] = await Promise.allSettled([
    sendToBitrix24(bitrixData),
    sendEmailNotification(parsed, formType, modelValue, fileUrl),
  ]);

  const hasBitrix = !!process.env.BITRIX24_WEBHOOK_URL;
  const hasResend =
    !!process.env.RESEND_API_KEY &&
    !!process.env.MAIL_FROM &&
    !!process.env.MAIL_TO;
  const anyIntegration = hasBitrix || hasResend;

  // Демо-режим: внешних интеграций нет — сохраняем заявку локально,
  // чтобы её можно было увидеть в uploads/leads.json
  if (!anyIntegration) {
    await saveLeadLocally({
      formType,
      fields: parsed,
      modelName: modelValue,
      fileUrl,
    });
    return NextResponse.json({ success: true });
  }

  const bitrixOk = bitrixRes.status === "fulfilled" && bitrixRes.value === true;
  const emailOk = emailRes.status === "fulfilled" && emailRes.value === true;

  if (!bitrixOk && !emailOk) {
    console.error("[lead] all integrations failed", {
      formType,
      bitrix: String(bitrixRes.status),
      email: String(emailRes.status),
    });
    return NextResponse.json(
      {
        error:
          "Не удалось отправить заявку. Попробуйте позже или свяжитесь по телефону.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}

function buildBitrixPayload(
  parsed: Record<string, string>,
  formType: FormType,
  modelName: string | null,
  fileUrl: string | null
) {
  const comments: string[] = [];
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    if (parsed[key]) comments.push(`${label}: ${parsed[key]}`);
  }
  if (modelName) comments.push(`Модель: ${modelName}`);
  if (fileUrl) comments.push(`Файл: ${fileUrl}`);

  return {
    fields: {
      TITLE: `Заявка с лендинга — ${FORM_LABELS[formType] ?? formType}`,
      NAME: parsed.name,
      PHONE: [{ VALUE: parsed.phone }],
      EMAIL: [{ VALUE: parsed.email || "" }],
      COMMENTS: comments.join("\n"),
      SOURCE_ID: "WEB",
      SOURCE_DESCRIPTION: `Форма: ${formType}`,
    },
  };
}

async function sendEmailNotification(
  data: Record<string, string>,
  formType: FormType,
  modelName: string | null,
  fileUrl: string | null
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;
  if (!apiKey || !from || !to) return false;

  const rows: string[] = [
    `<p><strong>Имя:</strong> ${escapeHtml(data.name || "")}</p>`,
    `<p><strong>Телефон:</strong> ${escapeHtml(data.phone || "")}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(data.email || "—")}</p>`,
  ];
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    if (data[key]) {
      rows.push(
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(data[key])}</p>`
      );
    }
  }
  if (modelName) {
    rows.push(`<p><strong>Модель:</strong> ${escapeHtml(modelName)}</p>`);
  }
  if (fileUrl) {
    rows.push(
      `<p><strong>Файл:</strong> <a href="${escapeHtml(fileUrl)}">${escapeHtml(
        fileUrl
      )}</a></p>`
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Новая заявка: ${FORM_LABELS[formType] ?? "Заявка"}`,
        html: `<h2>Новая заявка с сайта</h2>
<p><strong>Тип формы:</strong> ${escapeHtml(
          FORM_LABELS[formType] ?? formType
        )}</p>${rows.join("")}`,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("[email] send error:", error);
    return false;
  }
}
