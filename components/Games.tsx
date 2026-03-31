interface Game {
  id: number;
  title: string;
  image?: string;
  description?: string;
}

const GAMES: Game[] = [
  { id: 1, title: "Mystery Manor", description: "Solve the haunted manor case." },
  { id: 2, title: "Code Cipher", description: "Crack the digital enigma." },
  { id: 3, title: "Dark Archives", description: "Uncover hidden secrets." },
];

export default function Games() {
  return (
    <section id="games" className="relative bg-transparent px-8 py-20">
      <div className="mx-auto max-w-[1000px]">
        <h2 className="mb-12 text-center text-[clamp(2rem,5vw,3rem)] font-extrabold uppercase tracking-[0.1em] text-[#f5e6c8]">
          ABOUT GAMES
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="border border-[rgba(200,120,60,0.2)] bg-[rgba(30,12,5,0.8)] p-6 transition hover:-translate-y-2 hover:border-[rgba(200,120,60,0.5)]"
            >
              <div className="mb-4 flex h-[200px] w-full items-center justify-center overflow-hidden bg-[#0a0300]">
                {game.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={game.image} alt={game.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,#2a1a0a_0%,#1a0a00_100%)]" />
                )}
              </div>
              <div className="text-center">
                <h3 className="mb-2 text-[1.1rem] font-bold uppercase tracking-[0.08em] text-[#f5e6c8]">
                  {game.title}
                </h3>
                {game.description && (
                  <p className="m-0 text-[0.85rem] text-[#c4a07a]">{game.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
