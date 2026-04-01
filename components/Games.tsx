import ScrollSlide from "@/components/ScrollSlide";
import Image from "next/image";

interface Game {
  id: number;
  title: string;
  image?: string;
  description?: string;
}

const GAMES: Game[] = [
  { id: 1, title: "The Vault Breakers", image: "/1.png", description: "Collect pieces & Unlock the Path" },
  { id: 2, title: "Trail of Shadows", image: "/2.png", description: "Find the Clues then Solve the Puzzle" },
  { id: 3, title: "No Exit", image: "/3.png", description: "It'z about Challenges find the Hidden Keys" },
  { id: 4, title: "The AI Interrogation", image: "/4.png", description: "Not about Problems just be Creative" },

];

export default function Games() {
  return (
    <section id="games" className="relative bg-transparent px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1000px]">
        <h2 className="mb-8 text-center text-[clamp(1.6rem,6vw,3rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] sm:mb-10 md:mb-12 md:tracking-[0.1em]">
          ABOUT GAMES
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="mx-auto w-full max-w-[380px] border border-[rgba(200,120,60,0.2)] bg-[rgba(30,12,5,0.8)] p-4 transition hover:-translate-y-2 hover:border-[rgba(200,120,60,0.5)] sm:p-5 md:p-6"
            >
              <div className="mb-4 flex h-[180px] w-full items-center justify-center overflow-hidden bg-[#0a0300] sm:h-[210px] md:h-[220px]">
                {game.image ? (
                  <ScrollSlide className="h-full w-full" direction={game.id % 2 === 0 ? "right" : "left"} delayMs={game.id * 40}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image src={game.image} alt={game.title} width={400} height={400} className="h-full w-full object-contain p-0 sm:object-contain sm:p-2" />
                  </ScrollSlide>
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,#2a1a0a_0%,#1a0a00_100%)]" />
                )}
              </div>
              <div className="text-center">
                <h3 className="mb-2 min-h-[2.8em] text-[1rem] font-bold uppercase tracking-[0.06em] text-[#f5e6c8] sm:text-[1.06rem] md:text-[1.1rem] md:tracking-[0.08em]">
                  {game.title}
                </h3>
                {game.description && (
                  <p className="m-0 text-[0.82rem] leading-[1.5] text-[#c4a07a] sm:text-[0.85rem]">{game.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
