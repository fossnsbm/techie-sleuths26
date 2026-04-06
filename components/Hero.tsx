"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const [displayed, setDisplayed] = useState("");

  const TAGLINE = "Unravel the mystery. One clue at a time.";

  /* ── Typewriter ── */
  useEffect(() => {
    const delay = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(TAGLINE.slice(0, ++i));
        if (i >= TAGLINE.length) {
          clearInterval(interval);
        }
      }, 55);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(delay);
  }, []);

  return (
    <section className="relative flex min-h-130 h-screen w-full items-center justify-center overflow-hidden bg-transparent px-3 sm:px-6">

      {/* ── CONTENT ── */}
      <div className="relative z-5 px-2 text-center sm:px-6">
        {/* Logo - with data attribute for cursor hover effect */}
        <div
          data-cursor-hover
          className="logo-hover-target relative mx-auto mb-6 flex items-center justify-center
                     h-55 w-55 sm:h-75 sm:w-75 md:h-105 md:w-105 lg:h-200 lg:w-200"
        >
          <div className="absolute -inset-5 rounded-full pointer-events-none z-0
            bg-[radial-gradient(circle,rgba(196,160,122,0.12)_0%,transparent_70%)]
            opacity-0 transition-opacity duration-500
            group-hover:opacity-100" />

          {isLoading && <div className="absolute inset-0 rounded-md bg-[rgba(200,120,60,0.12)] animate-pulse" />}

          <Image
            src="/logo.png"
            alt="Techie Sleuths"
            width={800}
            height={800}
            className={[
              "relative z-1 h-auto w-full object-contain",
              "transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isLoading ? "opacity-0" : "opacity-100",
              "scale-100 brightness-90 hover:scale-[1.18] hover:brightness-[1.15] hover:drop-shadow-[0_0_40px_rgba(196,160,122,0.5)]",
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
              "pointer-events-none absolute left-0 top-[8%] z-2 h-auto w-[30%] translate-x-[20%] object-contain",
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
              "pointer-events-none absolute right-0 bottom-[14%] z-2 h-auto w-[35%] -translate-x-[20%] object-contain",
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
          <span className="inline-block w-0.5 h-[1.1em] bg-[#c4a07a] ml-0.75 align-middle animate-[blink_0.75s_step-end_infinite]" />
        </p>
      </div>
    </section>
  );
}
