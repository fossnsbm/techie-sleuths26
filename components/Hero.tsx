"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const [overLogo, setOverLogo] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  const TAGLINE = "Unravel the mystery. One clue at a time.";

  /* ── Typewriter ── */
  useEffect(() => {
    const delay = setTimeout(() => {
      setTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(TAGLINE.slice(0, ++i));
        if (i >= TAGLINE.length) {
          clearInterval(interval);
          setTyping(false);
        }
      }, 55);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(delay);
  }, []);

  /* ── Magnifier cursor ── */
  useEffect(() => {
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    ring.current = { ...mouse.current };
    document.body.style.cursor = "none";

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf: number;

    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);
      const x = ring.current.x + "px", y = ring.current.y + "px";
      if (ringRef.current) { ringRef.current.style.left = x; ringRef.current.style.top = y; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (logoRef.current) {
        const r = logoRef.current.getBoundingClientRect(), p = 30;
        setOverLogo(e.clientX >= r.left - p && e.clientX <= r.right + p && e.clientY >= r.top - p && e.clientY <= r.bottom + p);
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); document.body.style.cursor = ""; };
  }, []);

  return (
    <>
      {/* Cursor */}
      <div
        ref={ringRef}
        className={[
          "fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2",
          "transition-[width,height,transform] duration-300",
          overLogo ? "h-[124px] w-[124px]" : "h-[88px] w-[88px]",
        ].join(" ")}
      >
        <Image
          src="/magg.png"
          alt=""
          width={140}
          height={140}
          className="h-full w-full object-contain drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]"
          priority
        />
      </div>

      <section className="relative flex min-h-[520px] h-screen w-full items-center justify-center overflow-hidden bg-transparent px-3 sm:px-6">

        {/* ── CONTENT ── */}
        <div className="relative z-[5] px-2 text-center sm:px-6">
          {/* Logo */}
          <div
            ref={logoRef}
            className="relative mx-auto mb-6 flex items-center justify-center
                       h-[220px] w-[220px] sm:h-[300px] sm:w-[300px] md:h-[420px] md:w-[420px] lg:h-[800px] lg:w-[800px]"
          >
            <div className={["absolute -inset-5 rounded-full pointer-events-none z-0",
              "bg-[radial-gradient(circle,rgba(196,160,122,0.12)_0%,transparent_70%)]",
              "transition-opacity duration-500",
              overLogo ? "opacity-100" : "opacity-0"].join(" ")} />

            {isLoading && <div className="absolute inset-0 rounded-md bg-[rgba(200,120,60,0.12)] animate-pulse" />}

            <Image
              src="/logo.png"
              alt="Techie Sleuths"
              width={800}
              height={800}
              className={[
                "relative z-[1] h-auto w-full object-contain",
                "transition-[opacity,transform,filter] duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
                isLoading ? "opacity-0" : "opacity-100",
                overLogo
                  ? "scale-[1.18] brightness-[1.15] drop-shadow-[0_0_40px_rgba(196,160,122,0.5)]"
                  : "scale-100 brightness-90",
              ].join(" ")}
              onLoad={() => setIsLoading(false)}
              priority
            />
            <Image
              src="/homz.png"
              alt="Homz"
              width={300}
              height={300}
              className={[
                "pointer-events-none absolute left-0 top-[8%] z-[2] h-auto w-[30%] translate-x-[20%] object-contain",
                "transition-opacity duration-700",
                "animate-[floatLeft_11s_ease-in-out_infinite]",
                isLoading ? "opacity-0" : "opacity-90",
              ].join(" ")}
              priority
            />

            <Image
              src="/map.png"
              alt="Map"
              width={360}
              height={360}
              className={[
                "pointer-events-none absolute right-0 bottom-[14%] z-[2] h-auto w-[35%] -translate-x-[20%] object-contain",
                "transition-opacity duration-700",
                "animate-[floatRight_10s_ease-in-out_infinite]",
                isLoading ? "opacity-0" : "opacity-80",
              ].join(" ")}
              priority
            />



          </div>

          {/* Typewriter tagline */}
          <p className="m-0 min-h-[2em] text-[clamp(0.95rem,2vw,1.2rem)] italic tracking-[0.06em] text-[#c4a07a] opacity-[0.88]">
            {displayed}
            <span className="inline-block w-[2px] h-[1.1em] bg-[#c4a07a] ml-[3px] align-middle animate-[blink_0.75s_step-end_infinite]" />
          </p>
        </div>
      </section>
    </>
  );
}
