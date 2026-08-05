"use client";

import { useEffect, useRef, useState } from "react";

export function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element); // solo animamos la primera vez, no cada vez que scrollea
        }
      },
      { threshold: 0.15 }, // se activa cuando el 15% del elemento ya es visible
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}
