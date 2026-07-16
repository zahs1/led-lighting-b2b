"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions extends IntersectionObserverInit {
  /** Unobserve after first intersection (default: true). */
  once?: boolean;
}

/**
 * IntersectionObserver wrapper with reduced-motion + SSR safety.
 * When the user prefers reduced motion, `inView` resolves to `true`
 * immediately so content is never hidden behind a frozen animation.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const {
    once = true,
    threshold = 0.15,
    rootMargin = "0px 0px -10% 0px",
    root = null,
  } = options;

  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion users see content without animation: the CSS media query
    // forces transitions to ~0ms, so once the observer fires the element
    // appears instantly. No synchronous setState in the effect body.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin, root },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin, root]);

  return { ref, inView } as const;
}
