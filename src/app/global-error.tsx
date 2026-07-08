"use client";

import { AlertTriangle } from "lucide-react";
// global-error заменяет root layout, поэтому сам должен определить <html>/<body>
// и подключить глобальные стили (Tailwind), иначе страница будет без CSS.
import "./globals.css";

// nonce-based CSP требует dynamic rendering: Next.js применяет nonce к
// инлайн-скриптам (RSC flight data, гидрация) и инлайн-<style> во время SSR
// на основе CSP header из proxy. global-error заменяет root layout при ошибке
// в нём, поэтому должен сам быть force-dynamic, иначе инлайн-скрипты error
// page сгенерируются без nonce и будут заблокированы браузером.
// См. node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  console.error(error);

  return (
    // global-error must include html and body tags
    <html lang="ru">
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertTriangle size={28} />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-foreground">
              Что-то пошло не так
            </h1>
            <p className="mb-6 text-muted">
              Произошла критическая ошибка приложения. Попробуйте обновить
              страницу.
            </p>
            <button onClick={() => unstable_retry()} className="btn-primary">
              Попробовать снова
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
