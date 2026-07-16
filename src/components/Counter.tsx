"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

interface CounterProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Insert thin-space thousands separators (default true). */
  separator?: boolean;
  className?: string;
}

/**
 * Animated count-up that fires once when scrolled into view.
 * Falls back to the final value instantly under reduced-motion.
 */
export default function Counter({
  to,
  from = 0,
  duration = 1800,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = true,
  className,
}: CounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, from, to, duration]);

  const num =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  const formatted = separator ? num.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : num;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
