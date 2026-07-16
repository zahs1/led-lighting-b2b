import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop (default 40). */
  speed?: number;
  reverse?: boolean;
}

/**
 * Infinite horizontal marquee. Children are duplicated once so the
 * `translateX(-50%)` keyframe loops seamlessly. Pauses on hover.
 * Respects prefers-reduced-motion via the keyframe rule in globals.css.
 */
export default function Marquee({
  children,
  className = "",
  speed = 40,
  reverse = false,
}: MarqueeProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
