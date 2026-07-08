"use client";

import { CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SuccessMessageProps {
  title: string;
  text: string;
  /** Иконка из lucide-react. По умолчанию — CheckCircle. */
  icon?: LucideIcon;
}

/**
 * Унифицированный success-state: иконка в emerald-кружке + заголовок + текст.
 * Заменяет дублирующийся markup в 4 лид-формах.
 */
export default function SuccessMessage({
  title,
  text,
  icon: Icon = CheckCircle,
}: SuccessMessageProps) {
  return (
    <div className="py-24 md:py-32">
      <div className="container-custom mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
          <Icon size={32} className="text-emerald-400" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted">{text}</p>
      </div>
    </div>
  );
}
