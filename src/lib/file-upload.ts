import { put } from "@vercel/blob";

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".dwg",
  ".jpg",
  ".jpeg",
  ".png",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 МБ

export interface UploadedFile {
  url: string;
  filename: string;
  pathname: string;
}

export function validateFile(file: File): void {
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Недопустимое расширение файла: ${ext || "(нет)"}`);
  }
  if (file.size === 0) {
    throw new Error("Файл пустой");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Размер файла превышает 10 МБ");
  }
}

/**
 * Валидирует и загружает файл в Vercel Blob.
 * В демо-режиме (BLOB_READ_WRITE_TOKEN не задан) — проверяет файл,
 * но не загружает, возвращая null (форма всё равно отправляется).
 * См. README для подключения реального хранилища.
 */
export async function uploadFile(file: File): Promise<UploadedFile | null> {
  validateFile(file);

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.warn(
      "[file-upload] BLOB_READ_WRITE_TOKEN не задан — загрузка пропущена (демо-режим)"
    );
    return null;
  }

  const blob = await put(file.name, file, {
    access: "private",
    addRandomSuffix: true,
  });

  return { url: blob.url, filename: file.name, pathname: blob.pathname };
}
