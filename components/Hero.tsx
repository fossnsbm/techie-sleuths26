"use client";

import Image from "next/image";
import { useState } from "react";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="relative flex min-h-[480px] h-screen w-full items-center justify-center overflow-hidden bg-transparent">
      <div className="absolute inset-0 z-[1]" />
      <div className="relative z-[2] px-6 text-center">
        <div className="relative mx-auto mb-6 flex h-[260px] w-[260px] items-center justify-center sm:h-[340px] sm:w-[340px] md:h-[460px] md:w-[460px] lg:h-[800px] lg:w-[800px]">
          {isLoading && (
            <div className="absolute inset-0 rounded-md bg-[rgba(200,120,60,0.12)] animate-pulse" />
          )}
          <Image
            src="/logo.png"
            alt="Techie Sleuths"
            width={800}
            height={800}
            className={`h-auto w-full object-contain brightness-90 transition-opacity duration-700 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoadingComplete={() => setIsLoading(false)}
            priority
          />
        </div>
        <p className="m-0 text-[clamp(0.95rem,2vw,1.2rem)] italic tracking-[0.06em] text-[#c4a07a]">
          Unravel the mystery. One clue at a time.
        </p>
      </div>
    </section>
  );
}
