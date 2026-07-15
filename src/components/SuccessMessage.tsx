"use client";

import { CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SuccessMessageProps {
  title: string;
  text: string;
  /** Иконка из lucide-react. По умолчанию — CheckCircle. */
  icon?: LucideIcon;
  /** Компактный режим — внутри модалки (без больших отступов). */
  compact?: boolean;
  /** Если передан — рисуем кнопку закрытия/финального действия. */
  onClose?: () => void;
  closeLabel?: string;
}

/**
 * Унифицированный success-state: подтверждение + ожидание ответа (peak-end).
 * compact — для модалок; без compact — полноэкранный (как в SendTZBlock).
 */
export default function SuccessMessage({
  title,
  text,
  icon: Icon = CheckCircle,
  compact = false,
  onClose,
  closeLabel = "Закрыть",
}: SuccessMessageProps) {
  if (compact) {
    return (
      <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-copper-500/10">
          <Icon size={24} className="text-copper-500" />
        </div>
        <h3 className="mb-1.5 text-lg font-bold text-foreground">{title}</h3>
        <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-muted">
          {text}
        </p>
        {onClose && (
          <button onClick={onClose} className="btn-secondary px-6 py-2.5">
            {closeLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="py-24 md:py-32">
      <div className="container-custom mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-copper-500/10">
          <Icon size={32} className="text-copper-500" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted">{text}</p>
      </div>
    </div>
  );
}
