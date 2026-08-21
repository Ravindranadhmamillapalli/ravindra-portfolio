"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type TypeTextProps = {
  text: string;
  /** Characters per second. */
  cps?: number;
  /** Hold typing until this flips true (e.g. after the intro). */
  start?: boolean;
  delay?: number;
  /** Wait until the text scrolls into view before typing. */
  onView?: boolean;
};

export default function TypeText({
  text,
  cps = 140,
  start = true,
  delay = 0,
  onView = true,
}: TypeTextProps) {
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(!onView);
  const [count, setCount] = useState<number | null>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);
  const timerRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!onView || inView) return;
    const el = hostRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [onView, inView]);

  const animate = mounted && !reducedMotion && start && inView;

  useEffect(() => {
    if (!animate) return;

    setCount(0);

    const run = () => {
      const startedAt = performance.now();
      const tick = (now: number) => {
        const chars = Math.floor(((now - startedAt) / 1000) * cps);
        if (chars >= text.length) {
          setCount(null);
          return;
        }
        setCount(chars);
        frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    if (delay > 0) {
      timerRef.current = window.setTimeout(run, delay * 1000);
    } else {
      run();
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.clearTimeout(timerRef.current);
      setCount(null);
    };
  }, [animate, text, cps, delay]);

  // Before typing begins the full string still occupies its space, so the
  // layout never jumps when characters start landing.
  const waiting = mounted && !reducedMotion && (!start || !inView);
  const typing = count !== null;

  return (
    <span
      ref={hostRef}
      className={`typing${typing ? " is-active" : ""}${waiting ? " is-waiting" : ""}`}
    >
      {typing ? text.slice(0, count) : text}
    </span>
  );
}
