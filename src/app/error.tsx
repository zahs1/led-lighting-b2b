"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <AlertTriangle size={28} />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">
          Что-то пошло не так
        </h1>
        <p className="mb-6 text-muted">
          Произошла ошибка при загрузке страницы. Попробуйте обновить.
        </p>
        <button onClick={reset} className="btn-primary">
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
