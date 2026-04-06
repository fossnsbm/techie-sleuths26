"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CustomCursorProps {
  /** Selector for elements that should trigger the enlarged cursor state */
  hoverTargets?: string;
}

export default function CustomCursor({ hoverTargets = "[data-cursor-hover]" }: CustomCursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize cursor position to center of screen
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    ring.current = { ...mouse.current };
    
    // Hide the default cursor
    document.body.style.cursor = "none";

    // Linear interpolation for smooth cursor movement
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf: number;

    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);
      
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top = ring.current.y + "px";
      }
      
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Track mouse movement
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Check if hovering over any target elements
      if (hoverTargets) {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target) {
          const isOverTarget = target.closest(hoverTargets) !== null;
          setIsHovering(isOverTarget);
        }
      }
    };

    // Handle touch events for mobile - move cursor to touch position
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
    };
  }, [hoverTargets]);

  return (
    <div
      ref={ringRef}
      className={[
        "fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2",
        "transition-[width,height] duration-300 ease-out",
        isHovering ? "h-[124px] w-[124px]" : "h-[88px] w-[88px]",
      ].join(" ")}
      style={{ left: 0, top: 0 }}
      aria-hidden="true"
    >
      <Image
        src="/magg.png"
        alt=""
        width={140}
        height={140}
        className="h-full w-full object-contain drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]"
        priority
        draggable={false}
      />
    </div>
  );
}
