import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

/**
 * Локальное сохранение заявок для демо-режима (когда внешние интеграции
 * Bitrix24/Resend не настроены). Пишет в uploads/leads.json.
 *
 * ВАЖНО: работает только при локальном запуске (dev). На Vercel serverless
 * файловая система эфемерна — для прода используйте Bitrix24/Resend/Vercel Blob.
 * Файл leads.json исключён из git через /uploads/* в .gitignore.
 */
const LEADS_DIR = join(process.cwd(), "uploads");
const LEADS_FILE = join(LEADS_DIR, "leads.json");

export interface StoredLead {
  id: string;
  receivedAt: string;
  formType: string;
  fields: Record<string, string>;
  modelName?: string | null;
  fileUrl?: string | null;
}

export async function saveLeadLocally(
  lead: Omit<StoredLead, "id" | "receivedAt">,
): Promise<void> {
  // Defense in depth: в проде FS serverless эфемерна — запись молча теряет
  // данные. Основная защита (503) в route.ts; этот guard ловит случайные вызовы
  // из других мест и громко сигнализирует, вместо тихой потери заявки.
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[local-leads] saveLeadLocally called in production — refusing to write to ephemeral filesystem",
    );
    return;
  }

  try {
    await mkdir(LEADS_DIR, { recursive: true });

    let leads: StoredLead[] = [];
    try {
      const raw = await readFile(LEADS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) leads = parsed;
    } catch {
      // файла ещё нет или битый — начинаем с пустого списка
    }

    leads.push({
      ...lead,
      id: randomUUID(),
      receivedAt: new Date().toISOString(),
    });

    await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("[local-leads] save error:", err);
  }
}
