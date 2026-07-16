"use client";

import { useEffect, useRef } from "react";

interface UseMagneticOptions {
  /** 0–1, how strongly the element tracks the cursor (default 0.3). */
  strength?: number;
  /** Also translate the inner `.magnetic-inner` element at reduced rate. */
  inner?: boolean;
}

/**
 * Magnetic hover effect: element drifts toward the cursor and snaps back.
 * Disabled on touch devices and when reduced motion is requested.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>({
  strength = 0.3,
  inner = true,
}: UseMagneticOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return; // touch

    const innerEl = inner
      ? (el.querySelector(".magnetic-inner") as HTMLElement | null)
      : null;

    let raf = 0;
    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        if (innerEl) {
          innerEl.style.transform = `translate(${x * strength * 0.4}px, ${y * strength * 0.4}px)`;
        }
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
      if (innerEl) innerEl.style.transform = "";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength, inner]);

  return ref;
}
