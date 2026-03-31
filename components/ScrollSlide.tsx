"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SlideDirection = "left" | "right";

interface ScrollSlideProps {
  children: ReactNode;
  direction?: SlideDirection;
  delayMs?: number;
  className?: string;
}

export default function ScrollSlide({ children, direction = "left", delayMs = 0, className = "" }: ScrollSlideProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = wrapperRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(target);
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const directionClass = direction === "right" ? "scroll-slide-right" : "scroll-slide-left";

  return (
    <div
      ref={wrapperRef}
      className={`scroll-slide ${directionClass}${isVisible ? " is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
