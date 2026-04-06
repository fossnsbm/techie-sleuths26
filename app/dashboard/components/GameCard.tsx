"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollSlide from "@/components/ScrollSlide";

interface GameCardProps {
  id: number;
  title: string;
  image: string;
  description: string;
  status: "coming_soon" | "active" | "completed" | "locked";
  href?: string;
}

export default function GameCard({ id, title, image, description, status, href }: GameCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "coming_soon":
        return { text: "COMING SOON", color: "bg-amber-900/80 text-amber-300" };
      case "active":
        return { text: "ACTIVE", color: "bg-emerald-900/80 text-emerald-300" };
      case "completed":
        return { text: "COMPLETED", color: "bg-blue-900/80 text-blue-300" };
      case "locked":
        return { text: "LOCKED", color: "bg-gray-900/80 text-gray-300" };
      default:
        return { text: "COMING SOON", color: "bg-amber-900/80 text-amber-300" };
    }
  };

  const badge = getStatusBadge();
  const isComingSoon = status === "coming_soon" || status === "locked";

  const cardContent = (
    <div
      className={`relative mx-auto w-full max-w-[380px] border border-[rgba(200,120,60,0.2)] bg-[rgba(30,12,5,0.8)] p-4 transition hover:-translate-y-2 hover:border-[rgba(200,120,60,0.5)] sm:p-5 md:p-6 ${
        isComingSoon ? "opacity-80" : "cursor-pointer"
      }`}
    >
      <div className="relative mb-4 flex h-[180px] w-full items-center justify-center overflow-hidden bg-[#0a0300] sm:h-[210px] md:h-[220px]">
        <ScrollSlide className="h-full w-full" direction={id % 2 === 0 ? "right" : "left"} delayMs={id * 40}>
          <Image 
            src={image} 
            alt={title} 
            width={400} 
            height={400} 
            className="h-full w-full object-contain p-0 sm:object-contain sm:p-2" 
          />
        </ScrollSlide>
        
        {/* Status Badge Overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span
              className={`border border-current px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] ${badge.color}`}
            >
              {badge.text}
            </span>
          </div>
        )}
        
        {/* Status Badge for Active/Completed */}
        {!isComingSoon && (
          <div className="absolute right-2 top-2">
            <span
              className={`inline-block border border-current px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] ${badge.color}`}
            >
              {badge.text}
            </span>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <h3 className="mb-2 min-h-[2.8em] text-[1rem] font-bold uppercase tracking-[0.06em] text-[#f5e6c8] sm:text-[1.06rem] md:text-[1.1rem] md:tracking-[0.08em]">
          {title}
        </h3>
        <p className="m-0 text-[0.82rem] leading-[1.5] text-[#c4a07a] sm:text-[0.85rem]">
          {description}
        </p>
      </div>
    </div>
  );

  if (href && !isComingSoon) {
    return (
      <Link href={href}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
