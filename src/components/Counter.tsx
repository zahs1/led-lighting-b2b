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
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    let backstop = 0;

    if (reduced) {
      // Reduced-motion (a11y 2.3.3): финал без анимации. Через rAF-callback,
      // чтобы не вызывать setState синхронно в теле effect (react-hooks rule).
      raf = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(raf);
    }

    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0;
      if (elapsed >= duration) {
        setValue(to); // точный финал
        return;
      }
      // easeOutExpo
      const eased = 1 - Math.pow(2, (-10 * elapsed) / duration);
      setValue(from + (to - from) * eased);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Backstop: гарантирует финальное значение, даже если rAF-цикл оборвался
    // (cleanup/throttle) на предпоследнем кадре — иначе малые значения
    // (напр. 70) округлялись бы до 69.
    backstop = window.setTimeout(() => setValue(to), duration + 60);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(backstop);
    };
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
