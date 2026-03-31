import Image from "next/image";
import ScrollSlide from "@/components/ScrollSlide";

export default function WhyTechie() {
  return (
    <section className="relative bg-transparent px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20">
      <div className="w-full text-left md:text-right">
        <div className="flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex items-center justify-start">
            <ScrollSlide direction="left" delayMs={40}>
              <Image src="/logo.png" alt="Logo" width={250} height={250} className="h-150 w-150 object-contain animate-[floatLogo_6s_ease-in-out_infinite] sm:h-150 sm:w-150 md:h-200 md:w-200" />
            </ScrollSlide>
          </div>
          <div className="relative z-[1]">
          <h2 className="mb-7 text-[clamp(2rem,5vw,3rem)] font-extrabold uppercase tracking-[0.1em] text-[#f5e6c8] max-sm:mb-5">
            Why Techie Sleuth
          </h2>
            <p className="max-w-[920px] text-[1rem] leading-[1.8] text-[#c4a07a] sm:text-[1.08rem] md:ml-auto md:text-[1.2rem]">
             Techie Sleuths is more than just an event—it's an experience designed to challenge your thinking, sharpen your problem-solving
             skills, and ignite your curiosity. Through interactive challenges and real-world scenarios, participants get the opportunity to
             think critically, collaborate effectively, and explore the exciting world of technology in a fun and engaging way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
