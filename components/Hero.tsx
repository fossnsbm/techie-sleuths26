"use client";

import Image from "next/image";
import { useState } from "react";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-image-container">
          {isLoading && <div className="skeleton-loader"></div>}
          <Image
            src="/logo.png"
            alt="Techie Sleuths"
            width={300}
            height={300}
            className={`hero-image ${!isLoading ? "loaded" : ""}`}
            onLoadingComplete={() => setIsLoading(false)}
            priority
          />
        </div>
        <p className="hero-sub">Unravel the mystery. One clue at a time.</p>
      </div>

      <style jsx>{`
        .hero-image-container {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .skeleton-loader {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(200, 120, 60, 0.1) 25%,
            rgba(200, 120, 60, 0.2) 50%,
            rgba(200, 120, 60, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .hero-image {
          filter: brightness(0.8);
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .hero-image.loaded {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
