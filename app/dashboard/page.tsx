import CompactTeamSummary from "./components/CompactTeamSummary";
import StatsCard from "./components/StatsCard";
import GameCard from "./components/GameCard";
import { getAuthenticatedTeam } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTrailOfShadowsScore } from "@/app/actions/trail-of-shadows";
import { getNoExitScore } from "@/app/actions/no-exit";
import { getAIInterrogationScore } from "@/app/actions/ai-interrogation";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

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

export default async function DashboardPage() {
  // Fetch authenticated team data
  const team = await getAuthenticatedTeam();

  // This shouldn't happen due to middleware, but handle gracefully
  if (!team) {
    redirect('/login');
  }

  // Fetch real Trail of Shadows score
  const trailOfShadowsScore = await getTrailOfShadowsScore();
  const noExitScore = await getNoExitScore();
  const aiInterrogationScore = await getAIInterrogationScore();

  const completedTrailOfShadows = trailOfShadowsScore.questionsCompleted === 10 ? 1 : 0;
  const completedNoExit = noExitScore.challengesCompleted === 3 ? 1 : 0;
  const completedAIInterrogation = aiInterrogationScore.hasSubmitted ? 1 : 0;

  // Calculate stats
  const stats = {
    points: trailOfShadowsScore.totalScore + noExitScore.totalScore + aiInterrogationScore.totalScore,
    rank: "TBD",
    gamesCompleted: completedTrailOfShadows + completedNoExit + completedAIInterrogation
  };

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <section className="mb-8 sm:mb-12">
          <h1 className="mb-3 text-[clamp(2rem,6vw,3.5rem)] font-extrabold uppercase tracking-[0.08em] text-[#f5e6c8] md:tracking-[0.1em]">
            Welcome, {team.team_name}
          </h1>
          <p className="text-lg text-[#c4a07a] sm:text-xl">
            Unravel the mysteries. One challenge at a time.
          </p>
        </section>

        {/* Compact Team Summary */}
        <section className="mb-6 sm:mb-8">
          <CompactTeamSummary
            teamName={team.team_name}
            status={(team.status || 'pending') as "pending" | "approved" | "rejected"}
            memberCount={team.team_members.length}
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
              value={stats.points} 
            />
            <StatsCard 
              label="Rank" 
              value={stats.rank} 
            />
            <StatsCard 
              label="Completed" 
              value={`${stats.gamesCompleted}/3`} 
            />
            <StatsCard 
              label="Status" 
              value={team.status ? team.status.charAt(0).toUpperCase() + team.status.slice(1) : 'Pending'} 
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
