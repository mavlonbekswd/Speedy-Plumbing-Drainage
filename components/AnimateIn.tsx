"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number; // ms
  className?: string;
  y?: number;
}

// Scroll reveal on the browser's own IntersectionObserver and a CSS transition. It replaced an
// animation library that cost every page about 40 KB to do this one thing. Renders a single div,
// so `dl > AnimateIn > dt + dd` stays valid. Reduced motion, no observer support, and anything
// already on screen at load all show at once: content is never left waiting on a script.
export default function AnimateIn({ children, delay = 0, className = "", y = 22 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: React.CSSProperties =
    state === "static"
      ? {}
      : {
          opacity: state === "hidden" ? 0 : 1,
          transform: state === "hidden" ? `translateY(${y}px)` : "none",
          transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
