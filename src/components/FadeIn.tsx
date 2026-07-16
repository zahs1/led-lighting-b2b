"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type Variant = "up" | "scale" | "blur" | "left";

const HIDDEN: Record<Variant, string> = {
  up: "opacity-0 translate-y-6",
  scale: "opacity-0 scale-[0.96]",
  blur: "opacity-0 [filter:blur(12px)]",
  left: "opacity-0 -translate-x-8",
};

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms (kept for backward compat with existing sections). */
  delay?: number;
  variant?: Variant;
  duration?: number;
}

/**
 * Scroll-triggered reveal wrapper. Drop-in replacement for the original
 * FadeIn (same props) with added `variant`. Uses IntersectionObserver and
 * respects prefers-reduced-motion (shows immediately).
 */
export default function FadeIn({
  children,
  className = "",
  delay = 0,
  variant = "up",
  duration = 700,
}: FadeInProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    once: true,
    threshold: 0.08,
  });

  return (
    <div
      ref={ref}
      className={`${className} will-reveal transition-all ${
        inView
          ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-0"
          : HIDDEN[variant]
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}
