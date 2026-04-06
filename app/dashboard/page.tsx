import CompactTeamSummary from "./components/CompactTeamSummary";
import StatsCard from "./components/StatsCard";
import GameCard from "./components/GameCard";

// Mock team data
const MOCK_TEAM = {
  name: "The Baker Street Irregulars",
  leader: {
    name: "Sherlock Holmes",
    email: "sherlock@students.nsbm.ac.lk",
    phone: "0771234567"
  },
  members: [
    { name: "Sherlock Holmes", studentId: "12345" },
    { name: "John Watson", studentId: "12346" },
    { name: "Irene Adler", studentId: "12347" }
  ],
  status: "pending" as const,
  points: 0,
  rank: "TBD",
  gamesCompleted: 0
};

// Games data (excluding The Vault Breakers - presented separately)
const GAMES = [
  { 
    id: 2, 
    title: "Trail of Shadows", 
    image: "/2.png", 
    description: "Find the Clues then Solve the Puzzle", 
    status: "active" as const,
    href: "/dashboard/games/trail-of-shadows"
  },
  { 
    id: 3, 
    title: "No Exit", 
    image: "/3.png", 
    description: "It'z about Challenges find the Hidden Keys", 
    status: "active" as const,
    href: "/dashboard/games/no-exit"
  },
  { 
    id: 4, 
    title: "The AI Interrogation", 
    image: "/4.png", 
    description: "Not about Problems just be Creative", 
    status: "active" as const,
    href: "/dashboard/games/ai-interrogation"
  }
];

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <section className="mb-8 sm:mb-12">
          <h1 className="mb-3 text-[clamp(2rem,6vw,3.5rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] md:tracking-[0.1em]">
            Welcome, {MOCK_TEAM.name}
          </h1>
          <p className="text-lg text-[#c4a07a] sm:text-xl">
            Unravel the mysteries. One challenge at a time.
          </p>
        </section>

        {/* Compact Team Summary */}
        <section className="mb-6 sm:mb-8">
          <CompactTeamSummary
            teamName={MOCK_TEAM.name}
            status={MOCK_TEAM.status}
            memberCount={MOCK_TEAM.members.length}
          />
        </section>

        {/* Quick Stats */}
        <section className="mb-8 sm:mb-12">
          <h2 className="mb-6 text-center text-[clamp(1.6rem,5vw,2.5rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] sm:mb-8 md:tracking-[0.1em]">
            Your Stats
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            <StatsCard 
              label="Total Points" 
              value={MOCK_TEAM.points} 
            />
            <StatsCard 
              label="Rank" 
              value={MOCK_TEAM.rank} 
            />
            <StatsCard 
              label="Completed" 
              value={`${MOCK_TEAM.gamesCompleted}/3`} 
            />
            <StatsCard 
              label="Status" 
              value={MOCK_TEAM.status.charAt(0).toUpperCase() + MOCK_TEAM.status.slice(1)} 
            />
          </div>
        </section>

        {/* Games Section */}
        <section className="pb-8 sm:pb-12">
          <h2 className="mb-6 text-center text-[clamp(1.6rem,5vw,2.5rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] sm:mb-8 md:tracking-[0.1em]">
            Investigation Games
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {GAMES.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                image={game.image}
                description={game.description}
                status={game.status}
                href={game.href}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
