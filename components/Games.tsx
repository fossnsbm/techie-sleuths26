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
    <section id="games" className="games-section">
      <div className="games-container">
        <h2 className="games-heading">ABOUT GAMES</h2>
        <div className="games-grid">
          {GAMES.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-image">
                {game.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={game.image} alt={game.title} />
                ) : (
                  <div className="game-placeholder" />
                )}
              </div>
              <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                {game.description && (
                  <p className="game-desc">{game.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
