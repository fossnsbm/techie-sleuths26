import Image from "next/image";
import ScrollSlide from "@/components/ScrollSlide";

export default function AboutUs() {
  return (
    <section id="about" className="relative bg-transparent px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20">
      <div className="relative z-[1] w-full text-left">
        <div className="flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-[920px]">
            <h2 className="mb-7 text-[clamp(2rem,5vw,3rem)] font-extrabold uppercase tracking-[0.1em] text-[#f5e6c8] max-sm:mb-5">
              ABOUT US
            </h2>
            <p className="m-0 max-w-[920px] text-[1rem] leading-[1.8] text-[#c4a07a] sm:text-[1.08rem] md:text-[1.2rem]">
              We are a passionate community driven by the principles of Free and Open Source Software (FOSS).
              Our mission is to promote collaboration, innovation, and knowledge sharing by encouraging students
              and tech enthusiasts to explore, contribute, and grow through open technologies.
Through workshops, events, and projects, we aim to build a supportive environment where ideas are freely exchanged and creativity thrives.
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 md:ml-auto md:justify-end">
            <ScrollSlide direction="right" delayMs={30}>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-[0_8px_20px_rgba(0,0,0,0.25)] animate-[floatLogo_6s_ease-in-out_infinite] sm:h-28 sm:w-28 md:h-36 md:w-36">
                <Image src="/foss.png" alt="FOSS" width={96} height={96} className="h-full w-full object-contain" />
              </div>
            </ScrollSlide>
            <ScrollSlide direction="right" delayMs={100}>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-[0_8px_20px_rgba(0,0,0,0.25)] animate-[floatLogo_6s_ease-in-out_infinite] sm:h-28 sm:w-28 md:h-36 md:w-36">
                <Image src="/wif.png" alt="WIF" width={96} height={96} className="h-full w-full object-contain" />
              </div>
            </ScrollSlide>
            <ScrollSlide direction="right" delayMs={170}>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-[0_8px_20px_rgba(0,0,0,0.25)] animate-[floatLogo_6s_ease-in-out_infinite] sm:h-28 sm:w-28 md:h-36 md:w-36">
                <Image src="/nsbm.png" alt="NSBM" width={96} height={96} className="h-full w-full object-contain" />
              </div>
            </ScrollSlide>
          </div>
        </div>
      </div>
    </section>
  );
}
